const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// --- 1. CONFIGURE MULTER (Here in the route file) ---
// server/middleware/upload.js (or wherever your upload logic is)
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// 1. Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Configure Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'pottery_shop', // Folder name in Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
});

const upload = multer({ storage: storage });

module.exports = upload;

// --- 2. ROUTES ---

// GET All Products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET Single Product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST Add Product (With Images)
// Notice 'upload.array' is passed as the second argument
router.post('/', upload.array('images', 5), async (req, res) => {
    try {
        // Now req.body is defined because 'upload' ran first
        const { name, price, description } = req.body;
        
        // Handle cases where no files are uploaded
        const imagePaths = req.files ? req.files.map(file => file.path) : [];

        const newProduct = new Product({
            name,
            price,
            description,
            images: imagePaths
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

// DELETE Product
router.delete('/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product Deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;