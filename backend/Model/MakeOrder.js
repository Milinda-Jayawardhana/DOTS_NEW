const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;