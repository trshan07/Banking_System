// src/models/Branch.js
const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    sparse: true
  },
  code: {
    type: String,
    required: [true, 'Branch code is required'],
    unique: true,
    trim: true,
    uppercase: true
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
    default: null
  },
  longitude: {
    type: Number,
    default: null
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
  managerName: {
    type: String,
    trim: true,
    default: ''
  },
  city: {
    type: String,
    trim: true,
    default: ''
  },
  state: {
    type: String,
    trim: true,
    default: ''
  },
  country: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'maintenance', 'closed'],
    default: 'active'
  },
  employeeCount: {
    type: Number,
    default: 0
  },
  customerCount: {
    type: Number,
    default: 0
  },
  revenue: {
    type: Number,
    default: 0
  },
  established: {
    type: Date,
    default: Date.now
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

branchSchema.pre('save', function() {
  if (!this.id) {
    this.id = `BR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  this.isActive = this.status === 'active';
});

branchSchema.index({ code: 1, status: 1 });
branchSchema.index({ latitude: 1, longitude: 1 });

module.exports = mongoose.model('Branch', branchSchema);
