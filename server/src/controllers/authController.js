// backend/src/controllers/authController.js
const User = require('../models/User');
const tokenService = require('../services/tokenService');
const emailService = require('../services/emailService');
const { validationResult } = require('express-validator');

class AuthController {
  constructor() {
    this.getFrontendUrl = this.getFrontendUrl.bind(this);
    this.createAuthSession = this.createAuthSession.bind(this);
    this.setRefreshTokenCookie = this.setRefreshTokenCookie.bind(this);
    this.redirectToOAuthResult = this.redirectToOAuthResult.bind(this);
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.refreshToken = this.refreshToken.bind(this);
    this.logout = this.logout.bind(this);
    this.verifyEmail = this.verifyEmail.bind(this);
    this.resendVerification = this.resendVerification.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.getMe = this.getMe.bind(this);
    this.getCurrentUser = this.getCurrentUser.bind(this);
    this.validateToken = this.validateToken.bind(this);
  }

  getFrontendUrl() {
    return process.env.FRONTEND_URL || 'http://localhost:5173';
  }

  async createAuthSession(user) {
    const accessToken = tokenService.generateAccessToken(user);
    const refreshToken = tokenService.generateRefreshToken(user);

    user.refreshToken = tokenService.hashToken(refreshToken);
    user.refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;
    delete userResponse.emailVerificationToken;
    delete userResponse.__v;

    return {
      user: userResponse,
      token: accessToken,
      refreshToken
    };
  }

