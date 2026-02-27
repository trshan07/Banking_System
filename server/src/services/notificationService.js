// backend/src/services/notificationService.js
const emailService = require('./emailService');
const smsService = require('./smsService');

class NotificationService {
  async sendWelcomeNotification(user) {
    const promises = [];

    // Send welcome email
    if (user.email) {
      promises.push(
        emailService.sendWelcomeEmail(user.email, user.firstName)
          .catch(err => console.error('Welcome email failed:', err))
      );
    }

    // Send welcome SMS
    if (user.phone) {
      const message = `Welcome to Smart Bank, ${user.firstName}! Your account has been successfully created.`;
      promises.push(
        smsService.sendSMS(user.phone, message)
          .catch(err => console.error('Welcome SMS failed:', err))
      );
    }

    await Promise.all(promises);
  }

  async sendVerificationNotification(user, token) {
    if (user.email) {
      await emailService.sendVerificationEmail(user.email, token)
        .catch(err => console.error('Verification email failed:', err));
    }
  }

  async sendPasswordResetNotification(email, token) {
    await emailService.sendPasswordResetEmail(email, token)
      .catch(err => console.error('Password reset email failed:', err));
  }

  async sendTransactionAlert(user, transaction) {
    const message = `Your account has been ${transaction.type === 'credit' ? 'credited' : 'debited'} with $${transaction.amount}. New balance: $${transaction.newBalance}`;
    
    if (user.email && user.preferences?.notifications?.email) {
      await emailService.sendEmail({
        to: user.email,
        subject: 'Transaction Alert',
        html: `<p>${message}</p>`
      }).catch(err => console.error('Transaction email failed:', err));
    }

    if (user.phone && user.preferences?.notifications?.sms) {
      await smsService.sendSMS(user.phone, message)
        .catch(err => console.error('Transaction SMS failed:', err));
    }
  }
}

module.exports = new NotificationService();