// src/models/Account.js
const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true
  },
  accountType: {
    type: String,
    enum: ['checking', 'savings', 'business', 'joint'],
    required: true
  },
  balance: {
    type: Number,
    default: 0,
    min: [0, 'Balance cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'JPY']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'frozen', 'closed'],
    default: 'active'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jointOwners: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  interestRate: {
    type: Number,
    default: 0
  },
  overdraftLimit: {
    type: Number,
    default: 0
  },
  dailyTransactionLimit: {
    type: Number,
    default: 10000
  },
  monthlyTransactionLimit: {
    type: Number,
    default: 50000
  },
  openedAt: {
    type: Date,
    default: Date.now
  },
  closedAt: Date
}, {
  timestamps: true
});

// Generate account number before saving
accountSchema.pre('save', async function(next) {
  if (!this.accountNumber) {
    this.accountNumber = 'ACC' + Date.now() + Math.floor(Math.random() * 1000);
  }
  next();
});

module.exports = mongoose.model('Account', accountSchema);