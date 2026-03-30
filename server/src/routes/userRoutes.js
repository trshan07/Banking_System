// backend/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const { authMiddleware, checkRole, checkPermission } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { uploadSingle } = require('../middleware/upload');

// Validation rules
const updateProfileValidation = [
  body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
  body('phone').optional().notEmpty().withMessage('Phone cannot be empty'),
  body('address').optional().notEmpty().withMessage('Address cannot be empty'),
  validate
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase and number'),
  validate
];

const createUserValidation = [
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
  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['customer', 'employee', 'admin']).withMessage('Invalid role specified'),
  validate
];

// ============================================
// User Profile Routes (accessible by authenticated users)
// ============================================

// Get current user profile
router.get('/profile', authMiddleware, userController.getProfile);

// Update current user profile
router.put('/profile', authMiddleware, updateProfileValidation, userController.updateProfile);

// Upload profile picture
router.post('/profile-picture', authMiddleware, uploadSingle('profilePicture'), userController.uploadProfilePicture);

// Change password
router.post('/change-password', authMiddleware, changePasswordValidation, userController.changePassword);

// ============================================
// User Account Routes
// ============================================

// Get all accounts for current user
router.get('/accounts', authMiddleware, userController.getUserAccounts);

// Get specific account details
router.get('/accounts/:accountId', authMiddleware, userController.getAccountDetails);

// ============================================
// User Transaction Routes
// ============================================

// Get all transactions for current user
router.get('/transactions', authMiddleware, userController.getUserTransactions);

// Get specific transaction details
router.get('/transactions/:transactionId', authMiddleware, userController.getTransactionDetails);

// ============================================
// Admin Routes (protected by role)
// ============================================

// Create new user (role-based permissions)
router.post('/', authMiddleware, createUserValidation, userController.createUser);

// Get all users (admin only)
router.get('/', authMiddleware, checkRole('admin', 'superadmin'), userController.getAllUsers);

// Get user by ID (admin only)
router.get('/:userId', authMiddleware, checkRole('admin', 'superadmin'), userController.getUserById);

// Update user by ID (admin only)
router.put('/:userId', authMiddleware, checkRole('admin', 'superadmin'), userController.updateUser);

// Delete user by ID (super admin only)
router.delete('/:userId', authMiddleware, checkRole('superadmin'), userController.deleteUser);

// ============================================
// User Statistics Routes (admin only)
// ============================================

// Get user statistics
router.get('/stats/overview', authMiddleware, checkRole('admin', 'superadmin'), userController.getUserStats);

// Get user activity log
router.get('/:userId/activity', authMiddleware, checkRole('admin', 'superadmin'), userController.getUserActivity);

module.exports = router;