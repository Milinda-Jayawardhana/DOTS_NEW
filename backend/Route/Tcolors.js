const express = require("express");
const tcolor = require("../Controlers/Tcolors");

const router = express.Router();

router.get("/colors", tcolor.getAllColors);
router.get("/colors/:id", tcolor.getColorById);
router.post("/colors", tcolor.addColor);
router.put("/colors/:id", tcolor.updateColor);
router.delete("/colors/:id", tcolor.deleteColor);

module.exports = router;