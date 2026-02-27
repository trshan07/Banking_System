// src/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

const rateLimiter = (options = {}) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
      success: false,
      message: 'Too many requests, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    ...options
  };

  return rateLimit(defaultOptions);
};

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many attempts, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: {
    success: false,
    message: 'Rate limit exceeded. Please slow down.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  rateLimiter,
  authRateLimiter,
  apiRateLimiter
};