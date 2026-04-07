const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authMiddleware } = require('../middleware/auth');

// All dashboard routes require authentication
router.use(authMiddleware);

// Dashboard data
router.get('/data', dashboardController.getDashboardData);

// Sidebar items (role-based quick actions)
router.get('/sidebar', dashboardController.getSidebarItems);

// Alerts
router.get('/alerts', dashboardController.getAllAlerts);
router.put('/alerts/:alertId/dismiss', dashboardController.dismissAlert);
router.put('/alerts/:alertId/read', dashboardController.markAlertAsRead);

// Analytics
router.get('/analytics', dashboardController.getDashboardAnalytics);

module.exports = router;
