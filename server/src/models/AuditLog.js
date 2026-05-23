const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    userEmail: {
      type: String,
      trim: true,
      default: 'system',
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    entity: {
      type: String,
      trim: true,
      default: 'system',
    },
    entityId: {
      type: String,
      trim: true,
      default: null,
    },
    target: {
      type: String,
      trim: true,
      default: '',
    },
    details: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['success', 'failed', 'warning', 'info'],
      default: 'info',
      index: true,
    },
    ipAddress: {
      type: String,
      trim: true,
      default: 'unknown',
    },
    userAgent: {
      type: String,
      trim: true,
      default: '',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

auditLogSchema.index({ timestamp: -1, status: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
