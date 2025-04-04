const express = require("express");
const tcounts = require("../Controlers/Tcount");

const router = express.Router();

router.get("/counts", tcounts.getAllTShirtCounts);
router.get("/counts/:id", tcounts.getTShirtCountById);
router.post("/counts", tcounts.addTShirtCount);
router.put("/counts/:id", tcounts.updateTShirtCount);
router.delete("/counts/:id", tcounts.deleteTShirtCount);

module.exports = router;