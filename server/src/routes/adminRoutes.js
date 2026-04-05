const express = require('express');
const router = express.Router();
const {
  getStats,
  getChartData,
  getRecentActivities,
  getPendingApprovals
} = require('../controllers/adminController');
const { authMiddleware, checkRole } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(checkRole('admin', 'superadmin'));

router.get('/stats', getStats);
router.get('/charts', getChartData);
router.get('/activities', getRecentActivities);
router.get('/pending-approvals', getPendingApprovals);

module.exports = router;