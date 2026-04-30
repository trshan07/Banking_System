const os = require('os');
const mongoose = require('mongoose');

const Branch = require('../models/Branch');
const FraudReport = require('../models/FraudReport');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { formatCurrency } = require('../utils/formatCurrency');

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
    .select('firstName lastName email phone address role status createdAt updatedAt')
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
    ]);

    const roleSummaryMap = roleStatusSummary.reduce((accumulator, item) => {
      accumulator[item.role] = item;
      return accumulator;
    }, {});

    const revenue = revenueResult[0]?.total || 0;
    const expenses = 0;

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
        pendingAudits: roleStatusSummary.reduce((total, item) => total + item.pending, 0),
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
    const limit = Number.parseInt(req.query.limit, 10) || 10;

    const [recentUsers, recentTransactions, adminData] = await Promise.all([
      User.find()
        .select('firstName lastName email role status createdAt updatedAt')
        .sort({ updatedAt: -1, createdAt: -1 })
        .limit(limit)
        .lean(),
      Transaction.find()
        .select('amount status type createdAt updatedAt reference')
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean(),
      getAdminSummaries(),
    ]);

    const userLogs = recentUsers.map((user) => ({
      id: `user-${user._id}`,
      action: user.createdAt?.getTime() === user.updatedAt?.getTime() ? 'User account created' : 'User account updated',
      user: user.email,
      target: `${user.firstName} ${user.lastName} (${user.role})`,
      time: getTimeAgo(user.updatedAt || user.createdAt),
      timestamp: user.updatedAt || user.createdAt,
      status: user.status === 'active' ? 'success' : user.status,
      ip: 'system',
    }));

    const transactionLogs = recentTransactions.map((transaction) => ({
      id: `transaction-${transaction._id}`,
      action: `${transaction.type} transaction`,
      user: transaction.reference || 'transaction',
      target: formatCurrency(transaction.amount),
      time: getTimeAgo(transaction.createdAt),
      timestamp: transaction.createdAt,
      status: transaction.status === 'completed' ? 'success' : transaction.status,
      ip: 'system',
    }));

    const logs = [...userLogs, ...transactionLogs]
      .sort((left, right) => new Date(right.timestamp) - new Date(left.timestamp))
      .slice(0, limit)
      .map(({ timestamp, ...log }) => log);

    res.json({
      success: true,
      data: {
        logs,
        admins: adminData.admins.slice(0, 5),
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
    const roleStatusSummary = await getRoleStatusSummary();

    const performance = roleStatusSummary.map((item) => ({
      metric: item.label,
      value: item.active,
      target: item.total || 1,
    }));

    res.json({
      success: true,
      data: {
        period,
        performance,
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

exports.updateSettings = async (req, res) => {
  try {
    const { settings } = req.body;

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: {
        settings: settings || {},
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

    res.json({
      success: true,
      message: `Maintenance mode ${maintenanceMode ? 'enabled' : 'disabled'}`,
      data: {
        maintenanceMode,
        duration,
        startedAt: new Date(),
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
