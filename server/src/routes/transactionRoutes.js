// backend/src/routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const transactionController = require('../controllers/transactionController');
const { authMiddleware, checkRole } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// Validation rules
const dateRangeValidation = [
  body('startDate').optional().isISO8601().withMessage('Invalid start date'),
  body('endDate').optional().isISO8601().withMessage('Invalid end date'),
  validate
];

// User routes
router.get('/', authMiddleware, transactionController.getUserTransactions);
router.get('/:transactionId', authMiddleware, transactionController.getTransactionDetails);
router.get('/account/:accountId', authMiddleware, transactionController.getAccountTransactions);
router.post('/date-range', authMiddleware, dateRangeValidation, transactionController.getTransactionsByDateRange);

// Admin routes
router.get('/admin/all', authMiddleware, checkRole('admin', 'super_admin'), transactionController.getAllTransactions);
router.get('/admin/report', authMiddleware, checkRole('admin', 'super_admin'), transactionController.generateReport);

module.exports = router;