const express = require("express");
const typeController = require("../Controlers/Ttype"); // Make sure this path is correct

const router = express.Router();

// Routes for Type model
router.get("/types", typeController.getAllTypes);
router.get("/types/:id", typeController.getTypeById);
router.post("/types", typeController.addType);
router.put("/types/:id", typeController.updateType);
router.delete("/types/:id", typeController.deleteType);

module.exports = router;
