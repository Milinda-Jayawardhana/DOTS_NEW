const express = require("express");
const tcounts = require("../Controlers/Tcount");
const authMiddleware = require("../Utils/authMiddleware");

const router = express.Router();

router.get("/counts", tcounts.getAllTShirtCounts);
router.get("/counts/:id", tcounts.getTShirtCountById);
<<<<<<< Updated upstream
router.post("/counts", authMiddleware.authenticateToken, authMiddleware.authorizeAdmin, tcounts.addTShirtCount);
router.put("/counts/:id",  authMiddleware.authenticateToken, authMiddleware.authorizeAdmin, tcounts.updateTShirtCount);
router.delete("/counts/:id", authMiddleware.authenticateToken, authMiddleware.authorizeAdmin, tcounts.deleteTShirtCount);

module.exports = router;
=======
router.post("/counts", tcounts.addTShirtCount);
router.put("/counts/:id", tcounts.updateTShirtCount);
router.delete("/counts/:id", tcounts.deleteTShirtCount);
module.exports = router;
>>>>>>> Stashed changes
