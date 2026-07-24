const { validateEnvironment } = require('../environment');

describe('production environment validation', () => {
  const originalEnvironment = { ...process.env };

  beforeEach(() => {
    process.env = {
      ...originalEnvironment,
      NODE_ENV: 'production',
      MONGODB_URI: 'mongodb://database/app?replicaSet=rs0',
      FRONTEND_URL: 'https://bank.example',
      JWT_ACCESS_SECRET: 'a'.repeat(48),
      JWT_REFRESH_SECRET: 'b'.repeat(48),
      ENCRYPTION_KEY: 'c'.repeat(48),
      SMTP_HOST: 'smtp.example',
      SMTP_USER: 'mailer',
      SMTP_PASS: 'd'.repeat(32),
      SMTP_FROM: 'bank@example.com',
      ENABLE_DEMO_USERS: 'false',
      SUPERADMIN_PASSWORD: ''
    };
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  test('accepts a complete production configuration', () => {
    expect(() => validateEnvironment()).not.toThrow();
  });

  test('rejects HTTP frontend origins', () => {
    process.env.FRONTEND_URL = 'http://bank.example';
    expect(() => validateEnvironment()).toThrow('HTTPS');
  });

  test('rejects placeholder secrets', () => {
    process.env.JWT_ACCESS_SECRET = 'replace-with-a-real-secret-value-now';
    expect(() => validateEnvironment()).toThrow('JWT_ACCESS_SECRET');
  });

  test('rejects demo accounts in production', () => {
    process.env.ENABLE_DEMO_USERS = 'true';
    expect(() => validateEnvironment()).toThrow('ENABLE_DEMO_USERS');
  });
});
