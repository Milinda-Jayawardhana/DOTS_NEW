const express = require("express");
const tcollar = require("../Controlers/Tgsm"); // make sure controller file name matches

const router = express.Router();

// Get all gsm
router.get("/gsm", tcollar.getAllGsm);

// Get gsm by ID
router.get("/gsm/:id", tcollar.getGsmById);

// Add a new gsm
router.post("/gsm", tcollar.addGsm);

// Update a gsm
router.put("/gsm/:id", tcollar.updateGsm);

// Delete a gsm
router.delete("/gsm/:id", tcollar.deleteGsm);

module.exports = router;
