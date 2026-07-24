// src/controllers/accountController.js
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');
const crypto = require('crypto');

const normalizeMoney = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  const normalized = Math.round((amount + Number.EPSILON) * 100) / 100;
  if (Math.abs(normalized - amount) > Number.EPSILON * 100) return null;
  return Number.isSafeInteger(Math.round(normalized * 100)) ? normalized : null;
};

// @desc    Get user accounts
// @route   GET /api/accounts
// @access  Private
exports.getUserAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user._id })
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: accounts.length,
      data: accounts
    });
  } catch (error) {
    console.error('Get user accounts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get accounts'
    });
  }
};

// @desc    Get dashboard summary data
// @route   GET /api/accounts/dashboard
// @access  Private
exports.getDashboardData = async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    const accountIds = accounts.map((account) => account._id);
    const transactions = accountIds.length > 0
      ? await Transaction.find({
          $or: [
            { fromAccountId: { $in: accountIds } },
            { toAccountId: { $in: accountIds } }
          ]
        })
          .sort({ createdAt: -1 })
          .limit(10)
      : [];

    const totalBalance = accounts.reduce((sum, account) => sum + (Number(account.balance) || 0), 0);

    res.json({
      success: true,
      data: {
        stats: [
          { label: 'Account Balance', value: new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalBalance), change: `${accounts.length} account${accounts.length === 1 ? '' : 's'}` },
          { label: 'Active Accounts', value: String(accounts.filter((account) => account.status === 'active').length), change: `${accounts.length} total` },
          { label: 'Recent Transactions', value: String(transactions.length), change: 'Last 10 items' },
          { label: 'Support Tickets', value: '0', change: 'No data yet' }
        ],
        accounts,
        transactions,
        alerts: [],
        savingsGoals: []
      }
    });
  } catch (error) {
    console.error('Get dashboard data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard data'
    });
  }
};

// @desc    Get account details
// @route   GET /api/accounts/:accountId
// @access  Private
exports.getAccountDetails = async (req, res) => {
  try {
    const account = await Account.findOne({
      _id: req.params.accountId,
      userId: req.user._id
    }).populate('userId', 'firstName lastName email');

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }

    res.json({
      success: true,
      data: account
    });
  } catch (error) {
    console.error('Get account details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get account details'
    });
  }
};

// @desc    Create new account
// @route   POST /api/accounts
// @access  Private
exports.createAccount = async (req, res) => {
  try {
    const { accountType, initialDeposit = 0, currency = 'LKR' } = req.body;

    if (Number(initialDeposit) !== 0) {
      return res.status(400).json({
        success: false,
        message: 'New accounts must start with a zero balance. Deposits require a verified funding operation.'
      });
    }

    // Check if user already has an account of this type
    const existingAccount = await Account.findOne({
      userId: req.user._id,
      accountType: accountType
    });

    if (existingAccount) {
      return res.status(400).json({
        success: false,
        message: `You already have a ${accountType} account`
      });
    }

    // Generate unique account number
    const accountNumber = `ACC${crypto.randomBytes(9).toString('hex').toUpperCase()}`;

    const account = new Account({
      id: `acc_${crypto.randomUUID()}`,
      accountNumber,
      accountType,
      balance: 0,
      currency,
      userId: req.user._id,
      status: 'active'
    });

    await account.save();

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: account
    });
  } catch (error) {
    console.error('Create account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create account'
    });
  }
};

