// src/controllers/documentController.js
const Document = require('../models/Document');
const Loan = require('../models/Loan');
const KYCApplication = require('../models/KYCApplication');
const cloudinaryService = require('../services/cloudinaryService');
const fs = require('fs');

// @desc    Get user documents
// @route   GET /api/documents
// @access  Private
exports.getUserDocuments = async (req, res) => {
  try {
    const { page = 1, limit = 20, documentType } = req.query;

    const query = { userId: req.user._id };
    if (documentType) query.documentType = documentType;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const documents = await Document.find(query)
      .populate('loanId', 'loanType amount status')
      .populate('kycApplicationId', 'status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Document.countDocuments(query);

    res.json({
      success: true,
      data: documents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get user documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get documents'
    });
  }
};

// @desc    Get document details
// @route   GET /api/documents/:documentId
// @access  Private
exports.getDocumentDetails = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.documentId,
      userId: req.user._id
    })
      .populate('loanId')
      .populate('kycApplicationId')
      .populate('verifiedBy', 'firstName lastName email');

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    res.json({
      success: true,
      data: document
    });
  } catch (error) {
    console.error('Get document details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get document details'
    });
  }
};

// @desc    Upload documents
// @route   POST /api/documents/upload
// @access  Private
exports.uploadDocuments = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const { documentType, loanId, kycApplicationId } = req.body;
    const uploadedDocuments = [];

    // Validate loan if provided
    if (loanId) {
      const loan = await Loan.findOne({ _id: loanId, userId: req.user._id });
      if (!loan) {
        return res.status(404).json({
          success: false,
          message: 'Loan not found'
        });
      }
    }

    // Validate KYC application if provided
    if (kycApplicationId) {
      const kyc = await KYCApplication.findOne({ 
        _id: kycApplicationId, 
        userId: req.user._id 
      });
      if (!kyc) {
        return res.status(404).json({
          success: false,
          message: 'KYC application not found'
        });
      }
    }

    // Process each file
    for (const file of req.files) {
      try {
        // Upload to Cloudinary
        const uploadResult = await cloudinaryService.uploadImage(file.path, {
          folder: 'smartbank/documents',
          public_id: `${req.user._id}_${Date.now()}_${file.originalname}`
        });

        // Create document record
        const document = new Document({
          id: 'doc_' + Date.now() + Math.random().toString(36).substr(2, 9),
          fileName: file.originalname,
          fileType: file.mimetype.split('/')[1],
          fileSize: file.size,
          documentType,
          cloudinaryUrl: uploadResult.secure_url,
          cloudinaryPublicId: uploadResult.public_id,
          userId: req.user._id,
          loanId: loanId || null,
          kycApplicationId: kycApplicationId || null,
          status: 'pending'
        });

        await document.save();
        uploadedDocuments.push(document);

        // Clean up temp file
        fs.unlinkSync(file.path);
      } catch (uploadError) {
        console.error('Error uploading file:', uploadError);
        // Continue with other files even if one fails
      }
    }

    // If this is for a KYC application, update its document list
    if (kycApplicationId && uploadedDocuments.length > 0) {
      await KYCApplication.findByIdAndUpdate(kycApplicationId, {
        $push: { documents: { $each: uploadedDocuments.map(d => d._id) } }
      });
    }

    // If this is for a loan, update its document list
    if (loanId && uploadedDocuments.length > 0) {
      await Loan.findByIdAndUpdate(loanId, {
        $push: { documents: { $each: uploadedDocuments.map(d => d._id) } }
      });
    }

    res.status(201).json({
      success: true,
      message: `${uploadedDocuments.length} document(s) uploaded successfully`,
      data: uploadedDocuments
    });
  } catch (error) {
    console.error('Upload documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload documents'
    });
  }
};

// @desc    Delete document
// @route   DELETE /api/documents/:documentId
// @access  Private
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.documentId,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Can only delete pending documents
    if (document.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot delete document with status: ${document.status}`
      });
    }

    // Delete from Cloudinary
    if (document.cloudinaryPublicId) {
      await cloudinaryService.deleteImage(document.cloudinaryPublicId);
    }

    await document.deleteOne();

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete document'
    });
  }
};

// @desc    Get user documents by admin
// @route   GET /api/documents/user/:userId
// @access  Private/Admin
exports.getUserDocumentsByAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const documents = await Document.find({ userId })
      .populate('loanId', 'loanType amount status')
      .populate('kycApplicationId', 'status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Document.countDocuments({ userId });

    res.json({
      success: true,
      data: documents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get user documents by admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get documents'
    });
  }
};

// @desc    Verify document (admin only)
// @route   PUT /api/documents/:documentId/verify
// @access  Private/Admin
exports.verifyDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { status, rejectionReason } = req.body;

    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either verified or rejected'
      });
    }

    if (status === 'rejected' && !rejectionReason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    document.status = status;
    document.verifiedBy = req.user._id;
    document.verifiedAt = new Date();
    if (status === 'rejected') {
      document.rejectionReason = rejectionReason;
    }

    await document.save();

    // If this document is part of a KYC application, check if all documents are verified
    if (document.kycApplicationId && status === 'verified') {
      const kycApp = await KYCApplication.findById(document.kycApplicationId);
      const allDocuments = await Document.find({ 
        kycApplicationId: document.kycApplicationId 
      });
      
      const allVerified = allDocuments.every(doc => doc.status === 'verified');
      if (allVerified && kycApp.status === 'submitted') {
        kycApp.status = 'under_review';
        await kycApp.save();
      }
    }

    res.json({
      success: true,
      message: `Document ${status} successfully`,
      data: document
    });
  } catch (error) {
    console.error('Verify document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify document'
    });
  }
};