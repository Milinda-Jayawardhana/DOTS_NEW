const mongoose = require("mongoose");

const gsmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Each GSM type has a unique name (e.g., "160 GSM")
  },
  price: {
    type: Number,
    required: true, // Price for using this fabric weight
  },
});

const Gsm = mongoose.model("Gsm", gsmSchema);

module.exports = Gsm;
