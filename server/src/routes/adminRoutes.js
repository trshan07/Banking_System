const express = require('express');
const router = express.Router();
const {
  getStats,
  getChartData,
  getRecentActivities,
  getPendingApprovals,
  processPendingApproval,
  getProfile,
  updateProfile,
  getSettings,
  updateSettings,
  getTransactions,
  getTransactionCharts,
  getKYCApplications,
  getKYCStats,
  approveKYC,
  rejectKYC,
  getFraudAlerts,
  getFraudStats,
  getFraudTrends,
  resolveFraudAlert,
  escalateFraudAlert,
  generateReport
} = require('../controllers/adminController');
const { authMiddleware, checkRole } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(checkRole('admin', 'superadmin'));

router.get('/stats', getStats);
router.get('/charts', getChartData);
router.get('/activities', getRecentActivities);
router.get('/pending-approvals', getPendingApprovals);
router.put('/pending-approvals/:type/:id', processPendingApproval);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);
router.get('/transactions', getTransactions);
router.get('/transactions/charts', getTransactionCharts);
router.get('/kyc/applications', getKYCApplications);
router.get('/kyc/stats', getKYCStats);
router.put('/kyc/:id/approve', approveKYC);
router.put('/kyc/:id/reject', rejectKYC);
router.get('/fraud/alerts', getFraudAlerts);
router.get('/fraud/stats', getFraudStats);
router.get('/fraud/trends', getFraudTrends);
router.put('/fraud/:id/resolve', resolveFraudAlert);
router.put('/fraud/:id/escalate', escalateFraudAlert);
router.post('/reports/generate', generateReport);

module.exports = router;
