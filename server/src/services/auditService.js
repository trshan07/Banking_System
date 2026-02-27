// backend/src/services/auditService.js
const AuditLog = require('../models/AuditLog'); // You'll need to create this model

class AuditService {
  async log({
    userId,
    action,
    entity,
    entityId,
    oldData,
    newData,
    ipAddress,
    userAgent
  }) {
    try {
      const log = new AuditLog({
        userId,
        action,
        entity,
        entityId,
        oldData,
        newData,
        ipAddress,
        userAgent,
        timestamp: new Date()
      });

      await log.save();
      return log;
    } catch (error) {
      console.error('Audit log error:', error);
      // Don't throw - audit logging should not break the main flow
    }
  }

  async getUserLogs(userId, limit = 50) {
    return AuditLog.find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit);
  }

  async getEntityLogs(entity, entityId) {
    return AuditLog.find({ entity, entityId })
      .sort({ timestamp: -1 });
  }
}

module.exports = new AuditService();