// backend/src/controllers/dashboardController.js
const User = require('../models/User');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const Loan = require('../models/Loan');
const SavingsGoal = require('../models/SavingsGoal');
const Alert = require('../models/Alert');
const SupportTicket = require('../models/SupportTicket');
const FraudReport = require('../models/FraudReport');
const mongoose = require('mongoose');

// @desc    Get complete dashboard data
// @route   GET /api/dashboard/data
// @access  Private
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Parallel data fetching for better performance
    const [
      accounts,
      allTransactions,
      loans,
      savingsGoals,
      alerts,
      tickets,
      fraudReports
    ] = await Promise.all([
      Account.find({ userId, status: 'active' }),
      Transaction.find({ 
        $or: [{ fromUserId: userId }, { toUserId: userId }]
      }).sort({ createdAt: -1 }).limit(50),
      Loan.find({ userId }).sort({ createdAt: -1 }),
      SavingsGoal.find({ userId, status: 'active' }),
      Alert.find({ userId, isRead: false, isDismissed: false }).sort({ createdAt: -1 }).limit(10),
      SupportTicket.find({ userId, status: { $ne: 'closed' } }).sort({ createdAt: -1 }).limit(5),
      FraudReport.find({ userId, status: { $ne: 'resolved' } }).sort({ createdAt: -1 }).limit(5)
    ]);
    
    // Calculate statistics
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const totalLoans = loans
      .filter(loan => ['active', 'disbursed'].includes(loan.status))
      .reduce((sum, loan) => sum + (loan.remainingAmount || 0), 0);
    
    // Monthly expenses (current month)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const monthlyExpenses = allTransactions
      .filter(tx => 
        tx.fromUserId?.toString() === userId && 
        tx.type === 'transfer' &&
        tx.createdAt >= startOfMonth
      )
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    // Recent transactions (last 10)
    const recentTransactions = allTransactions.slice(0, 10);
    
    // Calculate savings progress
    const savingsProgress = savingsGoals.map(goal => ({
      ...goal.toObject(),
      progress: (goal.currentAmount / goal.targetAmount) * 100
    }));
    
    // Check for critical alerts
    const criticalAlerts = alerts.filter(a => a.severity === 'critical');
    
    // Get KYC status
    const kycStatus = req.user.kycStatus || 'pending';
    
    const stats = {
      totalBalance,
      totalLoans,
      activeAccounts: accounts.length,
      monthlyExpenses,
      activeLoans: loans.filter(l => l.status === 'active').length,
      savingsGoals: savingsGoals.length,
      pendingAlerts: alerts.length,
      criticalAlerts: criticalAlerts.length,
      openTickets: tickets.length,
      kycStatus
    };
    
    res.json({
      success: true,
      data: {
        stats,
        accounts,
        transactions: recentTransactions,
        loans: loans.slice(0, 5),
        savingsGoals: savingsProgress,
        alerts,
        recentTickets: tickets,
        recentFraudReports: fraudReports
      }
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching dashboard data',
      error: error.message 
    });
  }
};

// @desc    Dismiss alert
// @route   PUT /api/dashboard/alerts/:alertId/dismiss
// @access  Private
exports.dismissAlert = async (req, res) => {
  try {
    const { alertId } = req.params;
    const userId = req.user.id;
    
    const alert = await Alert.findOneAndUpdate(
      { _id: alertId, userId },
      { isDismissed: true, isRead: true },
      { new: true }
    );
    
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Alert dismissed successfully',
      data: alert
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error dismissing alert',
      error: error.message
    });
  }
};

// @desc    Mark alert as read
// @route   PUT /api/dashboard/alerts/:alertId/read
// @access  Private
exports.markAlertAsRead = async (req, res) => {
  try {
    const { alertId } = req.params;
    const userId = req.user.id;
    
    const alert = await Alert.findOneAndUpdate(
      { _id: alertId, userId },
      { isRead: true },
      { new: true }
    );
    
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Alert marked as read',
      data: alert
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error updating alert',
      error: error.message
    });
  }
};

