const express = require("express");
const statController = require("../Controlers/Stats"); // Ensure this path is correct
const authMiddleware = require("../Utils/authMiddleware");

const router = express.Router();

// Public routes
router.get("/stats", statController.getAllStats);
router.get("/stats/:id", statController.getStatById);

// Admin_protected routes
router.post(
  "/stats", authMiddleware.authenticateToken, authMiddleware.authorizeAdmin, statController.addStat
);

router.put(
  "/stats/:id", authMiddleware.authenticateToken, authMiddleware.authorizeAdmin, statController.updateStat
);

router.delete(
  "/stats/:id", authMiddleware.authenticateToken, authMiddleware.authorizeAdmin, statController.deleteStat
);

module.exports = router;
