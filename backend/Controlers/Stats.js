const Stat = require("../Model/Stats");

// Get all stats
exports.getAllStats = async (req, res) => {
  try {
    const stats = await Stat.find();
    if (!stats.length) {
      return res.status(404).json({ message: "No stats found" });
    }
    return res.status(200).json({ stats });
  } catch (err) {
    return res.status(500).json({ message: "An error occurred", error: err });
  }
};

// Get a single stat by ID
exports.getStatById = async (req, res) => {
  const { id } = req.params;
  try {
    const stat = await Stat.findById(id);
    if (!stat) {
      return res.status(404).json({ message: "Stat not found" });
    }
    return res.status(200).json({ stat });
  } catch (err) {
    return res.status(500).json({ message: "An error occurred", error: err });
  }
};

// Add a new stat
exports.addStat = async (req, res) => {
  try {
    const { num, mark, text } = req.body; 
    const newStat = new Stat({ num, mark, text });
    await newStat.save();
    res.status(201).json({ message: "Stat added successfully", stat: newStat });
  } catch (error) {
    res.status(400).json({ message: "Failed to add stat", error });
  }
};

// Update a stat
exports.updateStat = async (req, res) => {
  const { id } = req.params;
  const { num, mark, text } = req.body;
  try {
    const updatedStat = await Stat.findByIdAndUpdate(
      id,
      { num, mark, text },
      { new: true }
    );
    if (!updatedStat) {
      return res.status(404).json({ message: "Stat not found or update failed" });
    }
    return res.status(200).json({ message: "Stat updated successfully", stat: updatedStat });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};

// Delete a stat
exports.deleteStat = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedStat = await Stat.findByIdAndDelete(id);
    if (!deletedStat) {
      return res.status(404).json({ message: "Stat not found or already deleted" });
    }
    return res.status(200).json({ message: "Stat deleted successfully", stat: deletedStat });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};
