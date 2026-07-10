// src/controllers/transactionController.js
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const { formatCurrency } = require('../utils/formatCurrency');

// @desc    Get user transactions
// @route   GET /api/transactions
// @access  Private
exports.getUserTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 20, startDate, endDate } = req.query;

    // Get user's accounts
    const accounts = await Account.find({ userId: req.user._id }).select('_id');
    const accountIds = accounts.map(acc => acc._id);

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const transactions = await Transaction.find({
      $or: [
        { fromAccountId: { $in: accountIds } },
        { toAccountId: { $in: accountIds } }
      ]
    })
      .populate('fromAccountId', 'accountNumber accountType')
      .populate('toAccountId', 'accountNumber accountType')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments({
      $or: [
        { fromAccountId: { $in: accountIds } },
        { toAccountId: { $in: accountIds } }
      ]
    });

    res.json({
      success: true,
      data: transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get user transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transactions'
    });
  }
};

// @desc    Get transaction details
// @route   GET /api/transactions/:transactionId
// @access  Private
exports.getTransactionDetails = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.transactionId)
      .populate('fromAccountId', 'accountNumber accountType userId')
      .populate('toAccountId', 'accountNumber accountType userId');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Check if user has access to this transaction
    const hasAccess = 
      transaction.fromAccountId?.userId?.toString() === req.user._id.toString() ||
      transaction.toAccountId?.userId?.toString() === req.user._id.toString();

    if (!hasAccess && req.user.role === 'customer') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this transaction'
      });
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Get transaction details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transaction details'
    });
  }
};

// @desc    Get account transactions
// @route   GET /api/transactions/account/:accountId
// @access  Private
exports.getAccountTransactions = async (req, res) => {
  try {
    const { accountId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    // Verify account belongs to user (if customer)
    if (req.user.role === 'customer') {
      const account = await Account.findOne({
        _id: accountId,
        userId: req.user._id
      });

      if (!account) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this account'
        });
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = {
      $or: [
        { fromAccountId: accountId },
        { toAccountId: accountId }
      ]
    };

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query)
      .populate('fromAccountId', 'accountNumber accountType')
      .populate('toAccountId', 'accountNumber accountType')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get account transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transactions'
    });
  }
};

// @desc    Get transactions by date range
// @route   POST /api/transactions/date-range
// @access  Private
exports.getTransactionsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const { page = 1, limit = 20 } = req.query;

    // Get user's accounts
    const accounts = await Account.find({ userId: req.user._id }).select('_id');
    const accountIds = accounts.map(acc => acc._id);

    const query = {
      $or: [
        { fromAccountId: { $in: accountIds } },
        { toAccountId: { $in: accountIds } }
      ]
    };

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const transactions = await Transaction.find(query)
      .populate('fromAccountId', 'accountNumber accountType')
      .populate('toAccountId', 'accountNumber accountType')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(query);

    // Calculate summary
    const summary = transactions.reduce((acc, t) => {
      const isOutgoing = accountIds.some(id => id.toString() === t.fromAccountId?._id?.toString());
      if (isOutgoing) {
        acc.totalOutgoing += t.amount;
      } else {
        acc.totalIncoming += t.amount;
      }
      return acc;
    }, { totalIncoming: 0, totalOutgoing: 0 });

    res.json({
      success: true,
      data: transactions,
      summary,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get transactions by date range error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transactions'
    });
  }
};

// @desc    Get all transactions (admin only)
// @route   GET /api/transactions/admin/all
// @access  Private/Admin
exports.getAllTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 50, status, type } = req.query;

    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const transactions = await Transaction.find(query)
      .populate('fromAccountId', 'accountNumber accountType')
      .populate('toAccountId', 'accountNumber accountType')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get all transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transactions'
    });
  }
};

