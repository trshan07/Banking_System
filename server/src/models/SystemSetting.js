const mongoose = require('mongoose');

const systemSettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'default',
    },
    system: {
      maintenanceMode: { type: Boolean, default: false },
      debugMode: { type: Boolean, default: false },
      apiRateLimit: { type: Number, default: 1000 },
      sessionTimeout: { type: Number, default: 60 },
      maxLoginAttempts: { type: Number, default: 5 },
    },
    security: {
      encryptionLevel: { type: String, default: 'AES-256' },
      passwordPolicy: { type: String, default: 'strong' },
      mfaRequired: { type: Boolean, default: true },
      ipWhitelist: { type: [String], default: [] },
      auditRetention: { type: Number, default: 365 },
    },
    features: {
      cryptoEnabled: { type: Boolean, default: true },
      loanModule: { type: Boolean, default: true },
      fraudDetection: { type: Boolean, default: true },
      mobileBanking: { type: Boolean, default: true },
      internationalTransfers: { type: Boolean, default: true },
    },
    integrations: {
      swiftEnabled: { type: Boolean, default: true },
      fedwireEnabled: { type: Boolean, default: true },
      achEnabled: { type: Boolean, default: true },
      cryptoGateway: { type: String, default: 'coinbase' },
    },
    maintenance: {
      enabledAt: { type: Date, default: null },
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SystemSetting', systemSettingSchema);
