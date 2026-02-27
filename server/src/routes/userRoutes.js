// backend/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const { authMiddleware, checkRole } = require('../middleware/auth');
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

// Profile routes
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, updateProfileValidation, userController.updateProfile);
router.post('/profile-picture', authMiddleware, uploadSingle('profilePicture'), userController.uploadProfilePicture);
router.post('/change-password', authMiddleware, changePasswordValidation, userController.changePassword);

// Account routes
router.get('/accounts', authMiddleware, userController.getUserAccounts);
router.get('/accounts/:accountId', authMiddleware, userController.getAccountDetails);

// Transaction routes
router.get('/transactions', authMiddleware, userController.getUserTransactions);
router.get('/transactions/:transactionId', authMiddleware, userController.getTransactionDetails);

// Admin routes (protected by role)
router.get('/', authMiddleware, checkRole('admin', 'super_admin'), userController.getAllUsers);
router.get('/:userId', authMiddleware, checkRole('admin', 'super_admin'), userController.getUserById);
router.put('/:userId', authMiddleware, checkRole('admin', 'super_admin'), userController.updateUser);
router.delete('/:userId', authMiddleware, checkRole('super_admin'), userController.deleteUser);

module.exports = router;