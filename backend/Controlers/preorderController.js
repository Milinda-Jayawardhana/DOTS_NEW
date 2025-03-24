const Preorder = require('../Model/preorderModel');

// Create new preorder
const createPreorder = async (req, res) => {
    try {
        const preorderData = {
            customerName: req.body.customerName,
            address: req.body.address,
            telephone: req.body.telephone,
            tshirtDetails: {
                material: req.body.material,
                printingType: req.body.printingType,
                quantities: {
                    s: parseInt(req.body.s || 0),
                    m: parseInt(req.body.m || 0),
                    l: parseInt(req.body.l || 0),
                    xl: parseInt(req.body.xl || 0),
                    xxl: parseInt(req.body.xxl || 0)
                }
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
            message: 'Order placed successfully',
            data: preorder
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get all preorders
const getAllPreorders = async (req, res) => {
    try {
        const preorders = await Preorder.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: preorders.length,
            data: preorders
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get single preorder
const getPreorderById = async (req, res) => {
    try {
        const preorder = await Preorder.findById(req.params.id);
        
        if (!preorder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
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
};

module.exports = {
    createPreorder,
    getAllPreorders,
    getPreorderById
};