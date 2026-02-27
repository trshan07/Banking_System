// backend/src/routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const employeeController = require('../controllers/employeeController');
const { authMiddleware, checkRole } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// Validation rules
const leaveRequestValidation = [
  body('leaveType').isIn(['annual', 'sick', 'personal', 'maternity', 'paternity']).withMessage('Invalid leave type'),
  body('startDate').isISO8601().withMessage('Invalid start date'),
  body('endDate').isISO8601().withMessage('Invalid end date'),
  validate
];

// Employee routes (only accessible by employees and above)
router.get('/dashboard', authMiddleware, checkRole('employee', 'admin', 'super_admin'), employeeController.getDashboard);
router.get('/tasks', authMiddleware, checkRole('employee', 'admin', 'super_admin'), employeeController.getTasks);
router.put('/tasks/:taskId/complete', authMiddleware, checkRole('employee', 'admin', 'super_admin'), employeeController.completeTask);

// Leave requests
router.get('/leave-requests', authMiddleware, checkRole('employee', 'admin', 'super_admin'), employeeController.getLeaveRequests);
router.post('/leave-requests', authMiddleware, checkRole('employee', 'admin', 'super_admin'), leaveRequestValidation, employeeController.createLeaveRequest);
router.put('/leave-requests/:requestId', authMiddleware, checkRole('employee', 'admin', 'super_admin'), employeeController.updateLeaveRequest);

// Admin only routes for managing employees
router.get('/all', authMiddleware, checkRole('admin', 'super_admin'), employeeController.getAllEmployees);
router.get('/:employeeId', authMiddleware, checkRole('admin', 'super_admin'), employeeController.getEmployeeDetails);
router.put('/:employeeId/role', authMiddleware, checkRole('super_admin'), employeeController.updateEmployeeRole);

module.exports = router;