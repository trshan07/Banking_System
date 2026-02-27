// src/models/Document.js
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true,
    enum: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx']
  },
  fileSize: {
    type: Number,
    required: true
  },
  documentType: {
    type: String,
    enum: [
      'id_proof',
      'address_proof',
      'income_proof',
      'loan_document',
      'kyc_document',
      'contract',
      'statement',
      'other'
    ],
    required: true
  },
  cloudinaryUrl: {
    type: String,
    required: true
  },
  cloudinaryPublicId: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  loanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan'
  },
  kycApplicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KYCApplication'
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: Date,
  rejectionReason: String,
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Index for faster queries
documentSchema.index({ userId: 1, documentType: 1 });
documentSchema.index({ loanId: 1 });
documentSchema.index({ kycApplicationId: 1 });

module.exports = mongoose.model('Document', documentSchema);