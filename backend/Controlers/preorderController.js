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
    console.log("=== ORDER REQUEST DEBUG ===");
    console.log("Headers:", JSON.stringify(req.headers, null, 2));
    console.log("Body keys:", Object.keys(req.body));
    console.log("Environment:", process.env.NODE_ENV);
    
    // Extract and validate token
    const authHeader = req.headers.authorization;
    console.log("Auth header:", authHeader ? authHeader.substring(0, 20) + "..." : "Missing");
    
    if (!authHeader) {
      console.log("No authorization header provided");
      return res.status(401).json({
        success: false,
        message: "No authorization header provided"
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      console.log("Invalid authorization header format");
      return res.status(401).json({
        success: false,
        message: "Invalid authorization header format"
      });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token extracted, length:", token ? token.length : 0);
    
    if (!token) {
      console.log("No token in authorization header");
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    // Verify JWT token
    let decoded;
    try {
      console.log("Attempting to verify token...");
      console.log("Secret key exists:", !!secretKey);
      console.log("Secret key length:", secretKey ? secretKey.length : 0);
      
      decoded = jwt.verify(token, secretKey);
      console.log("Token verified successfully");
      console.log("Decoded payload:", {
        email: decoded.email,
        exp: new Date(decoded.exp * 1000),
        iat: new Date(decoded.iat * 1000)
      });
    } catch (jwtError) {
      console.error("JWT verification failed:", {
        name: jwtError.name,
        message: jwtError.message,
        expiredAt: jwtError.expiredAt
      });
      
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: "Token has expired"
        });
      } else if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: "Invalid token format"
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "Token verification failed"
        });
      }
    }

    const userEmail = decoded.email;
    console.log("User email from token:", userEmail);

    // Validate required fields
    const requiredFields = ['customerName', 'address', 'telephone'];
    const missingFields = requiredFields.filter(field => !req.body[field] || req.body[field].trim() === '');
    
    if (missingFields.length > 0) {
      console.log("Missing required fields:", missingFields);
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Parse and sanitize quantities array with better error handling
    let quantitiesArray = [];
    if (req.body.quantities) {
      if (Array.isArray(req.body.quantities)) {
        console.log("Processing quantities array, length:", req.body.quantities.length);
        quantitiesArray = req.body.quantities
          .map((q) => {
            if (!q || typeof q !== 'object') {
              console.warn("Invalid quantity object:", q);
              return null;
            }
            return {
              size: String(q.size || '').trim(),
              count: parseInt(q.count) || 0,
            };
          })
          .filter(q => {
            const isValid = q && q.size && q.count > 0;
            if (!isValid) {
              console.warn("Filtered out invalid quantity:", q);
            }
            return isValid;
          });
        console.log("Processed quantities:", quantitiesArray.length, "valid entries");
      } else {
        console.warn("quantities is not an array:", typeof req.body.quantities, req.body.quantities);
      }
    }

    // Validate and sanitize array fields
    const sanitizeArray = (field, fieldName, defaultValue = []) => {
      if (!field) return defaultValue;
      if (Array.isArray(field)) return field;
      if (typeof field === 'string') {
        console.log(`Converting string to array for ${fieldName}:`, field);
        return [field];
      }
      console.warn(`Invalid array field ${fieldName}:`, typeof field);
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
        collars: sanitizeArray(req.body.collars, 'collars'),
        piping: sanitizeArray(req.body.piping, 'piping'),
        finishing: sanitizeArray(req.body.finishing, 'finishing'),
        label: sanitizeArray(req.body.label, 'label'),
        buttons: {
          count: String((req.body.buttons?.count || '')).trim(),
          colour: String((req.body.buttons?.colour || '')).trim(),
        },
        outlines: sanitizeArray(req.body.outlines, 'outlines'),
        sleeve: sanitizeArray(req.body.sleeve, 'sleeve'),
      },
    };

    console.log("Final preorder data structure:");
    console.log("- userEmail:", preorderData.userEmail);
    console.log("- customerName:", preorderData.customerName);
    console.log("- quantities count:", preorderData.tshirtDetails.quantities.length);
    console.log("- arrays:", {
      collars: preorderData.tshirtDetails.collars.length,
      piping: preorderData.tshirtDetails.piping.length,
      finishing: preorderData.tshirtDetails.finishing.length,
      label: preorderData.tshirtDetails.label.length,
      outlines: preorderData.tshirtDetails.outlines.length,
      sleeve: preorderData.tshirtDetails.sleeve.length,
    });

    console.log("Attempting to save preorder...");
    const preorder = new Preorder(preorderData);
    const savedPreorder = await preorder.save();

    console.log("Order saved successfully with ID:", savedPreorder._id);
    console.log("===============================");

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: {
        id: savedPreorder._id,
        customerName: savedPreorder.customerName,
        createdAt: savedPreorder.createdAt
      },
    });

  } catch (error) {
    console.error("=== ORDER ERROR ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
      }));
      console.error("Validation errors:", validationErrors);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      console.error("Duplicate key error:", error.keyValue);
      return res.status(400).json({
        success: false,
        message: "Duplicate entry detected"
      });
    }

    // Handle cast errors (invalid ObjectId, etc.)
    if (error.name === 'CastError') {
      console.error("Cast error:", error.path, error.value);
      return res.status(400).json({
        success: false,
        message: "Invalid data format"
      });
    }

    console.error("===================");

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
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