// @desc    Transfer money between accounts
// @route   POST /api/accounts/transfer
// @access  Private
exports.transferMoney = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const {
      fromAccountId,
      toAccountId,
      amount: requestedAmount,
      description = '',
      transferType = 'own',       // 'own' | 'internal' | 'external'
    } = req.body;

    const transferAmount = normalizeMoney(requestedAmount);

    if (transferAmount === null) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive value with no more than two decimal places'
      });
    }

    if (transferType === 'external') {
      return res.status(501).json({
        success: false,
        message: 'External transfers are disabled until a regulated payment provider is configured'
      });
    }

    if (!['own', 'internal'].includes(transferType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transfer type'
      });
    }

    if (!toAccountId) {
      return res.status(400).json({
        success: false,
        message: 'Destination account is required'
      });
    }

    const suppliedKey = String(req.get('Idempotency-Key') || '').trim();
    if (process.env.NODE_ENV === 'production' && !suppliedKey) {
      return res.status(400).json({
        success: false,
        message: 'Idempotency-Key header is required'
      });
    }
    if (suppliedKey.length > 128) {
      return res.status(400).json({ success: false, message: 'Idempotency-Key is too long' });
    }
    const idempotencyKey = suppliedKey || crypto.randomUUID();
    const transferMinor = Math.round(transferAmount * 100);
    let savedTransaction;
    let fromBalance;
    let toBalance;

    await session.withTransaction(async () => {
      const existing = await Transaction.findOne({
        initiatedBy: req.user._id,
        idempotencyKey
      }).session(session);
      if (existing) {
        savedTransaction = existing;
        return;
      }

      const fromAccount = await Account.findOne({
        _id: fromAccountId,
        userId: req.user._id,
        status: 'active'
      }).session(session);
      const toAccount = await Account.findOne({
        _id: toAccountId,
        ...(transferType === 'own' ? { userId: req.user._id } : {}),
        status: 'active'
      }).session(session);

      if (!fromAccount || !toAccount) {
        const error = new Error('Source or destination account was not found or is inactive');
        error.statusCode = 404;
        throw error;
      }
      if (String(fromAccount._id) === String(toAccount._id)) {
        const error = new Error('Cannot transfer to the same account');
        error.statusCode = 400;
        throw error;
      }
      if (fromAccount.currency !== toAccount.currency) {
        const error = new Error('Cross-currency transfers are not supported');
        error.statusCode = 400;
        throw error;
      }

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const totals = await Transaction.aggregate([
        {
          $match: {
            fromAccountId: fromAccount._id,
            createdAt: { $gte: todayStart },
            type: 'transfer',
            status: 'completed'
          }
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).session(session);
      const todayTotal = totals[0]?.total || 0;
      if (todayTotal + transferAmount > (fromAccount.dailyTransactionLimit || 10000)) {
        const error = new Error('Daily transaction limit exceeded');
        error.statusCode = 400;
        throw error;
      }

      const debit = await Account.findOneAndUpdate(
        { _id: fromAccount._id, status: 'active', balance: { $gte: transferAmount } },
        [{
          $set: {
            balance: {
              $divide: [
                { $subtract: [{ $round: [{ $multiply: ['$balance', 100] }, 0] }, transferMinor] },
                100
              ]
            }
          }
        }],
        { new: true, session, runValidators: true }
      );
      if (!debit) {
        const error = new Error('Insufficient balance');
        error.statusCode = 400;
        throw error;
      }
      const credit = await Account.findOneAndUpdate(
        { _id: toAccount._id, status: 'active' },
        [{
          $set: {
            balance: {
              $divide: [
                { $add: [{ $round: [{ $multiply: ['$balance', 100] }, 0] }, transferMinor] },
                100
              ]
            }
          }
        }],
        { new: true, session, runValidators: true }
      );
      if (!credit) {
        const error = new Error('Destination account became unavailable');
        error.statusCode = 409;
        throw error;
      }

      [savedTransaction] = await Transaction.create([{
        id: `txn_${crypto.randomUUID()}`,
        fromAccountId: debit._id,
        toAccountId: credit._id,
        initiatedBy: req.user._id,
        idempotencyKey,
        amount: transferAmount,
        type: 'transfer',
        status: 'completed',
        description: String(description || '').trim(),
        reference: `TFR${crypto.randomBytes(12).toString('hex').toUpperCase()}`,
        category: 'transfer',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        metadata: { transferType },
        balanceAfter: {
          fromAccount: debit.balance,
          toAccount: credit.balance
        }
      }], { session });
      fromBalance = debit.balance;
      toBalance = credit.balance;
    });

    res.json({
      success: true,
      message: 'Transfer completed successfully',
      data: {
        transaction: savedTransaction,
        fromAccountBalance: fromBalance ?? savedTransaction.balanceAfter?.fromAccount,
        toAccountBalance: toBalance ?? savedTransaction.balanceAfter?.toAccount
      }
    });
  } catch (error) {
    console.error('Transfer money error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : 'Failed to complete transfer'
    });
  } finally {
    await session.endSession();
  }
};

// @desc    Get account transactions
// @route   GET /api/accounts/:accountId/transactions
// @access  Private
exports.getAccountTransactions = async (req, res) => {
  try {
    const { accountId } = req.params;
    const { page = 1, limit = 20, startDate, endDate } = req.query;

    // Verify account belongs to user
    const account = await Account.findOne({
      _id: accountId,
      userId: req.user._id
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }

    // Build query
    const query = {
      $or: [
        { fromAccountId: accountId },
        { toAccountId: accountId }
      ]
    };

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Pagination
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
    console.error('Get account transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transactions'
    });
  }
};

// @desc    Get all accounts (admin only)
// @route   GET /api/accounts/admin/all
// @access  Private/Admin
exports.getAllAccounts = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, type } = req.query;

    const query = {};
    if (status) query.status = status;
    if (type) query.accountType = type;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const accounts = await Account.find(query)
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Account.countDocuments(query);

    res.json({
      success: true,
      data: accounts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get all accounts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get accounts'
    });
  }
};

// @desc    Update account status (admin only)
// @route   PUT /api/accounts/:accountId/status
// @access  Private/Admin
exports.updateAccountStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { accountId } = req.params;

    const account = await Account.findById(accountId);

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }

    account.status = status;
    await account.save();

    res.json({
      success: true,
      message: `Account status updated to ${status}`,
      data: account
    });
  } catch (error) {
    console.error('Update account status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update account status'
    });
  }
};
