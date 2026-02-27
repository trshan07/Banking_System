// src/controllers/savingsController.js
const SavingsGoal = require('../models/SavingsGoal');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

// @desc    Get user savings goals
// @route   GET /api/savings/goals
// @access  Private
exports.getUserGoals = async (req, res) => {
  try {
    const goals = await SavingsGoal.find({ 
      userId: req.user._id,
      status: { $ne: 'cancelled' }
    }).sort({ deadline: 1 });

    res.json({
      success: true,
      data: goals
    });
  } catch (error) {
    console.error('Get user goals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get savings goals'
    });
  }
};

// @desc    Get goal details
// @route   GET /api/savings/goals/:goalId
// @access  Private
exports.getGoalDetails = async (req, res) => {
  try {
    const goal = await SavingsGoal.findOne({
      _id: req.params.goalId,
      userId: req.user._id
    }).populate('contributions.transactionId');

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Savings goal not found'
      });
    }

    res.json({
      success: true,
      data: goal
    });
  } catch (error) {
    console.error('Get goal details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get goal details'
    });
  }
};

// @desc    Create savings goal
// @route   POST /api/savings/goals
// @access  Private
exports.createGoal = async (req, res) => {
  try {
    const { 
      goalName, 
      targetAmount, 
      deadline, 
      category = 'other',
      notes 
    } = req.body;

    // Validate deadline is in the future
    if (new Date(deadline) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Deadline must be in the future'
      });
    }

    const goal = new SavingsGoal({
      id: 'goal_' + Date.now(),
      userId: req.user._id,
      goalName,
      targetAmount,
      deadline,
      category,
      notes,
      currentAmount: 0,
      status: 'active'
    });

    await goal.save();

    res.status(201).json({
      success: true,
      message: 'Savings goal created successfully',
      data: goal
    });
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create savings goal'
    });
  }
};

// @desc    Update goal progress
// @route   PUT /api/savings/goals/:goalId/progress
// @access  Private
exports.updateProgress = async (req, res) => {
  const session = await Account.startSession();
  session.startTransaction();

  try {
    const { goalId } = req.params;
    const { amount, accountId, note } = req.body;

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }

    const goal = await SavingsGoal.findOne({
      _id: goalId,
      userId: req.user._id,
      status: 'active'
    }).session(session);

    if (!goal) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Active savings goal not found'
      });
    }

    // Check if goal would be exceeded
    if (goal.currentAmount + amount > goal.targetAmount) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `This contribution would exceed your target amount by $${(goal.currentAmount + amount) - goal.targetAmount}`
      });
    }

    // Get source account
    const account = await Account.findOne({
      _id: accountId,
      userId: req.user._id,
      status: 'active'
    }).session(session);

    if (!account) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Source account not found or inactive'
      });
    }

    // Check sufficient balance
    if (account.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    // Update account balance
    account.balance -= amount;
    await account.save({ session });

    // Create transaction record
    const transaction = new Transaction({
      id: 'txn_' + Date.now(),
      fromAccountId: account._id,
      toAccountId: account._id, // Self-transfer for tracking
      amount,
      type: 'transfer',
      status: 'completed',
      description: `Contribution to savings goal: ${goal.goalName}`,
      reference: 'SAV' + Date.now(),
      category: 'savings',
      balanceAfter: {
        fromAccount: account.balance,
        toAccount: account.balance
      }
    });

    await transaction.save({ session });

    // Update goal
    goal.currentAmount += amount;
    goal.contributions.push({
      amount,
      date: new Date(),
      transactionId: transaction._id,
      note: note || `Contribution of $${amount}`
    });

    // Check if goal is completed
    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = 'completed';
      goal.completedAt = new Date();
    }

    await goal.save({ session });

    await session.commitTransaction();

    res.json({
      success: true,
      message: goal.status === 'completed' 
        ? 'Congratulations! You have reached your savings goal!' 
        : 'Progress updated successfully',
      data: {
        goal,
        transaction,
        newBalance: account.balance
      }
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update progress'
    });
  } finally {
    session.endSession();
  }
};

// @desc    Delete savings goal
// @route   DELETE /api/savings/goals/:goalId
// @access  Private
exports.deleteGoal = async (req, res) => {
  try {
    const goal = await SavingsGoal.findOne({
      _id: req.params.goalId,
      userId: req.user._id
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Savings goal not found'
      });
    }

    // Can only delete if no contributions or goal is not completed
    if (goal.contributions.length > 0 && goal.status !== 'cancelled') {
      goal.status = 'cancelled';
      await goal.save();
      
      return res.json({
        success: true,
        message: 'Savings goal cancelled successfully',
        data: goal
      });
    }

    await goal.deleteOne();

    res.json({
      success: true,
      message: 'Savings goal deleted successfully'
    });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete savings goal'
    });
  }
};

