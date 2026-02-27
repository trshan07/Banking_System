// src/models/Branch.js
const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Branch name is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Branch address is required']
  },
  latitude: {
    type: Number,
    required: [true, 'Latitude is required']
  },
  longitude: {
    type: Number,
    required: [true, 'Longitude is required']
  },
  services: [{
    type: String,
    enum: [
      'withdrawal',
      'deposit',
      'loan',
      'account_opening',
      'customer_service',
      'atm',
      'currency_exchange',
      'safety_deposit'
    ]
  }],
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  email: {
    type: String,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  openingHours: {
    monday: { type: String, default: '9:00 AM - 5:00 PM' },
    tuesday: { type: String, default: '9:00 AM - 5:00 PM' },
    wednesday: { type: String, default: '9:00 AM - 5:00 PM' },
    thursday: { type: String, default: '9:00 AM - 5:00 PM' },
    friday: { type: String, default: '9:00 AM - 5:00 PM' },
    saturday: { type: String, default: '10:00 AM - 2:00 PM' },
    sunday: { type: String, default: 'Closed' }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create geospatial index for location-based queries
branchSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Branch', branchSchema);