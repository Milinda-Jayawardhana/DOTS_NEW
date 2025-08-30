const Collar = require("../Model/Tcollars");

// Get all collar types
exports.getAllCollars = async (req, res) => {
  try {
    const collars = await Collar.find();
    if (!collars.length) {
      return res.status(404).json({ message: "No collar types found" });
    }
    return res.status(200).json({ collars });
  } catch (err) {
    return res.status(500).json({ message: "Unexpected error occurred", error: err });
  }
};

// Get collar by ID
exports.getCollarById = async (req, res) => {
  const { id } = req.params;
  try {
    const collar = await Collar.findById(id);
    if (!collar) {
      return res.status(404).json({ message: "Collar type not found" });
    }
    return res.status(200).json({ collar });
  } catch (err) {
    return res.status(500).json({ message: "Unexpected error occurred", error: err });
  }
};

// Add a new collar type
exports.addCollar = async (req, res) => {
  try {
    const { name, price } = req.body;
    const newCollar = new Collar({ name, price });
    await newCollar.save();
    res.status(201).json({ message: "Collar type added successfully", collar: newCollar });
  } catch (error) {
    res.status(400).json({ message: "Failed to add collar type", error });
  }
};

// Update a collar type
exports.updateCollar = async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  try {
    const updatedCollar = await Collar.findByIdAndUpdate(id, { name, price }, { new: true });
    if (!updatedCollar) {
      return res.status(404).json({ message: "Collar type not found or update failed" });
    }
    return res.status(200).json({ message: "Collar type updated successfully", collar: updatedCollar });
  } catch (error) {
    res.status(500).json({ message: "Unexpected error occurred", error });
  }
};

// Delete a collar type
exports.deleteCollar = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCollar = await Collar.findByIdAndDelete(id);
    if (!deletedCollar) {
      return res.status(404).json({ message: "Collar type not found or already deleted" });
    }
    return res.status(200).json({ message: "Collar type deleted successfully", collar: deletedCollar });
  } catch (error) {
    res.status(500).json({ message: "Unexpected error occurred", error });
  }
};
