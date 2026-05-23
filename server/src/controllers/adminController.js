const mongoose = require('mongoose');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const SupportTicket = require('../models/SupportTicket');
const FraudReport = require('../models/FraudReport');
const KYCApplication = require('../models/KYCApplication');
const Loan = require('../models/Loan');
const Branch = require('../models/Branch');
const Account = require('../models/Account');
const { formatCurrency } = require('../utils/formatCurrency');

const DEFAULT_ADMIN_SETTINGS = {
  notifications: {
    email: true,
    push: true,
    sms: false,
    inApp: true,
    dailyDigest: true,
    weeklyReport: true,
  },
  security: {
    twoFactorAuth: true,
    sessionTimeout: 30,
    loginAlerts: true,
    deviceManagement: true,
  },
  appearance: {
    theme: 'light',
    compactMode: false,
    animations: true,
    sidebarCollapsed: false,
  },
  preferences: {
    language: 'en',
    timezone: 'Asia/Colombo',
    dateFormat: 'YYYY-MM-DD',
    numberFormat: 'en-US',
  },
  system: {
    backupSchedule: 'daily',
    autoUpdate: true,
    maintenanceMode: false,
    logRetention: 90,
  },
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const toObjectId = (value) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return null;
  }

  return new mongoose.Types.ObjectId(value);
};

const mergeSettings = (settings = {}) => ({
  notifications: { ...DEFAULT_ADMIN_SETTINGS.notifications, ...(settings.notifications || {}) },
  security: { ...DEFAULT_ADMIN_SETTINGS.security, ...(settings.security || {}) },
  appearance: { ...DEFAULT_ADMIN_SETTINGS.appearance, ...(settings.appearance || {}) },
  preferences: { ...DEFAULT_ADMIN_SETTINGS.preferences, ...(settings.preferences || {}) },
  system: { ...DEFAULT_ADMIN_SETTINGS.system, ...(settings.system || {}) },
});

const getProfilePayload = (user) => ({
  name: [user.firstName, user.lastName].filter(Boolean).join(' ').trim(),
  email: user.email || '',
  role: user.role === 'superadmin' ? 'Super Admin' : 'Admin',
  department: user.department || 'Administration',
  employeeId: user.employeeId || `EMP-${String(user._id).slice(-6).toUpperCase()}`,
  joinDate: user.createdAt ? user.createdAt.toISOString().split('T')[0] : '',
  phone: user.phone || '',
  address: user.address || '',
  city: user.city || '',
  state: user.state || '',
  zipCode: user.zipCode || '',
  country: user.country || '',
  avatar: user.profileImage || '',
  dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
  status: user.status || '',
  permissions: user.permissions || [],
});

const mapKYCStatus = (status) => {
  if (status === 'under_review') return 'pending';
  if (status === 'verified') return 'approved';
  return status;
};

const getTimeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} days ago`;
  return `${Math.floor(days / 7)} weeks ago`;
};

const getRangeStart = (period = 'week') => {
  const now = new Date();
  const start = new Date(now);

  if (period === 'year') {
    start.setMonth(now.getMonth() - 11, 1);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  if (period === 'month') {
    start.setDate(now.getDate() - 29);
  } else {
    start.setDate(now.getDate() - 6);
  }

  start.setHours(0, 0, 0, 0);
  return start;
};

const buildUserGrowth = async (period) => {
  const start = getRangeStart(period);
  const users = await User.find({ createdAt: { $gte: start } })
    .select('createdAt status')
    .sort({ createdAt: 1 })
    .lean();

  if (period === 'year') {
    const buckets = [];
    const totals = new Map();

    for (let offset = 11; offset >= 0; offset -= 1) {
      const date = new Date();
      date.setMonth(date.getMonth() - offset, 1);
      date.setHours(0, 0, 0, 0);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      totals.set(key, { month: MONTH_NAMES[date.getMonth()], users: 0, active: 0 });
      buckets.push(key);
    }

    users.forEach((user) => {
      const createdAt = new Date(user.createdAt);
      const key = `${createdAt.getFullYear()}-${createdAt.getMonth()}`;
      const bucket = totals.get(key);
      if (bucket) {
        bucket.users += 1;
        if (user.status === 'active') {
          bucket.active += 1;
        }
      }
    });

    return buckets.map((key) => totals.get(key));
  }

  const days = period === 'month' ? 30 : 7;
  const buckets = [];
  const totals = new Map();

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - offset);
    const key = date.toISOString().split('T')[0];
    totals.set(key, {
      month: DAY_NAMES[date.getDay()],
      users: 0,
      active: 0,
    });
    buckets.push(key);
  }

  users.forEach((user) => {
    const key = new Date(user.createdAt).toISOString().split('T')[0];
    const bucket = totals.get(key);
    if (bucket) {
      bucket.users += 1;
      if (user.status === 'active') {
        bucket.active += 1;
      }
    }
  });

  return buckets.map((key) => totals.get(key));
};

const buildTransactionVolume = async (period) => {
  const start = getRangeStart(period);
  const days = period === 'year' ? 12 : period === 'month' ? 30 : 7;
  const groupFormat = period === 'year' ? '%Y-%m' : '%Y-%m-%d';

  const aggregates = await Transaction.aggregate([
    { $match: { createdAt: { $gte: start } } },
    {
      $group: {
        _id: { $dateToString: { format: groupFormat, date: '$createdAt' } },
        volume: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const values = new Map(aggregates.map((item) => [item._id, item]));
  const output = [];

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date();
    if (period === 'year') {
      date.setMonth(date.getMonth() - offset, 1);
      date.setHours(0, 0, 0, 0);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const item = values.get(key);
      output.push({
        day: MONTH_NAMES[date.getMonth()],
        volume: item?.volume || 0,
        count: item?.count || 0,
      });
    } else {
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - offset);
      const key = date.toISOString().split('T')[0];
      const item = values.get(key);
      output.push({
        day: DAY_NAMES[date.getDay()],
        volume: item?.volume || 0,
        count: item?.count || 0,
      });
    }
  }

  return output;
};

const buildRevenue = async () => {
  const start = new Date();
  start.setMonth(start.getMonth() - 5, 1);
  start.setHours(0, 0, 0, 0);

  const monthly = await Transaction.aggregate([
    { $match: { createdAt: { $gte: start } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        revenue: { $sum: '$fee' },
        expenses: { $sum: 0 },
      },
    },
  ]);

  const map = new Map(
    monthly.map((item) => [`${item._id.year}-${item._id.month}`, item])
  );

  const result = [];
  for (let offset = 5; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setMonth(date.getMonth() - offset, 1);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    const item = map.get(key);
    result.push({
      month: MONTH_NAMES[date.getMonth()],
      revenue: item?.revenue || 0,
      expenses: item?.expenses || 0,
    });
  }

  return result;
};

const enrichTransaction = async (transaction) => {
  const [fromAccount, toAccount] = await Promise.all([
    transaction.fromAccountId
      ? Account.findById(transaction.fromAccountId).populate('userId', 'firstName lastName email').lean()
      : null,
    transaction.toAccountId
      ? Account.findById(transaction.toAccountId).populate('userId', 'firstName lastName email').lean()
      : null,
  ]);

  const user = fromAccount?.userId || toAccount?.userId || null;
  const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Unknown User';

  return {
    id: transaction.id || transaction.reference || String(transaction._id),
    _id: transaction._id,
    user: userName,
    userEmail: user?.email || 'N/A',
    amount: Number(transaction.amount || 0),
    type: transaction.type,
    status: transaction.status,
    date: transaction.createdAt,
    paymentMethod: transaction.metadata?.paymentMethod || transaction.category || 'Bank Transfer',
    reference: transaction.reference || 'N/A',
    description: transaction.description || 'No description',
  };
};

const buildKYCApplicationPayload = (application) => {
  const user = application.userId || {};
  const docs = [];

  if (application.identification?.frontImage?.url || application.identification?.frontImage?.filename) {
    docs.push({
      type: 'ID Front',
      url: application.identification.frontImage.url || '',
      status: application.status === 'approved' ? 'verified' : 'uploaded',
    });
  }
  if (application.identification?.backImage?.url || application.identification?.backImage?.filename) {
    docs.push({
      type: 'ID Back',
      url: application.identification.backImage.url || '',
      status: application.status === 'approved' ? 'verified' : 'uploaded',
    });
  }
  if (application.addressProof?.documentImage?.url || application.addressProof?.documentImage?.filename) {
    docs.push({
      type: 'Address Proof',
      url: application.addressProof.documentImage.url || '',
      status: application.status === 'approved' ? 'verified' : 'uploaded',
    });
  }

  return {
    id: application._id,
    userId: user._id || application.userId,
    name: application.personalInfo?.fullName || application.userFullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
    email: application.contactInfo?.email || application.userEmail || user.email || '',
    phone: application.contactInfo?.phoneNumber || user.phone || '',
    status: mapKYCStatus(application.status),
    submittedDate: application.submittedAt ? new Date(application.submittedAt).toISOString().split('T')[0] : '',
    approvedDate: application.approvedAt ? new Date(application.approvedAt).toISOString().split('T')[0] : '',
    documentType: application.identification?.idType || 'N/A',
    documentNumber: application.identification?.idNumber || 'N/A',
    riskLevel: application.riskLevel || 'medium',
    address: [
      application.contactInfo?.address?.street,
      application.contactInfo?.address?.city,
      application.contactInfo?.address?.state,
      application.contactInfo?.address?.country,
    ].filter(Boolean).join(', '),
    dateOfBirth: application.personalInfo?.dateOfBirth
      ? new Date(application.personalInfo.dateOfBirth).toISOString().split('T')[0]
      : '',
    nationality: application.personalInfo?.nationality || '',
    occupation: application.employmentInfo?.occupation || '',
    documents: docs,
    rejectionReason: application.verification?.rejectionReason || '',
  };
};

const buildFraudAlertPayload = (report) => ({
  id: report._id,
  reportId: report.reportId,
  type: String(report.fraudType || 'other').replaceAll('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
  priority: report.priority === 'critical' ? 'high' : report.priority,
  status: report.status === 'under_investigation' ? 'investigating' : report.status,
  user: report.reporterName || report.reporterEmail || 'Unknown User',
  userId: report.reportedBy,
  amount: Number(report.amount || 0),
  date: report.reportedAt || report.createdAt,
  location: report.fraudulentParty?.accountNumber || report.accountNumber || 'N/A',
  device: report.actionTaken || 'N/A',
  ipAddress: report.lawEnforcementReference || 'N/A',
  description: report.description || '',
  actions: (report.investigationNotes || []).map((note) => note.note).slice(0, 5),
  riskScore: report.priority === 'high' || report.priority === 'critical' ? 90 : report.priority === 'medium' ? 65 : 35,
});

exports.getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      pendingKYC,
      totalTransactions,
      totalVolumeAggregate,
      pendingTickets,
      fraudAlerts,
      totalEmployees,
      branches,
      loanApplications,
      approvedLoans,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: 'active' }),
      KYCApplication.countDocuments({ status: { $in: ['pending', 'under_review'] } }),
      Transaction.countDocuments(),
      Transaction.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      SupportTicket.countDocuments({ status: { $in: ['open', 'in_progress', 'awaiting_reply'] } }),
      FraudReport.countDocuments({ status: { $in: ['pending', 'under_investigation'] } }),
      User.countDocuments({ role: { $in: ['employee', 'admin', 'superadmin'] } }),
      Branch.countDocuments(),
      Loan.countDocuments(),
      Loan.countDocuments({ status: 'approved' }),
    ]);

    const approvalRate = loanApplications > 0 ? ((approvedLoans / loanApplications) * 100).toFixed(1) : '0.0';

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        pendingKYC,
        totalTransactions,
        totalVolume: totalVolumeAggregate[0]?.total || 0,
        pendingTickets,
        fraudAlerts,
        totalEmployees,
        branches,
        loanApplications,
        approvalRate,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getChartData = async (req, res) => {
  try {
    const period = req.query.period || 'week';
    const [userGrowth, transactionVolume, revenue, totalUsers, submittedKYC, kycStats] = await Promise.all([
      buildUserGrowth(period),
      buildTransactionVolume(period),
      buildRevenue(),
      User.countDocuments(),
      KYCApplication.countDocuments(),
      KYCApplication.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    ]);

    const kycStatus = kycStats.map((stat) => ({
      name: mapKYCStatus(stat._id) === 'approved' ? 'Verified' : mapKYCStatus(stat._id).replace(/\b\w/g, (char) => char.toUpperCase()),
      value: stat.count,
      color: stat._id === 'approved' || stat._id === 'verified'
        ? '#10b981'
        : stat._id === 'pending' || stat._id === 'under_review'
          ? '#f59e0b'
          : '#ef4444',
    }));

    kycStatus.push({
      name: 'Not Submitted',
      value: Math.max(totalUsers - submittedKYC, 0),
      color: '#6b7280',
    });

    res.json({
      success: true,
      data: { userGrowth, transactionVolume, kycStatus, revenue },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getRecentActivities = async (req, res) => {
  try {
    const [recentUsers, rawTransactions, kycItems, fraudItems] = await Promise.all([
      User.find().sort({ createdAt: -1 }).limit(8).select('firstName lastName email createdAt status role').lean(),
      Transaction.find().sort({ createdAt: -1 }).limit(8).lean(),
      KYCApplication.find({ status: { $in: ['pending', 'approved', 'rejected'] } })
        .sort({ updatedAt: -1 })
        .limit(6)
        .populate('userId', 'firstName lastName email')
        .lean(),
      FraudReport.find().sort({ updatedAt: -1 }).limit(6).lean(),
    ]);

    const recentTransactions = await Promise.all(rawTransactions.map(enrichTransaction));

    const userActivities = recentUsers.map((user) => ({
      id: String(user._id),
      action: 'New user registered',
      user: user.email,
      time: getTimeAgo(user.createdAt),
      timestamp: user.createdAt,
      type: 'user',
    }));

    const kycActivities = kycItems.map((item) => ({
      id: String(item._id),
      action: `KYC ${mapKYCStatus(item.status)}`,
      user: item.userId?.email || item.userEmail || 'Unknown user',
      time: getTimeAgo(item.updatedAt || item.submittedAt || item.createdAt),
      timestamp: item.updatedAt || item.submittedAt || item.createdAt,
      type: 'kyc',
    }));

    const fraudActivities = fraudItems.map((item) => ({
      id: String(item._id),
      action: `Fraud report ${item.status}`,
      user: item.reporterEmail || item.reporterName || 'Unknown user',
      time: getTimeAgo(item.updatedAt || item.reportedAt || item.createdAt),
      timestamp: item.updatedAt || item.reportedAt || item.createdAt,
      type: 'fraud',
    }));

    const transactionActivities = recentTransactions.map((item) => ({
      id: String(item._id),
      action: `Transaction of ${formatCurrency(item.amount)}`,
      user: item.user,
      time: getTimeAgo(item.date),
      timestamp: item.date,
      type: 'transaction',
    }));

    const activities = [...userActivities, ...kycActivities, ...fraudActivities, ...transactionActivities]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)
      .map(({ timestamp, ...activity }) => activity);

    const users = recentUsers.map((user) => ({
      id: String(user._id),
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      email: user.email,
      date: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : '',
      status: user.status,
      role: user.role,
    }));

    res.json({
      success: true,
      data: activities,
      users,
      transactions: recentTransactions,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getPendingApprovals = async (req, res) => {
  try {
    const [pendingKYC, pendingLoans] = await Promise.all([
      KYCApplication.find({ status: { $in: ['pending', 'under_review'] } })
        .populate('userId', 'firstName lastName email')
        .sort({ submittedAt: 1, createdAt: 1 })
        .limit(10)
        .lean(),
      Loan.find({ status: 'pending' })
        .populate('userId', 'firstName lastName email')
        .sort({ createdAt: 1 })
        .limit(10)
        .lean(),
    ]);

    const approvals = [
      ...pendingKYC.map((item) => ({
        id: String(item._id),
        type: 'kyc',
        user: item.personalInfo?.fullName || `${item.userId?.firstName || ''} ${item.userId?.lastName || ''}`.trim(),
        date: (item.submittedAt || item.createdAt || new Date()).toISOString().split('T')[0],
        priority: item.riskLevel === 'high' || item.riskLevel === 'very_high' ? 'high' : 'medium',
      })),
      ...pendingLoans.map((item) => ({
        id: String(item._id),
        type: 'loan',
        user: `${item.userId?.firstName || ''} ${item.userId?.lastName || ''}`.trim(),
        date: (item.createdAt || new Date()).toISOString().split('T')[0],
        priority: Number(item.amount || 0) >= 1000000 ? 'high' : 'medium',
      })),
    ]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 10);

    res.json({ success: true, data: approvals });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.processPendingApproval = async (req, res) => {
  try {
    const { type, id } = req.params;
    const { action, reason } = req.body;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Invalid action' });
    }

    if (type === 'kyc') {
      const application = await KYCApplication.findById(id);
      if (!application) {
        return res.status(404).json({ success: false, message: 'KYC application not found' });
      }

      application.status = action === 'approve' ? 'approved' : 'rejected';
      application.approvedAt = action === 'approve' ? new Date() : application.approvedAt;
      application.verification = {
        ...(application.verification || {}),
        reviewedBy: req.user._id,
        reviewedByName: `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim(),
        reviewedAt: new Date(),
        rejectionReason: action === 'reject' ? (reason || 'Rejected by admin') : '',
      };
      await application.save();

      return res.json({
        success: true,
        message: `KYC application ${action}d successfully`,
      });
    }

    if (type === 'loan') {
      const loan = await Loan.findById(id);
      if (!loan) {
        return res.status(404).json({ success: false, message: 'Loan not found' });
      }

      loan.status = action === 'approve' ? 'approved' : 'rejected';
      loan.adminComment = reason || loan.adminComment || '';
      loan.approvedBy = req.user._id;
      loan.approvedAt = action === 'approve' ? new Date() : loan.approvedAt;
      await loan.save();

      return res.json({
        success: true,
        message: `Loan ${action}d successfully`,
      });
    }

    return res.status(400).json({ success: false, message: 'Unsupported approval type' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean();
    res.json({ success: true, data: getProfilePayload(user) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      country,
      dateOfBirth,
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) {
      const [firstName, ...lastNameParts] = String(name).trim().split(/\s+/);
      user.firstName = firstName || user.firstName;
      user.lastName = lastNameParts.join(' ') || user.lastName;
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email: email.trim().toLowerCase(), _id: { $ne: user._id } });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
      }
      user.email = email.trim().toLowerCase();
    }

    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (city !== undefined) user.city = city;
    if (state !== undefined) user.state = state;
    if (zipCode !== undefined) user.zipCode = zipCode;
    if (country !== undefined) user.country = country;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth || null;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: getProfilePayload(user),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean();
    res.json({
      success: true,
      data: {
        settings: mergeSettings(user?.preferences?.adminDashboard),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const nextSettings = mergeSettings(req.body.settings || req.body);
    user.preferences = user.preferences || {};
    user.preferences.adminDashboard = nextSettings;
    await user.save();

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: {
        settings: nextSettings,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const {
      type,
      status,
      startDate,
      endDate,
      page = 1,
    } = req.query;

    const query = {};
    if (type && type !== 'all') query.type = type;
    if (status && status !== 'all') query.status = status;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const limit = 25;
    const skip = (Math.max(Number(page), 1) - 1) * limit;

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const data = await Promise.all(transactions.map(enrichTransaction));

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getTransactionCharts = async (_req, res) => {
  try {
    const [dailyVolume, typeStats, successMonthly, totalTransactions, totalVolume, completedCount, pendingCount] = await Promise.all([
      buildTransactionVolume('week'),
      Transaction.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]),
      Transaction.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              status: '$status',
            },
            count: { $sum: 1 },
          },
        },
      ]),
      Transaction.countDocuments(),
      Transaction.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
      Transaction.countDocuments({ status: 'completed' }),
      Transaction.countDocuments({ status: 'pending' }),
    ]);

    const transactionTypes = typeStats.map((item, index) => ({
      name: String(item._id || 'other').replace(/\b\w/g, (char) => char.toUpperCase()),
      value: item.count,
      color: ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6'][index % 5],
    }));

    const successMap = new Map();
    successMonthly.forEach((item) => {
      const key = `${item._id.year}-${item._id.month}`;
      if (!successMap.has(key)) {
        successMap.set(key, { month: MONTH_NAMES[item._id.month - 1], success: 0, failed: 0 });
      }
      const bucket = successMap.get(key);
      if (item._id.status === 'completed') bucket.success += item.count;
      if (item._id.status === 'failed' || item._id.status === 'cancelled') bucket.failed += item.count;
    });

    const successRate = [];
    for (let offset = 5; offset >= 0; offset -= 1) {
      const date = new Date();
      date.setMonth(date.getMonth() - offset, 1);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      successRate.push(successMap.get(key) || { month: MONTH_NAMES[date.getMonth()], success: 0, failed: 0 });
    }

    res.json({
      success: true,
      data: {
        dailyVolume,
        transactionTypes,
        successRate,
        summary: {
          totalTransactions,
          totalVolume: totalVolume[0]?.total || 0,
          successRate: totalTransactions ? ((completedCount / totalTransactions) * 100).toFixed(1) : '0.0',
          pendingTransactions: pendingCount,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getKYCApplications = async (req, res) => {
  try {
    const { status = 'all', page = 1 } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status === 'pending' ? { $in: ['pending', 'under_review'] } : status;
    }

    const limit = 20;
    const skip = (Math.max(Number(page), 1) - 1) * limit;

    const applications = await KYCApplication.find(filter)
      .populate('userId', 'firstName lastName email phone')
      .sort({ submittedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      data: applications.map(buildKYCApplicationPayload),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getKYCStats = async (_req, res) => {
  try {
    const [total, pending, approved, rejected] = await Promise.all([
      KYCApplication.countDocuments(),
      KYCApplication.countDocuments({ status: { $in: ['pending', 'under_review'] } }),
      KYCApplication.countDocuments({ status: { $in: ['approved', 'verified'] } }),
      KYCApplication.countDocuments({ status: 'rejected' }),
    ]);

    res.json({ success: true, data: { total, pending, approved, rejected } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.approveKYC = async (req, res) => {
  req.params.type = 'kyc';
  req.params.id = req.params.id;
  req.body.action = 'approve';
  return exports.processPendingApproval(req, res);
};

exports.rejectKYC = async (req, res) => {
  req.params.type = 'kyc';
  req.params.id = req.params.id;
  req.body.action = 'reject';
  return exports.processPendingApproval(req, res);
};

exports.getFraudAlerts = async (req, res) => {
  try {
    const { priority = 'all', status = 'all' } = req.query;
    const query = {};
    if (priority && priority !== 'all') query.priority = priority === 'high' ? { $in: ['high', 'critical'] } : priority;
    if (status && status !== 'all') query.status = status === 'investigating' ? 'under_investigation' : status;

    const reports = await FraudReport.find(query).sort({ reportedAt: -1, createdAt: -1 }).lean();
    res.json({ success: true, data: reports.map(buildFraudAlertPayload) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getFraudStats = async (_req, res) => {
  try {
    const [total, high, medium, low, resolved] = await Promise.all([
      FraudReport.countDocuments(),
      FraudReport.countDocuments({ priority: { $in: ['high', 'critical'] } }),
      FraudReport.countDocuments({ priority: 'medium' }),
      FraudReport.countDocuments({ priority: 'low' }),
      FraudReport.countDocuments({ status: 'resolved' }),
    ]);

    res.json({ success: true, data: { total, high, medium, low, resolved } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getFraudTrends = async (_req, res) => {
  try {
    const start = new Date();
    start.setDate(start.getDate() - 27);
    start.setHours(0, 0, 0, 0);

    const data = await FraudReport.aggregate([
      { $match: { reportedAt: { $gte: start } } },
      {
        $group: {
          _id: {
            week: { $isoWeek: '$reportedAt' },
            year: { $isoWeekYear: '$reportedAt' },
          },
          alerts: { $sum: 1 },
          resolved: {
            $sum: {
              $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0],
            },
          },
        },
      },
      { $sort: { '_id.year': 1, '_id.week': 1 } },
    ]);

    res.json({
      success: true,
      data: data.map((item, index) => ({
        week: `Week ${index + 1}`,
        alerts: item.alerts,
        resolved: item.resolved,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.resolveFraudAlert = async (req, res) => {
  try {
    const report = await FraudReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Fraud alert not found' });
    }

    report.status = 'resolved';
    report.resolvedAt = new Date();
    report.resolvedBy = req.user._id;
    await report.save();

    res.json({ success: true, message: 'Fraud alert resolved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.escalateFraudAlert = async (req, res) => {
  try {
    const report = await FraudReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Fraud alert not found' });
    }

    report.priority = 'critical';
    report.status = 'under_investigation';
    report.investigationNotes = [
      ...(report.investigationNotes || []),
      {
        note: 'Escalated by admin for urgent review',
        addedBy: req.user._id,
        addedByName: `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim(),
        addedAt: new Date(),
      },
    ];
    await report.save();

    res.json({ success: true, message: 'Fraud alert escalated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.generateReport = async (req, res) => {
  try {
    const { type = 'transactions', startDate, endDate } = req.body;
    const dateQuery = {};
    if (startDate || endDate) {
      dateQuery.createdAt = {};
      if (startDate) dateQuery.createdAt.$gte = new Date(startDate);
      if (endDate) dateQuery.createdAt.$lte = new Date(endDate);
    }

    const [transactions, newUsers, activeUsers, kycItems, fraudItems] = await Promise.all([
      Transaction.find(dateQuery).lean(),
      User.countDocuments(startDate || endDate ? dateQuery : {}),
      User.countDocuments({ status: 'active' }),
      KYCApplication.find(startDate || endDate ? { submittedAt: dateQuery.createdAt || undefined } : {}).lean(),
      FraudReport.find(startDate || endDate ? { reportedAt: dateQuery.createdAt || undefined } : {}).lean(),
    ]);

    const totalTransactions = transactions.length;
    const totalVolume = transactions.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const revenue = transactions.reduce((sum, item) => sum + Number(item.fee || 0), 0);
    const resolvedAlerts = fraudItems.filter((item) => item.status === 'resolved').length;
    const kycCompleted = kycItems.filter((item) => ['approved', 'verified'].includes(item.status)).length;

    const dailyMap = new Map();
    transactions.forEach((item) => {
      const key = new Date(item.createdAt).toISOString().split('T')[0];
      if (!dailyMap.has(key)) {
        dailyMap.set(key, { date: key, transactions: 0, volume: 0 });
      }
      const bucket = dailyMap.get(key);
      bucket.transactions += 1;
      bucket.volume += Number(item.amount || 0);
    });

    const categoryMap = new Map();
    transactions.forEach((item) => {
      const key = item.type || 'other';
      categoryMap.set(key, (categoryMap.get(key) || 0) + 1);
    });

    res.json({
      success: true,
      data: {
        summary: {
          totalTransactions,
          totalVolume,
          activeUsers,
          newUsers,
          kycCompleted,
          fraudAlerts: fraudItems.length,
          resolvedAlerts,
          revenue,
          expenses: 0,
          type,
        },
        chartData: {
          dailyData: Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date)).slice(-15),
          categoryData: Array.from(categoryMap.entries()).map(([name, value]) => ({
            name: String(name).replace(/\b\w/g, (char) => char.toUpperCase()),
            value,
          })),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
