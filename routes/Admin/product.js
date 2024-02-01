const express = require('express');
const router = express.Router();
const Product = require('../../models/product');
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/product');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
        const fileExtension = file.originalname.split('.').pop().toLowerCase();
        if (allowedExtensions.includes(`.${fileExtension}`)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only .jpg, .jpeg, .png, .webp files are allowed.'));
        }
    },
});

router.post('/ad/products', upload.single('image'), async (req, res) => {
    try {
        const { productname, category, description, price,stock } = req.body;
        const image = req.file.filename; 
                

        const product = new Product({
            productname,
            category,
            description,
            price,
            image,
            stock
        });

        const savedProduct = await product.save();

        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/admin/product', async (req, res) => {
    try {
        const product = await Product.find({}, '-__v');
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pets.' });
    }
});

module.exports = router;
