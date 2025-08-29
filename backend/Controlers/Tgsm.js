const Gsm = require("../Model/Tgsm");

// Get all GSM types
exports.getAllGsm = async (req, res) => {
  try {
    const gsmList = await Gsm.find();
    if (!gsmList.length) {
      return res.status(404).json({ message: "No GSM types found" });
    }
    return res.status(200).json({ gsmList });
  } catch (err) {
    return res.status(500).json({ message: "Unexpected error occurred", error: err });
  }
};

// Get GSM type by ID
exports.getGsmById = async (req, res) => {
  const { id } = req.params;
  try {
    const gsm = await Gsm.findById(id);
    if (!gsm) {
      return res.status(404).json({ message: "GSM type not found" });
    }
    return res.status(200).json({ gsm });
  } catch (err) {
    return res.status(500).json({ message: "Unexpected error occurred", error: err });
  }
};

// Add a new GSM type
exports.addGsm = async (req, res) => {
  try {
    const { name, price } = req.body;
    const newGsm = new Gsm({ name, price });
    await newGsm.save();
    res.status(201).json({ message: "GSM type added successfully", gsm: newGsm });
  } catch (error) {
    res.status(400).json({ message: "Failed to add GSM type", error });
  }
};

// Update a GSM type
exports.updateGsm = async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  try {
    const updatedGsm = await Gsm.findByIdAndUpdate(id, { name, price }, { new: true });
    if (!updatedGsm) {
      return res.status(404).json({ message: "GSM type not found or update failed" });
    }
    return res.status(200).json({ message: "GSM type updated successfully", gsm: updatedGsm });
  } catch (error) {
    res.status(500).json({ message: "Unexpected error occurred", error });
  }
};

// Delete a GSM type
exports.deleteGsm = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedGsm = await Gsm.findByIdAndDelete(id);
    if (!deletedGsm) {
      return res.status(404).json({ message: "GSM type not found or already deleted" });
    }
    return res.status(200).json({ message: "GSM type removed successfully", gsm: deletedGsm });
  } catch (error) {
    res.status(500).json({ message: "Unexpected error occurred", error });
  }
};
