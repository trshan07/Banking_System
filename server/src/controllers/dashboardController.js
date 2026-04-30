const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const Loan = require('../models/Loan');
const SavingsGoal = require('../models/SavingsGoal');
const Alert = require('../models/Alert');
const SupportTicket = require('../models/SupportTicket');
const FraudReport = require('../models/FraudReport');
const KYCApplication = require('../models/KYCApplication');

const formatTitle = (value = '') =>
  String(value)
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const formatAccountName = (accountType = '') => {
  const label = formatTitle(accountType || 'checking');
  return label ? `${label} Account` : 'Bank Account';
};

const toObjectIdString = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (value._id) return String(value._id);
  return String(value);
};

const getAlertAction = (alert) => {
  const metadata = alert?.metadata ? Object.fromEntries(alert.metadata) : {};

  if (metadata.link) {
    return {
      label: metadata.label || 'View details',
      link: metadata.link,
    };
  }

  const alertText = `${alert?.title || ''} ${alert?.message || ''}`.toLowerCase();

  if (alertText.includes('kyc')) {
    return { label: 'Complete KYC', link: '/dashboard/kyc' };
  }

  if (alertText.includes('loan')) {
    return { label: 'View loans', link: '/dashboard/loans/status' };
  }

  if (alertText.includes('saving')) {
    return { label: 'View savings', link: '/dashboard/savings' };
  }

  if (alert?.type === 'security' || alert?.severity === 'critical') {
    return { label: 'Contact support', link: '/dashboard/support/create' };
  }

  return null;
};

const mapAccount = (account) => ({
  _id: account._id,
  id: account.id,
  accountNumber: account.accountNumber,
  accountType: account.accountType,
  balance: Number(account.balance) || 0,
  currency: account.currency || 'USD',
  status: account.status || 'active',
  interestRate: Number(account.interestRate) || 0,
  openedAt: account.openedAt || account.createdAt,
  name: formatAccountName(account.accountType),
});

const mapTransaction = (transaction, ownAccountIds) => {
  const fromAccountId = toObjectIdString(transaction.fromAccountId);
  const toAccountId = toObjectIdString(transaction.toAccountId);
  const isOutgoing = ownAccountIds.has(fromAccountId);
  const isIncoming = ownAccountIds.has(toAccountId);

  let direction = 'neutral';
  if (isOutgoing && isIncoming) direction = 'internal';
  else if (isOutgoing) direction = 'out';
  else if (isIncoming) direction = 'in';

  const fallbackDescription = direction === 'in'
    ? `Incoming ${transaction.type || 'transaction'}`
    : direction === 'out'
      ? `Outgoing ${transaction.type || 'transaction'}`
      : `${formatTitle(transaction.type || 'transaction')} transaction`;

  return {
    _id: transaction._id,
    id: transaction.id || String(transaction._id),
    amount: Number(transaction.amount) || 0,
    type: transaction.type || 'transfer',
    status: transaction.status || 'pending',
    description: transaction.description || fallbackDescription,
    category: transaction.category || 'other',
    date: transaction.createdAt,
    createdAt: transaction.createdAt,
    direction,
    reference: transaction.reference || '',
    fromAccountId,
    toAccountId,
    fromAccount: transaction.fromAccountId
      ? {
          id: fromAccountId,
          number: transaction.fromAccountId.accountNumber,
          type: transaction.fromAccountId.accountType,
          name: formatAccountName(transaction.fromAccountId.accountType),
        }
      : null,
    toAccount: transaction.toAccountId
      ? {
          id: toAccountId,
          number: transaction.toAccountId.accountNumber,
          type: transaction.toAccountId.accountType,
          name: formatAccountName(transaction.toAccountId.accountType),
        }
      : null,
  };
};

const mapSavingsGoal = (goal) => {
  const currentAmount = Number(goal.currentAmount) || 0;
  const targetAmount = Number(goal.targetAmount) || 0;
  const progress = targetAmount > 0
    ? Math.min((currentAmount / targetAmount) * 100, 100)
    : 0;

  return {
    _id: goal._id,
    id: goal.id || String(goal._id),
    goalName: goal.goalName,
    name: goal.goalName,
    targetAmount,
    target: targetAmount,
    currentAmount,
    current: currentAmount,
    deadline: goal.deadline,
    targetDate: goal.deadline,
    status: goal.status || 'active',
    category: goal.category || 'other',
    progress,
    percentage: Number(goal.percentage) || progress,
  };
};

