// routes/payment.js

const express = require("express");
const paymentController = require("../Controlers/Payments");

const router = express.Router();

// Route for payment notification
router.post('/notify', paymentController.handlePaymentNotify);

// Route for payment return (successful payment)
router.get('/return', paymentController.handlePaymentReturn);

// Route for payment cancellation
router.get('/cancel', paymentController.handlePaymentCancel);

module.exports = router;
