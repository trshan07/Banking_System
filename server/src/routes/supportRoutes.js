// backend/src/routes/supportRoutes.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const supportController = require('../controllers/supportController');
const { authMiddleware, checkRole } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// Validation rules
const createTicketValidation = [
  body('category').isIn(['technical', 'billing', 'general', 'complaint', 'feedback']).withMessage('Invalid category'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required'),
  validate
];

const addMessageValidation = [
  body('message').notEmpty().withMessage('Message is required'),
  validate
];

// User routes
router.get('/tickets', authMiddleware, supportController.getUserTickets);
router.get('/tickets/:ticketId', authMiddleware, supportController.getTicketDetails);
router.post('/tickets', authMiddleware, createTicketValidation, supportController.createTicket);
router.post('/tickets/:ticketId/messages', authMiddleware, addMessageValidation, supportController.addMessage);

// Employee/Admin routes
router.get('/admin/tickets', authMiddleware, checkRole('employee', 'admin', 'super_admin'), supportController.getAllTickets);
router.put('/tickets/:ticketId/assign', authMiddleware, checkRole('employee', 'admin', 'super_admin'), supportController.assignTicket);
router.put('/tickets/:ticketId/status', authMiddleware, checkRole('employee', 'admin', 'super_admin'), supportController.updateTicketStatus);

module.exports = router;