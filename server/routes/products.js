const express = require('express');
const router = express.Router();
const multer = require('multer');
const Product = require('../models/Product');

// --- 1. CONFIGURE MULTER (Here in the route file) ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Make sure this folder exists in 'server'
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

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
        const imagePaths = req.files ? req.files.map(file => file.filename) : [];

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