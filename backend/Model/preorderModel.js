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
  ],
  collars: {
    type: [String],
    enum: ['Ready Made', 'Half in', 'Half out', 'Full Collar'],
    default: []
  },
  piping: {
    type: [String],
    enum: ['Arm Whole', 'Cuff', 'Placket'],
    default: []
  },
  finishing: {
    type: [String],
    enum: ['Side Open', 'Single Plackets', 'Front Packets', 'Under Packets'],
    default: []
  },
  label: {
    type: [String],
    enum: ['Label-DOTS', 'Label-Size'],
    default: []
  },
  buttons: {
    count: { type: String },
    colour: { type: String }
  },

  outlines: {
    type: [String],
    enum: [
      'Shoulder-1/8', 'Shoulder-1/16',
      'Armwhole-1/8', 'Armwhole-1/16',
      'Collar-1/8', 'Collar-1/16',
      'Contras-1/8', 'Contras-1/16'
    ],
    default: []
  },
  sleeve: {
    type: [String],
    enum: ['Normal', 'Cuff', 'DB Hem'],
    default: []
  }
}, { _id: false });

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
  },
  advancedPayment: {
    paid: { type: Boolean, default: false },        // if advanced payment done
    amount: { type: Number, default: 0 },           // paid amount
    provider: { type: String, default: "" },        // e.g. "payhere"
    transactionId: { type: String, default: "" },   // provider txn id
    paidAt: { type: Date, default: null },          // timestamp
    raw: { type: Object, default: null }            // optional full provider payload
  },
}, {
  timestamps: true
});

preorderSchema.pre('save', function (next) {
  if (!this.orderId && this.userEmail) {
    const timestamp = Date.now();
    const emailHash = crypto.createHash('md5').update(this.userEmail).digest('hex').substring(0, 6);
    this.orderId = `ORD-${emailHash}-${timestamp}`;
  }
  next();
});

module.exports = mongoose.model('Preorder', preorderSchema);
