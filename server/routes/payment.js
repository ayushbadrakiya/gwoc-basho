const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const Product = require('../models/Product');
require('dotenv').config();

// 1. Initialize Razorpay with a consistent variable name
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// 2. CREATE ORDER ROUTE (For Products)
router.post('/create-order', async (req, res) => {
    try {
        const { productId, amount } = req.body;

        let finalAmount = amount;

        // Security check
        if (productId) {
            const product = await Product.findById(productId);
            if (product) {
                finalAmount = product.price;
            }
        }

        const options = {
            amount: finalAmount * 100, 
            currency: "INR",
            receipt: "order_rcptid_" + Date.now()
        };

        // Use 'razorpay', not 'instance'
        const order = await razorpay.orders.create(options);
        res.json(order);

    } catch (error) {
        console.error("Razorpay Error:", error);
        res.status(500).send(error);
    }
});

// 3. CREATE WORKSHOP ORDER ROUTE (Fixed Variable Names)
router.post('/create-workshop-order', async (req, res) => {
    try {
        // FIX: Extract 'amount' because that is what frontend sends
        const { amount, workshopId } = req.body; 
        
        if (!amount) {
            return res.status(400).json({ success: false, message: "Amount is missing" });
        }

        const options = {
            amount: amount * 100, // Now 'amount' is defined
            currency: "INR",
            receipt: `ws_${workshopId.slice(-10)}_${Date.now()}`
        };

        // Use 'razorpay', not 'instance'
        const order = await razorpay.orders.create(options);
        res.json({ success: true, order });

    } catch (error) {
        console.error("Razorpay Error:", error);
        res.status(500).json({ success: false, message: "Payment creation failed" });
    }
});

module.exports = router;