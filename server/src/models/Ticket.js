const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    unique: true,
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['account', 'transaction', 'loan', 'card', 'technical', 'other'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open'
  },
  message: {
    type: String,
    required: true
  },
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  responses: [{
    responderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    responderName: String,
    responderRole: {
      type: String,
      enum: ['customer', 'employee', 'admin']
    },
    message: String,
    attachments: [String],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  resolution: {
    type: String,
    resolvedAt: Date,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  satisfactionRating: {
    type: Number,
    min: 1,
    max: 5
  },
  satisfactionFeedback: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate ticket ID before saving
ticketSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Ticket').countDocuments();
    this.ticketId = `TKT${String(count + 1).padStart(6, '0')}`;
  }
  this.updatedAt = Date.now();
  next();
});

// Index for faster searches
ticketSchema.index({ ticketId: 1, status: 1, priority: 1 });
ticketSchema.index({ customerEmail: 1, createdAt: -1 });

module.exports = mongoose.model('Ticket', ticketSchema);