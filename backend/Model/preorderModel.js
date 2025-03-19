const mongoose = require('mongoose');
const crypto = require('crypto');

const tshirtDetailsSchema = new mongoose.Schema({
  quantity: {
    type: String,
    required: [true, 'Count type is required'],
  },
  material: {
    type: String,
    required: [true, 'Material type is required'],
  },
  printingType: {
    type: String,
    required: [true, 'Printing type is required'],
  },
  quantities: [
    {
      size: { type: String, required: true },
      count: { type: Number, default: 0, min: 0 }
    }
  ]
}, { _id: false }); // _id false since this is a subdocument

const preorderSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    lowercase: true,
  },
  orderId: {
    type: String,
    unique: true
  },
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
    type: tshirtDetailsSchema,
    required: true
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Processing', 'Ready', 'Delivered', 'Cancelled'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

// Generate a unique orderId before saving
preorderSchema.pre('save', function (next) {
  if (!this.orderId && this.userEmail) {
    const timestamp = Date.now();
    const emailHash = crypto.createHash('md5').update(this.userEmail).digest('hex').substring(0, 6);
    this.orderId = `ORD-${emailHash}-${timestamp}`;
  }
  next();
});

module.exports = mongoose.model('Preorder', preorderSchema);
