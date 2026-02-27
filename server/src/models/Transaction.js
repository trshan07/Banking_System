// src/models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  fromAccountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  toAccountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  type: {
    type: String,
    enum: ['transfer', 'deposit', 'withdrawal', 'payment', 'fee', 'interest'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  description: {
    type: String,
    trim: true
  },
  reference: {
    type: String,
    unique: true
  },
  category: {
    type: String,
    enum: [
      'transfer',
      'bill_payment',
      'shopping',
      'food',
      'entertainment',
      'transport',
      'utilities',
      'salary',
      'interest',
      'fee',
      'other'
    ],
    default: 'other'
  },
  fee: {
    type: Number,
    default: 0
  },
  balanceAfter: {
    fromAccount: Number,
    toAccount: Number
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  ipAddress: String,
  userAgent: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  }
}, {
  timestamps: true
});

// Generate reference number before saving
transactionSchema.pre('save', async function(next) {
  if (!this.reference) {
    this.reference = 'TXN' + Date.now() + Math.floor(Math.random() * 10000);
  }
  next();
});

// Index for faster queries
transactionSchema.index({ fromAccountId: 1, toAccountId: 1 });
transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ status: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);