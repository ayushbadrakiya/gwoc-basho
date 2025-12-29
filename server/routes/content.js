const express = require('express');
const router = express.Router();
const News = require('../models/News');
const Testimonial = require('../models/Testimonial');

module.exports = (upload) => {

    // --- NEWS / EXHIBITIONS ---

    // Get All News
    router.get('/news', async (req, res) => {
        try {
            const news = await News.find().sort({ date: -1 });
            res.json(news);
        } catch (err) { res.status(500).json({ msg: err.message }); }
    });

    // Add News (Admin)
    router.post('/news/add', upload.single('image'), async (req, res) => {
        try {
            const { title, description } = req.body;
            const newNews = new News({
                title, description,
                image: req.file ? req.file.filename : ''
            });
            await newNews.save();
            res.json({ success: true, msg: "News Added" });
        } catch (err) { res.status(500).json({ msg: err.message }); }
    });

    // Delete News
    router.delete('/news/:id', async (req, res) => {
        try {
            await News.findByIdAndDelete(req.params.id);
            res.json({ success: true, msg: "News Deleted" });
        } catch (err) { res.status(500).json({ msg: err.message }); }
    });


    // --- TESTIMONIALS ---

    // Get All Testimonials
    router.get('/testimonials', async (req, res) => {
        try {
            const tests = await Testimonial.find().sort({ createdAt: -1 });
            res.json(tests);
        } catch (err) { res.status(500).json({ msg: err.message }); }
    });

    // Add Testimonial
    router.post('/testimonials/add', upload.single('media'), async (req, res) => {
        try {
            const { name, message, designation } = req.body;
            
            let media = '';
            let mediaType = 'none';

            if (req.file) {
                media = req.file.filename;
                // Determine if it is an image or video based on the file mimetype
                if (req.file.mimetype.startsWith('image/')) {
                    mediaType = 'image';
                } else if (req.file.mimetype.startsWith('video/')) {
                    mediaType = 'video';
                }
            }

            const newTest = new Testimonial({ 
                name, 
                message, 
                designation, 
                media, 
                mediaType 
            });
            
            await newTest.save();
            res.json({ success: true, msg: "Testimonial Added" });
        } catch (err) { res.status(500).json({ msg: err.message }); }
    });

    // Delete Testimonial
    router.delete('/testimonials/:id', async (req, res) => {
        try {
            await Testimonial.findByIdAndDelete(req.params.id);
            res.json({ success: true, msg: "Testimonial Deleted" });
        } catch (err) { res.status(500).json({ msg: err.message }); }
    });

    return router;
};