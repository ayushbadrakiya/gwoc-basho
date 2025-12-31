const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// ... existing routes ...

// GET USER'S ORDERS (New Route)
router.get('/user/:userId', async (req, res) => {
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

module.exports = router;