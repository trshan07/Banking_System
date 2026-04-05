// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Main authentication middleware
const authMiddleware = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check cookie as fallback
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET, {
        issuer: 'smartbank',
        audience: 'smartbank-users'
      });

      // Get user
      const user = await User.findById(decoded.id).select('-password -refreshToken -__v');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if user is active
      if (user.status !== 'active') {
        return res.status(403).json({
          success: false,
          message: 'Your account is not active. Please contact support.'
        });
      }

      // Check if account is locked
      if (user.lockUntil && user.lockUntil > Date.now()) {
        return res.status(403).json({
          success: false,
          message: 'Your account is locked. Please try again later.'
        });
      }

      // Check token version (for invalidation on password change)
      if (decoded.tokenVersion !== undefined && decoded.tokenVersion !== user.tokenVersion) {
        return res.status(401).json({
          success: false,
          message: 'Token has been invalidated'
        });
      }

      // Attach user to request
      req.user = user;
      req.userId = user._id;
      
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired'
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// Role-based authorization middleware
const checkRole = (...roles) => {
  return (req, res, next) => {
    // Check if user exists (should be set by authMiddleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if user's role is in the allowed roles array
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`
      });
    }

    next();
  };
};

// Permission-based authorization middleware
const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Superadmin has all permissions
    if (req.user.role === 'superadmin' || req.user.role === 'super_admin') {
      return next();
    }

    // Check if user has the required permission
    if (!req.user.permissions || !req.user.permissions.includes(requiredPermission)) {
      return res.status(403).json({
        success: false,
        message: `Permission '${requiredPermission}' is required to access this route`
      });
    }

    next();
  };
};

// Optional authentication (doesn't require token, but if present, verifies it)
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET);
        const user = await User.findById(decoded.id).select('-password -refreshToken -__v');
        if (user && user.status === 'active') {
          req.user = user;
          req.userId = user._id;
        }
      } catch (error) {
        // Token invalid, but that's ok for optional auth
        console.log('Optional auth token invalid:', error.message);
      }
    }
    
    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  authMiddleware,
  checkRole,
  checkPermission,
  optionalAuth
};