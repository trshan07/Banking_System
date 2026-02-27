// backend/src/services/smsService.js
/**
 * Mock SMS Service for development
 * This service logs SMS messages to console instead of sending real SMS
 */

class SMSService {
  constructor() {
    console.log('📱 Mock SMS Service initialized - SMS will be logged to console');
  }

  async sendSMS(to, message) {
    try {
      // Log the SMS that would be sent
      console.log('\n' + '='.repeat(50));
      console.log('📱 MOCK SMS SERVICE');
      console.log('='.repeat(50));
      console.log(`To: ${to}`);
      console.log(`Message: ${message}`);
      console.log(`Timestamp: ${new Date().toLocaleString()}`);
      console.log('='.repeat(50) + '\n');

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      return { 
        success: true, 
        mock: true,
        messageId: 'mock-' + Date.now(),
        to,
        message
      };
    } catch (error) {
      console.error('Mock SMS error:', error);
      throw error;
    }
  }

  async sendVerificationCode(to, code) {
    const message = `Your Smart Bank verification code is: ${code}. Valid for 10 minutes.`;
    return this.sendSMS(to, message);
  }

  async sendTransactionAlert(to, amount, type, balance) {
    const action = type === 'credit' ? 'credited to' : 'debited from';
    const message = `Smart Bank Alert: $${amount} ${action} your account. New balance: $${balance}`;
    return this.sendSMS(to, message);
  }

  async sendLoginAlert(to, deviceInfo) {
    const message = `Smart Bank: New login from ${deviceInfo.device || 'unknown device'} at ${new Date().toLocaleTimeString()}`;
    return this.sendSMS(to, message);
  }

  async sendPasswordChangeAlert(to) {
    const message = 'Smart Bank: Your password was changed successfully';
    return this.sendSMS(to, message);
  }
}

module.exports = new SMSService();