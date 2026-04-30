// backend/src/controllers/bankingController.js
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Alert = require('../models/Alert');

// @desc    Get all user accounts
// @route   GET /api/banking/accounts
// @access  Private
exports.getAccounts = async (req, res) => {
  try {
    const userId = req.user.id;
    const accounts = await Account.find({ userId }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: accounts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching accounts',
      error: error.message
    });
  }
};

// @desc    Create new account
// @route   POST /api/banking/accounts
// @access  Private
exports.createAccount = async (req, res) => {
  try {
    const { accountType, initialDeposit = 0, currency = 'LKR' } = req.body;
    const userId = req.user.id;
    
    // Check if user already has this type of account
    const existingAccount = await Account.findOne({ userId, accountType });
    if (existingAccount) {
      return res.status(400).json({
        success: false,
        message: `You already have a ${accountType} account`
      });
    }
    
    // Generate unique account number
    const accountNumber = 'ACC' + Date.now() + Math.floor(Math.random() * 10000);
    
    const account = new Account({
      userId,
      accountNumber,
      accountType,
      balance: initialDeposit,
      currency,
      status: 'active'
    });
    
    await account.save();
    
    // Create initial deposit transaction if any
    if (initialDeposit > 0) {
      const transaction = new Transaction({
        toAccountId: account._id,
        toUserId: userId,
        amount: initialDeposit,
        type: 'deposit',
        status: 'completed',
        description: 'Initial account deposit',
        reference: `INIT_${Date.now()}`
      });
      await transaction.save();
      
      // Create alert for successful account creation
      await Alert.create({
        userId,
        type: 'general',
        title: 'Account Created',
        message: `Your ${accountType} account (${accountNumber}) has been created with LKR ${Number(initialDeposit).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} initial deposit`,
        severity: 'low'
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: account
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error creating account',
      error: error.message
    });
  }
};

// @desc    Get account details
// @route   GET /api/banking/accounts/:accountId
// @access  Private
exports.getAccountDetails = async (req, res) => {
  try {
    const { accountId } = req.params;
    const userId = req.user.id;
    
    const account = await Account.findOne({ _id: accountId, userId });
    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }
    
    // Get recent transactions for this account
    const transactions = await Transaction.find({
      $or: [{ fromAccountId: accountId }, { toAccountId: accountId }]
    })
    .sort({ createdAt: -1 })
    .limit(20);
    
    res.json({
      success: true,
      data: { account, transactions }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching account details',
      error: error.message
    });
  }
};

// @desc    Transfer funds
// @route   POST /api/banking/transfer
// @access  Private
exports.transferFunds = async (req, res) => {
  try {
    const { 
      fromAccountId, 
      toAccountNumber, 
      amount, 
      description,
      isRecurring = false,
      recurringFrequency = null
    } = req.body;
    
    const userId = req.user.id;
    
    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }
    
    // Validate source account
    const fromAccount = await Account.findOne({ _id: fromAccountId, userId });
    if (!fromAccount) {
      return res.status(404).json({
        success: false,
        message: 'Source account not found'
      });
    }
    
    if (fromAccount.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Source account is not active'
      });
    }
    
    if (fromAccount.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance',
        data: { availableBalance: fromAccount.balance }
      });
    }
    
    // Validate destination account
    const toAccount = await Account.findOne({ accountNumber: toAccountNumber });
    if (!toAccount) {
      return res.status(404).json({
        success: false,
        message: 'Destination account not found'
      });
    }
    
    if (toAccount.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Destination account is not active'
      });
    }
    
    // Check if transferring to self
    const isSelfTransfer = toAccount.userId.toString() === userId;
    
    // Process transfer
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Deduct from source
      fromAccount.balance -= amount;
      await fromAccount.save({ session });
      
      // Add to destination
      toAccount.balance += amount;
      await toAccount.save({ session });
      
      // Create transaction record
      const transaction = new Transaction({
        fromAccountId: fromAccount._id,
        toAccountId: toAccount._id,
        fromUserId: userId,
        toUserId: toAccount.userId,
        amount,
        type: 'transfer',
        status: 'completed',
        description: description || 'Fund transfer',
        reference: `TRF_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        isRecurring,
        recurringFrequency
      });
      
      await transaction.save({ session });
      
      // Create alert for large transactions (> LKR 1,000)
      if (amount > 1000) {
        await Alert.create({
          userId,
          type: 'transaction',
          title: 'Large Transfer Alert',
          message: `A transfer of LKR ${Number(amount).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} was made from your account to ${toAccountNumber}`,
          severity: 'medium'
        });
      }
      
      await session.commitTransaction();
      
      res.json({
        success: true,
        message: 'Transfer successful',
        data: {
          transactionId: transaction._id,
          fromAccountBalance: fromAccount.balance,
          toAccountNumber: toAccount.accountNumber,
          amount,
          timestamp: transaction.createdAt,
          isSelfTransfer
        }
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Transfer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing transfer',
      error: error.message
    });
  }
};

// @desc    Get transaction history with filters
// @route   GET /api/banking/transactions
// @access  Private
exports.getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      page = 1, 
      limit = 20, 
      type, 
      startDate, 
      endDate,
      minAmount,
      maxAmount,
      accountId 
    } = req.query;
    
    let query = {
      $or: [{ fromUserId: userId }, { toUserId: userId }]
    };
    
    // Apply filters
    if (type && type !== 'all') {
      query.type = type;
    }
    
    if (accountId) {
      query.$or = [
        { fromAccountId: accountId },
        { toAccountId: accountId }
      ];
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = parseFloat(minAmount);
      if (maxAmount) query.amount.$lte = parseFloat(maxAmount);
    }
    
    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('fromAccountId toAccountId', 'accountNumber accountType');
    
    const total = await Transaction.countDocuments(query);
    
    // Calculate summary
    const summary = await Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalSent: {
            $sum: {
              $cond: [{ $eq: ["$fromUserId", mongoose.Types.ObjectId(userId)] }, "$amount", 0]
            }
          },
          totalReceived: {
            $sum: {
              $cond: [{ $eq: ["$toUserId", mongoose.Types.ObjectId(userId)] }, "$amount", 0]
            }
          },
          totalTransactions: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: transactions,
      summary: summary[0] || { totalSent: 0, totalReceived: 0, totalTransactions: 0 },
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
      message: 'Error fetching transactions',
      error: error.message
    });
  }
};

// @desc    Download transaction statement
// @route   GET /api/banking/transactions/download
// @access  Private
exports.downloadStatement = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, format = 'csv' } = req.query;
    
    let query = {
      $or: [{ fromUserId: userId }, { toUserId: userId }],
      status: 'completed'
    };
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .populate('fromAccountId toAccountId', 'accountNumber');
    
    if (format === 'csv') {
      // Generate CSV
      const csv = convertToCSV(transactions);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=statement_${Date.now()}.csv`);
      return res.send(csv);
    } else {
      // Return JSON
      res.json({
        success: true,
        data: transactions
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error downloading statement',
      error: error.message
    });
  }
};

// Helper function to convert transactions to CSV
function convertToCSV(transactions) {
  const headers = ['Date', 'Type', 'Amount', 'Description', 'Reference', 'Status'];
  const rows = transactions.map(tx => [
    tx.createdAt.toISOString(),
    tx.type,
    tx.amount,
    tx.description,
    tx.reference,
    tx.status
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
}
