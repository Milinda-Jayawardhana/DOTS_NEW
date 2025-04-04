const Size = require("../Model/Tsizes");

// Get all sizes
exports.getAllSizes = async (req, res) => {
  try {
    const sizes = await Size.find();
    if (!sizes.length) {
      return res.status(404).json({ message: "No sizes found" });
    }
    return res.status(200).json({ sizes });
  } catch (err) {
    return res.status(500).json({ message: "An error occurred", error: err });
  }
};

// Get size by ID
exports.getSizeById = async (req, res) => {
  const { id } = req.params;
  try {
    const size = await Size.findById(id);
    if (!size) {
      return res.status(404).json({ message: "Size not found" });
    }
    return res.status(200).json({ size });
  } catch (err) {
    return res.status(500).json({ message: "An error occurred", error: err });
  }
};

// Add a new size
exports.addSize = async (req, res) => {
  try {
    const { name } = req.body;
    const newSize = new Size({ name });
    await newSize.save();
    res.status(201).json({ message: "Size added successfully", size: newSize });
  } catch (error) {
    res.status(400).json({ message: "Failed to add size", error });
  }
};

// Update a size
exports.updateSize = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updatedSize = await Size.findByIdAndUpdate(id, { name }, { new: true });
    if (!updatedSize) {
      return res.status(404).json({ message: "Size not found or update failed" });
    }
    return res.status(200).json({ message: "Size updated successfully", size: updatedSize });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};

// Delete a size
exports.deleteSize = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSize = await Size.findByIdAndDelete(id);
    if (!deletedSize) {
      return res.status(404).json({ message: "Size not found or already deleted" });
    }
    return res.status(200).json({ message: "Size deleted successfully", size: deletedSize });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};