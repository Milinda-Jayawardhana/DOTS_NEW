// models/Stat.js

const mongoose = require("mongoose");

const statSchema = new mongoose.Schema({
  num: {
    type: Number,
    required: true,
  },
  mark: {
    type: String,
    required: true,
    default: "+", // optional default
  },
  text: {
    type: String,
    required: true,
    unique: true,
  },
});

const Stat = mongoose.model("Stat", statSchema);

module.exports = Stat;
