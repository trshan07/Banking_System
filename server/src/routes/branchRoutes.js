// backend/src/routes/branchRoutes.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const branchController = require('../controllers/branchController');
const { authMiddleware, checkRole } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const createBranchValidation = [
  body('code').notEmpty().withMessage('Branch code is required'),
  body('name').notEmpty().withMessage('Branch name is required'),
  body('address').notEmpty().withMessage('Branch address is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('email').optional({ values: 'falsy' }).isEmail().withMessage('Please provide a valid branch email'),
  body('status').optional().isIn(['active', 'maintenance', 'closed']).withMessage('Invalid branch status'),
  body('employees').optional({ values: 'falsy' }).isInt({ min: 0 }).withMessage('Employees must be zero or more'),
  body('customers').optional({ values: 'falsy' }).isInt({ min: 0 }).withMessage('Customers must be zero or more'),
  body('revenue').optional().isFloat({ min: 0 }).withMessage('Revenue must be zero or more'),
  validate
];

const updateBranchValidation = [
  body('code').optional().notEmpty().withMessage('Branch code cannot be empty'),
  body('name').optional().notEmpty().withMessage('Branch name cannot be empty'),
  body('address').optional().notEmpty().withMessage('Branch address cannot be empty'),
  body('phone').optional().notEmpty().withMessage('Phone number cannot be empty'),
  body('email').optional({ values: 'falsy' }).isEmail().withMessage('Please provide a valid branch email'),
  body('status').optional().isIn(['active', 'maintenance', 'closed']).withMessage('Invalid branch status'),
  body('employees').optional({ values: 'falsy' }).isInt({ min: 0 }).withMessage('Employees must be zero or more'),
  body('customers').optional({ values: 'falsy' }).isInt({ min: 0 }).withMessage('Customers must be zero or more'),
  body('revenue').optional().isFloat({ min: 0 }).withMessage('Revenue must be zero or more'),
  validate
];

// Public routes
router.get('/', branchController.getAllBranches);
router.get('/nearby', branchController.getNearbyBranches);
router.get('/:branchId', branchController.getBranchById);

// Admin routes
router.post('/', authMiddleware, checkRole('admin', 'superadmin'), createBranchValidation, branchController.createBranch);
router.put('/:branchId', authMiddleware, checkRole('admin', 'superadmin'), updateBranchValidation, branchController.updateBranch);
router.delete('/:branchId', authMiddleware, checkRole('superadmin'), branchController.deleteBranch);

module.exports = router;
