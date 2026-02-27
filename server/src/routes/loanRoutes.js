// backend/src/routes/loanRoutes.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const loanController = require('../controllers/loanController');
const { authMiddleware, checkRole } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// Validation rules
const applyLoanValidation = [
  body('loanType').isIn(['personal', 'home', 'auto', 'business', 'education']).withMessage('Invalid loan type'),
  body('amount').isNumeric().withMessage('Amount must be a number').custom(value => value > 0).withMessage('Amount must be greater than 0'),
  body('purpose').notEmpty().withMessage('Purpose is required'),
  validate
];

// User routes
router.get('/', authMiddleware, loanController.getUserLoans);
router.get('/:loanId', authMiddleware, loanController.getLoanDetails);
router.post('/apply', authMiddleware, applyLoanValidation, loanController.applyForLoan);

// Employee/Admin routes
router.get('/admin/pending', authMiddleware, checkRole('employee', 'admin', 'super_admin'), loanController.getPendingLoans);
router.put('/:loanId/approve', authMiddleware, checkRole('employee', 'admin', 'super_admin'), loanController.approveLoan);
router.put('/:loanId/reject', authMiddleware, checkRole('employee', 'admin', 'super_admin'), loanController.rejectLoan);
router.post('/:loanId/comment', authMiddleware, checkRole('employee', 'admin', 'super_admin'), loanController.addAdminComment);

module.exports = router;