const mapLoan = (loan) => {
  const paidAmount = Array.isArray(loan.payments)
    ? loan.payments
        .filter((payment) => payment.status === 'paid')
        .reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0)
    : 0;

  const totalPayment = Number(loan.totalPayment) || 0;
  const remainingAmount = Math.max(totalPayment - paidAmount, 0);

  return {
    _id: loan._id,
    id: loan.id || String(loan._id),
    loanType: loan.loanType,
    type: formatTitle(loan.loanType),
    amount: Number(loan.amount) || 0,
    interestRate: Number(loan.interestRate) || 0,
    term: Number(loan.term) || 0,
    tenure: loan.term ? `${loan.term} months` : 'N/A',
    status: loan.status || 'pending',
    appliedDate: loan.createdAt,
    createdAt: loan.createdAt,
    decisionDate: loan.approvedAt || null,
    approvedAt: loan.approvedAt || null,
    monthlyPayment: Number(loan.monthlyPayment) || 0,
    totalPayment,
    remainingAmount,
    nextPaymentDate: loan.nextPaymentDate || null,
  };
};

const mapAlert = (alert) => ({
  _id: alert._id,
  id: String(alert._id),
  title: alert.title,
  message: alert.message,
  type: alert.type === 'security' ? 'error' : alert.type,
  severity: alert.severity || 'low',
  isRead: Boolean(alert.isRead),
  isDismissed: Boolean(alert.isDismissed),
  date: alert.createdAt,
  createdAt: alert.createdAt,
  action: getAlertAction(alert),
});

