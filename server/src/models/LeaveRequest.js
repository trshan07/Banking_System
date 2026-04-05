const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    unique: true,
    required: true
  },
  
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  employeeName: {
    type: String,
    required: true
  },
  
  employeeEmail: {
    type: String,
    required: true
  },
  
  employeeDepartment: {
    type: String,
    enum: ['operations', 'it', 'hr', 'compliance', 'risk', 'customer_service', 'sales', 'finance'],
    required: true
  },
  
  leaveType: {
    type: String,
    enum: ['annual', 'sick', 'casual', 'unpaid', 'maternity', 'paternity', 'bereavement', 'study', 'other'],
    required: true
  },
  
  startDate: {
    type: Date,
    required: true
  },
  
  endDate: {
    type: Date,
    required: true
  },
  
  totalDays: {
    type: Number,
    required: true,
    min: 0.5
  },
  
  reason: {
    type: String,
    required: true,
    maxlength: 500
  },
  
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Document attachments
  attachments: [{
    filename: String,
    url: String,
    fileType: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Leave balance tracking
  leaveBalance: {
    annual: {
      type: Number,
      default: 0
    },
    sick: {
      type: Number,
      default: 0
    },
    casual: {
      type: Number,
      default: 0
    },
    used: {
      annual: { type: Number, default: 0 },
      sick: { type: Number, default: 0 },
      casual: { type: Number, default: 0 }
    }
  },
  
  // Approval workflow
  approvalFlow: {
    firstLevel: {
      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      approvedByName: String,
      approvedAt: Date,
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      },
      comments: String
    },
    secondLevel: {
      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      approvedByName: String,
      approvedAt: Date,
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      },
      comments: String
    }
  },
  
  // Final decision
  finalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  
  decision: {
    madeBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    madeByName: String,
    madeAt: Date,
    comments: String,
    rejectionReason: String
  },
  
  // Emergency contact during leave
  emergencyContact: {
    name: String,
    relationship: String,
    phoneNumber: String,
    alternatePhone: String
  },
  
  // Backup arrangement
  backupArrangement: {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    employeeName: String,
    tasksDelegated: String,
    confirmed: {
      type: Boolean,
      default: false
    }
  },
  
  // HR notes
  hrNotes: {
    type: String,
    maxlength: 1000
  },
  
  // System fields
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  isActive: {
    type: Boolean,
    default: true
  }
});

// Generate request ID before saving
leaveRequestSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('LeaveRequest').countDocuments();
    const year = new Date().getFullYear();
    this.requestId = `LVE${year}${String(count + 1).padStart(6, '0')}`;
  }
  this.updatedAt = Date.now();
  next();
});

// Calculate total days automatically
leaveRequestSchema.pre('save', function(next) {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    this.totalDays = diffDays;
  }
  next();
});

// Virtual for leave duration in hours
leaveRequestSchema.virtual('durationHours').get(function() {
  return this.totalDays * 8; // Assuming 8-hour workday
});

// Indexes for better query performance
leaveRequestSchema.index({ requestId: 1 });
leaveRequestSchema.index({ employeeId: 1, status: 1 });
leaveRequestSchema.index({ startDate: -1, endDate: -1 });
leaveRequestSchema.index({ status: 1, priority: 1 });
leaveRequestSchema.index({ employeeDepartment: 1, status: 1 });

// Method to check if leave dates are valid
leaveRequestSchema.methods.isDateRangeValid = function() {
  return this.startDate <= this.endDate;
};

// Method to check if leave is overlapping with existing leaves
leaveRequestSchema.statics.checkOverlappingLeaves = async function(employeeId, startDate, endDate, excludeRequestId = null) {
  const query = {
    employeeId: employeeId,
    status: { $in: ['pending', 'approved'] },
    isActive: true,
    $or: [
      { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
    ]
  };
  
  if (excludeRequestId) {
    query._id = { $ne: excludeRequestId };
  }
  
  const overlapping = await this.find(query);
  return overlapping;
};

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);