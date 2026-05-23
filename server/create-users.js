const mongoose = require('mongoose');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartbank');
    console.log('Connected to MongoDB');

    const adminPassword = process.env.ADMIN_PASSWORD;
    const employeePassword = process.env.EMPLOYEE_PASSWORD;

    if (!adminPassword || !employeePassword) {
      throw new Error('ADMIN_PASSWORD and EMPLOYEE_PASSWORD must be set before running create-users.js');
    }

    const adminHash = await bcrypt.hash(adminPassword, 12);
    const employeeHash = await bcrypt.hash(employeePassword, 12);

    // Create Admin
    const admin = await User.findOneAndUpdate(
      { email: 'admin@example.com' },
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: adminHash,
        phone: '+1234567892',
        address: '789 Pine St, City, State',
        role: 'admin',
        isEmailVerified: true,
        status: 'active',
        loginAttempts: 0,
        lockUntil: null,
        permissions: ['view_account', 'manage_account', 'view_transactions', 'create_transactions', 'view_users', 'manage_users', 'view_reports']
      },
      { upsert: true, new: true }
    );

    // Create Employee
    const employee = await User.findOneAndUpdate(
      { email: 'employee@example.com' },
      {
        firstName: 'Jane',
        lastName: 'Employee',
        email: 'employee@example.com',
        password: employeeHash,
        phone: '+1234567891',
        address: '456 Oak St, City, State',
        role: 'employee',
        isEmailVerified: true,
        status: 'active',
        loginAttempts: 0,
        lockUntil: null,
        permissions: ['view_account', 'manage_account', 'view_transactions', 'create_transactions', 'view_users']
      },
      { upsert: true, new: true }
    );

    console.log('✅ Admin user created/updated:', admin.email);
    console.log('✅ Employee user created/updated:', employee.email);
    console.log('\n📋 Test Credentials:');
    console.log('Admin: admin@example.com / [configured password]');
    console.log('Employee: employee@example.com / [configured password]');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createUsers();
