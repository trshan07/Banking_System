const os = require('os');
const mongoose = require('mongoose');

const AuditLog = require('../models/AuditLog');
const Branch = require('../models/Branch');
const FraudReport = require('../models/FraudReport');
const SystemSetting = require('../models/SystemSetting');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

const TRACKED_ROLES = ['superadmin', 'admin', 'employee', 'customer'];
const TRACKED_STATUSES = ['active', 'pending', 'inactive', 'suspended'];

const formatNumber = (value) => Number((value || 0).toFixed(2));

const formatDate = (date) => {
  if (!date) {
    return 'N/A';
  }

  return new Date(date).toISOString().split('T')[0];
};

const getTimeAgo = (date) => {
  if (!date) {
    return 'unknown';
  }

  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

  if (seconds < 60) return `${seconds} seconds ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} days ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} months ago`;

  return `${Math.floor(months / 12)} years ago`;
};

const formatUptime = (seconds) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
};

const formatUser = (user) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  name: `${user.firstName} ${user.lastName}`.trim(),
  email: user.email,
  username: user.username || '',
  phone: user.phone,
  address: user.address,
  role: user.role,
  status: user.status,
  lastActive: formatDate(user.updatedAt || user.createdAt),
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const createRoleSummaryTemplate = (role) => ({
  role,
  label: role === 'superadmin' ? 'Super Admins' : `${role.charAt(0).toUpperCase()}${role.slice(1)}s`,
  total: 0,
  active: 0,
  pending: 0,
  inactive: 0,
  suspended: 0,
});

const getRoleStatusSummary = async () => {
  const summaryMap = TRACKED_ROLES.reduce((accumulator, role) => {
    accumulator[role] = createRoleSummaryTemplate(role);
    return accumulator;
  }, {});

  const results = await User.aggregate([
    { $match: { role: { $in: TRACKED_ROLES } } },
    {
      $group: {
        _id: { role: '$role', status: '$status' },
        count: { $sum: 1 },
      },
    },
  ]);

  results.forEach(({ _id, count }) => {
    const entry = summaryMap[_id.role];
    if (!entry) {
      return;
    }

    entry.total += count;
    if (TRACKED_STATUSES.includes(_id.status)) {
      entry[_id.status] = count;
    }
  });

  return TRACKED_ROLES.map((role) => summaryMap[role]);
};

const getAdminSummaries = async () => {
  const admins = await User.find({ role: 'admin' })
    .select('firstName lastName email username phone address role status createdAt updatedAt')
    .sort({ createdAt: -1 })
    .lean();

  const formattedAdmins = admins.map(formatUser);
  const statusBreakdown = TRACKED_STATUSES.reduce((accumulator, status) => {
    accumulator[status] = formattedAdmins.filter((admin) => admin.status === status).length;
    return accumulator;
  }, {});

  return {
    admins: formattedAdmins,
    summary: {
      total: formattedAdmins.length,
      ...statusBreakdown,
    },
  };
};

const getOrCreateSettings = async () => {
  let settings = await SystemSetting.findOne({ key: 'default' });
  if (!settings) {
    settings = await SystemSetting.create({ key: 'default' });
  }

  return settings;
};

const createAuditEntry = async ({
  req,
  action,
  entity = 'system',
  entityId = null,
  target = '',
  details = '',
  status = 'success',
  metadata = {},
}) => {
  await AuditLog.create({
    userId: req.user?._id || null,
    userEmail: req.user?.email || 'system',
    action,
    entity,
    entityId: entityId ? String(entityId) : null,
    target,
    details,
    status,
    ipAddress: req.ip || req.connection?.remoteAddress || 'unknown',
    userAgent: req.get('User-Agent') || '',
    metadata,
    timestamp: new Date(),
  });
};

