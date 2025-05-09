const Preorder = require('../Model/preorderModel');

// Create new preorder
const createPreorder = async (req, res) => {
    try {
        const preorderData = {
            name: req.body.name,
            registrationNumber: req.body.registrationNumber,
            batch: req.body.batch,
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
                    path: req.file.path,
                    uploadDate: new Date()
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
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get preorder by registration number
const getPreorderByRegNo = async (req, res) => {
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
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const preorder = await Preorder.findOneAndUpdate(
            { registrationNumber: req.params.regNo },
            { orderStatus: req.body.orderStatus },
            { new: true, runValidators: true }
        );

        if (!preorder) {
            return res.status(404).json({
                success: false,
                message: 'Preorder not found'
            });
        }

        res.status(200).json({
            success: true,
            data: preorder,
            message: 'Order status updated successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get order statistics
const getOrderStats = async (req, res) => {
    try {
        const stats = await Preorder.aggregate([
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalAmount: { $sum: "$paymentDetails.amount" },
                    totalShirts: {
                        $sum: {
                            $add: [
                                "$tshirtOrders.xs",
                                "$tshirtOrders.s",
                                "$tshirtOrders.m",
                                "$tshirtOrders.l",
                                "$tshirtOrders.xl",
                                "$tshirtOrders.xxl"
                            ]
                        }
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: stats[0] || {
                totalOrders: 0,
                totalAmount: 0,
                totalShirts: 0
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createPreorder,
    getAllPreorders,
    getPreorderByRegNo,
    updateOrderStatus,
    getOrderStats
};