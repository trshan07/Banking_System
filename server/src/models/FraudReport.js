const mongoose = require('mongoose');

const fraudReportSchema = new mongoose.Schema({
  reportId: {
    type: String,
    unique: true,
    required: true
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reporterName: String,
  reporterEmail: String,
  reporterRole: {
    type: String,
    enum: ['customer', 'employee', 'admin', 'system'],
    default: 'customer'
  },
  transactionId: {
    type: String,
    sparse: true
  },
  accountNumber: {
    type: String,
    required: true
  },
  fraudulentParty: {
    name: String,
    accountNumber: String,
    email: String,
    phone: String
  },
  fraudType: {
    type: String,
    enum: [
      'unauthorized_transaction',
      'phishing_attempt',
      'identity_theft',
      'account_takeover',
      'money_laundering',
      'card_fraud',
      'loan_fraud',
      'other'
    ],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    min: 0
  },
  currency: {
    type: String,
    default: 'LKR'
  },
  transactionDate: Date,
  reportedAt: {
    type: Date,
    default: Date.now
  },
  evidence: [{
    type: {
      type: String,
      enum: ['screenshot', 'document', 'email', 'other']
    },
    filename: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'under_investigation', 'confirmed', 'dismissed', 'resolved'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  assignedInvestigator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  investigationNotes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedByName: String,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  actionTaken: {
    type: String,
    enum: ['refund_issued', 'account_frozen', 'transaction_reversed', 'legal_referred', 'no_action'],
    default: null
  },
  refundAmount: Number,
  refundDate: Date,
  lawEnforcementNotified: {
    type: Boolean,
    default: false
  },
  lawEnforcementReference: String,
  resolvedAt: Date,
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate report ID before saving
fraudReportSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('FraudReport').countDocuments();
    this.reportId = `FRD${String(count + 1).padStart(6, '0')}`;
  }
  this.updatedAt = Date.now();
  next();
});

// Indexes for efficient querying
fraudReportSchema.index({ reportId: 1, status: 1 });
fraudReportSchema.index({ accountNumber: 1, reportedAt: -1 });
fraudReportSchema.index({ priority: 1, status: 1 });

// Virtual for time since report
fraudReportSchema.virtual('timeSinceReport').get(function() {
  const minutes = Math.floor((Date.now() - this.reportedAt) / 60000);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  return `${Math.floor(hours / 24)} days ago`;
});

module.exports = mongoose.model('FraudReport', fraudReportSchema);