  setRefreshTokenCookie(res, refreshToken) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
  }

  redirectToOAuthResult(res, params = {}) {
    const redirectUrl = new URL('/auth/login', this.getFrontendUrl());

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        redirectUrl.searchParams.set(key, value);
      }
    });

    res.redirect(redirectUrl.toString());
  }

  // Register new user
  async register(req, res) {
    try {
      const { firstName, lastName, email, password, phone, address } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        });
      }

      // Set default permissions based on role
      const permissions = [
        'view_account',
        'manage_account',
        'view_transactions',
        'create_transactions',
        'apply_loans',
        'view_loans',
        'create_tickets',
        'view_tickets'
      ];

      // Create user
      const user = new User({
        firstName,
        lastName,
        email,
        password,
        phone,
        address,
        role: 'customer',
        status: 'active',
        isEmailVerified: true,
        permissions,
        preferences: {
          notifications: { email: true, sms: false, push: true },
          language: 'en',
          theme: 'light',
          currency: 'LKR'
        }
      });

      // Generate verification token
      const verificationToken = user.generateEmailVerificationToken();
      await user.save();

      // Send verification email (don't await to speed up response)
      emailService.sendVerificationEmail(user, verificationToken).catch(err => {
        console.error('Failed to send verification email:', err);
      });

      const { user: userResponse, token: accessToken, refreshToken } = await this.createAuthSession(user);

      res.status(201).json({
        success: true,
        message: 'Registration successful. Please check your email to verify your account.',
        data: {
          user: userResponse,
          token: accessToken,
          refreshToken: refreshToken
        }
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Login user
  async login(req, res) {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt for email:', email);

    // Find user
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      const lockTimeRemaining = Math.ceil((user.lockUntil - Date.now()) / 60000);
      console.log('Account locked:', email);
      return res.status(423).json({
        success: false,
        message: `Account is locked. Please try again in ${lockTimeRemaining} minutes.`
      });
    }

    // Check if account is active
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Your account is not active. Please contact support.'
      });
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    
    if (!isValidPassword) {
      await user.incrementLoginAttempts();
      console.log('Invalid password for:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const { user: userResponse, token: accessToken, refreshToken } = await this.createAuthSession(user);

    // Set refresh token in HTTP-only cookie
    this.setRefreshTokenCookie(res, refreshToken);

    console.log('Login successful for:', email);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token: accessToken,
        refreshToken: refreshToken
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

  // Refresh token
  async refreshToken(req, res) {
    try {
      // Get refresh token from multiple sources
      let refreshToken = null;
      
      // 1. Check cookie
      if (req.cookies && req.cookies.refreshToken) {
        refreshToken = req.cookies.refreshToken;
        console.log('📦 Refresh token from cookie');
      }
      
      // 2. Check Authorization header
      if (!refreshToken && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
          refreshToken = authHeader.substring(7);
          console.log('📦 Refresh token from Authorization header');
        }
      }
      
      // 3. Check request body
      if (!refreshToken && req.body && req.body.refreshToken) {
        refreshToken = req.body.refreshToken;
        console.log('📦 Refresh token from request body');
      }
      
      if (!refreshToken) {
        console.log('❌ No refresh token provided');
        return res.status(401).json({
          success: false,
          message: 'Refresh token required'
        });
      }

      console.log('✅ Refresh token received, length:', refreshToken.length);

      // Verify refresh token
      const decoded = tokenService.verifyRefreshToken(refreshToken);

      // Find user
      const user = await User.findById(decoded.id).select('+refreshToken +refreshTokenExpires');
      
      if (!user) {
        console.log('❌ User not found for refresh token');
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if user has a stored refresh token
      if (!user.refreshToken) {
        console.log('❌ No stored refresh token for user');
        return res.status(401).json({
          success: false,
          message: 'Invalid refresh token'
        });
      }

      // Verify stored refresh token matches
      const hashedToken = tokenService.hashToken(refreshToken);
      if (user.refreshToken !== hashedToken) {
        console.log('❌ Refresh token mismatch');
        return res.status(401).json({
          success: false,
          message: 'Invalid refresh token'
        });
      }

      // Check if refresh token has expired
      if (user.refreshTokenExpires && user.refreshTokenExpires < Date.now()) {
        console.log('❌ Refresh token expired');
        return res.status(401).json({
          success: false,
          message: 'Refresh token expired'
        });
      }

      // Generate new tokens
      const newAccessToken = tokenService.generateAccessToken(user);
      const newRefreshToken = tokenService.generateRefreshToken(user);

      // Save new refresh token hash
      user.refreshToken = tokenService.hashToken(newRefreshToken);
      user.refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await user.save();

      // Set new refresh token in cookie
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      console.log('✅ Tokens refreshed successfully for user:', user.email);

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          token: newAccessToken,  // Changed from accessToken to token for consistency
          refreshToken: newRefreshToken
        }
      });

    } catch (error) {
      console.error('❌ Token refresh error:', error);
      res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }
  }

  // Logout user
  async logout(req, res) {
    try {
      // Get refresh token from cookie or body
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
      
      if (refreshToken && req.user) {
        // Clear refresh token from database
        const user = await User.findById(req.user.id);
        if (user) {
          user.refreshToken = null;
          user.refreshTokenExpires = null;
          await user.save();
          console.log('✅ User logged out:', user.email);
        }
      }

      // Clear cookies
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      res.json({
        success: true,
        message: 'Logged out successfully'
      });

    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, we should still clear cookies
      res.clearCookie('refreshToken');
      res.clearCookie('accessToken');
      
      res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
  }

  // Verify email
  async verifyEmail(req, res) {
    try {
      const { token } = req.body;

      // Hash token
      const hashedToken = tokenService.hashToken(token);

      // Find user with valid token
      const user = await User.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationExpires: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired verification token'
        });
      }

      // Verify email
      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();

      // Send welcome email
      emailService.sendWelcomeEmail(user).catch(err => {
        console.error('Failed to send welcome email:', err);
      });

      res.json({
        success: true,
        message: 'Email verified successfully'
      });

    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Email verification failed'
      });
    }
  }

  // Resend verification email
  async resendVerification(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      if (user.isEmailVerified) {
        return res.status(400).json({
          success: false,
          message: 'Email already verified'
        });
      }

      // Generate new verification token
      const verificationToken = user.generateEmailVerificationToken();
      await user.save();

      // Send verification email
      await emailService.sendVerificationEmail(user, verificationToken);

      res.json({
        success: true,
        message: 'Verification email sent'
      });

    } catch (error) {
      console.error('Resend verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send verification email'
      });
    }
  }

  // Forgot password
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Generate reset token
      const resetToken = user.generatePasswordResetToken();
      await user.save();

      // Send reset email
      await emailService.sendPasswordResetEmail(user, resetToken);

      res.json({
        success: true,
        message: 'Password reset email sent'
      });

    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process request'
      });
    }
  }

  // Reset password
  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      // Hash token
      const hashedToken = tokenService.hashToken(token);

      // Find user with valid token
      const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
      }).select('+password');
      
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired reset token'
        });
      }

      // Update password
      user.password = newPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      
      // Invalidate all refresh tokens by incrementing tokenVersion
      user.tokenVersion = (user.tokenVersion || 0) + 1;
      
      await user.save();

      res.json({
        success: true,
        message: 'Password reset successfully'
      });

    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reset password'
      });
    }
  }

  // Change password
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      const user = await User.findById(userId).select('+password');
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

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
      
      // Invalidate all refresh tokens
      user.tokenVersion = (user.tokenVersion || 0) + 1;
      
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
  }

  // Update user profile
  async updateProfile(req, res) {
    try {
      const { firstName, lastName, phone, address, preferences } = req.body;

      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (phone) user.phone = phone;
      if (address) user.address = address;
      if (preferences) user.preferences = { ...(user.preferences?.toObject?.() ?? user.preferences), ...preferences };

      await user.save();

      const userResponse = user.toObject();
      delete userResponse.password;
      delete userResponse.refreshToken;
      delete userResponse.__v;

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { user: userResponse }
      });

    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile'
      });
    }
  }

  // Get current user (alias: getMe)
  async getMe(req, res) {
    return this.getCurrentUser(req, res);
  }

  // Get current user
  async getCurrentUser(req, res) {
    try {
      const user = await User.findById(req.user.id).select('-password -refreshToken -__v');
      
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
      console.error('Get current user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user'
      });
    }
  }

  // Validate token
  async validateToken(req, res) {
    try {
      const user = await User.findById(req.user.id).select('-password -refreshToken -__v');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Token is valid',
        data: { user }
      });

    } catch (error) {
      console.error('Token validation error:', error);
      res.status(500).json({
        success: false,
        message: 'Token validation failed'
      });
    }
  }
}

module.exports = new AuthController();