// @desc    Get all alerts with pagination
// @route   GET /api/dashboard/alerts
// @access  Private
exports.getAllAlerts = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, status = 'all' } = req.query;
    
    let query = { userId };
    
    if (status === 'unread') {
      query.isRead = false;
      query.isDismissed = false;
    } else if (status === 'dismissed') {
      query.isDismissed = true;
    }
    
    const alerts = await Alert.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await Alert.countDocuments(query);
    
    res.json({
      success: true,
      data: alerts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching alerts',
      error: error.message
    });
  }
};

// @desc    Get dashboard analytics (charts data)
// @route   GET /api/dashboard/analytics
// @access  Private
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = 'month' } = req.query;
    
    let startDate;
    const now = new Date();
    
    switch(period) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }
    
    // Get transaction trends
    const transactions = await Transaction.aggregate([
      {
        $match: {
          $or: [{ fromUserId: mongoose.Types.ObjectId(userId) }, { toUserId: mongoose.Types.ObjectId(userId) }],
          createdAt: { $gte: startDate },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          sent: {
            $sum: {
              $cond: [{ $eq: ["$fromUserId", mongoose.Types.ObjectId(userId)] }, "$amount", 0]
            }
          },
          received: {
            $sum: {
              $cond: [{ $eq: ["$toUserId", mongoose.Types.ObjectId(userId)] }, "$amount", 0]
            }
          }
        }
      },
      { $sort: { "_id": 1 } }
    ]);
    
    // Get expense categories
    const expensesByCategory = await Transaction.aggregate([
      {
        $match: {
          fromUserId: mongoose.Types.ObjectId(userId),
          type: 'transfer',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        transactionTrends: transactions,
        expensesByCategory,
        period
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
};

// @desc    Get sidebar quick action items based on user role
// @route   GET /api/dashboard/sidebar
// @access  Private
exports.getSidebarItems = async (req, res) => {
  try {
    const user = req.user;
    const role = user.role || 'customer';

    const customerItems = [
      { id: 'transfer', title: 'Transfer Funds', description: 'Send money between accounts', tag: 'Banking' },
      { id: 'pay-bills', title: 'Pay Bills', description: 'Pay your utility bills', tag: 'Payments' },
      { id: 'apply-loan', title: 'Apply for Loan', description: 'Get a personal or business loan', tag: 'Loans' },
      { id: 'savings', title: 'Savings Goals', description: 'Track your savings progress', tag: 'Savings' },
      { id: 'support', title: 'Get Support', description: 'Contact customer service', tag: 'Help' },
    ];

    const adminItems = [
      { id: 'manage-users', title: 'Manage Users', description: 'View and manage user accounts', tag: 'Admin' },
      { id: 'loan-approvals', title: 'Loan Approvals', description: 'Review pending loan applications', tag: 'Loans' },
      { id: 'reports', title: 'Reports', description: 'Generate system reports', tag: 'Analytics' },
      { id: 'fraud-review', title: 'Fraud Review', description: 'Review flagged transactions', tag: 'Security' },
    ];

    const employeeItems = [
      { id: 'tasks', title: 'My Tasks', description: 'View assigned tasks', tag: 'Work' },
      { id: 'leaves', title: 'Leave Requests', description: 'Apply for or manage leaves', tag: 'HR' },
      { id: 'support-tickets', title: 'Support Tickets', description: 'Handle customer queries', tag: 'Support' },
    ];

    let items;
    switch (role) {
      case 'admin':
        items = adminItems;
        break;
      case 'employee':
        items = employeeItems;
        break;
      case 'super_admin':
        items = [...adminItems, { id: 'system-config', title: 'System Config', description: 'Manage system settings', tag: 'System' }];
        break;
      default:
        items = customerItems;
    }

    res.json({
      success: true,
      items
    });
  } catch (error) {
    console.error('Get sidebar items error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sidebar items'
    });
  }
};