// src/models/Loan.js
const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  loanType: {
    type: String,
    enum: ['personal', 'home', 'auto', 'business', 'education'],
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Loan amount is required'],
    min: [100, 'Loan amount must be at least 100']
  },
  interestRate: {
    type: Number,
    required: true,
    min: [0, 'Interest rate cannot be negative'],
    max: [100, 'Interest rate cannot exceed 100%']
  },
  term: {
    type: Number, // in months
    required: true,
    min: [1, 'Term must be at least 1 month'],
    max: [360, 'Term cannot exceed 360 months']
  },
  monthlyPayment: {
    type: Number
  },
  totalPayment: {
    type: Number
  },
  status: {
    type: String,
    enum: [
      'pending',
      'approved',
      'rejected',
      'disbursed',
      'active',
      'completed',
      'defaulted',
      'cancelled'
    ],
    default: 'pending'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
  purpose: {
    type: String,
    required: true
  },
  employmentDetails: {
    employer: String,
    position: String,
    monthlyIncome: Number,
    yearsEmployed: Number
  },
  collateral: {
    type: String,
    description: String,
    value: Number
  },
  guarantors: [{
    name: String,
    email: String,
    phone: String,
    relationship: String
  }],
  documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  adminComment: String,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  disbursedAt: Date,
  nextPaymentDate: Date,
  payments: [{
    date: Date,
    amount: Number,
    status: {
      type: String,
      enum: ['paid', 'pending', 'late']
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction'
    }
  }]
}, {
  timestamps: true
});

// Calculate monthly payment before saving
loanSchema.pre('save', function(next) {
  if (this.isModified('amount') || this.isModified('interestRate') || this.isModified('term')) {
    const monthlyRate = this.interestRate / 100 / 12;
    const numberOfPayments = this.term;
    
    if (monthlyRate === 0) {
      this.monthlyPayment = this.amount / numberOfPayments;
    } else {
      this.monthlyPayment = this.amount * 
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    }
    
    this.totalPayment = this.monthlyPayment * numberOfPayments;
  }
  next();
});

module.exports = mongoose.model('Loan', loanSchema);