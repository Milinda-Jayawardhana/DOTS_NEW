const jwt = require('jsonwebtoken');
const Preorder = require('../Model/preorderModel');
const { secretKey } = require('../Configuration/jwtConfig');

const createPreorder = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, secretKey);
    const userEmail = decoded.email;

    // Parse and sanitize quantities array
    const quantitiesArray = Array.isArray(req.body.quantities)
      ? req.body.quantities.map(q => ({
          size: String(q.size),
          count: parseInt(q.count || 0)
        }))
      : [];

    const preorderData = {
      userEmail,
      customerName: req.body.customerName,
      address: req.body.address,
      telephone: req.body.telephone,
      tshirtDetails: {
        quantity: req.body.quantity,
        material: req.body.material,
        printingType: req.body.printingType,
        quantities: quantitiesArray
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


// Get all preorders (for admin)
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

// Get preorders for the logged-in user
const getUserPreorders = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = jwt.verify(token, secretKey);
        const userEmail = decoded.email;

        const preorders = await Preorder.find({ userEmail }).sort({ createdAt: -1 });
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

// Get single preorder by ID
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
    getPreorderById,
    getUserPreorders
};
