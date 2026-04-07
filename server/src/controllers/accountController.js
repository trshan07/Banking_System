// src/controllers/accountController.js
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

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
          { label: 'Account Balance', value: `$${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, change: `${accounts.length} account${accounts.length === 1 ? '' : 's'}` },
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
    const { accountType, initialDeposit = 0, currency = 'USD' } = req.body;

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
    const accountNumber = 'ACC' + Date.now() + Math.floor(Math.random() * 1000);

    const account = new Account({
      id: 'acc_' + Date.now(),
      accountNumber,
      accountType,
      balance: initialDeposit,
      currency,
      userId: req.user._id,
      status: 'active'
    });

    await account.save();

    // If initial deposit > 0, create transaction record
    if (initialDeposit > 0) {
      const transaction = new Transaction({
        id: 'txn_' + Date.now(),
        fromAccountId: account._id,
        toAccountId: account._id,
        amount: initialDeposit,
        type: 'deposit',
        status: 'completed',
        description: 'Initial deposit',
        reference: 'DEP' + Date.now(),
        balanceAfter: {
          fromAccount: initialDeposit,
          toAccount: initialDeposit
        }
      });
      await transaction.save();
    }

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
  try {
    const {
      fromAccountId,
      toAccountId,
      amount,
      description = '',
      transferType = 'own',       // 'own' | 'internal' | 'external'
      beneficiaryName,
      beneficiaryAccountNumber,
      beneficiaryBank
    } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }

    // Get source account (must belong to logged-in user)
    const fromAccount = await Account.findOne({
      _id: fromAccountId,
      userId: req.user._id,
      status: 'active'
    });

    if (!fromAccount) {
      return res.status(404).json({
        success: false,
        message: 'Source account not found or inactive'
      });
    }

    // Check sufficient balance
    if (fromAccount.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    // Check daily limit
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayTransactions = await Transaction.find({
      fromAccountId: fromAccount._id,
      createdAt: { $gte: todayStart },
      status: 'completed'
    });

    const todayTotal = todayTransactions.reduce((sum, t) => sum + t.amount, 0);

    if (todayTotal + amount > (fromAccount.dailyTransactionLimit || 10000)) {
      return res.status(400).json({
        success: false,
        message: `Daily transaction limit of $${fromAccount.dailyTransactionLimit || 10000} exceeded`
      });
    }

    const ts = Date.now();
    let toAccount = null;
    let transactionData = {
      id: 'txn_' + ts,
      fromAccountId: fromAccount._id,
      amount,
      type: 'transfer',
      status: 'completed',
      description,
      reference: 'TFR' + ts + Math.floor(Math.random() * 1000),
      category: 'transfer',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      metadata: new Map()
    };

    // Handle based on transfer type
    if (transferType === 'own' || transferType === 'internal') {
      // Internal transfer: destination must be a valid Smart Bank account
      if (!toAccountId) {
        return res.status(400).json({
          success: false,
          message: 'Destination account is required for internal transfers'
        });
      }

      toAccount = await Account.findOne({
        _id: toAccountId,
        status: 'active'
      });

      if (!toAccount) {
        return res.status(404).json({
          success: false,
          message: 'Destination account not found or inactive'
        });
      }

      // Prevent self-transfer to same account
      if (fromAccount._id.toString() === toAccount._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Cannot transfer to the same account'
        });
      }

      // Credit destination account
      toAccount.balance += amount;
      await toAccount.save();

      transactionData.toAccountId = toAccount._id;
      transactionData.balanceAfter = {
        fromAccount: fromAccount.balance - amount,
        toAccount: toAccount.balance
      };

    } else if (transferType === 'external') {
      // External transfer: requires beneficiary details
      if (!beneficiaryName || !beneficiaryAccountNumber || !beneficiaryBank) {
        return res.status(400).json({
          success: false,
          message: 'Beneficiary name, account number, and bank are required for external transfers'
        });
      }

      // For external transfers, use source account as toAccountId (self-reference for record keeping)
      transactionData.toAccountId = fromAccount._id;
      transactionData.description = description || `External transfer to ${beneficiaryName}`;
      transactionData.metadata.set('beneficiaryName', beneficiaryName);
      transactionData.metadata.set('beneficiaryAccountNumber', beneficiaryAccountNumber);
      transactionData.metadata.set('beneficiaryBank', beneficiaryBank);
      transactionData.metadata.set('transferType', 'external');
      transactionData.balanceAfter = {
        fromAccount: fromAccount.balance - amount,
        toAccount: 0
      };

    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid transfer type. Use: own, internal, or external'
      });
    }

    // Debit source account
    fromAccount.balance -= amount;
    await fromAccount.save();

    // Create transaction record
    const transaction = await Transaction.collection.insertOne({
      ...transactionData,
      metadata: Object.fromEntries(transactionData.metadata),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Fetch the saved transaction for the response
    const savedTransaction = await Transaction.findById(transaction.insertedId);

    res.json({
      success: true,
      message: transferType === 'external'
        ? `Transfer to ${beneficiaryName} at ${beneficiaryBank} completed successfully`
        : 'Transfer completed successfully',
      data: {
        transaction: savedTransaction,
        fromAccountBalance: fromAccount.balance,
        toAccountBalance: toAccount?.balance || null
      }
    });
  } catch (error) {
    console.error('Transfer money error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete transfer'
    });
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