const Material = require("../Model/Tmaterials");

// Get all materials
exports.getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find();
    if (!materials.length) {
      return res.status(404).json({ message: "No materials found" });
    }
    return res.status(200).json({ materials });
  } catch (err) {
    return res.status(500).json({ message: "An error occurred", error: err });
  }
};

// Get material by ID
exports.getMaterialById = async (req, res) => {
  const { id } = req.params;
  try {
    const material = await Material.findById(id);
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }
    return res.status(200).json({ material });
  } catch (err) {
    return res.status(500).json({ message: "An error occurred", error: err });
  }
};

// Add a new material
exports.addMaterial = async (req, res) => {
  try {
    const { name, price } = req.body;
    const newMaterial = new Material({ name, price });
    await newMaterial.save();
    res.status(201).json({ message: "Material added successfully", material: newMaterial });
  } catch (error) {
    res.status(400).json({ message: "Failed to add material", error });
  }
};

// Update a material
exports.updateMaterial = async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  try {
    const updatedMaterial = await Material.findByIdAndUpdate(id, { name, price }, { new: true });
    if (!updatedMaterial) {
      return res.status(404).json({ message: "Material not found or update failed" });
    }
    return res.status(200).json({ message: "Material updated successfully", material: updatedMaterial });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};

// Delete a material
exports.deleteMaterial = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedMaterial = await Material.findByIdAndDelete(id);
    if (!deletedMaterial) {
      return res.status(404).json({ message: "Material not found or already deleted" });
    }
    return res.status(200).json({ message: "Material deleted successfully", material: deletedMaterial });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};