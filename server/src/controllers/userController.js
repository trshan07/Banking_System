// backend/src/controllers/userController.js
const User = require('../models/User');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const bcrypt = require('bcryptjs');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -__v');
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, address } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    
    await user.save();
    
    const updatedUser = await User.findById(req.user._id).select('-password -__v');
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};

// @desc    Upload profile picture
// @route   POST /api/users/profile-picture
// @access  Private
exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const user = await User.findById(req.user._id);
    
    // In a real app, you would upload to cloud storage and get URL
    // For now, we'll use local path
    const profilePictureUrl = `/uploads/${req.file.filename}`;
    user.profileImage = profilePictureUrl;
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: { profileImage: profilePictureUrl }
    });
  } catch (error) {
    console.error('Upload profile picture error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload profile picture'
    });
  }
};

// @desc    Change password
// @route   POST /api/users/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user._id).select('+password');
    
    // Verify current password
    const isValidPassword = await user.comparePassword(currentPassword);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
};

// @desc    Get user accounts
// @route   GET /api/users/accounts
// @access  Private
exports.getUserAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user._id });
    
    res.json({
      success: true,
      data: accounts
    });
  } catch (error) {
    console.error('Get user accounts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get accounts'
    });
  }
};

// @desc    Get account details
// @route   GET /api/users/accounts/:accountId
// @access  Private
exports.getAccountDetails = async (req, res) => {
  try {
    const account = await Account.findOne({
      _id: req.params.accountId,
      userId: req.user._id
    });
    
    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }
    
    res.json({
      success: true,
      data: account
    });
  } catch (error) {
    console.error('Get account details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get account details'
    });
  }
};

// @desc    Get user transactions
// @route   GET /api/users/transactions
// @access  Private
exports.getUserTransactions = async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user._id }).select('_id');
    const accountIds = accounts.map(acc => acc._id);
    
    const transactions = await Transaction.find({
      $or: [
        { fromAccountId: { $in: accountIds } },
        { toAccountId: { $in: accountIds } }
      ]
    }).sort({ createdAt: -1 }).limit(50);
    
    res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('Get user transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transactions'
    });
  }
};

// @desc    Get transaction details
// @route   GET /api/users/transactions/:transactionId
// @access  Private
exports.getTransactionDetails = async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user._id }).select('_id');
    const accountIds = accounts.map(acc => acc._id);
    
    const transaction = await Transaction.findOne({
      _id: req.params.transactionId,
      $or: [
        { fromAccountId: { $in: accountIds } },
        { toAccountId: { $in: accountIds } }
      ]
    });
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }
    
    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Get transaction details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transaction details'
    });
  }
};

// Admin routes

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const users = await User.find()
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments();
    
    res.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users'
    });
  }
};

// @desc    Get user by ID (admin only)
// @route   GET /api/users/:userId
// @access  Private/Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user'
    });
  }
};

// @desc    Update user (admin only)
// @route   PUT /api/users/:userId
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const { role, status, permissions } = req.body;
    
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (role) user.role = role;
    if (status) user.status = status;
    if (permissions) user.permissions = permissions;
    
    await user.save();
    
    const updatedUser = await User.findById(req.params.userId).select('-password');
    
    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
};

// @desc    Delete user (super admin only)
// @route   DELETE /api/users/:userId
// @access  Private/SuperAdmin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Prevent deleting yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }
    
    await user.deleteOne();
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
};