// backend/src/controllers/userController.js
const User = require('../models/User');

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -refreshToken -__v');
    
    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile'
    });
  }
};

// Update current user profile
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, address } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    
    await user.save();
    
    const updatedUser = await User.findById(req.user.id).select('-password -refreshToken -__v');
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: updatedUser }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};

// Upload profile picture
exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const user = await User.findById(req.user.id);
    user.profileImage = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: { profileImage: user.profileImage }
    });
  } catch (error) {
    console.error('Upload profile picture error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload profile picture'
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.id).select('+password');
    
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

// Get user accounts (placeholder)
exports.getUserAccounts = async (req, res) => {
  try {
    // This would typically fetch accounts from an Account model
    res.json({
      success: true,
      data: { accounts: [] }
    });
  } catch (error) {
    console.error('Get user accounts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get accounts'
    });
  }
};

// Get account details (placeholder)
exports.getAccountDetails = async (req, res) => {
  try {
    const { accountId } = req.params;
    
    res.json({
      success: true,
      data: { 
        account: {
          id: accountId,
          message: 'Account details endpoint - to be implemented'
        }
      }
    });
  } catch (error) {
    console.error('Get account details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get account details'
    });
  }
};

// Get user transactions (placeholder)
exports.getUserTransactions = async (req, res) => {
  try {
    res.json({
      success: true,
      data: { transactions: [] }
    });
  } catch (error) {
    console.error('Get user transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transactions'
    });
  }
};

// Get transaction details (placeholder)
exports.getTransactionDetails = async (req, res) => {
  try {
    const { transactionId } = req.params;
    
    res.json({
      success: true,
      data: { 
        transaction: {
          id: transactionId,
          message: 'Transaction details endpoint - to be implemented'
        }
      }
    });
  } catch (error) {
    console.error('Get transaction details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transaction details'
    });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -refreshToken -__v');

    res.json({
      success: true,
      data: { users }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users'
    });
  }
};

// Create new user (role-based permissions)
exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, address, role } = req.body;
    const currentUser = req.user;

    // Role hierarchy validation
    const allowedRoles = {
      'superadmin': ['admin', 'employee', 'customer'],
      'admin': ['employee', 'customer'],
      'employee': ['customer']
    };

    // Check if current user can create the requested role
    if (!allowedRoles[currentUser.role] || !allowedRoles[currentUser.role].includes(role)) {
      return res.status(403).json({
        success: false,
        message: `You cannot create users with role '${role}'. Your role: ${currentUser.role}`
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Set default permissions based on role
    const rolePermissions = {
      'superadmin': ['*'], // All permissions
      'admin': [
        'view_users', 'manage_users', 'view_reports', 'manage_reports',
        'view_accounts', 'manage_accounts', 'view_transactions', 'manage_transactions',
        'view_loans', 'manage_loans', 'view_support', 'manage_support'
      ],
      'employee': [
        'view_accounts', 'manage_accounts', 'view_transactions', 'manage_transactions',
        'view_loans', 'manage_loans', 'view_support', 'manage_support',
        'view_customers', 'manage_customers'
      ],
      'customer': [
        'view_account', 'manage_account', 'view_transactions', 'create_transactions',
        'apply_loans', 'view_loans', 'create_tickets', 'view_tickets'
      ]
    };

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
      role,
      status: 'active',
      isEmailVerified: true, // Auto-verify for admin-created accounts
      permissions: rolePermissions[role] || []
    });

    await user.save();

    // Remove sensitive data from response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;
    delete userResponse.__v;

    res.status(201).json({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully`,
      data: { user: userResponse }
    });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user'
    });
  }
};

// Get user by ID (admin only)
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('-password -refreshToken -__v');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user'
    });
  }
};

// Update user by ID (admin only)
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, email, phone, address, role, status } = req.body;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (role) user.role = role;
    if (status) user.status = status;
    
    await user.save();
    
    const updatedUser = await User.findById(userId).select('-password -refreshToken -__v');
    
    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user: updatedUser }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
};

// Delete user by ID (super admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Soft delete - set status to inactive
    user.status = 'inactive';
    await user.save();
    
    res.json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
};

// Get user statistics (admin only)
exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const inactiveUsers = await User.countDocuments({ status: 'inactive' });
    
    const roleStats = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    
    res.json({
      success: true,
      data: {
        stats: {
          total: totalUsers,
          active: activeUsers,
          inactive: inactiveUsers,
          byRole: roleStats
        }
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user statistics'
    });
  }
};

// Get user activity (placeholder)
exports.getUserActivity = async (req, res) => {
  try {
    const { userId } = req.params;
    
    res.json({
      success: true,
      data: {
        activity: [],
        message: 'User activity endpoint - to be implemented'
      }
    });
  } catch (error) {
    console.error('Get user activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user activity'
    });
  }
};