const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const Product = require('../models/Product');
require('dotenv').config();

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// 1. CREATE ORDER ROUTE
router.post('/create-order', async (req, res) => {
    try {
        const { productId, amount } = req.body;

        let finalAmount = amount;

        // Security: If a productId is provided, fetch the REAL price from DB
        // This prevents users from hacking the frontend to send ₹1
        if (productId) {
            const product = await Product.findById(productId);
            if (product) {
                finalAmount = product.price;
            }
        }

        // Razorpay expects amount in PAISE (multiply by 100)
        const options = {
            amount: finalAmount * 100, 
            currency: "INR",
            receipt: "order_rcptid_" + Date.now()
        };

        const order = await razorpay.orders.create(options);
        res.json(order);

    } catch (error) {
        console.error("Razorpay Error:", error);
        res.status(500).send(error);
    }
});

module.exports = router;