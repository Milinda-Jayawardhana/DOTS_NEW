const jwt = require("jsonwebtoken");
const Preorder = require("../Model/preorderModel");
const { secretKey } = require("../Configuration/jwtConfig");
const { uploadFileToFirebase } = require('../utils/fileUpload');
const multer = require('multer');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const createPreorder = async (req, res) => {
  try {
    let bankSlipUrl = null;
    if (req.file) {
      bankSlipUrl = await uploadFileToFirebase(req.file, 'bankSlips');
    }

    // Parse and sanitize quantities array
    const quantitiesArray = Array.isArray(req.body.quantities)
      ? req.body.quantities.map((q) => ({
          size: String(q.size),
          count: parseInt(q.count || 0),
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
        quantities: quantitiesArray,
        collars: req.body.collars || [],
        piping: req.body.piping || [],
        finishing: req.body.finishing || [],
        label: req.body.label || [],
        buttons: {
          count: req.body.buttons?.count || "",
          colour: req.body.buttons?.colour || 0,
        },
        outlines: req.body.outlines || [],
        sleeve: req.body.sleeve || [],
      },
      paymentDetails: {
        amount: parseFloat(req.body.amount),
        bankSlip: {
          url: bankSlipUrl,
          uploadDate: new Date()
        }
      }
    };

    const preorder = new Preorder(preorderData);
    await preorder.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: preorder,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
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
      data: preorders,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get preorders for the logged-in user
const getUserPreorders = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, secretKey);
    const userEmail = decoded.email;

    const preorders = await Preorder.find({ userEmail }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      count: preorders.length,
      data: preorders,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
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
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: preorder,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updatePreorder = async (req, res) => {
  const { id } = req.params;

  const {
    customerName,
    address,
    telephone,
    quantity,
    material,
    printingType,
    quantities,
    collars,
    piping,
    finishing,
    label,
    buttons,
    outlines,
    sleeve,
    orderStatus, // ✅ include this
  } = req.body;

  const formattedQuantities = Array.isArray(quantities)
    ? quantities.map((q) => ({
        size: String(q.size),
        count: parseInt(q.count || 0),
      }))
    : [];

  try {
    const updatedPreorder = await Preorder.findByIdAndUpdate(
      id,
      {
        customerName,
        address,
        telephone,
        orderStatus, // ✅ now this will be updated
        tshirtDetails: {
          quantity,
          material,
          printingType,
          quantities: formattedQuantities,
          collars: collars || [],
          piping: piping || [],
          finishing: finishing || [],
          label: label || [],
          buttons: {
            count: buttons?.count || "",
            colour: buttons?.colour || "",
          },
          outlines: outlines || [],
          sleeve: sleeve || [],
        },
      },
      { new: true }
    );

    if (!updatedPreorder) {
      return res
        .status(404)
        .json({ success: false, message: "Preorder not found or update failed" });
    }

    return res.status(200).json({
      success: true,
      message: "Preorder updated successfully",
      preorder: updatedPreorder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "An error occurred", error });
  }
};


const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { orderStatus } = req.body;

  if (!orderStatus) {
    return res.status(400).json({ success: false, message: 'Order status is required' });
  }

  try {
    const updatedOrder = await Preorder.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Update failed', error: err });
  }
};


const deletePreorder = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPreorder = await Preorder.findByIdAndDelete(id);
    if (!deletedPreorder) {
      return res
        .status(404)
        .json({ message: "Preorder not found or already deleted" });
    }
    return res.status(200).json({
      message: "Preorder deleted successfully",
      preorder: deletedPreorder,
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};

module.exports = {
  createPreorder,
  getAllPreorders,
  getPreorderById,
  getUserPreorders,
  updatePreorder,
  deletePreorder,
  updateOrderStatus
};
