// backend/src/routes/documentRoutes.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const documentController = require('../controllers/documentController');
const { authMiddleware, checkRole } = require('../middleware/auth');
const { uploadMultiple } = require('../middleware/upload');
const { validate } = require('../middleware/validation');

// Validation rules
const documentUploadValidation = [
  body('documentType').isIn(['id_proof', 'address_proof', 'income_proof', 'loan_document', 'other']).withMessage('Invalid document type'),
  body('loanId').optional().isMongoId().withMessage('Invalid loan ID'),
  body('kycApplicationId').optional().isMongoId().withMessage('Invalid KYC application ID'),
  validate
];

// User routes
router.get('/', authMiddleware, documentController.getUserDocuments);
router.get('/:documentId', authMiddleware, documentController.getDocumentDetails);
router.post('/upload', authMiddleware, uploadMultiple('documents', 5), documentUploadValidation, documentController.uploadDocuments);
router.delete('/:documentId', authMiddleware, documentController.deleteDocument);

// Admin routes
router.get('/user/:userId', authMiddleware, checkRole('admin', 'super_admin'), documentController.getUserDocumentsByAdmin);

module.exports = router;