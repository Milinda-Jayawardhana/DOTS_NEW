const jwt = require("jsonwebtoken");
const Preorder = require("../Model/preorderModel");
const { secretKey } = require("../Configuration/jwtConfig");
/*
const createPreorder = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, secretKey);
    const userEmail = decoded.email;

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
};*/

const createPreorder = async (req, res) => {
  try {
    console.log("Received request body:", JSON.stringify(req.body, null, 2));
    console.log("Request headers:", req.headers);

    // Validate token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secretKey);
    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError);
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }

    const userEmail = decoded.email;

    // Validate required fields
    if (!req.body.customerName || !req.body.address || !req.body.telephone) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: customerName, address, or telephone"
      });
    }

    // Parse and sanitize quantities array with better error handling
    let quantitiesArray = [];
    if (req.body.quantities) {
      if (Array.isArray(req.body.quantities)) {
        quantitiesArray = req.body.quantities
          .map((q) => {
            if (!q || typeof q !== 'object') return null;
            return {
              size: String(q.size || '').trim(),
              count: parseInt(q.count) || 0,
            };
          })
          .filter(q => q && q.size && q.count > 0); // Only include valid entries
      } else {
        console.warn("quantities is not an array:", typeof req.body.quantities);
      }
    }

    // Validate and sanitize array fields
    const sanitizeArray = (field, defaultValue = []) => {
      if (!field) return defaultValue;
      if (Array.isArray(field)) return field;
      if (typeof field === 'string') return [field]; // Handle single string
      return defaultValue;
    };

    // Build the preorder data with better validation
    const preorderData = {
      userEmail: String(userEmail).trim(),
      customerName: String(req.body.customerName || '').trim(),
      address: String(req.body.address || '').trim(),
      telephone: String(req.body.telephone || '').trim(),
      tshirtDetails: {
        quantity: String(req.body.quantity || '').trim(),
        material: String(req.body.material || '').trim(),
        printingType: String(req.body.printingType || '').trim(),
        quantities: quantitiesArray,
        collars: sanitizeArray(req.body.collars),
        piping: sanitizeArray(req.body.piping),
        finishing: sanitizeArray(req.body.finishing),
        label: sanitizeArray(req.body.label),
        buttons: {
          count: String((req.body.buttons?.count || '')).trim(),
          colour: String((req.body.buttons?.colour || '')).trim(),
        },
        outlines: sanitizeArray(req.body.outlines),
        sleeve: sanitizeArray(req.body.sleeve),
      },
    };

    console.log("Sanitized preorder data:", JSON.stringify(preorderData, null, 2));

    // Validate that we have the essential data
    if (!preorderData.customerName || !preorderData.address || !preorderData.telephone) {
      return res.status(400).json({
        success: false,
        message: "Customer name, address, and telephone are required"
      });
    }

    const preorder = new Preorder(preorderData);
    const savedPreorder = await preorder.save();

    console.log("Order saved successfully:", savedPreorder._id);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: savedPreorder,
    });

  } catch (error) {
    console.error("Detailed error:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate entry detected"
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
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
