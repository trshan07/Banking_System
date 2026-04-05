const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Ticket = require('../models/Ticket');
const FraudReport = require('../models/FraudReport');
const KYCApplication = require('../models/KYCApplication');
const LoanApplication = require('../models/LoanApplication');
const LeaveRequest = require('../models/LeaveRequest');

// Get dashboard statistics
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const pendingKYC = await KYCApplication.countDocuments({ status: 'pending' });
    const totalTransactions = await Transaction.countDocuments();
    const totalVolume = await Transaction.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const pendingTickets = await Ticket.countDocuments({ status: { $in: ['open', 'in-progress'] } });
    const fraudAlerts = await FraudReport.countDocuments({ status: 'pending' });
    const totalEmployees = await User.countDocuments({ role: { $in: ['employee', 'admin'] } });
    const branches = 28; // Can be fetched from Branch model
    const loanApplications = await LoanApplication.countDocuments();
    const approvedLoans = await LoanApplication.countDocuments({ status: 'approved' });
    const approvalRate = loanApplications > 0 ? (approvedLoans / loanApplications) * 100 : 0;

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        pendingKYC,
        totalTransactions,
        totalVolume: totalVolume[0]?.total || 0,
        pendingTickets,
        fraudAlerts,
        totalEmployees,
        branches,
        loanApplications,
        approvalRate: approvalRate.toFixed(1)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get chart data
exports.getChartData = async (req, res) => {
  try {
    const { period } = req.query;
    let userGrowth = [];
    let transactionVolume = [];
    let kycStatus = [];
    let revenue = [];

    // Get KYC status distribution
    const kycStats = await KYCApplication.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const kycMap = {
      'approved': 'Verified',
      'pending': 'Pending',
      'rejected': 'Rejected'
    };
    
    kycStatus = kycStats.map(stat => ({
      name: kycMap[stat._id] || stat._id,
      value: stat.count,
      color: stat._id === 'approved' ? '#10b981' : stat._id === 'pending' ? '#f59e0b' : '#ef4444'
    }));

    // Add not submitted users
    const totalUsers = await User.countDocuments();
    const submittedKYC = await KYCApplication.countDocuments();
    kycStatus.push({
      name: 'Not Submitted',
      value: totalUsers - submittedKYC,
      color: '#6b7280'
    });

    // Get user growth based on period
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 0; i < 6; i++) {
      const month = months[new Date().getMonth() - (5 - i)];
      userGrowth.push({
        month,
        users: Math.floor(Math.random() * 500) + 1000,
        active: Math.floor(Math.random() * 400) + 800
      });
    }

    // Transaction volume data
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    transactionVolume = days.map(day => ({
      day,
      volume: Math.floor(Math.random() * 300000) + 200000,
      count: Math.floor(Math.random() * 800) + 500
    }));

    // Revenue data
    for (let i = 0; i < 6; i++) {
      const month = months[new Date().getMonth() - (5 - i)];
      revenue.push({
        month,
        revenue: Math.floor(Math.random() * 100000) + 100000,
        expenses: Math.floor(Math.random() * 50000) + 80000
      });
    }

    res.json({
      success: true,
      data: { userGrowth, transactionVolume, kycStatus, revenue }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get recent activities
exports.getRecentActivities = async (req, res) => {
  try {
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt status');
    
    const recentTransactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name');
    
    const activities = [
      ...recentUsers.map(u => ({
        id: u._id,
        action: 'New user registered',
        user: u.email,
        time: getTimeAgo(u.createdAt),
        type: 'user'
      })),
      ...recentTransactions.map(t => ({
        id: t._id,
        action: `Transaction of $${t.amount}`,
        user: t.userId?.name || 'Unknown',
        time: getTimeAgo(t.createdAt),
        type: 'transaction'
      }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);

    res.json({
      success: true,
      data: activities,
      users: recentUsers,
      transactions: recentTransactions
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get pending approvals
exports.getPendingApprovals = async (req, res) => {
  try {
    const pendingKYC = await KYCApplication.find({ status: 'pending' })
      .populate('userId', 'name email')
      .limit(5);
    
    const pendingLoans = await LoanApplication.find({ status: 'pending' })
      .populate('userId', 'name email')
      .limit(5);
    
    const approvals = [
      ...pendingKYC.map(k => ({
        id: k._id,
        type: 'KYC',
        user: k.userId?.name || 'Unknown',
        date: k.createdAt.toISOString().split('T')[0],
        priority: 'high'
      })),
      ...pendingLoans.map(l => ({
        id: l._id,
        type: 'Loan',
        user: l.userId?.name || 'Unknown',
        date: l.createdAt.toISOString().split('T')[0],
        priority: 'medium'
      }))
    ];

    res.json({
      success: true,
      data: approvals
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Helper function to get time ago
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} days ago`;
  return `${Math.floor(days / 7)} weeks ago`;
}

module.exports = {
  getStats,
  getChartData,
  getRecentActivities,
  getPendingApprovals
};