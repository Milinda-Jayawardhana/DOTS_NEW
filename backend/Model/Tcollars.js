const mongoose = require("mongoose");

const collarSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // each collar type has unique name
  },
  price: {
    type: Number,
    required: true,
  },
});

const Collar = mongoose.model("Collar", collarSchema);

module.exports = Collar;
