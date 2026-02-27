// backend/src/routes/kycRoutes.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const kycController = require('../controllers/kycController');
const { authMiddleware, checkRole } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// Validation rules
const kycApplicationValidation = [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('nationality').notEmpty().withMessage('Nationality is required'),
  body('idType').isIn(['passport', 'driving_license', 'national_id']).withMessage('Invalid ID type'),
  body('idNumber').notEmpty().withMessage('ID number is required'),
  validate
];

// User routes
router.get('/', authMiddleware, kycController.getUserKYCStatus);
router.post('/apply', authMiddleware, kycApplicationValidation, kycController.applyForKYC);
router.post('/submit-documents', authMiddleware, kycController.submitKYCDocuments);

// Admin routes
router.get('/applications/pending', authMiddleware, checkRole('employee', 'admin', 'super_admin'), kycController.getPendingApplications);
router.get('/applications/:applicationId', authMiddleware, checkRole('employee', 'admin', 'super_admin'), kycController.getApplicationDetails);
router.put('/applications/:applicationId/verify', authMiddleware, checkRole('employee', 'admin', 'super_admin'), kycController.verifyKYC);
router.put('/applications/:applicationId/reject', authMiddleware, checkRole('employee', 'admin', 'super_admin'), kycController.rejectKYC);

module.exports = router;