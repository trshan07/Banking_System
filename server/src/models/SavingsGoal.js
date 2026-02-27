// src/models/SavingsGoal.js
const mongoose = require('mongoose');

const savingsGoalSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  goalName: {
    type: String,
    required: true
  },
  targetAmount: {
    type: Number,
    required: true,
    min: [1, 'Target amount must be at least 1']
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: [0, 'Current amount cannot be negative']
  },
  percentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  deadline: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    enum: [
      'emergency_fund',
      'vacation',
      'home_purchase',
      'car_purchase',
      'education',
      'retirement',
      'wedding',
      'business',
      'other'
    ],
    default: 'other'
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  contributions: [{
    amount: Number,
    date: {
      type: Date,
      default: Date.now
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction'
    },
    note: String
  }],
  autoSave: {
    enabled: { type: Boolean, default: false },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly']
    },
    amount: Number,
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account'
    },
    nextRun: Date
  },
  notes: String,
  completedAt: Date
}, {
  timestamps: true
});

// Calculate percentage before saving
savingsGoalSchema.pre('save', function(next) {
  if (this.targetAmount > 0) {
    this.percentage = (this.currentAmount / this.targetAmount) * 100;
  }
  next();
});

module.exports = mongoose.model('SavingsGoal', savingsGoalSchema);