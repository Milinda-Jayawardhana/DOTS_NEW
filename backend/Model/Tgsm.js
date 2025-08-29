const mongoose = require("mongoose");

const gsmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // each GSM type should be unique
  },
  price: {
    type: Number,
    required: true,
  },
});

const Gsm = mongoose.model("Gsm", gsmSchema);

module.exports = Gsm;
