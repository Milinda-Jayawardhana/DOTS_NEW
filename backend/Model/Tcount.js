const mongoose = require("mongoose");

const countSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Count = mongoose.model("Count", countSchema);

module.exports = Count;