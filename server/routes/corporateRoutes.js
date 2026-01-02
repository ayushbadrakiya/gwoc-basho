const express = require('express');
const router = express.Router();
const CorporateInquiry = require('../models/CorporateInquiry');

// 1. POST: Submit Inquiry (Already exists)
router.post('/inquiry', async (req, res) => {
    try {
        const newInquiry = new CorporateInquiry(req.body);
        await newInquiry.save();
        res.status(201).json({ success: true, message: "Inquiry received!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// 2. GET: Fetch All Inquiries (For Admin)
router.get('/', async (req, res) => {
    try {
        // Sort by newest first (-1)
        const inquiries = await CorporateInquiry.find().sort({ createdAt: -1 });
        res.json(inquiries);
    } catch (err) {
        res.status(500).json({ message: "Server Error fetching inquiries" });
    }
});

// 3. DELETE: Remove an Inquiry
router.delete('/:id', async (req, res) => {
    try {
        await CorporateInquiry.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Inquiry deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting inquiry" });
    }
});

module.exports = router;