exports.getStats = async (req, res) => {
  try {
    const [
      roleStatusSummary,
      totalUsers,
      totalTransactions,
      totalBranches,
      totalVolumeResult,
      revenueResult,
      fraudAlerts,
      auditCount,
    ] = await Promise.all([
      getRoleStatusSummary(),
      User.countDocuments(),
      Transaction.countDocuments(),
      Branch.countDocuments(),
      Transaction.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Transaction.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$fee' } } },
      ]),
      FraudReport.countDocuments({ status: 'pending' }),
      AuditLog.countDocuments(),
    ]);

    const roleSummaryMap = roleStatusSummary.reduce((accumulator, item) => {
      accumulator[item.role] = item;
      return accumulator;
    }, {});

    const revenue = revenueResult[0]?.total || 0;
    const expenses = Math.round(revenue * 0.18 * 100) / 100;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalSuperAdmins: roleSummaryMap.superadmin?.total || 0,
        totalAdmins: roleSummaryMap.admin?.total || 0,
        totalEmployees: roleSummaryMap.employee?.total || 0,
        totalCustomers: roleSummaryMap.customer?.total || 0,
        totalBranches,
        totalTransactions,
        totalVolume: totalVolumeResult[0]?.total || 0,
        systemUptime: formatUptime(process.uptime()),
        activeSessions: 0,
        pendingAudits: auditCount,
        fraudAlerts,
        revenue,
        expenses,
        profit: revenue - expenses,
        activeUsers: roleStatusSummary.reduce((total, item) => total + item.active, 0),
        statusSummary: roleStatusSummary,
      },
    });
  } catch (error) {
    console.error('Error fetching super admin stats:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getSystemHealth = async (req, res) => {
  try {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryPercentage = totalMemory > 0 ? (usedMemory / totalMemory) * 100 : 0;

    const cpuCount = os.cpus().length || 1;
    const loadAverage = os.loadavg()[0] || 0;
    const cpuUsage = cpuCount > 0 ? Math.min((loadAverage / cpuCount) * 100, 100) : 0;
    const settings = await getOrCreateSettings();

    const databaseState = mongoose.connection.readyState;
    const databaseStatusMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    res.json({
      success: true,
      data: {
        cpu: {
          usage: formatNumber(cpuUsage),
          cores: cpuCount,
        },
        memory: {
          used: formatNumber(usedMemory / (1024 * 1024 * 1024)),
          total: formatNumber(totalMemory / (1024 * 1024 * 1024)),
          percentage: formatNumber(memoryPercentage),
        },
        disk: {
          used: 0,
          total: 0,
          percentage: 0,
        },
        database: {
          status: databaseStatusMap[databaseState] || 'unknown',
          responseTime: 'N/A',
          connections: databaseState === 1 ? 1 : 0,
          maxConnections: 1,
        },
        api: {
          uptime: formatUptime(process.uptime()),
        },
        maintenanceMode: Boolean(settings.system?.maintenanceMode),
        uptime: formatNumber((process.uptime() / 86400) * 100),
        lastChecked: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching system health:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getAuditLogs = async (req, res) => {
  try {
    const limit = Number.parseInt(req.query.limit, 10) || 20;
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(limit).lean();

    res.json({
      success: true,
      data: {
        logs: logs.map((log) => ({
          id: String(log._id),
          action: log.action,
          user: log.userEmail || 'system',
          target: log.target || log.entity || 'system',
          time: getTimeAgo(log.timestamp),
          timestamp: log.timestamp,
          status: log.status,
          ip: log.ipAddress || 'unknown',
          details: log.details || '',
        })),
        total: logs.length,
        limit,
        skip: 0,
      },
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getPerformance = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const [roleStatusSummary, transactions, branches, settings] = await Promise.all([
      getRoleStatusSummary(),
      Transaction.find({ status: 'completed' }).select('amount fee createdAt').sort({ createdAt: 1 }).lean(),
      Branch.find().sort({ revenue: -1 }).lean(),
      getOrCreateSettings(),
    ]);

    const performance = roleStatusSummary.map((item) => ({
      metric: item.label,
      value: item.active,
      target: item.total || 1,
    }));

    const now = new Date();
    const bucketCount = period === 'week' ? 7 : period === 'year' ? 12 : 6;
    const revenueGrowth = [];

    for (let index = bucketCount - 1; index >= 0; index -= 1) {
      const bucketDate = new Date(now);
      if (period === 'week') {
        bucketDate.setDate(now.getDate() - index);
      } else {
        bucketDate.setMonth(now.getMonth() - index);
      }

      const label = period === 'week'
        ? bucketDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : bucketDate.toLocaleDateString('en-US', { month: 'short' });

      const bucketTransactions = transactions.filter((transaction) => {
        const createdAt = new Date(transaction.createdAt);
        if (period === 'week') {
          return createdAt.toDateString() === bucketDate.toDateString();
        }

        return (
          createdAt.getMonth() === bucketDate.getMonth() &&
          createdAt.getFullYear() === bucketDate.getFullYear()
        );
      });

      const revenue = bucketTransactions.reduce((total, transaction) => total + (transaction.fee || 0), 0);
      const expenses = Math.round(revenue * 0.18 * 100) / 100;

      revenueGrowth.push({
        month: label,
        revenue,
        expenses,
        profit: revenue - expenses,
      });
    }

    const userActivity = Array.from({ length: 24 }, (_, hour) => {
      const matchingTransactions = transactions.filter((transaction) => {
        const createdAt = new Date(transaction.createdAt);
        return createdAt.getHours() === hour;
      });

      return {
        hour: `${String(hour).padStart(2, '0')}:00`,
        active: matchingTransactions.length,
      };
    });

    const systemMetrics = [
      { metric: 'CPU Usage', value: formatNumber(Math.min(os.loadavg()[0] * 10, 100)) },
      { metric: 'Memory Usage', value: formatNumber(((os.totalmem() - os.freemem()) / os.totalmem()) * 100) },
      { metric: 'Disk Usage', value: 0 },
      { metric: 'Network Load', value: Math.min(transactions.length, 100) },
      { metric: 'DB Load', value: mongoose.connection.readyState === 1 ? 100 : 0 },
    ];

    const branchPerformance = branches.slice(0, 5).map((branch) => ({
      branch: branch.code || branch.name,
      transactions: branch.customerCount || 0,
      revenue: branch.revenue || 0,
    }));

    res.json({
      success: true,
      data: {
        period,
        performance,
        revenueGrowth,
        userActivity,
        systemMetrics,
        branchPerformance,
        maintenanceMode: Boolean(settings.system?.maintenanceMode),
        summary: {
          totalTrackedRoles: roleStatusSummary.length,
          activeUsers: roleStatusSummary.reduce((total, item) => total + item.active, 0),
          pendingUsers: roleStatusSummary.reduce((total, item) => total + item.pending, 0),
          suspendedUsers: roleStatusSummary.reduce((total, item) => total + item.suspended, 0),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching performance data:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getAdmins = async (req, res) => {
  try {
    const adminData = await getAdminSummaries();

    res.json({
      success: true,
      data: adminData,
    });
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const ADMIN_PERMISSIONS = [
  'view_users', 'manage_users', 'view_accounts', 'manage_accounts',
  'view_transactions', 'manage_transactions', 'view_loans', 'manage_loans',
  'view_reports', 'manage_tickets', 'manage_kyc', 'manage_fraud'
];

exports.createAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, username, password, phone, address, status = 'active' } = req.body;
    if (!firstName || !lastName || !email || !username || !password || !phone || !address) {
      return res.status(400).json({ success: false, message: 'All admin fields are required' });
    }
    if (password.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return res.status(400).json({ success: false, message: 'Password must be 8+ characters with uppercase, lowercase and a number' });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();
    const duplicate = await User.findOne({ $or: [{ email: normalizedEmail }, { username: normalizedUsername }] });
    if (duplicate) return res.status(409).json({ success: false, message: 'Email or username already exists' });

    const admin = await User.create({ firstName, lastName, email: normalizedEmail, username: normalizedUsername,
      password, phone, address, role: 'admin', status, isEmailVerified: true, permissions: ADMIN_PERMISSIONS });
    await createAuditEntry({ req, action: 'create_admin', entity: 'user', entityId: admin._id,
      target: admin.email, details: `Created administrator ${admin.email}` });
    return res.status(201).json({ success: true, message: 'Administrator created', data: { admin: formatUser(admin) } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create administrator', error: error.message });
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const admin = await User.findOne({ _id: req.params.adminId, role: 'admin' }).select('+password');
    if (!admin) return res.status(404).json({ success: false, message: 'Administrator not found' });
    const allowed = ['firstName', 'lastName', 'phone', 'address', 'status'];
    allowed.forEach((field) => { if (req.body[field] !== undefined) admin[field] = req.body[field]; });
    if (req.body.email) admin.email = req.body.email.trim().toLowerCase();
    if (req.body.username) admin.username = req.body.username.trim().toLowerCase();
    if (req.body.password) {
      if (req.body.password.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(req.body.password)) {
        return res.status(400).json({ success: false, message: 'Password must be 8+ characters with uppercase, lowercase and a number' });
      }
      admin.password = req.body.password;
      admin.tokenVersion += 1;
    }
    admin.role = 'admin';
    admin.permissions = ADMIN_PERMISSIONS;
    await admin.save();
    await createAuditEntry({ req, action: 'update_admin', entity: 'user', entityId: admin._id,
      target: admin.email, details: `Updated administrator ${admin.email}` });
    return res.json({ success: true, message: 'Administrator updated', data: { admin: formatUser(admin) } });
  } catch (error) {
    const status = error.code === 11000 ? 409 : 500;
    return res.status(status).json({ success: false, message: error.code === 11000 ? 'Email or username already exists' : 'Failed to update administrator' });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await User.findOneAndDelete({ _id: req.params.adminId, role: 'admin' });
    if (!admin) return res.status(404).json({ success: false, message: 'Administrator not found' });
    await createAuditEntry({ req, action: 'delete_admin', entity: 'user', entityId: admin._id,
      target: admin.email, details: `Deleted administrator ${admin.email}` });
    return res.json({ success: true, message: 'Administrator deleted' });
  } catch (_error) {
    return res.status(500).json({ success: false, message: 'Failed to delete administrator' });
  }
};

exports.getSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    res.json({
      success: true,
      data: {
        settings,
      },
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const nextSettings = req.body.settings || req.body;
    const settings = await getOrCreateSettings();

    settings.system = { ...settings.system.toObject(), ...(nextSettings.system || {}) };
    settings.security = { ...settings.security.toObject(), ...(nextSettings.security || {}) };
    settings.features = { ...settings.features.toObject(), ...(nextSettings.features || {}) };
    settings.integrations = { ...settings.integrations.toObject(), ...(nextSettings.integrations || {}) };
    await settings.save();

    await createAuditEntry({
      req,
      action: 'System settings updated',
      entity: 'system-settings',
      entityId: settings._id,
      target: 'System configuration',
      details: 'Super admin updated platform settings.',
      metadata: nextSettings,
    });

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: {
        settings,
      },
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.setMaintenanceMode = async (req, res) => {
  try {
    const { mode, duration } = req.body;
    const maintenanceMode = Boolean(mode);
    const settings = await getOrCreateSettings();

    settings.system.maintenanceMode = maintenanceMode;
    settings.maintenance.enabledAt = maintenanceMode ? new Date() : null;
    settings.maintenance.updatedBy = req.user?._id || null;
    await settings.save();

    await createAuditEntry({
      req,
      action: maintenanceMode ? 'Maintenance mode enabled' : 'Maintenance mode disabled',
      entity: 'maintenance',
      entityId: settings._id,
      target: 'Platform maintenance',
      details: maintenanceMode
        ? `Maintenance mode enabled${duration ? ` for ${duration}` : ''}.`
        : 'Maintenance mode disabled.',
      metadata: { duration, maintenanceMode },
    });

    res.json({
      success: true,
      message: `Maintenance mode ${maintenanceMode ? 'enabled' : 'disabled'}`,
      data: {
        maintenanceMode,
        duration,
        startedAt: settings.maintenance.enabledAt,
      },
    });
  } catch (error) {
    console.error('Error setting maintenance mode:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
