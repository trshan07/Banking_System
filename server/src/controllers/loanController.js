// src/controllers/loanController.js
const Loan = require('../models/Loan');
const Account = require('../models/Account');
const User = require('../models/User');
const Document = require('../models/Document');

// @desc    Get user loans
// @route   GET /api/loans
// @access  Private
exports.getUserLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ userId: req.user._id })
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: loans.length,
      data: loans
    });
  } catch (error) {
    console.error('Get user loans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get loans'
    });
  }
};

// @desc    Get loan details
// @route   GET /api/loans/:loanId
// @access  Private
exports.getLoanDetails = async (req, res) => {
  try {
    const loan = await Loan.findOne({
      _id: req.params.loanId,
      userId: req.user._id
    })
      .populate('userId', 'firstName lastName email')
      .populate('accountId', 'accountNumber accountType')
      .populate('documents');

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }

    res.json({
      success: true,
      data: loan
    });
  } catch (error) {
    console.error('Get loan details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get loan details'
    });
  }
};

// @desc    Apply for loan
// @route   POST /api/loans/apply
// @access  Private
exports.applyForLoan = async (req, res) => {
  try {
    const {
      loanType,
      amount,
      term,
      purpose,
      employmentDetails,
      collateral,
      guarantors
    } = req.body;

    // Check if user has an account
    const account = await Account.findOne({ userId: req.user._id });
    if (!account) {
      return res.status(400).json({
        success: false,
        message: 'You need an active account to apply for a loan'
      });
    }

    // Calculate interest rate based on loan type and term
    let interestRate;
    switch (loanType) {
      case 'personal':
        interestRate = 10.5;
        break;
      case 'home':
        interestRate = 6.5;
        break;
      case 'auto':
        interestRate = 7.5;
        break;
      case 'business':
        interestRate = 8.5;
        break;
      case 'education':
        interestRate = 5.5;
        break;
      default:
        interestRate = 9.5;
    }

    // Adjust rate based on term
    if (term > 60) interestRate += 1;
    if (term > 120) interestRate += 1;

    const loan = new Loan({
      id: 'loan_' + Date.now(),
      loanType,
      amount,
      interestRate,
      term,
      purpose,
      userId: req.user._id,
      accountId: account._id,
      employmentDetails,
      collateral,
      guarantors,
      status: 'pending'
    });

    await loan.save();

    // Create task for loan officer (you'd implement this with your task system)
    // await createLoanReviewTask(loan._id, req.user._id);

    res.status(201).json({
      success: true,
      message: 'Loan application submitted successfully',
      data: loan
    });
  } catch (error) {
    console.error('Apply for loan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit loan application'
    });
  }
};

// @desc    Get pending loans (employee/admin only)
// @route   GET /api/loans/admin/pending
// @access  Private/Employee
exports.getPendingLoans = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const loans = await Loan.find({ status: 'pending' })
      .populate('userId', 'firstName lastName email phone')
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Loan.countDocuments({ status: 'pending' });

    res.json({
      success: true,
      data: loans,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get pending loans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get pending loans'
    });
  }
};

// @desc    Approve loan (employee/admin only)
// @route   PUT /api/loans/:loanId/approve
// @access  Private/Employee
exports.approveLoan = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { adminComment } = req.body;

    const loan = await Loan.findById(loanId);

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }

    if (loan.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Loan is already ${loan.status}`
      });
    }

    loan.status = 'approved';
    loan.adminComment = adminComment;
    loan.approvedBy = req.user._id;
    loan.approvedAt = new Date();

    await loan.save();

    // Notify user (implement notification service)
    // await notificationService.sendLoanApprovedNotification(loan.userId, loan);

    res.json({
      success: true,
      message: 'Loan approved successfully',
      data: loan
    });
  } catch (error) {
    console.error('Approve loan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve loan'
    });
  }
};

// @desc    Reject loan (employee/admin only)
// @route   PUT /api/loans/:loanId/reject
// @access  Private/Employee
exports.rejectLoan = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { adminComment } = req.body;

    if (!adminComment) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const loan = await Loan.findById(loanId);

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }

    if (loan.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Loan is already ${loan.status}`
      });
    }

    loan.status = 'rejected';
    loan.adminComment = adminComment;
    loan.approvedBy = req.user._id;

    await loan.save();

    // Notify user (implement notification service)
    // await notificationService.sendLoanRejectedNotification(loan.userId, loan, adminComment);

    res.json({
      success: true,
      message: 'Loan rejected successfully',
      data: loan
    });
  } catch (error) {
    console.error('Reject loan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject loan'
    });
  }
};

// @desc    Add admin comment to loan
// @route   POST /api/loans/:loanId/comment
// @access  Private/Employee
exports.addAdminComment = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({
        success: false,
        message: 'Comment is required'
      });
    }

    const loan = await Loan.findById(loanId);

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }

    // Append comment (you might want to store comments array)
    loan.adminComment = loan.adminComment 
      ? loan.adminComment + '\n\n' + new Date().toLocaleDateString() + ': ' + comment
      : new Date().toLocaleDateString() + ': ' + comment;

    await loan.save();

    res.json({
      success: true,
      message: 'Comment added successfully',
      data: loan
    });
  } catch (error) {
    console.error('Add admin comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add comment'
    });
  }
};