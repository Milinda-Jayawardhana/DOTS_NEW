const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Preorder = require('../Model/preorderModel');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/bankSlips')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only .png, .jpg, .jpeg and .pdf format allowed!'));
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Create new preorder
router.post('/', upload.single('bankSlip'), async (req, res) => {
    try {
        const preorderData = {
            ...req.body,
            tshirtOrders: {
                xs: parseInt(req.body.xs || 0),
                s: parseInt(req.body.s || 0),
                m: parseInt(req.body.m || 0),
                l: parseInt(req.body.l || 0),
                xl: parseInt(req.body.xl || 0),
                xxl: parseInt(req.body.xxl || 0)
            },
            paymentDetails: {
                amount: parseFloat(req.body.amount),
                bankSlip: req.file ? {
                    filename: req.file.filename,
                    path: req.file.path
                } : null
            }
        };

        const preorder = new Preorder(preorderData);
        await preorder.save();

        res.status(201).json({
            success: true,
            message: 'Preorder created successfully',
            data: preorder
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Get all preorders
router.get('/', async (req, res) => {
    try {
        const preorders = await Preorder.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: preorders
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Get single preorder by registration number
router.get('/:regNo', async (req, res) => {
    try {
        const preorder = await Preorder.findOne({ 
            registrationNumber: req.params.regNo 
        });
        
        if (!preorder) {
            return res.status(404).json({
                success: false,
                message: 'Preorder not found'
            });
        }

        res.status(200).json({
            success: true,
            data: preorder
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;