const crypto = require("crypto");
const Preorder = require("../Model/preorderModel"); // your order model

// 🔐 Utility: Validate md5sig
const validatePayHereSignature = (paymentData, merchantSecret) => {
  const {
    merchant_id,
    order_id,
    payhere_amount,
    payhere_currency,
    status_code,
    md5sig, // Sent by PayHere
  } = paymentData;

  const secretHash = crypto.createHash("md5").update(merchantSecret).digest("hex").toUpperCase();

  const localHash = crypto
    .createHash("md5")
    .update(
      `${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${secretHash}`
    )
    .digest("hex")
    .toUpperCase();

  return localHash === md5sig;
};

// ✅ Notify URL (PayHere Server → Your Server)
const handlePaymentNotify = async (req, res) => {
  try {
    const paymentData = req.body;

    // Validate signature
    const isValidSignature = validatePayHereSignature(paymentData, process.env.MERCHANT_SECRET);
    if (!isValidSignature) {
      return res.status(400).json({ message: "Invalid payment signature." });
    }

    const { status_code, custom_1: preorderId, order_id } = paymentData;

    if (status_code === "2") {
      // ✅ Mark the Preorder as Confirmed
      const order = await Preorder.findById(preorderId);
      if (!order) {
        return res.status(404).json({ message: "Preorder not found." });
      }

      order.orderStatus = "Confirmed"; // move from "Pending" → "Confirmed"
      order.paymentInfo = {
        payhereOrderId: order_id,
        amount: paymentData.payhere_amount,
        currency: paymentData.payhere_currency,
        method: paymentData.method || "PayHere", // optional
      };

      await order.save();

      return res.status(200).json({ message: "Preorder payment confirmed." });
    } else {
      return res.status(400).json({ message: "Payment failed or incomplete." });
    }
  } catch (error) {
    console.error("Payment notify error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// ✅ Return URL (User redirected after payment)
const handlePaymentReturn = async (req, res) => {
  if (req.method === "GET") {
    const { order_id, status } = req.query;

    if (status === "Completed") {
      console.log(`✅ Payment successful (Return) for Order ID: ${order_id}`);
      res.redirect(`${process.env.FRONTEND_URL}/payment-success`);
    } else {
      console.log(`❌ Payment failed (Return) for Order ID: ${order_id}`);
      res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
};

// ✅ Cancel URL
const handlePaymentCancel = async (req, res) => {
  if (req.method === "GET") {
    const { order_id } = req.query;
    console.log(`⚠️ Payment canceled by user for Order ID: ${order_id}`);
    res.redirect(`${process.env.FRONTEND_URL}/payment-canceled`);
  } else {
    res.status(405).end();
  }
};

module.exports = {
  handlePaymentNotify,
  handlePaymentReturn,
  handlePaymentCancel,
};
