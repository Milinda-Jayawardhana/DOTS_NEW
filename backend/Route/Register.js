const express = require("express");
const registerController = require("../Controlers/Register");

const router = express.Router();

router.post("/register", registerController.createUser);

module.exports = router;