// src/controllers/kycController.js
const KYCApplication = require('../models/KYCApplication');
const User = require('../models/User');
const Document = require('../models/Document');

// @desc    Get user KYC status
// @route   GET /api/kyc
// @access  Private
exports.getUserKYCStatus = async (req, res) => {
  try {
    let kycApplication = await KYCApplication.findOne({ 
      userId: req.user._id 
    }).populate('documents');

    if (!kycApplication) {
      // Return empty but not error
      return res.json({
        success: true,
        data: null,
        message: 'No KYC application found'
      });
    }

    res.json({
      success: true,
      data: kycApplication
    });
  } catch (error) {
    console.error('Get KYC status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get KYC status'
    });
  }
};

// @desc    Apply for KYC
// @route   POST /api/kyc/apply
// @access  Private
exports.applyForKYC = async (req, res) => {
  try {
    const {
      fullName,
      dateOfBirth,
      nationality,
      idType,
      idNumber,
      idExpiryDate,
      address,
      occupation,
      sourceOfFunds
    } = req.body;

    // Check if KYC application already exists
    const existingKYC = await KYCApplication.findOne({ userId: req.user._id });
    
    if (existingKYC) {
      if (existingKYC.status === 'verified') {
        return res.status(400).json({
          success: false,
          message: 'KYC already verified'
        });
      }
      
      if (existingKYC.status === 'submitted' || existingKYC.status === 'under_review') {
        return res.status(400).json({
          success: false,
          message: `KYC application already ${existingKYC.status}`
        });
      }
    }

    // Check if ID number is already used
    const existingId = await KYCApplication.findOne({ idNumber });
    if (existingId && existingId.userId.toString() !== req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'ID number already registered with another account'
      });
    }

    const kycData = {
      id: 'kyc_' + Date.now(),
      userId: req.user._id,
      fullName,
      dateOfBirth,
      nationality,
      idType,
      idNumber,
      idExpiryDate,
      address,
      occupation,
      sourceOfFunds,
      status: 'draft'
    };

    let kycApplication;
    
    if (existingKYC) {
      // Update existing draft
      kycApplication = await KYCApplication.findByIdAndUpdate(
        existingKYC._id,
        { ...kycData, status: 'draft' },
        { new: true }
      );
    } else {
      // Create new
      kycApplication = new KYCApplication(kycData);
      await kycApplication.save();
    }

    res.json({
      success: true,
      message: 'KYC application saved as draft',
      data: kycApplication
    });
  } catch (error) {
    console.error('Apply for KYC error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save KYC application'
    });
  }
};

// @desc    Submit KYC documents
// @route   POST /api/kyc/submit-documents
// @access  Private
exports.submitKYCDocuments = async (req, res) => {
  try {
    const { documentIds } = req.body;

    if (!documentIds || !Array.isArray(documentIds) || documentIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one document is required'
      });
    }

    // Find KYC application
    let kycApplication = await KYCApplication.findOne({ 
      userId: req.user._id 
    });

    if (!kycApplication) {
      return res.status(404).json({
        success: false,
        message: 'Please create a KYC application first'
      });
    }

    if (kycApplication.status === 'verified') {
      return res.status(400).json({
        success: false,
        message: 'KYC already verified'
      });
    }

    // Verify documents belong to user
    const documents = await Document.find({
      _id: { $in: documentIds },
      userId: req.user._id
    });

    if (documents.length !== documentIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Some documents not found or do not belong to you'
      });
    }

    // Update documents with KYC application ID
    await Document.updateMany(
      { _id: { $in: documentIds } },
      { kycApplicationId: kycApplication._id }
    );

    // Update KYC application
    kycApplication.documents = documentIds;
    kycApplication.status = 'submitted';
    kycApplication.submittedAt = new Date();

    await kycApplication.save();

    res.json({
      success: true,
      message: 'KYC application submitted successfully',
      data: kycApplication
    });
  } catch (error) {
    console.error('Submit KYC documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit KYC application'
    });
  }
};

// @desc    Get pending KYC applications (admin only)
// @route   GET /api/kyc/applications/pending
// @access  Private/Admin
exports.getPendingApplications = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const applications = await KYCApplication.find({ 
      status: { $in: ['submitted', 'under_review'] } 
    })
      .populate('userId', 'firstName lastName email phone')
      .populate('documents')
      .sort({ submittedAt: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await KYCApplication.countDocuments({ 
      status: { $in: ['submitted', 'under_review'] } 
    });

    res.json({
      success: true,
      data: applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get pending applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get pending applications'
    });
  }
};

// @desc    Get KYC application details (admin only)
// @route   GET /api/kyc/applications/:applicationId
// @access  Private/Admin
exports.getApplicationDetails = async (req, res) => {
  try {
    const application = await KYCApplication.findById(req.params.applicationId)
      .populate('userId', 'firstName lastName email phone')
      .populate('documents')
      .populate('reviewedBy', 'firstName lastName email')
      .populate('notes.addedBy', 'firstName lastName email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Get application details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get application details'
    });
  }
};

// @desc    Verify KYC application (admin only)
// @route   PUT /api/kyc/applications/:applicationId/verify
// @access  Private/Admin
exports.verifyKYC = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { riskRating = 'low', notes } = req.body;

    const application = await KYCApplication.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.status !== 'submitted' && application.status !== 'under_review') {
      return res.status(400).json({
        success: false,
        message: `Application is already ${application.status}`
      });
    }

    // Verify all documents are verified
    if (application.documents && application.documents.length > 0) {
      const documents = await Document.find({
        _id: { $in: application.documents }
      });
      
      const allVerified = documents.every(doc => doc.status === 'verified');
      if (!allVerified) {
        return res.status(400).json({
          success: false,
          message: 'All documents must be verified before approving KYC'
        });
      }
    }

    application.status = 'verified';
    application.reviewedBy = req.user._id;
    application.reviewedAt = new Date();
    application.riskRating = riskRating;

    if (notes) {
      application.notes.push({
        comment: notes,
        addedBy: req.user._id,
        addedAt: new Date()
      });
    }

    await application.save();

    // Update user's KYC status
    await User.findByIdAndUpdate(application.userId, {
      isEmailVerified: true // This should be separate from KYC
      // You might want to add a KYC verified flag to User model
    });

    res.json({
      success: true,
      message: 'KYC application verified successfully',
      data: application
    });
  } catch (error) {
    console.error('Verify KYC error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify KYC'
    });
  }
};

// @desc    Reject KYC application (admin only)
// @route   PUT /api/kyc/applications/:applicationId/reject
// @access  Private/Admin
exports.rejectKYC = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { reason, notes } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const application = await KYCApplication.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.status !== 'submitted' && application.status !== 'under_review') {
      return res.status(400).json({
        success: false,
        message: `Application is already ${application.status}`
      });
    }

    application.status = 'rejected';
    application.reviewedBy = req.user._id;
    application.reviewedAt = new Date();
    application.rejectionReason = reason;

    if (notes) {
      application.notes.push({
        comment: notes,
        addedBy: req.user._id,
        addedAt: new Date()
      });
    }

    await application.save();

    res.json({
      success: true,
      message: 'KYC application rejected',
      data: application
    });
  } catch (error) {
    console.error('Reject KYC error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject KYC'
    });
  }
};