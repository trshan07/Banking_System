// backend/src/routes/accountRoutes.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const accountController = require('../controllers/accountController');
const { authMiddleware, checkRole } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// Validation rules
const createAccountValidation = [
  body('accountType').isIn(['checking', 'savings', 'business']).withMessage('Invalid account type'),
  body('initialDeposit').optional().isNumeric().withMessage('Initial deposit must be a number'),
  validate
];

const transferValidation = [
  body('fromAccountId').notEmpty().withMessage('Source account is required'),
  body('toAccountId').notEmpty().withMessage('Destination account is required'),
  body('amount').isNumeric().withMessage('Amount must be a number').custom(value => value > 0).withMessage('Amount must be greater than 0'),
  body('description').optional().isString(),
  validate
];

// User routes
router.get('/', authMiddleware, accountController.getUserAccounts);
router.get('/:accountId', authMiddleware, accountController.getAccountDetails);
router.post('/', authMiddleware, createAccountValidation, accountController.createAccount);
router.post('/transfer', authMiddleware, transferValidation, accountController.transferMoney);
router.get('/:accountId/transactions', authMiddleware, accountController.getAccountTransactions);

// Admin routes
router.get('/admin/all', authMiddleware, checkRole('admin', 'super_admin'), accountController.getAllAccounts);
router.put('/:accountId/status', authMiddleware, checkRole('admin', 'super_admin'), accountController.updateAccountStatus);

module.exports = router;