const Type = require("../Model/Ttype");

// Get all types
exports.getAllTypes = async (req, res) => {
  try {
    const types = await Type.find();
    if (!types.length) {
      return res.status(404).json({ message: "No types found" });
    }
    return res.status(200).json({ types });
  } catch (err) {
    return res.status(500).json({ message: "An error occurred", error: err });
  }
};

// Get a single type by ID
exports.getTypeById = async (req, res) => {
  const { id } = req.params;
  try {
    const type = await Type.findById(id);
    if (!type) {
      return res.status(404).json({ message: "Type not found" });
    }
    return res.status(200).json({ type });
  } catch (err) {
    return res.status(500).json({ message: "An error occurred", error: err });
  }
};

// Add a new type
exports.addType = async (req, res) => {
  try {
    const { name, price } = req.body;
    const newType = new Type({ name, price });
    await newType.save();
    res.status(201).json({ message: "Type added successfully", type: newType });
  } catch (error) {
    res.status(400).json({ message: "Failed to add type", error });
  }
};

// Update a type
exports.updateType = async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  try {
    const updatedType = await Type.findByIdAndUpdate(id, { name, price }, { new: true });
    if (!updatedType) {
      return res.status(404).json({ message: "Type not found or update failed" });
    }
    return res.status(200).json({ message: "Type updated successfully", type: updatedType });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};

// Delete a type
exports.deleteType = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedType = await Type.findByIdAndDelete(id);
    if (!deletedType) {
      return res.status(404).json({ message: "Type not found or already deleted" });
    }
    return res.status(200).json({ message: "Type deleted successfully", type: deletedType });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};
