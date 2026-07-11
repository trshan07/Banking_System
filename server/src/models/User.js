// backend/src/models/User.js - Add missing methods
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  username: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  googleId: { type: String, unique: true, sparse: true },
  password: { type: String, required: true, select: false },
  phone: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  city: { type: String, default: '', trim: true },
  state: { type: String, default: '', trim: true },
  zipCode: { type: String, default: '', trim: true },
  country: { type: String, default: '', trim: true },
  dateOfBirth: { type: Date, default: null },
  department: { type: String, default: '', trim: true },
  employeeId: { type: String, default: '', trim: true },
  profileImage: { type: String, default: '' },
  role: { type: String, enum: ['customer', 'employee', 'admin', 'superadmin'], default: 'customer' },
  status: { type: String, enum: ['pending', 'active', 'inactive', 'suspended'], default: 'pending' },
  isEmailVerified: { type: Boolean, default: false },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
  permissions: { type: [String], default: [] },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    language: { type: String, default: 'en' },
    theme: { type: String, default: 'light' },
    currency: { type: String, default: 'LKR' },
    adminDashboard: {
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        inApp: { type: Boolean, default: true },
        dailyDigest: { type: Boolean, default: true },
        weeklyReport: { type: Boolean, default: true }
      },
      security: {
        twoFactorAuth: { type: Boolean, default: true },
        sessionTimeout: { type: Number, default: 30 },
        loginAlerts: { type: Boolean, default: true },
        deviceManagement: { type: Boolean, default: true }
      },
      appearance: {
        theme: { type: String, default: 'light' },
        compactMode: { type: Boolean, default: false },
        animations: { type: Boolean, default: true },
        sidebarCollapsed: { type: Boolean, default: false }
      },
      preferences: {
        language: { type: String, default: 'en' },
        timezone: { type: String, default: 'Asia/Colombo' },
        dateFormat: { type: String, default: 'YYYY-MM-DD' },
        numberFormat: { type: String, default: 'en-US' }
      },
      system: {
        backupSchedule: { type: String, default: 'daily' },
        autoUpdate: { type: Boolean, default: true },
        maintenanceMode: { type: Boolean, default: false },
        logRetention: { type: Number, default: 90 }
      }
    }
  },
  refreshToken: { type: String, select: false },
  refreshTokenExpires: { type: Date, default: null },
  emailVerificationToken: { type: String, select: false },
  emailVerificationExpires: { type: Date, default: null },
  tokenVersion: { type: Number, default: 0 }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for isLocked
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate email verification token
userSchema.methods.generateEmailVerificationToken = function() {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
    
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
  
  return verificationToken;
};

// Generate password reset token
userSchema.methods.generatePasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  this.passwordResetExpires = Date.now() + 60 * 60 * 1000;
  
  return resetToken;
};

// Increment login attempts
userSchema.methods.incrementLoginAttempts = function() {
  this.loginAttempts += 1;
  
  if (this.loginAttempts >= 5) {
    this.lockUntil = Date.now() + 30 * 60 * 1000;
  }
  
  return this.save();
};

// Reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  this.loginAttempts = 0;
  this.lockUntil = null;
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
