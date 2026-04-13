const express = require('express');
const router = express.Router();
const { authMiddleware, checkRole } = require('../middleware/auth');
const {
  getAdmins,
  getAuditLogs,
  getPerformance,
  getStats,
  getSystemHealth,
  setMaintenanceMode,
  updateSettings,
} = require('../controllers/superadminController');

// All superadmin routes require authentication and superadmin role
router.use(authMiddleware);
router.use(checkRole('superadmin'));

// Get dashboard statistics
router.get('/stats', getStats);

// Get system health
router.get('/system-health', getSystemHealth);

// Get audit logs
router.get('/audit-logs', getAuditLogs);

// Get performance data
router.get('/performance', getPerformance);

// Get admin management data
router.get('/admins', getAdmins);

// Update system settings
router.put('/settings', updateSettings);

// Maintenance mode endpoint
router.post('/maintenance', setMaintenanceMode);

module.exports = router;
