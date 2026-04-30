const mongoose = require('mongoose');

const kycApplicationSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    unique: true,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  userEmail: String,
  userFullName: String,
  
  // Personal Information
  personalInfo: {
    fullName: {
      type: String,
      required: true
    },
    dateOfBirth: {
      type: Date,
      required: true
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    nationality: String,
    countryOfResidence: String,
    maritalStatus: {
      type: String,
      enum: ['single', 'married', 'divorced', 'widowed']
    }
  },
  
  // Contact Information
  contactInfo: {
    email: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    alternatePhone: String,
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    }
  },
  
  // Identification Documents
  identification: {
    idType: {
      type: String,
      enum: ['passport', 'driving_license', 'national_id', 'pan_card', 'ssn'],
      required: true
    },
    idNumber: {
      type: String,
      required: true
    },
    issuingCountry: String,
    expiryDate: Date,
    frontImage: {
      filename: String,
      url: String,
      uploadedAt: Date
    },
    backImage: {
      filename: String,
      url: String,
      uploadedAt: Date
    }
  },
  
  // Address Proof
  addressProof: {
    documentType: {
      type: String,
      enum: ['utility_bill', 'bank_statement', 'rental_agreement', 'government_letter']
    },
    documentImage: {
      filename: String,
      url: String
    },
    issueDate: Date
  },
  
  // Employment Information
  employmentInfo: {
    employmentStatus: {
      type: String,
      enum: ['employed', 'self_employed', 'unemployed', 'student', 'retired']
    },
    employerName: String,
    occupation: String,
    annualIncome: Number,
    incomeCurrency: {
      type: String,
      default: 'LKR'
    },
    sourceOfFunds: String
  },
  
  // Tax Information
  taxInfo: {
    tinNumber: String,
    countryOfTaxResidence: String
  },
  
  // Additional Information
  additionalInfo: {
    isPoliticallyExposed: {
      type: Boolean,
      default: false
    },
    pePDetails: String,
    hasCriminalRecord: {
      type: Boolean,
      default: false
    },
    criminalRecordDetails: String,
    purposeOfAccount: String
  },
  
  // Verification Status
  status: {
    type: String,
    enum: ['draft', 'pending', 'under_review', 'approved', 'rejected', 'expired'],
    default: 'pending'
  },
  
  // Verification Details
  verification: {
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    },
    reviewedByName: String,
    reviewedAt: Date,
    rejectionReason: String,
    rejectionNotes: String,
    verificationScore: {
      type: Number,
      min: 0,
      max: 100
    },
    flags: [{
      type: String,
      enum: ['incomplete_info', 'document_expired', 'document_tampered', 'mismatch_info', 'high_risk']
    }]
  },
  
  // Compliance Checks
  complianceChecks: {
    amlCheck: {
      status: {
        type: String,
        enum: ['pending', 'cleared', 'flagged']
      },
      checkedAt: Date,
      reference: String
    },
    sanctionsCheck: {
      status: {
        type: String,
        enum: ['pending', 'cleared', 'flagged']
      },
      checkedAt: Date,
      reference: String
    },
    pepCheck: {
      status: {
        type: String,
        enum: ['pending', 'cleared', 'flagged']
      },
      checkedAt: Date,
      reference: String
    }
  },
  
  // Risk Assessment
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'very_high'],
    default: 'medium'
  },
  riskScore: Number,
  
  // Timestamps
  submittedAt: {
    type: Date,
    default: Date.now
  },
  approvedAt: Date,
  expiresAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate application ID before saving
kycApplicationSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('KYCApplication').countDocuments();
    this.applicationId = `KYC${String(count + 1).padStart(8, '0')}`;
  }
  this.updatedAt = Date.now();
  
  // Auto-calculate risk score based on various factors
  if (this.isModified('personalInfo') || this.isModified('employmentInfo') || this.isModified('additionalInfo')) {
    let riskScore = 0;
    if (this.additionalInfo.isPoliticallyExposed) riskScore += 30;
    if (this.additionalInfo.hasCriminalRecord) riskScore += 40;
    if (this.employmentInfo.annualIncome > 1000000) riskScore += 10;
    if (this.personalInfo.countryOfResidence !== this.taxInfo.countryOfTaxResidence) riskScore += 15;
    
    this.riskScore = riskScore;
    if (riskScore >= 50) this.riskLevel = 'high';
    else if (riskScore >= 30) this.riskLevel = 'medium';
    else if (riskScore >= 70) this.riskLevel = 'very_high';
    else this.riskLevel = 'low';
  }
  
  next();
});

// Indexes for efficient querying
kycApplicationSchema.index({ applicationId: 1, status: 1 });
kycApplicationSchema.index({ userId: 1 });
kycApplicationSchema.index({ status: 1, submittedAt: -1 });
kycApplicationSchema.index({ 'identification.idNumber': 1 });
kycApplicationSchema.index({ riskLevel: 1, status: 1 });

// Virtual for KYC age
kycApplicationSchema.virtual('kycAge').get(function() {
  if (!this.approvedAt) return null;
  const days = Math.floor((Date.now() - this.approvedAt) / (1000 * 60 * 60 * 24));
  return days;
});

// Method to check if KYC is expired
kycApplicationSchema.methods.isExpired = function() {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
};

module.exports = mongoose.model('KYCApplication', kycApplicationSchema);
