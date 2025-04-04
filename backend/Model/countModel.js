const mongoose = require("mongoose");

const countSchema = mongoose.Schema(
    {
        shirtAmount: {
            type: Number,
            required: [true, 'Please enter the shirt amount'],
            default: 0
        },
        price: {
            type: Number,
            required: [true, 'Please enter the prize amount']
        }
    },
    {
        timestamps: true
    }
);

const Count = mongoose.model("Count", countSchema);

module.exports = Count;