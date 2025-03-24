const mongoose = require("mongoose");

const tShirtSchema = mongoose.Schema(
    {
        size:{
            type: String,
            required:[true, 'Plaease enter a product name']
        },
        quantity: {
            type: Number,
            required: true,
            default: 0
        },
        price: {
            type: Number,
            required: true
        },
        color:{
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
)

const Tshirt = mongoose.model("Tshirt",tShirtSchema)

module.exports = Tshirt