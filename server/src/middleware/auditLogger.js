const AuditLog = require('../models/AuditLog');

const auditLogger = (req, res, next) => {
  const originalEnd = res.end;
  const startTime = Date.now();

  res.end = function(chunk, encoding) {
    const responseTime = Date.now() - startTime;
    const safeUrl = String(req.originalUrl || req.url).split('?')[0];

    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: safeUrl,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      userId: req.user ? req.user._id : 'unauthenticated',
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('\nAUDIT LOG:');
      console.log(JSON.stringify(logData, null, 2));
    }

    const shouldPersist =
      safeUrl.startsWith('/api/') &&
      !safeUrl.includes('/auth/refresh-token');

    if (shouldPersist) {
      AuditLog.create({
        userId: req.user?._id || null,
        userEmail: req.user?.email || 'unauthenticated',
        action: `${req.method} ${safeUrl}`,
        entity: 'request',
        entityId: req.user?._id?.toString?.() || null,
        target: safeUrl,
        details: `Request completed with status ${res.statusCode} in ${responseTime}ms`,
        status: res.statusCode >= 500 ? 'failed' : res.statusCode >= 400 ? 'warning' : 'success',
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent') || '',
        metadata: {
          method: req.method,
          url: safeUrl,
          statusCode: res.statusCode,
          responseTime,
        },
        timestamp: new Date(),
      }).catch((error) => {
        console.error('Failed to persist audit log:', error.message);
      });
    }

    originalEnd.call(this, chunk, encoding);
  };

  next();
};

module.exports = auditLogger;
