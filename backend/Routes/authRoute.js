const express = require("express");
const {
  registerUser,
  loginUser,
  updateUserDetails,
} = require("../Controllers/authControllers");
const { authenticate, authorizeSupervisor } = require("../Middlewares/authMiddlewares");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/update/:id", authenticate, authorizeSupervisor, updateUserDetails);

module.exports = router;