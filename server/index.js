const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer'); // <--- Import Nodemailer

// Import Models
const Order = require('./models/Order');
const Product = require('./models/Product');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

// --- EMAIL CONFIGURATION (SAME AS AUTH.JS) ---
const EMAIL_USER = "bashobyshivangi@gmail.com"; 
const EMAIL_PASS = "ropt eszn ojog vfcz"; // <--- PASTE YOUR APP PASSWORD HERE

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS 
  }
});

// Helper function to send emails safely
const sendEmail = async (to, subject, htmlContent) => {
    try {
        await transporter.sendMail({
            from: `"My Shop" <${EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: htmlContent
        });
        console.log(`📧 Email sent to ${to}`);
    } catch (err) {
        console.error("❌ Email failed:", err);
    }
};

// --- STATIC FILES & DB ---
app.use('/uploads', express.static('uploads'));

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

mongoose.connect('mongodb://localhost:27017/pottery_shop')
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// --- ORDER ROUTES ---

// 1. BUY / PLACE ORDER (Sends Confirmation Email)
app.post('/api/buy', upload.array('customImages', 5), async (req, res) => {
  try {
    // Note: When using Multer, non-file fields are in req.body
    const { 
      email, otp, 
      customerName, amount, orderType, productId, productName, 
      address, phone, city, zip, 
      // Custom details come as separate fields in FormData
      description, material 
    } = req.body;

    // 1. VERIFY OTP
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
        return res.status(400).json({ success: false, message: "Invalid or Expired OTP" });
    }
    
    // Clear OTP
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // 2. PREPARE ORDER DATA
    let newOrderData = {
      customerName, email, amount, orderType,
      address, phone, city, zip,
      trackingStatus: 'Processing'
    };

    if (orderType === 'STANDARD') {
        newOrderData.productId = productId;
        newOrderData.productName = productName;
        
        // Handle Standard Product Image Snapshot
        if (productId) {
            const p = await Product.findById(productId);
            if(p && p.images && p.images.length > 0) {
                newOrderData.productImage = p.images[0];
            }
            await Product.findByIdAndDelete(productId);
        }

    } else if (orderType === 'CUSTOM') {
        // Handle Custom Details
        newOrderData.customDetails = {
            description: description, // Read from req.body
            material: material        // Read from req.body
        };
        
        // Handle Custom Images (from Multer)
        if (req.files && req.files.length > 0) {
            newOrderData.customImages = req.files.map(file => file.filename);
        }
    }

    const newOrder = new Order(newOrderData);
    await newOrder.save();

    // 3. SEND EMAIL (Keep your existing email logic here)
    const emailSubject = `Order Confirmed: ${orderType}`;
    const emailBody = `<p>Order ID: ${newOrder._id}</p><p>We received your request.</p>`;
    sendEmail(email, emailSubject, emailBody);

    res.status(201).json({ success: true, message: "Order placed!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }

});

   


// 2. CANCEL ORDER (Sends Cancellation Email)
app.post('/api/orders/:id/cancel', async (req, res) => {
    try {
        const { email, otp } = req.body; // <--- Require OTP

        // Verify OTP
        const user = await User.findOne({ email });
        if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or Expired OTP" });
        }
        
        // Clear OTP
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // Proceed to Cancel
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });
        
        order.status = 'CANCELLED';
        await order.save();

        // --- SEND EMAIL: ORDER CANCELLED ---
        const emailSubject = `Order Cancelled: ${order._id}`;
        const emailBody = `
            <h2>Hi ${order.customerName},</h2>
            <p>Your order for <strong>${order.orderType === 'STANDARD' ? order.productName : 'Custom Request'}</strong> has been cancelled.</p>
            <p>If you did not request this, please contact support.</p>
        `;
        sendEmail(order.email, emailSubject, emailBody);

        res.json({ success: true, message: "Order Cancelled" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. UPDATE TRACKING (Optional: Send Email on "Shipped" or "Delivered")
app.put('/api/orders/:id/tracking', async (req, res) => {
  try {
    const { trackingStatus } = req.body;
    const stages = ['Processing', 'Shipped', 'Reached at final station', 'Out for delivery', 'Delivered'];
    
    const order = await Order.findById(req.params.id);
    if (order.trackingStatus === 'Delivered') return res.status(400).json({ message: "Order is already Delivered." });

    const currentIndex = stages.indexOf(order.trackingStatus);
    const newIndex = stages.indexOf(trackingStatus);

    if (newIndex !== currentIndex + 1) {
        return res.status(400).json({ message: "Invalid Sequence Step" });
    }

    order.trackingStatus = trackingStatus;
    await order.save();

    // --- OPTIONAL: SEND EMAIL ON STATUS CHANGE ---
    // Uncomment below if you want email updates for tracking too!
    /*
    const subject = `Order Update: ${trackingStatus}`;
    const body = `<p>Your order is now <strong>${trackingStatus}</strong>.</p>`;
    sendEmail(order.email, subject, body);
    */

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ALL ORDERS
app.get('/api/orders', async (req, res) => {
    try {
        // Sort by newest first
        const orders = await Order.find().sort({ createdAt: -1 }); 
        res.json(orders);
    } catch(err) { res.status(500).json({message: err.message}); }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});