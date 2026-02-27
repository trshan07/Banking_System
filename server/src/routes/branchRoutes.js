// backend/src/routes/branchRoutes.js
const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');
const { authMiddleware, checkRole } = require('../middleware/auth');

// Public routes
router.get('/', branchController.getAllBranches);
router.get('/nearby', branchController.getNearbyBranches);
router.get('/:branchId', branchController.getBranchById);

// Admin routes
router.post('/', authMiddleware, checkRole('admin', 'super_admin'), branchController.createBranch);
router.put('/:branchId', authMiddleware, checkRole('admin', 'super_admin'), branchController.updateBranch);
router.delete('/:branchId', authMiddleware, checkRole('super_admin'), branchController.deleteBranch);

module.exports = router;