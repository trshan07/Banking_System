const express = require('express');
const router = express.Router();
const {
  createLeaveRequest,
  getLeaveRequests,
  getMyLeaveRequests,
  getLeaveRequestById,
  updateLeaveRequest,
  cancelLeaveRequest,
  approveLeaveRequest,
  rejectLeaveRequest,
  getLeaveStatistics,
  getLeaveBalance,
  getPendingApprovals
} = require('../controllers/leaveController');
const { authMiddleware, checkRole } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Employee routes
router.post('/create', checkRole('employee', 'admin', 'superadmin'), createLeaveRequest);
router.get('/my-requests', checkRole('employee', 'admin', 'superadmin'), getMyLeaveRequests);
router.get('/balance', checkRole('employee', 'admin', 'superadmin'), getLeaveBalance);
router.get('/statistics', checkRole('employee', 'admin', 'superadmin', 'hr'), getLeaveStatistics);
router.get('/:id', getLeaveRequestById);
router.put('/:id', checkRole('employee', 'admin', 'superadmin'), updateLeaveRequest);
router.delete('/:id/cancel', checkRole('employee', 'admin', 'superadmin'), cancelLeaveRequest);

// Admin/HR routes
router.get('/pending-approvals', checkRole('admin', 'superadmin', 'hr'), getPendingApprovals);
router.put('/:id/approve', checkRole('admin', 'superadmin', 'hr'), approveLeaveRequest);
router.put('/:id/reject', checkRole('admin', 'superadmin', 'hr'), rejectLeaveRequest);
router.get('/admin/all', checkRole('admin', 'superadmin', 'hr'), getLeaveRequests);

module.exports = router;