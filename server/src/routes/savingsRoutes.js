// backend/src/routes/savingsRoutes.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const savingsController = require('../controllers/savingsController');
const { authMiddleware } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// Validation rules
const createGoalValidation = [
  body('goalName').trim().notEmpty().withMessage('Goal name is required'),
  body('targetAmount').isNumeric().withMessage('Target amount must be a number').custom(value => value > 0).withMessage('Target amount must be greater than 0'),
  body('deadline').notEmpty().withMessage('Deadline is required').bail().isISO8601().withMessage('Invalid deadline date'),
  body('category').optional().isIn([
    'emergency_fund',
    'vacation',
    'home_purchase',
    'car_purchase',
    'education',
    'retirement',
    'wedding',
    'business',
    'other'
  ]).withMessage('Invalid savings goal category'),
  body('notes').optional().isString().trim(),
  validate
];

const updateProgressValidation = [
  body('accountId').notEmpty().withMessage('Source account is required'),
  body('amount').isNumeric().withMessage('Amount must be a number').custom(value => value > 0).withMessage('Amount must be greater than 0'),
  body('note').optional().isString().trim(),
  validate
];

// Savings goals routes
router.get('/goals', authMiddleware, savingsController.getUserGoals);
router.get('/goals/:goalId', authMiddleware, savingsController.getGoalDetails);
router.post('/goals', authMiddleware, createGoalValidation, savingsController.createGoal);
router.put('/goals/:goalId/progress', authMiddleware, updateProgressValidation, savingsController.updateProgress);
router.delete('/goals/:goalId', authMiddleware, savingsController.deleteGoal);

// Savings account routes
router.get('/accounts', authMiddleware, savingsController.getSavingsAccounts);
router.get('/accounts/:accountId', authMiddleware, savingsController.getSavingsAccountDetails);
router.post('/accounts/:accountId/deposit', authMiddleware, savingsController.depositToSavings);
router.post('/accounts/:accountId/withdraw', authMiddleware, savingsController.withdrawFromSavings);

module.exports = router;