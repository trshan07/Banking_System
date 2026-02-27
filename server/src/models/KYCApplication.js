// src/models/KYCApplication.js
const mongoose = require('mongoose');

const kycApplicationSchema = new mongoose.Schema({
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
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'verified', 'rejected'],
    default: 'draft'
  },
  fullName: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  nationality: {
    type: String,
    required: true
  },
  idType: {
    type: String,
    enum: ['passport', 'driving_license', 'national_id'],
    required: true
  },
  idNumber: {
    type: String,
    required: true,
    unique: true
  },
  idExpiryDate: {
    type: Date,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  occupation: String,
  sourceOfFunds: String,
  documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  submittedAt: Date,
  reviewedAt: Date,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectionReason: String,
  riskRating: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  notes: [{
    comment: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for faster queries
kycApplicationSchema.index({ userId: 1 });
kycApplicationSchema.index({ status: 1 });
kycApplicationSchema.index({ idNumber: 1 });

module.exports = mongoose.model('KYCApplication', kycApplicationSchema);