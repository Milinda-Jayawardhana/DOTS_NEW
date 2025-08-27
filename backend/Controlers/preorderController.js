const jwt = require("jsonwebtoken");
const Preorder = require("../Model/preorderModel");
const { secretKey } = require("../Configuration/jwtConfig");

/*
  Preorder controller - robust, defensive handling
  - Expects Authorization: Bearer <token> for user-specific routes (create/getUser).
  - Accepts quantities either at root (req.body.quantities) or inside tshirtDetails.
  - Supports optional images: req.body.tshirtDetails.images (array of { url, public_id }).
  - Returns consistent { success, message, data } JSON.
*/

const verifyToken = (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) throw { status: 401, message: "Authentication token missing" };
  try {
    return jwt.verify(token, secretKey);
  } catch (err) {
    // normalize jwt error
    throw { status: 401, message: "invalid signature" };
  }
};

const normalizeQuantities = (maybeArray) => {
  if (!Array.isArray(maybeArray)) return [];
  return maybeArray.map((q) => ({
    size: String(q.size ?? q.name ?? "").trim(),
    count: Number(q.count ?? q.quantity ?? 0),
  }));
};

const createPreorder = async (req, res) => {
  try {
    const decoded = verifyToken(req);
    const userEmail = decoded.email;

    // Accept quantities from root or tshirtDetails
    const incomingQuantities =
      Array.isArray(req.body.quantities) ? req.body.quantities : Array.isArray(req.body.tshirtDetails?.quantities) ? req.body.tshirtDetails.quantities : [];
    const quantities = normalizeQuantities(incomingQuantities);

    const tshirtDetailsSource = req.body.tshirtDetails || req.body;

    // images support (optional)
    const incomingImages = Array.isArray(tshirtDetailsSource.images) ? tshirtDetailsSource.images : [];

    const quantityTotal =
      Number(req.body.quantity ?? tshirtDetailsSource.quantity ?? 0) ||
      quantities.reduce((s, q) => s + (Number(q.count) || 0), 0);

    const preorderData = {
      userEmail,
      customerName: String(req.body.customerName ?? tshirtDetailsSource.customerName ?? "").trim(),
      address: String(req.body.address ?? tshirtDetailsSource.address ?? "").trim(),
      telephone: String(req.body.telephone ?? tshirtDetailsSource.telephone ?? "").trim(),
      orderStatus: String(req.body.orderStatus ?? "Pending"),
      tshirtDetails: {
        quantity: Number(quantityTotal),
        material: String(req.body.material ?? tshirtDetailsSource.material ?? ""),
        printingType: String(req.body.printingType ?? tshirtDetailsSource.printingType ?? ""),
        quantities,
        collars: Array.isArray(tshirtDetailsSource.collars) ? tshirtDetailsSource.collars : [],
        piping: Array.isArray(tshirtDetailsSource.piping) ? tshirtDetailsSource.piping : [],
        finishing: Array.isArray(tshirtDetailsSource.finishing) ? tshirtDetailsSource.finishing : [],
        label: Array.isArray(tshirtDetailsSource.label) ? tshirtDetailsSource.label : [],
        buttons: {
          count: Number(tshirtDetailsSource.buttons?.count ?? 0),
          colour: String(tshirtDetailsSource.buttons?.colour ?? ""),
        },
        outlines: Array.isArray(tshirtDetailsSource.outlines) ? tshirtDetailsSource.outlines : [],
        sleeve: Array.isArray(tshirtDetailsSource.sleeve) ? tshirtDetailsSource.sleeve : [],
        images: incomingImages,
      },
    };

    const preorder = new Preorder(preorderData);
    await preorder.save();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: preorder,
    });
  } catch (err) {
    const status = err?.status || 400;
    const msg = err?.message || "Failed to create preorder";
    return res.status(status).json({ success: false, message: msg });
  }
};

const getAllPreorders = async (req, res) => {
  try {
    const preorders = await Preorder.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: preorders.length, data: preorders });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || "Failed to fetch preorders" });
  }
};

const getUserPreorders = async (req, res) => {
  try {
    const decoded = verifyToken(req);
    const userEmail = decoded.email;
    const preorders = await Preorder.find({ userEmail }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: preorders.length, data: preorders });
  } catch (err) {
    const status = err?.status || 400;
    const msg = err?.message || "Failed to fetch user preorders";
    return res.status(status).json({ success: false, message: msg });
  }
};

const getPreorderById = async (req, res) => {
  try {
    const preorder = await Preorder.findById(req.params.id);
    if (!preorder) return res.status(404).json({ success: false, message: "Order not found" });
    return res.status(200).json({ success: true, data: preorder });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message || "Failed to get order" });
  }
};

const updatePreorder = async (req, res) => {
  try {
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
      orderStatus,
    } = req.body;

    const formattedQuantities = normalizeQuantities(quantities);

    const update = {
      customerName,
      address,
      telephone,
      orderStatus,
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
          count: Number(buttons?.count ?? 0),
          colour: String(buttons?.colour ?? ""),
        },
        outlines: outlines || [],
        sleeve: sleeve || [],
      },
    };

    const updatedPreorder = await Preorder.findByIdAndUpdate(id, update, { new: true });
    if (!updatedPreorder) return res.status(404).json({ success: false, message: "Preorder not found or update failed" });

    return res.status(200).json({ success: true, message: "Preorder updated successfully", preorder: updatedPreorder });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || "Update failed", error: err });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;
    if (!orderStatus) return res.status(400).json({ success: false, message: "Order status is required" });

    const updatedOrder = await Preorder.findByIdAndUpdate(id, { orderStatus }, { new: true });
    if (!updatedOrder) return res.status(404).json({ success: false, message: "Order not found" });

    return res.status(200).json({ success: true, message: "Order status updated successfully", data: updatedOrder });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || "Update failed", error: err });
  }
};

const deletePreorder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPreorder = await Preorder.findByIdAndDelete(id);
    if (!deletedPreorder) return res.status(404).json({ success: false, message: "Preorder not found or already deleted" });
    return res.status(200).json({ success: true, message: "Preorder deleted successfully", preorder: deletedPreorder });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || "Delete failed", error: err });
  }
};

module.exports = {
  createPreorder,
  getAllPreorders,
  getPreorderById,
  getUserPreorders,
  updatePreorder,
  deletePreorder,
  updateOrderStatus,
};