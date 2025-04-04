const express = require("express");
const tsize = require("../Controlers/Tsizes");

const router = express.Router();

router.get("/sizes", tsize.getAllSizes);
router.get("/sizes/:id", tsize.getSizeById);
router.post("/sizes", tsize.addSize);
router.put("/sizes/:id", tsize.updateSize);
router.delete("/sizes/:id", tsize.deleteSize);

module.exports = router;