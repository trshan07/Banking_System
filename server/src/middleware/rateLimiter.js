// backend/src/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

// Helper function to get client IP (works with IPv4 and IPv6)
const getClientIp = (req) => {
  // Check for proxy headers first
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ips = forwarded.split(',');
    return ips[0].trim();
  }
  
  // Check for cloudflare header
  if (req.headers['cf-connecting-ip']) {
    return req.headers['cf-connecting-ip'];
  }
  
  // Check for real IP
  if (req.headers['x-real-ip']) {
    return req.headers['x-real-ip'];
  }
  
  // Fallback to socket remote address
  return req.socket.remoteAddress || req.ip || 'unknown';
};

// Custom key generator that handles IPv6 properly
const keyGenerator = (req) => {
  // Use email if available for auth endpoints
  if (req.body?.email && req.path.includes('/auth/')) {
    return req.body.email.toLowerCase();
  }
  
  // Otherwise use IP address
  let ip = getClientIp(req);
  
  // Normalize IPv6 localhost to IPv4 for consistent keys
  if (ip === '::1' || ip === '::ffff:127.0.0.1') {
    ip = '127.0.0.1';
  }
  
  // For IPv6 addresses, we can use the full address or prefix
  // This avoids the ERR_ERL_KEY_GEN_IPV6 error
  return ip;
};

// General rate limiter - more lenient
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
  keyGenerator, // Use custom key generator
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.'
    });
  }
});

// Auth rate limiter - stricter for auth endpoints
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit to 30 auth requests per 15 minutes
  skipSuccessfulRequests: true, // Don't count successful requests
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator, // Use custom key generator
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts. Please try again later.'
    });
  }
});

// Login rate limiter - even stricter for login attempts
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Only 5 login attempts per 15 minutes
  skipSuccessfulRequests: true, // Don't count successful logins
  message: {
    success: false,
    message: 'Too many login attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use email for login attempts if available
    if (req.body?.email) {
      return req.body.email.toLowerCase();
    }
    // Otherwise use IP
    let ip = getClientIp(req);
    if (ip === '::1' || ip === '::ffff:127.0.0.1') {
      ip = '127.0.0.1';
    }
    return ip;
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many login attempts. Please try again later.'
    });
  }
});

// API rate limiter for general API endpoints
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per minute
  message: {
    success: false,
    message: 'Rate limit exceeded, please slow down'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Rate limit exceeded. Please slow down.'
    });
  }
});

// Skip rate limiter for logout (or make it very lenient)
const logoutLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Allow 10 logout requests per minute
  skipSuccessfulRequests: true,
  message: {
    success: false,
    message: 'Too many logout requests'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many logout requests. Please try again later.'
    });
  }
});

module.exports = {
  generalLimiter,
  authRateLimiter,
  loginRateLimiter,
  apiLimiter,
  logoutLimiter
};