const PLACEHOLDER_PATTERN = /^(replace[_-]with|change[_-]me|your-|replaceme|password$)/i;

const requireStrongSecret = (name, minimumLength = 32) => {
  const value = String(process.env[name] || '');
  if (value.length < minimumLength || PLACEHOLDER_PATTERN.test(value)) {
    throw new Error(`${name} must be a non-placeholder secret of at least ${minimumLength} characters`);
  }
};

const validateEnvironment = () => {
  if (process.env.NODE_ENV !== 'production') return;

  if (!String(process.env.MONGODB_URI || '').startsWith('mongodb')) {
    throw new Error('MONGODB_URI is required in production');
  }

  if (!String(process.env.FRONTEND_URL || '').startsWith('https://')) {
    throw new Error('FRONTEND_URL must use HTTPS in production');
  }

  requireStrongSecret('JWT_ACCESS_SECRET');
  requireStrongSecret('JWT_REFRESH_SECRET');
  requireStrongSecret('ENCRYPTION_KEY');

  for (const name of ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM']) {
    if (!process.env[name] || PLACEHOLDER_PATTERN.test(String(process.env[name]))) {
      throw new Error(`${name} is required in production`);
    }
  }

  if (process.env.ENABLE_DEMO_USERS === 'true') {
    throw new Error('ENABLE_DEMO_USERS cannot be enabled in production');
  }

  if (process.env.SUPERADMIN_PASSWORD) {
    requireStrongSecret('SUPERADMIN_PASSWORD', 16);
    if (!process.env.SUPERADMIN_EMAIL) {
      throw new Error('SUPERADMIN_EMAIL is required when bootstrapping a super administrator');
    }
  }
};

module.exports = { validateEnvironment };
