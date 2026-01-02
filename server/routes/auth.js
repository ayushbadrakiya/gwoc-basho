const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const JWT_SECRET = "secret123";

// --- NODEMAILER CONFIG ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "", // <--- UPDATE THIS
        pass: ""    // <--- UPDATE THIS
    }
});

// Helper to generate & send OTP
const sendOtpEmail = async (user, subject) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    await transporter.sendMail({
        from: `"OTP" <bashobyshivangi@gmail.com>`,
        to: user.email,
        subject: subject,
        text: `Your Verification Code is: ${otp}`
    });
    return otp;
};
router.get('/profile/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password -otp'); // Don't send password
        if (!user) return res.status(404).json({ msg: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
});

// 2. UPDATE USER PROFILE (Shipping Info)
router.put('/profile/update', async (req, res) => {
    try {
        const { userId, name, phone, address, city, zip } = req.body;

        // Find user and update
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: "User not found" });

        // Update fields
        user.name = name || user.name;
        user.phone = phone || '';
        user.address = address || '';
        user.city = city || '';
        user.zip = zip || '';

        await user.save();

        // Return updated user info (excluding password)
        const updatedUser = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            address: user.address,
            city: user.city,
            zip: user.zip
        };

        res.json({ success: true, user: updatedUser, msg: "Profile Updated Successfully" });
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
});
// 1. REGISTER (Step 1: Save User & Send OTP)
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check if user already exists
        let user = await User.findOne({ email });

        // If user exists AND is verified, stop them
        if (user && user.isVerified) {
            return res.status(400).json({ msg: "User already exists" });
        }

        // 2. If user doesn't exist (or isn't verified), create/update them
        if (!user) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            user = new User({
                name,
                email,
                password: hashedPassword,
                isVerified: false // Important flag
            });
        }

        // 3. Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save();

        // 4. SEND EMAIL (This is the part that was likely missing or failing)
        await transporter.sendMail({
            from: `"OTP Verification" <${transporter.options.auth.user}>`, // Auto-uses your email
            to: email,
            subject: "Verify Your Account",
            html: `
                <h3>Welcome, ${name}!</h3>
                <p>Your verification code is:</p>
                <h1 style="color: blue; letter-spacing: 5px;">${otp}</h1>
                <p>This code expires in 10 minutes.</p>
            `
        });

        res.json({ success: true, step: 'OTP_SENT', msg: "OTP sent to your email" });

    } catch (err) {
        console.error("Register Error:", err); // <--- Check your terminal if this prints!
        res.status(500).json({ msg: "Server Error: Could not send email" });
    }
});

// 2. VERIFY REGISTRATION OTP (Step 2: Activate Account)
router.post('/verify-register', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ msg: "User not found" });
        if (user.otp !== otp || user.otpExpires < Date.now()) return res.status(400).json({ msg: "Invalid OTP" });

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({ success: true, msg: "Account Verified! You can now login." });
    } catch (err) { res.status(500).json({ msg: "Server Error" }); }
});

// 3. LOGIN (Simple: No OTP)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ msg: "User not found" });
        if (!user.isVerified) return res.status(400).json({ msg: "Email not verified. Please register again." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

        res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) { res.status(500).json({ msg: "Server Error" }); }
});

// server/routes/auth.js

// 1. Request Password Reset OTP
router.post('/forgot-password-otp', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ success: false, message: "Email not found" });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Save OTP to user (In production, hash this and set an expiry time)
        user.otp = otp; 
        await user.save();

        // Send Email (Reuse your existing nodemailer transporter)
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset Password OTP - Basho',
            text: `Your OTP for password reset is: ${otp}`
        };

        await transporter.sendMail(mailOptions); // Ensure 'transporter' is defined in your file

        res.json({ success: true, message: "OTP sent to email" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// 2. Reset Password
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.otp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        user.otp = null; // Clear OTP
        await user.save();

        res.json({ success: true, message: "Password reset successful" });

    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// 4. REQUEST OTP (For Ordering/Cancelling)
router.post('/req-otp', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ msg: "User not found" });

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
        await user.save();

        // Send Email (Using your Nodemailer setup)
        // Make sure you import 'transporter' or pass the email logic here
        // NOTE: You might need to export 'sendOtpEmail' helper from your main file or redefine it here.

        const mailOptions = {
            from: `"Basho Support" <bashobyshivangi@gmail.com>`, // Use a business-like name
            to: email,
            subject: "Verify Your Account",
            text: `Your Verification Code is: ${otp}`, // Fallback for old devices
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #2c3e50; text-align: center;">Welcome to Basho!</h2>
            <p style="font-size: 16px; color: #555;">Hi there,</p>
            <p style="font-size: 16px; color: #555;">Thank you for registering. Please use the verification code below to complete your signup:</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0; text-align: center; border-radius: 5px; border: 1px dashed #ccc;">
                <h1 style="color: #007bff; letter-spacing: 5px; margin: 0; font-size: 32px;">${otp}</h1>
            </div>

            <p style="font-size: 14px; color: #777;">This code expires in 10 minutes.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #aaa; text-align: center;">
                If you did not request this email, please ignore it.<br>
                &copy; Basho by Shivangi
            </p>
        </div>
    `
        };

        // Assuming 'transporter' is available here (imported from config or defined above)
        await transporter.sendMail(mailOptions);

        res.json({ success: true, msg: "OTP Sent" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server Error" });
    }
});

module.exports = router;
