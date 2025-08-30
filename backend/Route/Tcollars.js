const express = require("express");
const tcollar = require("../Controlers/Tcollars"); // make sure controller file name matches

const router = express.Router();

// Get all collars
router.get("/collar", tcollar.getAllCollars);

// Get collar by ID
router.get("/collar/:id", tcollar.getCollarById);

// Add a new collar
router.post("/collar", tcollar.addCollar);

// Update a collar
router.put("/collar/:id", tcollar.updateCollar);

// Delete a collar
router.delete("/collar/:id", tcollar.deleteCollar);

module.exports = router;
