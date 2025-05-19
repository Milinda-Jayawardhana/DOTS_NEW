const mongoose = require('mongoose');

const preorderSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: [true, 'Customer name is required']
    },
    address: {
        type: String,
        required: [true, 'Delivery address is required']
    },
    telephone: {
        type: String,
        required: [true, 'Telephone number is required'],
        match: [/^[0-9]{10}$/, 'Please enter a valid phone number']
    },
    tshirtDetails: {
        material: {
            type: String
        },
        printingType: {
            type: String,
            required: [true, 'Printing type is required'],
            enum: ['Printing', 'Embroidering', 'Sublimation']
        },
        quantities: {
            xs: { type: Number, default: 0, min: 0 },
            s: { type: Number, default: 0, min: 0 },
            m: { type: Number, default: 0, min: 0 },
            l: { type: Number, default: 0, min: 0 },
            xl: { type: Number, default: 0, min: 0 },
            xxl: { type: Number, default: 0, min: 0 },
            xxxl: { type: Number, default: 0, min: 0 }
        }
    },
    
    orderStatus: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Processing', 'Ready', 'Delivered', 'Cancelled'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Preorder', preorderSchema);