// @desc    Get savings accounts
// @route   GET /api/savings/accounts
// @access  Private
exports.getSavingsAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ 
      userId: req.user._id,
      accountType: 'savings'
    });

    res.json({
      success: true,
      data: accounts
    });
  } catch (error) {
    console.error('Get savings accounts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get savings accounts'
    });
  }
};

// @desc    Get savings account details
// @route   GET /api/savings/accounts/:accountId
// @access  Private
exports.getSavingsAccountDetails = async (req, res) => {
  try {
    const account = await Account.findOne({
      _id: req.params.accountId,
      userId: req.user._id,
      accountType: 'savings'
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Savings account not found'
      });
    }

    // Get interest projections
    const monthlyRate = account.interestRate / 100 / 12;
    const yearlyProjection = account.balance * Math.pow(1 + monthlyRate, 12);

    res.json({
      success: true,
      data: {
        ...account.toObject(),
        projections: {
          oneYear: yearlyProjection,
          fiveYear: account.balance * Math.pow(1 + monthlyRate, 60),
          tenYear: account.balance * Math.pow(1 + monthlyRate, 120)
        }
      }
    });
  } catch (error) {
    console.error('Get savings account details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get account details'
    });
  }
};

// @desc    Deposit to savings account
// @route   POST /api/savings/accounts/:accountId/deposit
// @access  Private
exports.depositToSavings = async (req, res) => {
  const session = await Account.startSession();
  session.startTransaction();

  try {
    const { accountId } = req.params;
    const { amount, fromAccountId } = req.body;

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }

    // Get savings account
    const savingsAccount = await Account.findOne({
      _id: accountId,
      userId: req.user._id,
      accountType: 'savings'
    }).session(session);

    if (!savingsAccount) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Savings account not found'
      });
    }

    // Get source account
    const sourceAccount = await Account.findOne({
      _id: fromAccountId,
      userId: req.user._id,
      status: 'active'
    }).session(session);

    if (!sourceAccount) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Source account not found'
      });
    }

    // Check sufficient balance
    if (sourceAccount.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    // Update balances
    sourceAccount.balance -= amount;
    savingsAccount.balance += amount;

    await sourceAccount.save({ session });
    await savingsAccount.save({ session });

    // Create transaction
    const transaction = new Transaction({
      id: 'txn_' + Date.now(),
      fromAccountId: sourceAccount._id,
      toAccountId: savingsAccount._id,
      amount,
      type: 'transfer',
      status: 'completed',
      description: 'Transfer to savings account',
      reference: 'SAV' + Date.now(),
      category: 'savings',
      balanceAfter: {
        fromAccount: sourceAccount.balance,
        toAccount: savingsAccount.balance
      }
    });

    await transaction.save({ session });
    await session.commitTransaction();

    res.json({
      success: true,
      message: 'Deposit to savings account successful',
      data: {
        transaction,
        savingsBalance: savingsAccount.balance,
        sourceBalance: sourceAccount.balance
      }
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Deposit to savings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deposit to savings account'
    });
  } finally {
    session.endSession();
  }
};

// @desc    Withdraw from savings account
// @route   POST /api/savings/accounts/:accountId/withdraw
// @access  Private
exports.withdrawFromSavings = async (req, res) => {
  const session = await Account.startSession();
  session.startTransaction();

  try {
    const { accountId } = req.params;
    const { amount, toAccountId } = req.body;

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }

    // Get savings account
    const savingsAccount = await Account.findOne({
      _id: accountId,
      userId: req.user._id,
      accountType: 'savings'
    }).session(session);

    if (!savingsAccount) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Savings account not found'
      });
    }

    // Check sufficient balance
    if (savingsAccount.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    // Get destination account
    const destAccount = await Account.findOne({
      _id: toAccountId,
      userId: req.user._id,
      status: 'active'
    }).session(session);

    if (!destAccount) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Destination account not found'
      });
    }

    // Update balances
    savingsAccount.balance -= amount;
    destAccount.balance += amount;

    await savingsAccount.save({ session });
    await destAccount.save({ session });

    // Create transaction
    const transaction = new Transaction({
      id: 'txn_' + Date.now(),
      fromAccountId: savingsAccount._id,
      toAccountId: destAccount._id,
      amount,
      type: 'transfer',
      status: 'completed',
      description: 'Withdrawal from savings account',
      reference: 'SAVW' + Date.now(),
      category: 'savings',
      balanceAfter: {
        fromAccount: savingsAccount.balance,
        toAccount: destAccount.balance
      }
    });

    await transaction.save({ session });
    await session.commitTransaction();

    res.json({
      success: true,
      message: 'Withdrawal from savings account successful',
      data: {
        transaction,
        savingsBalance: savingsAccount.balance,
        destBalance: destAccount.balance
      }
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Withdraw from savings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to withdraw from savings account'
    });
  } finally {
    session.endSession();
  }
};