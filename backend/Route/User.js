const express = require("express")
const cors = require("cors")
const userController = require("../Controlers/User")
const authMiddleware = require("../Utils/authMiddleware")

const router = express.Router();

router.use(cors());

router.get("/users", authMiddleware.authenticateToken, userController.getUsers);

module.exports = router;