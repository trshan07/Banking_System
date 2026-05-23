// backend/src/seed.js
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const getSuperAdminConfig = () => ({
  firstName: process.env.SUPERADMIN_FIRST_NAME?.trim() || 'System',
  lastName: process.env.SUPERADMIN_LAST_NAME?.trim() || 'Owner',
  email: process.env.SUPERADMIN_EMAIL?.trim().toLowerCase(),
  password: process.env.SUPERADMIN_PASSWORD,
  phone: process.env.SUPERADMIN_PHONE?.trim() || '+94000000000',
  address: process.env.SUPERADMIN_ADDRESS?.trim() || 'Head Office'
});

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});

    // Create test users
    const users = [
      {
        firstName: 'John',
        lastName: 'Customer',
        email: 'customer@example.com',
        password: await bcrypt.hash('customer123', 12),
        phone: '+1234567890',
        address: '123 Main St, City, State',
        role: 'customer',
        isEmailVerified: true,
        status: 'active',
        permissions: ['view_account', 'manage_account', 'view_transactions', 'create_transactions']
      },
      {
        firstName: 'Jane',
        lastName: 'Employee',
        email: 'employee@example.com',
        password: await bcrypt.hash('employee123', 12),
        phone: '+1234567891',
        address: '456 Oak St, City, State',
        role: 'employee',
        isEmailVerified: true,
        status: 'active',
        permissions: ['view_account', 'manage_account', 'view_transactions', 'create_transactions', 'view_users']
      },
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 12),
        phone: '+1234567892',
        address: '789 Pine St, City, State',
        role: 'admin',
        isEmailVerified: true,
        status: 'active',
        permissions: ['view_account', 'manage_account', 'view_transactions', 'create_transactions', 'view_users', 'manage_users', 'view_reports']
      },
    ];

    const superAdminConfig = getSuperAdminConfig();
    if (superAdminConfig.email && superAdminConfig.password) {
      users.push({
        firstName: superAdminConfig.firstName,
        lastName: superAdminConfig.lastName,
        email: superAdminConfig.email,
        password: await bcrypt.hash(superAdminConfig.password, 12),
        phone: superAdminConfig.phone,
        address: superAdminConfig.address,
        role: 'superadmin',
        isEmailVerified: true,
        status: 'active',
        permissions: ['*']
      });
    }

    await User.insertMany(users);
    console.log('✅ Test users created successfully');
    console.log('\nTest credentials:');
    console.log('Customer: customer@example.com / customer123');
    console.log('Employee: employee@example.com / employee123');
    console.log('Admin: admin@example.com / admin123');
    if (superAdminConfig.email) {
      console.log(`Super Admin: ${superAdminConfig.email} / [configured in environment]`);
    }

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

const ensureSuperAdmin = async () => {
  try {
    const superAdminConfig = getSuperAdminConfig();
    const existing = await User.findOne({ role: 'superadmin' }).select('+password');

    if (existing) {
      existing.status = 'active';
      existing.isEmailVerified = true;
      existing.permissions = ['*'];
      await existing.save();
      console.log(`Super admin already exists for ${existing.email}.`);
      return;
    }

    if (!superAdminConfig.email || !superAdminConfig.password) {
      console.warn('SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD are not configured. Skipping superadmin bootstrap.');
      return;
    }

    console.log(`Creating initial superadmin user for ${superAdminConfig.email}...`);

    const superAdmin = new User({
      firstName: superAdminConfig.firstName,
      lastName: superAdminConfig.lastName,
      email: superAdminConfig.email,
      password: superAdminConfig.password,
      phone: superAdminConfig.phone,
      address: superAdminConfig.address,
      role: 'superadmin',
      isEmailVerified: true,
      status: 'active',
      permissions: ['*']
    });

    await superAdmin.save();
    console.log('Default superadmin user created.');
  } catch (error) {
    console.error('Error ensuring superadmin user:', error);
    process.exit(1);
  }
};

// Ensure basic demo users exist in development mode
const ensureDemoUsers = async () => {
  if (process.env.ENABLE_DEMO_USERS !== 'true') {
    console.log('Demo user bootstrap is disabled.');
    return;
  }

  if (process.env.NODE_ENV === 'production') {
    return;
  }

  const demoUsers = [
    {
      firstName: 'John',
      lastName: 'Customer',
      email: 'customer@example.com',
      password: 'customer123',
      phone: '+1234567890',
      address: '123 Main St, City, State',
      role: 'customer',
      isEmailVerified: true,
      status: 'active',
      permissions: ['view_account', 'manage_account', 'view_transactions', 'create_transactions']
    },
    {
      firstName: 'Jane',
      lastName: 'Employee',
      email: 'employee@example.com',
      password: 'employee123',
      phone: '+1234567891',
      address: '456 Oak St, City, State',
      role: 'employee',
      isEmailVerified: true,
      status: 'active',
      permissions: ['view_account', 'manage_account', 'view_transactions', 'create_transactions', 'view_users']
    },
    {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: 'admin123',
      phone: '+1234567892',
      address: '789 Pine St, City, State',
      role: 'admin',
      isEmailVerified: true,
      status: 'active',
      permissions: ['view_account', 'manage_account', 'view_transactions', 'create_transactions', 'view_users', 'manage_users', 'view_reports']
    }
  ];

  for (const userData of demoUsers) {
    const existing = await User.findOne({ email: userData.email });
    if (existing) continue;

    const hashedPassword = await bcrypt.hash(userData.password, 12);
    await User.create({
      ...userData,
      password: hashedPassword
    });
    console.log(`Created demo user: ${userData.email}`);
  }
};

if (require.main === module) {
  seedUsers();
}

module.exports = { seedUsers, ensureSuperAdmin, ensureDemoUsers };