// @desc    Generate transaction report (admin only)
// @route   GET /api/transactions/admin/report
// @access  Private/Admin
exports.generateReport = async (req, res) => {
  try {
    const { startDate, endDate, format = 'json' } = req.query;

    const query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query)
      .populate('fromAccountId', 'accountNumber userId')
      .populate('toAccountId', 'accountNumber userId')
      .sort({ createdAt: -1 });

    // Calculate statistics
    const stats = {
      totalTransactions: transactions.length,
      totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
      byStatus: {},
      byType: {},
      byDay: {}
    };

    transactions.forEach(t => {
      // By status
      stats.byStatus[t.status] = (stats.byStatus[t.status] || 0) + 1;

      // By type
      stats.byType[t.type] = (stats.byType[t.type] || 0) + t.amount;

      // By day
      const day = t.createdAt.toISOString().split('T')[0];
      stats.byDay[day] = (stats.byDay[day] || 0) + t.amount;
    });

    if (format === 'json') {
      res.json({
        success: true,
        data: {
          transactions,
          statistics: stats
        }
      });
    } else {
      // For CSV or other formats, you'd implement accordingly
      res.status(400).json({
        success: false,
        message: 'Format not supported yet'
      });
    }
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate report'
    });
  }
};

const userCanAccessTransaction = (transaction, user) => {
  if (!transaction || !user) return false;
  if (['employee', 'admin', 'superadmin'].includes(user.role)) return true;

  return (
    transaction.fromAccountId?.userId?.toString() === user._id.toString() ||
    transaction.toAccountId?.userId?.toString() === user._id.toString()
  );
};

const buildReceiptPayload = (transaction) => ({
  receiptNumber: transaction.reference || transaction.id || String(transaction._id),
  transactionId: String(transaction._id),
  date: transaction.createdAt,
  status: transaction.status,
  type: transaction.type,
  amount: Number(transaction.amount || 0),
  formattedAmount: formatCurrency(Number(transaction.amount || 0)),
  fee: Number(transaction.fee || 0),
  formattedFee: formatCurrency(Number(transaction.fee || 0)),
  description: transaction.description || '',
  category: transaction.category || 'other',
  fromAccount: transaction.fromAccountId ? {
    id: String(transaction.fromAccountId._id),
    accountNumber: transaction.fromAccountId.accountNumber,
    accountType: transaction.fromAccountId.accountType,
  } : null,
  toAccount: transaction.toAccountId ? {
    id: String(transaction.toAccountId._id),
    accountNumber: transaction.toAccountId.accountNumber,
    accountType: transaction.toAccountId.accountType,
  } : null,
  balanceAfter: transaction.balanceAfter || {},
});

const buildReceiptText = (receipt) => [
  'SMART BANK TRANSACTION RECEIPT',
  '--------------------------------',
  `Receipt No: ${receipt.receiptNumber}`,
  `Date: ${new Date(receipt.date).toLocaleString()}`,
  `Status: ${receipt.status}`,
  `Type: ${receipt.type}`,
  `Amount: ${receipt.formattedAmount}`,
  `Fee: ${receipt.formattedFee}`,
  `From: ${receipt.fromAccount?.accountNumber || 'N/A'} (${receipt.fromAccount?.accountType || 'N/A'})`,
  `To: ${receipt.toAccount?.accountNumber || 'N/A'} (${receipt.toAccount?.accountType || 'N/A'})`,
  `Description: ${receipt.description || 'N/A'}`,
  '--------------------------------',
  'This receipt was generated by Smart Bank.',
  '',
].join('\n');

// @desc    Generate transaction receipt
// @route   GET /api/transactions/:transactionId/receipt
// @access  Private
exports.getTransactionReceipt = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.transactionId)
      .populate('fromAccountId', 'accountNumber accountType userId')
      .populate('toAccountId', 'accountNumber accountType userId');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    if (!userCanAccessTransaction(transaction, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to generate this receipt'
      });
    }

    const receipt = buildReceiptPayload(transaction);

    if (req.query.format === 'txt') {
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename=receipt_${receipt.receiptNumber}.txt`);
      return res.send(buildReceiptText(receipt));
    }

    return res.json({
      success: true,
      data: { receipt }
    });
  } catch (error) {
    console.error('Get transaction receipt error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate receipt'
    });
  }
};
