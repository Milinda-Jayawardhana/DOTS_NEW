const express = require("express")
const cors = require("cors")
const {login, refreshToken} = require("../Controlers/Login");

const router = express.Router();

router.use(cors());

router.post("/login", login)
router.post("/refresh-token", refreshToken)

module.exports = router;
