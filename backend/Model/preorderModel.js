const mongoose = require('mongoose');

const preorderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    registrationNumber: {
        type: String,
        required: [true, 'Registration number is required'],
        unique: true,
        match: [/^[A-Z]{2}\/\d{4}\/\d{4}$/, 'Please enter a valid registration number (XX/XXXX/XXXX)']
    },
    batch: {
        type: String,
        required: [true, 'Batch is required']
    },
    tshirtOrders: {
        xs: { type: Number, default: 0, min: 0 },
        s: { type: Number, default: 0, min: 0 },
        m: { type: Number, default: 0, min: 0 },
        l: { type: Number, default: 0, min: 0 },
        xl: { type: Number, default: 0, min: 0 },
        xxl: { type: Number, default: 0, min: 0 }
    },
    paymentDetails: {
        amount: {
            type: Number,
            required: [true, 'Payment amount is required']
        },
        bankSlip: {
            filename: String,
            path: String,
            uploadDate: {
                type: Date,
                default: Date.now
            }
        }
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Preorder', preorderSchema);