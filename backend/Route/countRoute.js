const express = require("express");
const router = express.Router();

const {
    createCount,
    getCounts,
    updateCount,
    deleteCount
} = require("../Controllers/countController");

// Route to create a new count entry
router.post("/create", createCount);

// Route to get all count entries
router.get("/", getCounts);

// Route to update a count entry by ID
router.put("/:id", updateCount);

// Route to delete a count entry by ID
router.delete("/:id", deleteCount);

module.exports = router;