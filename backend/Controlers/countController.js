const Count = require('../models/countModel');

// Create a new count entry
const createCount = async (req, res) => {
    try {
        const createdCount = await Count.create(req.body);
        res.status(200).json(createdCount);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};

// Get all count entries
const getCounts = async (req, res) => {
    try {
        const counts = await Count.find();
        res.status(200).json(counts);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};

// Update a count entry by ID
const updateCount = async (req, res) => {
    try {
        const updatedCount = await Count.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedCount) {
            return res.status(404).json({ message: "Count not found" });
        }
        res.status(200).json(updatedCount);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};

// Delete a count entry by ID
const deleteCount = async (req, res) => {
    try {
        const deletedCount = await Count.findByIdAndDelete(req.params.id);
        if (!deletedCount) {
            return res.status(404).json({ message: "Count not found" });
        }
        res.status(200).json({ message: "Count deleted successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCount,
    getCounts,
    updateCount,
    deleteCount,
};