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
    user: "bashobyshivangi@gmail.com", // <--- UPDATE THIS
    pass: "ropt eszn ojog vfcz"    // <--- UPDATE THIS
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
            from: `"OTP" <bashobyshivangi@gmail.com>`,
            to: email,
            subject: "Action Confirmation OTP",
            text: `Your Verification Code is: ${otp}`
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