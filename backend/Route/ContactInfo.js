const express = require("express");
const router = express.Router();
const { getContactInfo, updateContactInfo } = require("../Controlers/ContactInfo");

// Public: Get contact info
router.get("/contact-info", getContactInfo);

// Admin: Update contact info (add auth middleware as needed)
router.put("/contact-info", updateContactInfo);

module.exports = router;