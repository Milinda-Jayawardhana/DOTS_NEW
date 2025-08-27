const Color = require("../Model/Tcolors");

// Get all colors
exports.getAllColors = async (req, res) => {
  try {
    const colors = await Color.find();
    if (!colors.length) {
      return res.status(404).json({ message: "No colors found" });
    }
    return res.status(200).json({ colors });
  } catch (err) {
    return res.status(500).json({ message: "An error occurred", error: err });
  }
};

// Get color by ID
exports.getColorById = async (req, res) => {
  const { id } = req.params;
  try {
    const color = await Color.findById(id);
    if (!color) {
      return res.status(404).json({ message: "Color not found" });
    }
    return res.status(200).json({ color });
  } catch (err) {
    return res.status(500).json({ message: "An error occurred", error: err });
  }
};

// Add a new color
exports.addColor = async (req, res) => {
  try {
    const { name, price } = req.body;
    const newColor = new Color({ name, price });
    await newColor.save();
    res.status(201).json({ message: "Color added successfully", color: newColor });
  } catch (error) {
    res.status(400).json({ message: "Failed to add color", error });
  }
};

// Update a color
exports.updateColor = async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  try {
    const updatedColor = await Color.findByIdAndUpdate(id, { name, price }, { new: true });
    if (!updatedColor) {
      return res.status(404).json({ message: "Color not found or update failed" });
    }
    return res.status(200).json({ message: "Color updated successfully", color: updatedColor });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};

// Delete a color
exports.deleteColor = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedColor = await Color.findByIdAndDelete(id);
    if (!deletedColor) {
      return res.status(404).json({ message: "Color not found or already deleted" });
    }
    return res.status(200).json({ message: "Color removed successfully", color: deletedColor });
  } catch (error) {
    res.status(500).json({ message: "Unexpected error occurred", error });
  }
};