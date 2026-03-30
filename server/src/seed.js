// backend/src/seed.js
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

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
      {
        firstName: 'Super',
        lastName: 'Admin',
        email: 'superadmin@example.com',
        password: await bcrypt.hash('superadmin123', 12),
        phone: '+1234567893',
        address: '321 Elm St, City, State',
        role: 'superadmin',
        isEmailVerified: true,
        status: 'active',
        permissions: ['*'] // All permissions
      }
    ];

    await User.insertMany(users);
    console.log('✅ Test users created successfully');
    console.log('\nTest credentials:');
    console.log('Customer: customer@example.com / customer123');
    console.log('Employee: employee@example.com / employee123');
    console.log('Admin: admin@example.com / admin123');
    console.log('Super Admin: superadmin@example.com / superadmin123');

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

const ensureSuperAdmin = async () => {
  try {
    const existing = await User.findOne({ email: 'superadmin@example.com' });
    if (existing) {
      console.log('Super admin already exists.');
      return;
    }

    console.log('Creating default superadmin user...');

    const superAdmin = new User({
      firstName: 'Super',
      lastName: 'Admin',
      email: 'superadmin@example.com',
      password: await bcrypt.hash('superadmin123', 12),
      phone: '+1234567893',
      address: '321 Elm St, City, State',
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

if (require.main === module) {
  seedUsers();
}

module.exports = { seedUsers, ensureSuperAdmin };