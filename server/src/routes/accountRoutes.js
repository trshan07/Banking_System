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
  body('initialDeposit')
    .optional()
    .custom((value) => Number(value) === 0)
    .withMessage('New accounts must start with a zero balance'),
  validate
];

const transferValidation = [
  body('fromAccountId').notEmpty().withMessage('Source account is required'),
  body('amount').isNumeric().withMessage('Amount must be a number').custom(value => value > 0).withMessage('Amount must be greater than 0'),
  body('transferType').optional().isIn(['own', 'internal', 'external']).withMessage('Invalid transfer type'),
  body('toAccountId').optional().isString(),
  body('beneficiaryName').optional().isString().trim(),
  body('beneficiaryAccountNumber').optional().isString().trim(),
  body('beneficiaryBank').optional().isString().trim(),
  body('description').optional().isString(),
  body('description').optional().isLength({ max: 250 }).withMessage('Description is too long'),
  validate
];

// User routes
router.get('/', authMiddleware, accountController.getUserAccounts);
router.get('/dashboard', authMiddleware, accountController.getDashboardData);
router.post('/', authMiddleware, createAccountValidation, accountController.createAccount);
router.post('/transfer', authMiddleware, transferValidation, accountController.transferMoney);

// Admin routes
router.get('/admin/all', authMiddleware, checkRole('admin', 'superadmin'), accountController.getAllAccounts);
router.put(
  '/:accountId/status',
  authMiddleware,
  checkRole('admin', 'superadmin'),
  body('status').isIn(['active', 'inactive', 'frozen', 'closed']).withMessage('Invalid account status'),
  validate,
  accountController.updateAccountStatus
);

router.get('/:accountId/transactions', authMiddleware, accountController.getAccountTransactions);
router.get('/:accountId', authMiddleware, accountController.getAccountDetails);

module.exports = router;
