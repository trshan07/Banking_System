// backend/src/services/smsService.js
const twilio = require('twilio');

class SMSService {
  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  async sendSMS(to, message) {
    try {
      const result = await this.client.messages.create({
        body: message,
        to: to,
        from: process.env.TWILIO_PHONE_NUMBER
      });
      console.log('SMS sent:', result.sid);
      return { success: true, sid: result.sid };
    } catch (error) {
      console.error('SMS sending error:', error);
      throw error;
    }
  }

  async sendVerificationCode(to, code) {
    const message = `Your Smart Bank verification code is: ${code}. This code will expire in 10 minutes.`;
    return this.sendSMS(to, message);
  }
}

module.exports = new SMSService();