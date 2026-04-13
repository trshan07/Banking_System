// backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { passport, isGoogleAuthConfigured } = require('../config/auth');
const authController = require('../controllers/authController');
const { authMiddleware, protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { 
  authRateLimiter, 
  loginRateLimiter, 
  logoutLimiter 
} = require('../middleware/rateLimiter');

// Validation rules
const registerValidation = [
  body('firstName')
    .notEmpty().withMessage('First name is required')
    .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .notEmpty().withMessage('Last name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
  
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('phone')
    .notEmpty().withMessage('Phone number is required'),
  
  body('address')
    .notEmpty().withMessage('Address is required'),
  
  validate
];

const loginValidation = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
  
  validate
];

const emailValidation = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  validate
];

const resetPasswordValidation = [
  body('token')
    .notEmpty().withMessage('Token is required'),
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  validate
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  validate
];

const redirectOAuthError = (res, message) => {
  authController.redirectToOAuthResult(res, { error: message });
};

// ============================================
// Public Routes (No Authentication Required)
// ============================================

router.get('/google', (req, res, next) => {
  if (!isGoogleAuthConfigured()) {
    return redirectOAuthError(res, 'Google sign-in is not configured on the server.');
  }

  return passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  if (!isGoogleAuthConfigured()) {
    return redirectOAuthError(res, 'Google sign-in is not configured on the server.');
  }

  return passport.authenticate('google', { session: false }, async (error, user) => {
    if (error || !user) {
      return redirectOAuthError(res, error?.message || 'Google sign-in failed.');
    }

    if (user.status !== 'active') {
      return redirectOAuthError(res, 'Your account is not active. Please contact support.');
    }

    if (user.lockUntil && user.lockUntil > Date.now()) {
      return redirectOAuthError(res, 'Your account is locked. Please try again later.');
    }

    try {
      const session = await authController.createAuthSession(user);
      authController.setRefreshTokenCookie(res, session.refreshToken);

      return authController.redirectToOAuthResult(res, {
        token: session.token,
        refreshToken: session.refreshToken
      });
    } catch (sessionError) {
      console.error('Google callback session error:', sessionError);
      return redirectOAuthError(res, 'Google sign-in failed. Please try again.');
    }
  })(req, res, next);
});

// Register
router.post('/register', authRateLimiter, registerValidation, authController.register);

// Login
router.post('/login', loginRateLimiter, loginValidation, authController.login);

// Refresh Token
router.post('/refresh-token', authRateLimiter, authController.refreshToken);

// Email Verification
router.post('/verify-email', authRateLimiter, authController.verifyEmail);
router.post('/resend-verification', authRateLimiter, emailValidation, authController.resendVerification);

// Password Management
router.post('/forgot-password', authRateLimiter, emailValidation, authController.forgotPassword);
router.post('/reset-password', authRateLimiter, resetPasswordValidation, authController.resetPassword);

// ============================================
// Protected Routes (Authentication Required)
// ============================================
router.use(protect);

// Get current user
router.get('/me', authController.getMe);

// Validate token
router.get('/validate', authController.validateToken);

// Logout
router.post('/logout', logoutLimiter, authController.logout);

// Change password
router.put('/change-password', changePasswordValidation, authController.changePassword);

// Update profile
router.put('/profile', [
  body('firstName').optional().isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  body('lastName').optional().isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
  body('phone').optional().notEmpty().withMessage('Phone cannot be empty'),
  validate
], authController.updateProfile);

module.exports = router;