// @desc    Get complete dashboard data
// @route   GET /api/dashboard/data
// @access  Private
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    const [
      accounts,
      loans,
      savingsGoals,
      alerts,
      tickets,
      fraudReports,
      latestKycApplication,
    ] = await Promise.all([
      Account.find({ userId }).sort({ createdAt: -1 }),
      Loan.find({ userId }).sort({ createdAt: -1 }),
      SavingsGoal.find({ userId, status: 'active' }),
      Alert.find({ userId, isRead: false, isDismissed: false }).sort({ createdAt: -1 }).limit(10),
      SupportTicket.find({ userId, status: { $ne: 'closed' } }).sort({ createdAt: -1 }).limit(5),
      FraudReport.find({ userId, status: { $ne: 'resolved' } }).sort({ createdAt: -1 }).limit(5),
      KYCApplication.findOne({ userId }).sort({ updatedAt: -1, createdAt: -1 }),
    ]);

    const accountIds = accounts.map((account) => account._id);
    const ownAccountIds = new Set(accountIds.map((accountId) => String(accountId)));

    const transactions = ownAccountIds.size > 0
      ? await Transaction.find({
          $or: [
            { fromAccountId: { $in: accountIds } },
            { toAccountId: { $in: accountIds } },
          ],
        })
          .populate('fromAccountId', 'accountNumber accountType')
          .populate('toAccountId', 'accountNumber accountType')
          .sort({ createdAt: -1 })
          .limit(25)
      : [];

    const mappedAccounts = accounts.map(mapAccount);
    const mappedTransactions = transactions.map((transaction) => mapTransaction(transaction, ownAccountIds));
    const mappedSavingsGoals = savingsGoals.map(mapSavingsGoal);
    const mappedLoans = loans.map(mapLoan);
    const mappedAlerts = alerts.map(mapAlert);

    const totalBalance = mappedAccounts.reduce((sum, account) => sum + account.balance, 0);
    const totalOutstandingLoans = mappedLoans
      .filter((loan) => ['active', 'approved', 'disbursed', 'pending'].includes(loan.status))
      .reduce((sum, loan) => sum + loan.remainingAmount, 0);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyExpenses = mappedTransactions
      .filter((transaction) =>
        transaction.createdAt >= startOfMonth &&
        transaction.direction === 'out' &&
        ['transfer', 'payment', 'withdrawal', 'fee'].includes(transaction.type)
      )
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const criticalAlerts = mappedAlerts.filter((alert) => alert.severity === 'critical');
    const kycStatus = latestKycApplication?.status || 'not_submitted';

    const stats = {
      totalBalance,
      totalLoans: totalOutstandingLoans,
      activeAccounts: mappedAccounts.filter((account) => account.status === 'active').length,
      monthlyExpenses,
      activeLoans: mappedLoans.filter((loan) => ['active', 'approved', 'disbursed', 'pending'].includes(loan.status)).length,
      savingsGoals: mappedSavingsGoals.length,
      pendingAlerts: mappedAlerts.length,
      criticalAlerts: criticalAlerts.length,
      openTickets: tickets.length,
      kycStatus,
      pendingFraudReports: fraudReports.length,
    };

    res.json({
      success: true,
      data: {
        stats,
        accounts: mappedAccounts,
        transactions: mappedTransactions.slice(0, 8),
        loans: mappedLoans.slice(0, 5),
        savingsGoals: mappedSavingsGoals,
        alerts: mappedAlerts,
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
    const userId = req.user._id;
    const { period = 'month' } = req.query;

    let startDate;
    const now = new Date();

    switch (period) {
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

    const accounts = await Account.find({ userId }).select('_id');
    const accountIds = accounts.map((account) => account._id);

    if (accountIds.length === 0) {
      return res.json({
        success: true,
        data: {
          transactionTrends: [],
          expensesByCategory: [],
          period,
        },
      });
    }

    const transactions = await Transaction.aggregate([
      {
        $match: {
          $or: [
            { fromAccountId: { $in: accountIds } },
            { toAccountId: { $in: accountIds } },
          ],
          createdAt: { $gte: startDate },
          status: 'completed',
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          sent: {
            $sum: {
              $cond: [{ $in: ['$fromAccountId', accountIds] }, '$amount', 0]
            }
          },
          received: {
            $sum: {
              $cond: [{ $in: ['$toAccountId', accountIds] }, '$amount', 0]
            }
          }
        }
      },
      { $sort: { "_id": 1 } }
    ]);
    
    const expensesByCategory = await Transaction.aggregate([
      {
        $match: {
          fromAccountId: { $in: accountIds },
          type: { $in: ['transfer', 'payment', 'withdrawal', 'fee'] },
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

// @desc    Execute sidebar quick actions
// @route   POST /api/dashboard/sidebar/:actionId/execute
// @access  Private
exports.executeSidebarAction = async (req, res) => {
  try {
    const { actionId } = req.params;
    const role = req.user.role || 'customer';

    if (role === 'customer') {
      const activeAccounts = await Account.find({
        userId: req.user._id,
        status: 'active',
      }).select('_id accountType balance');

      const customerActions = {
        dashboard: {
          redirectTo: '/dashboard',
          message: 'Opening your customer dashboard overview.',
        },
        transfer: {
          redirectTo: activeAccounts.length >= 2 ? '/dashboard/banking/transfer' : '/dashboard/banking/accounts',
          message: activeAccounts.length >= 2
            ? 'Opening the transfer workspace.'
            : 'You need at least two active accounts to transfer between your own accounts.',
        },
        'transfer-funds': {
          redirectTo: activeAccounts.length >= 2 ? '/dashboard/banking/transfer' : '/dashboard/banking/accounts',
          message: activeAccounts.length >= 2
            ? 'Opening the transfer workspace.'
            : 'You need at least two active accounts to transfer between your own accounts.',
        },
        'pay-bills': {
          redirectTo: '/dashboard/banking/transactions',
          message: 'Review your recent payments and account activity.',
        },
        'apply-loan': {
          redirectTo: '/dashboard/loans/apply',
          message: 'Opening the loan application form.',
        },
        'loan-status': {
          redirectTo: '/dashboard/loans/status',
          message: 'Opening your loan applications and repayment status.',
        },
        accounts: {
          redirectTo: '/dashboard/banking/accounts',
          message: 'Opening your linked bank accounts.',
        },
        transactions: {
          redirectTo: '/dashboard/banking/transactions',
          message: 'Opening your recent transactions and activity history.',
        },
        savings: {
          redirectTo: '/dashboard/savings',
          message: 'Opening your savings tracker.',
        },
        'open-savings': {
          redirectTo: '/dashboard/savings',
          message: 'Opening your savings tracker.',
        },
        support: {
          redirectTo: '/dashboard/support/create',
          message: 'Opening support so you can contact the bank team quickly.',
        },
        'support-tickets': {
          redirectTo: '/dashboard/support',
          message: 'Opening your support tickets.',
        },
        'report-fraud': {
          redirectTo: '/dashboard/fraud/report',
          message: 'Opening the fraud reporting form.',
        },
        'kyc-verification': {
          redirectTo: '/dashboard/kyc',
          message: 'Opening your KYC verification workspace.',
        },
      };

      const result = customerActions[actionId];

      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Unknown quick action',
        });
      }

      return res.json({
        success: true,
        ...result,
        actionId,
      });
    }

    const staffActions = {
      'manage-users': { redirectTo: '/admin/users', message: 'Opening user management.' },
      'loan-approvals': { redirectTo: '/admin/loans', message: 'Opening loan approvals.' },
      reports: { redirectTo: '/admin/reports', message: 'Opening reports.' },
      'fraud-review': { redirectTo: '/admin/fraud', message: 'Opening fraud monitoring.' },
      'system-config': { redirectTo: '/super-admin/system', message: 'Opening system configuration.' },
      tasks: { redirectTo: '/employee/tasks', message: 'Opening your task workspace.' },
      leaves: { redirectTo: '/employee/leaves', message: 'Opening leave requests.' },
      'support-tickets': { redirectTo: '/dashboard/support', message: 'Opening support tickets.' },
    };

    const result = staffActions[actionId];

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Unknown quick action',
      });
    }

    return res.json({
      success: true,
      ...result,
      actionId,
    });
  } catch (error) {
    console.error('Execute sidebar action error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to execute quick action',
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

    let customerItems = [];

    if (role === 'customer') {
      const accountDocs = await Account.find({ userId: user._id }).select('_id status');
      const accountIds = accountDocs.map((account) => account._id);
      const activeAccounts = accountDocs.filter((account) => String(account.status || '').toLowerCase() === 'active').length;

      const [
        totalLoans,
        pendingLoans,
        totalSavingsGoals,
        openTickets,
        totalFraudReports,
        kycApplication,
        totalTransactions,
      ] = await Promise.all([
        Loan.countDocuments({ userId: user._id }),
        Loan.countDocuments({ userId: user._id, status: { $in: ['pending', 'approved', 'active', 'disbursed'] } }),
        SavingsGoal.countDocuments({ userId: user._id }),
        SupportTicket.countDocuments({
          userId: user._id,
          status: { $in: ['open', 'in_progress', 'awaiting_reply'] },
        }),
        FraudReport.countDocuments({ reportedBy: user._id }),
        KYCApplication.findOne({ userId: user._id }).select('status'),
        accountIds.length > 0
          ? Transaction.countDocuments({
              $or: [
                { fromAccountId: { $in: accountIds } },
                { toAccountId: { $in: accountIds } },
              ],
            })
          : Promise.resolve(0),
      ]);

      const kycStatus = kycApplication?.status
        ? formatTitle(String(kycApplication.status).replace(/_/g, ' '))
        : 'Not Submitted';

      customerItems = [
        {
          id: 'dashboard',
          title: 'Dashboard',
          description: 'Return to your main banking overview and see the latest account updates.',
          tag: 'Overview',
          route: '/dashboard',
          metric: `${activeAccounts} active account${activeAccounts === 1 ? '' : 's'}`,
        },
        {
          id: 'apply-loan',
          title: 'Apply for Loan',
          description: 'Start a new loan application with your saved customer details.',
          tag: 'Loans',
          route: '/dashboard/loans/apply',
          metric: pendingLoans > 0 ? `${pendingLoans} in review` : 'Ready to apply',
        },
        {
          id: 'loan-status',
          title: 'Loan Status',
          description: 'Track applications, approvals, and repayment progress from one place.',
          tag: 'Loans',
          route: '/dashboard/loans/status',
          metric: `${totalLoans} loan record${totalLoans === 1 ? '' : 's'}`,
        },
        {
          id: 'accounts',
          title: 'Accounts',
          description: 'Review account balances, details, and linked banking profiles.',
          tag: 'Banking',
          route: '/dashboard/banking/accounts',
          metric: `${accountDocs.length} total account${accountDocs.length === 1 ? '' : 's'}`,
        },
        {
          id: 'transfer-funds',
          title: 'Transfer Funds',
          description: 'Move money between eligible accounts quickly and securely.',
          tag: 'Payments',
          route: '/dashboard/banking/transfer',
          metric: activeAccounts >= 2 ? 'Transfer ready' : 'Need 2 active accounts',
        },
        {
          id: 'transactions',
          title: 'Transactions',
          description: 'See payment history, transfers, deposits, and recent account activity.',
          tag: 'History',
          route: '/dashboard/banking/transactions',
          metric: `${totalTransactions} transaction${totalTransactions === 1 ? '' : 's'}`,
        },
        {
          id: 'savings',
          title: 'Savings Tracker',
          description: 'Follow your savings goals and keep progress moving steadily.',
          tag: 'Savings',
          route: '/dashboard/savings',
          metric: `${totalSavingsGoals} goal${totalSavingsGoals === 1 ? '' : 's'}`,
        },
        {
          id: 'support-tickets',
          title: 'Support Tickets',
          description: 'Create a ticket or review replies from the bank support team.',
          tag: 'Support',
          route: '/dashboard/support',
          metric: `${openTickets} open ticket${openTickets === 1 ? '' : 's'}`,
        },
        {
          id: 'report-fraud',
          title: 'Report Fraud',
          description: 'Report suspicious activity and protect your accounts quickly.',
          tag: 'Security',
          route: '/dashboard/fraud/report',
          metric: totalFraudReports > 0 ? `${totalFraudReports} report${totalFraudReports === 1 ? '' : 's'}` : 'Stay protected',
        },
        {
          id: 'kyc-verification',
          title: 'KYC Verification',
          description: 'Complete identity verification or review your current compliance status.',
          tag: 'Compliance',
          route: '/dashboard/kyc',
          metric: kycStatus,
        },
      ];
    }

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
