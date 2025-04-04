const express = require("express");
const tmaterial = require("../Controlers/Tmaterials");

const router = express.Router();

router.get("/material", tmaterial.getAllMaterials);
router.get("/material/:id", tmaterial.getMaterialById);
router.post("/material", tmaterial.addMaterial);
router.put("/material/:id", tmaterial.updateMaterial);
router.delete("/material/:id", tmaterial.deleteMaterial);

module.exports = router;