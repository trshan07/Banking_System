// src/middleware/auditLogger.js
const auditLogger = (req, res, next) => {
  const originalEnd = res.end;
  const startTime = Date.now();

  res.end = function(chunk, encoding) {
    const responseTime = Date.now() - startTime;

    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl || req.url,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      userId: req.user ? req.user._id : 'unauthenticated',
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('\n📋 AUDIT LOG:');
      console.log(JSON.stringify(logData, null, 2));
    }

    // In production, you might want to save to database or file
    if (process.env.NODE_ENV === 'production') {
      // TODO: Save to audit log collection or file
    }

    originalEnd.call(this, chunk, encoding);
  };

  next();
};

module.exports = auditLogger;