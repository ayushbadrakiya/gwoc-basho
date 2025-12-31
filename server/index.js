const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer'); // <--- Import Nodemailer
const crypto = require('crypto');


const app = express();


// Import Models
const Order = require('./models/Order');
const Product = require('./models/Product');
const User = require('./models/User');
const ordersRoute = require('./routes/orders');
const paymentRoute = require('./routes/payment');


app.use(cors());
app.use(express.json());
app.use('/api/orders', ordersRoute);
app.use('/api/payment', paymentRoute);


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
const sendEmail = async (to, subject, htmlContent,attachments = []) => {
    try {
        await transporter.sendMail({
            from: `"My Shop" <${EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: htmlContent,
            attachments: attachments
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
const upload = multer({ storage: storage,limits: { fileSize: 50 * 1024 * 1024 } });
const contentRoutes = require('./routes/content')(upload);

const workshopRoutes = require('./routes/workshops')(upload, sendEmail);
app.use('/api/workshops', workshopRoutes);
app.use('/api/content', contentRoutes);

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
    const { 
        email, 
        otp, 
        // 👇 NEW: Extract Payment Details
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        // ---------------------------
        productName, 
        productId, 
        amount, 
        productImage, 
        orderType,
        customerName,
        description,
        material,
        phone,
        address,
        city,
        zip,
        customDetails,
        customImages 
    } = req.body;

    // --- 1. SECURITY CHECK: VERIFY OTP ---
    if (!otp) {
        return res.status(400).json({ success: false, message: "OTP is required to confirm order." });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
    }

    if (user.otp !== otp) {
        return res.status(400).json({ success: false, message: "Invalid OTP. Order failed." });
    }

    // --- 1.5 SECURITY CHECK: VERIFY RAZORPAY PAYMENT ---
    // Only verify if it is a paid order (Standard) or amount > 0
    if (orderType === 'STANDARD' && amount > 0) {
        
        if (!razorpay_payment_id || !razorpay_signature) {
             return res.status(400).json({ success: false, message: "Payment details missing." });
        }

        // Create the expected signature
        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        // Compare signatures
        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Payment verification failed. Invalid Signature." });
        }
    }
    // ----------------------------------------------------

    // 2. Clear OTP (Prevent reuse)
    user.otp = null;
    await user.save();

    // 3. Save Order to Database
    const newOrder = new Order({
        email,
        productName,
        productId,
        amount,
        productImage,
        orderType,
        customerName,
        description,
        material,
        phone,
        address,
        city,
        zip,
        customDetails,
        customImages,
        // 👇 NEW: Save Payment ID
        paymentId: razorpay_payment_id || null, 
        status: 'PROCESSING',
        trackingStatus: 'Processing'
    });

    await newOrder.save();

    let attachments = [];

    // Add the Thank You Image
    attachments.push({
        filename: 'thanks.png',
        path: 'C:\\Users\\AYUSH\\OneDrive\\Desktop\\gwoc\\client\\public\\thanks.png', 
        cid: 'thankyouImage' 
    });

    // 3. SEND EMAIL
    const emailSubject = `Order Confirmed: ${orderType}`;
    const emailBody = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 600px; margin: 0 auto;">
        
       <div style="text-align: center; margin-bottom: 20px;">
            <img src="cid:thankyouImage" alt="Thank You" style="width: 100%; max-width: 300px; border-radius: 8px;" />
        </div>

        <h2 style="color: #333; text-align: center;">Order Confirmation</h2>
        
        <p>Hi <strong>${customerName}</strong>,</p>
        <p>Thank you for your order! We have received your request and it is now <strong>Processing</strong>.</p>
        
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />

        <h3>📦 Order Details</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Order ID:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${newOrder._id}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Type:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${orderType}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Item:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">
              ${orderType === 'STANDARD' ? productName : description}
            </td>
          </tr>
          ${orderType === 'CUSTOM' ? `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Material:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${material}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Total Amount:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; color: green; font-weight: bold;">
              ${amount > 0 ? `₹${amount}` : 'Pending Quote'}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Payment Status:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">
              ${razorpay_payment_id ? '<span style="color:green">PAID</span>' : 'Unpaid/Pending'}
            </td>
          </tr>
        </table>

        <h3>📍 Shipping Information</h3>
        <p style="margin: 5px 0;"><strong>Phone:</strong> ${phone}</p>
        <p style="margin: 5px 0;"><strong>Address:</strong><br/>
        ${address}<br/>
        ${city}, ${zip}</p>

        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        
        <p style="font-size: 0.9em; color: #666; text-align: center;">
          If you have any questions, simply reply to this email.
        </p>
      </div>
    `;
    sendEmail(email, emailSubject, emailBody, attachments);

    res.status(201).json({ success: true, message: "Order placed!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

   


// 2. CANCEL ORDER (Sends Cancellation Email)
app.post('/api/orders/:id/cancel', async (req, res) => {
    try {
        const { email, otp, isAdmin } = req.body; 

        // --- STEP 1: SECURITY & VALIDATION ---
        
        // If it's the CUSTOMER, we strictly require OTP
        if (!isAdmin) {
            if (!email || !otp) {
                return res.status(400).json({ message: "OTP is required for cancellation" });
            }

            const user = await User.findOne({ email });
            if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
                return res.status(400).json({ message: "Invalid or Expired OTP" });
            }
            
            // Clear OTP
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();
        }

        // --- STEP 2: UPDATE ORDER STATUS ---
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });
        
        if (order.status === 'CANCELLED') {
            return res.status(400).json({ message: "Order is already cancelled" });
        }

        order.status = 'CANCELLED';
        await order.save();

        // --- STEP 3: PREPARE EMAIL (Based on who cancelled) ---
        let emailSubject = '';
        let emailBody = '';

        if (isAdmin) {
            // 🔴 SCENARIO 1: CANCELLED BY ADMIN
            emailSubject = `Update: Order #${order._id} Cancelled`;
            emailBody = `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ffcccc; background-color: #fff5f5; border-radius: 8px;">
                    <h2 style="color: #cc0000;">Order Cancelled by Store</h2>
                    <p>Hi ${order.customerName},</p>
                    <p>We are writing to inform you that your order for <strong>${order.orderType === 'STANDARD' ? order.productName : 'Custom Request'}</strong> has been cancelled by our administration team.</p>
                    <p><strong>Reason:</strong> Order could not be fulfilled or verification failed.</p>
                    <p>If you have already paid, a refund has been initiated.</p>
                    <hr style="border: 0; border-top: 1px solid #eebdbd; margin: 20px 0;" />
                    <p style="font-size: 0.9em;">Please contact support if you believe this is a mistake.</p>
                </div>
            `;
        } else {
            // 🟢 SCENARIO 2: CANCELLED BY CUSTOMER (YOU)
            emailSubject = `Cancellation Confirmed: Order #${order._id}`;
            emailBody = `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #333;">You Cancelled Your Order</h2>
                    <p>Hi ${order.customerName},</p>
                    <p>As requested, we have successfully cancelled your order.</p>
                    
                    <div style="background: #f9f9f9; padding: 10px; margin: 15px 0; border-radius: 4px;">
                        <p style="margin: 5px 0;"><strong>Item:</strong> ${order.orderType === 'STANDARD' ? order.productName : 'Custom Request'}</p>
                        <p style="margin: 5px 0;"><strong>Order ID:</strong> ${order._id}</p>
                    </div>

                    <p>We hope to serve you again in the future!</p>
                </div>
            `;
        }

        // Send the specific email to the customer
        // We use 'order.email' to ensure it goes to the customer, even if Admin triggered it
        sendEmail(order.email, emailSubject, emailBody);

        res.json({ success: true, message: "Order Cancelled Successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

app.get('/user/:userId', async (req, res) => {
    try {
        // Find orders where 'email' matches (or store userId in Order model for better linking)
        // Assuming we query by email since that's what was saved in previous steps
        // First, we might need to find the user to get the email, OR the frontend sends the email.
        // Let's assume we saved 'userId' in the Order model? 
        // If not, we will query by the email passed in the query string or body.
        
        // BETTER APPROACH: Just query by email if that's what we have
        // But the frontend usually passes ID. Let's try to query by Email for now since Order model has 'email'.
        
        const { email } = req.query; // Frontend will send ?email=user@example.com
        
        const orders = await Order.find({ email: email }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ msg: err.message });
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