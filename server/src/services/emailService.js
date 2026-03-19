const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Send email
  async sendEmail({ to, subject, html, text }) {
    const mailOptions = {
      from: `"Smart Bank" <${process.env.SMTP_FROM || 'noreply@smartbank.com'}>`,
      to,
      subject,
      html,
      text
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new Error('Failed to send email');
    }
  }

  // Send verification email
  async sendVerificationEmail(user, verificationToken) {
    const verificationUrl = `${process.env.FRONTEND_URL}/auth/verify-email?token=${verificationToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
          .button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Smart Bank!</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName},</h2>
            <p>Thank you for registering with Smart Bank. Please verify your email address to activate your account.</p>
            <p>Click the button below to verify your email:</p>
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account with Smart Bank, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Smart Bank. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Welcome to Smart Bank!
      
      Hello ${user.firstName},
      
      Thank you for registering with Smart Bank. Please verify your email address to activate your account.
      
      Click the link below to verify your email:
      ${verificationUrl}
      
      This link will expire in 24 hours.
      
      If you didn't create an account with Smart Bank, please ignore this email.
      
      © 2024 Smart Bank. All rights reserved.
    `;

    return this.sendEmail({
      to: user.email,
      subject: 'Verify Your Email - Smart Bank',
      html,
      text
    });
  }

  // Send password reset email
  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
          .button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName},</h2>
            <p>We received a request to reset your password for your Smart Bank account.</p>
            <p>Click the button below to reset your password:</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${resetUrl}</p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Smart Bank. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Password Reset Request
      
      Hello ${user.firstName},
      
      We received a request to reset your password for your Smart Bank account.
      
      Click the link below to reset your password:
      ${resetUrl}
      
      This link will expire in 1 hour.
      
      If you didn't request a password reset, please ignore this email or contact support if you have concerns.
      
      © 2024 Smart Bank. All rights reserved.
    `;

    return this.sendEmail({
      to: user.email,
      subject: 'Reset Your Password - Smart Bank',
      html,
      text
    });
  }

  // Send welcome email
  async sendWelcomeEmail(user) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
          .feature { margin: 20px 0; padding: 15px; background: white; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Smart Bank, ${user.firstName}!</h1>
          </div>
          <div class="content">
            <p>We're excited to have you on board! Your account has been successfully created and verified.</p>
            
            <h3>What you can do with Smart Bank:</h3>
            
            <div class="feature">
              <h4>💰 Manage Your Accounts</h4>
              <p>View balances, transaction history, and manage multiple accounts in one place.</p>
            </div>
            
            <div class="feature">
              <h4>💳 Transfer Money</h4>
              <p>Send money to friends, family, or other accounts instantly and securely.</p>
            </div>
            
            <div class="feature">
              <h4>🏦 Apply for Loans</h4>
              <p>Get personalized loan offers and apply directly through our platform.</p>
            </div>
            
            <div class="feature">
              <h4>🎫 24/7 Support</h4>
              <p>Create support tickets and get help whenever you need it.</p>
            </div>
            
            <p style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL}/dashboard" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>
            </p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Smart Bank. All rights reserved.</p>
            <p>Need help? Contact our support team at support@smartbank.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: user.email,
      subject: 'Welcome to Smart Bank!',
      html
    });
  }
}

module.exports = new EmailService();