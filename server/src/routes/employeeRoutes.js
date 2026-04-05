const express = require('express');
const router = express.Router();
const { 
  getStats, 
  getRecentActivities, 
  getCustomers, 
  approveKYC,
  rejectKYC,
  getTickets,
  updateTicketStatus,
  getFraudReports,
  updateFraudStatus,
  getEmployeeStats,
  getCustomerDetails
} = require('../controllers/employeeController');
const { authMiddleware, checkRole } = require('../middleware/auth');

// All employee routes require authentication and employee+ role
router.use(authMiddleware);
router.use(checkRole('employee', 'admin', 'superadmin')); // Using checkRole instead of roleMiddleware

// Dashboard routes
router.get('/stats', getStats);
router.get('/activities', getRecentActivities);
router.get('/employee-stats', getEmployeeStats);

// Customer management routes
router.get('/customers', getCustomers);
router.get('/customers/:customerId', getCustomerDetails);
router.put('/kyc/:customerId/approve', approveKYC);
router.put('/kyc/:customerId/reject', rejectKYC);

// Ticket management routes
router.get('/tickets', getTickets);
router.put('/tickets/:ticketId/status', updateTicketStatus);

// Fraud management routes
router.get('/fraud-reports', getFraudReports);
router.put('/fraud-reports/:reportId/status', updateFraudStatus);

module.exports = router;