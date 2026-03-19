const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class TokenService {
  constructor() {
    this.accessTokenSecret = process.env.JWT_ACCESS_SECRET;
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
    this.accessTokenExpiry = process.env.JWT_ACCESS_EXPIRE || '15m';
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRE || '7d';
  }

  // Generate access token
  generateAccessToken(user) {
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
      permissions: user.permissions
    };

    return jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry,
      issuer: 'smartbank',
      audience: 'smartbank-users'
    });
  }

  // Generate refresh token
  generateRefreshToken(user) {
    const payload = {
      id: user._id,
      tokenVersion: user.tokenVersion || 0
    };

    return jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiry,
      issuer: 'smartbank',
      audience: 'smartbank-users'
    });
  }

  // Verify access token
  verifyAccessToken(token) {
    try {
      return jwt.verify(token, this.accessTokenSecret, {
        issuer: 'smartbank',
        audience: 'smartbank-users'
      });
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  // Verify refresh token
  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, this.refreshTokenSecret, {
        issuer: 'smartbank',
        audience: 'smartbank-users'
      });
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  // Generate random token
  generateRandomToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  // Hash token
  hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}

module.exports = new TokenService();