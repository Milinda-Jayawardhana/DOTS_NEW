const TShirtCount = require("../Model/Tcount");

// Get all T-shirt counts
exports.getAllTShirtCounts = async (req, res) => {
  try {
    const tshirtCounts = await TShirtCount.find();
    if (!tshirtCounts.length) {
      return res.status(404).json({ message: "No T-shirt count records found" });
    }
    return res.status(200).json({ tshirtCounts });
  } catch (err) {
    return res.status(500).json({ message: "Unexpected error occurred", error: err });
  }
};

// Get a single T-shirt count by ID
exports.getTShirtCountById = async (req, res) => {
  const { id } = req.params;
  try {
    const tshirtCount = await TShirtCount.findById(id);
    if (!tshirtCount) {
      return res.status(404).json({ message: "T-shirt count record not found" });
    }
    return res.status(200).json({ tshirtCount });
  } catch (err) {
    return res.status(500).json({ message: "Unexpected error occurred", error: err });
  }
};

// Add a new T-shirt count record
exports.addTShirtCount = async (req, res) => {
  try {
    const { name, price } = req.body;
    const newTShirtCount = new TShirtCount({ name, price });
    await newTShirtCount.save();
    res.status(201).json({ message: "T-shirt count record added successfully", tshirtCount: newTShirtCount });
  } catch (error) {
    res.status(400).json({ message: "Failed to add T-shirt count record", error });
  }
};

// Update a T-shirt count record
exports.updateTShirtCount = async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  try {
    const updatedTShirtCount = await TShirtCount.findByIdAndUpdate(id, { name, price }, { new: true });
    if (!updatedTShirtCount) {
      return res.status(404).json({ message: "T-shirt count record not found or update failed" });
    }
    return res.status(200).json({ message: "T-shirt count record updated successfully", tshirtCount: updatedTShirtCount });
  } catch (error) {
    res.status(500).json({ message: "Unexpected error occurred", error });
  }
};

// Delete a T-shirt count record
exports.deleteTShirtCount = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTShirtCount = await TShirtCount.findByIdAndDelete(id);
    if (!deletedTShirtCount) {
      return res.status(404).json({ message: "T-shirt count record not found or already deleted" });
    }
    return res.status(200).json({ message: "T-shirt count record deleted successfully", tshirtCount: deletedTShirtCount });
  } catch (error) {
    res.status(500).json({ message: "Unexpected error occurred", error });
  }
};