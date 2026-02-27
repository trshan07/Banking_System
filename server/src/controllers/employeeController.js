// src/controllers/employeeController.js
const User = require('../models/User');
const Task = require('../models/Task');
const LeaveRequest = require('../models/LeaveRequest');
const Loan = require('../models/Loan');
const SupportTicket = require('../models/SupportTicket');

// @desc    Get employee dashboard data
// @route   GET /api/employee/dashboard
// @access  Private/Employee
exports.getDashboard = async (req, res) => {
  try {
    // Get pending tasks
    const pendingTasks = await Task.find({
      assignedTo: req.user._id,
      status: { $in: ['pending', 'in_progress'] }
    }).sort({ priority: -1, dueDate: 1 }).limit(10);

    // Get counts
    const taskCount = await Task.countDocuments({
      assignedTo: req.user._id,
      status: { $in: ['pending', 'in_progress'] }
    });

    const pendingLoans = await Loan.countDocuments({ 
      status: 'pending' 
    });

    const openTickets = await SupportTicket.countDocuments({ 
      status: { $in: ['open', 'in_progress'] } 
    });

    // Get recent activity (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const recentTasks = await Task.countDocuments({
      assignedTo: req.user._id,
      updatedAt: { $gte: weekAgo }
    });

    const completedTasks = await Task.countDocuments({
      assignedTo: req.user._id,
      status: 'completed',
      updatedAt: { $gte: weekAgo }
    });

    res.json({
      success: true,
      data: {
        pendingTasks,
        counts: {
          tasks: taskCount,
          pendingLoans,
          openTickets,
          recentTasks,
          completedTasks
        },
        performance: {
          completionRate: recentTasks > 0 ? (completedTasks / recentTasks) * 100 : 0
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard data'
    });
  }
};

// @desc    Get employee tasks
// @route   GET /api/employee/tasks
// @access  Private/Employee
exports.getTasks = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = { assignedTo: req.user._id };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tasks = await Task.find(query)
      .populate('assignedBy', 'firstName lastName email')
      .populate('relatedTo.entityId')
      .sort({ priority: -1, dueDate: 1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(query);

    res.json({
      success: true,
      data: tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get tasks'
    });
  }
};

// @desc    Complete task
// @route   PUT /api/employee/tasks/:taskId/complete
// @access  Private/Employee
exports.completeTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { notes } = req.body;

    const task = await Task.findOne({
      _id: taskId,
      assignedTo: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    task.status = 'completed';
    task.completedAt = new Date();
    if (notes) {
      task.notes = notes;
    }

    await task.save();

    // If task is related to a ticket, update ticket status
    if (task.relatedTo?.entityType === 'ticket' && task.relatedTo.entityId) {
      await SupportTicket.findByIdAndUpdate(task.relatedTo.entityId, {
        status: 'awaiting_reply'
      });
    }

    res.json({
      success: true,
      message: 'Task completed successfully',
      data: task
    });
  } catch (error) {
    console.error('Complete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete task'
    });
  }
};

// @desc    Get employee leave requests
// @route   GET /api/employee/leave-requests
// @access  Private/Employee
exports.getLeaveRequests = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = { employeeId: req.user._id };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const leaveRequests = await LeaveRequest.find(query)
      .populate('approvedBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await LeaveRequest.countDocuments(query);

    // Get leave balance (simplified - you'd have a separate LeaveBalance model)
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31);

    const usedLeave = await LeaveRequest.aggregate([
      {
        $match: {
          employeeId: req.user._id,
          status: 'approved',
          startDate: { $gte: startOfYear },
          endDate: { $lte: endOfYear }
        }
      },
      {
        $group: {
          _id: '$leaveType',
          total: { $sum: '$duration' }
        }
      }
    ]);

    res.json({
      success: true,
      data: leaveRequests,
      leaveBalance: {
        annual: 20 - (usedLeave.find(l => l._id === 'annual')?.total || 0),
        sick: 12 - (usedLeave.find(l => l._id === 'sick')?.total || 0),
        personal: 5 - (usedLeave.find(l => l._id === 'personal')?.total || 0)
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get leave requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get leave requests'
    });
  }
};

// @desc    Create leave request
// @route   POST /api/employee/leave-requests
// @access  Private/Employee
exports.createLeaveRequest = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason, contactDuringLeave } = req.body;

    // Validate dates
    if (new Date(startDate) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Start date must be in the future'
      });
    }

    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    // Check for overlapping requests
    const overlapping = await LeaveRequest.findOne({
      employeeId: req.user._id,
      status: { $in: ['pending', 'approved'] },
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
      ]
    });

    if (overlapping) {
      return res.status(400).json({
        success: false,
        message: 'You already have a leave request during this period'
      });
    }

    const leaveRequest = new LeaveRequest({
      id: 'lr_' + Date.now(),
      employeeId: req.user._id,
      leaveType,
      startDate,
      endDate,
      reason,
      contactDuringLeave,
      status: 'pending'
    });

    await leaveRequest.save();

    // Create task for manager to review
    const managers = await User.find({ 
      role: { $in: ['admin', 'super_admin'] } 
    });

    if (managers.length > 0) {
      const task = new Task({
        id: 'task_' + Date.now(),
        title: `Leave Request: ${leaveType} leave for ${req.user.firstName} ${req.user.lastName}`,
        description: `${reason}\nFrom: ${new Date(startDate).toLocaleDateString()} To: ${new Date(endDate).toLocaleDateString()}`,
        type: 'other',
        priority: 'medium',
        status: 'pending',
        assignedTo: managers[0]._id,
        assignedBy: req.user._id,
        relatedTo: {
          entityType: 'leave',
          entityId: leaveRequest._id
        },
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
      });
      await task.save();
    }

    res.status(201).json({
      success: true,
      message: 'Leave request submitted successfully',
      data: leaveRequest
    });
  } catch (error) {
    console.error('Create leave request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create leave request'
    });
  }
};

// @desc    Update leave request
// @route   PUT /api/employee/leave-requests/:requestId
// @access  Private/Employee
exports.updateLeaveRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { reason, contactDuringLeave } = req.body;

    const leaveRequest = await LeaveRequest.findOne({
      _id: requestId,
      employeeId: req.user._id
    });

    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    if (leaveRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot update request with status: ${leaveRequest.status}`
      });
    }

    if (reason) leaveRequest.reason = reason;
    if (contactDuringLeave) leaveRequest.contactDuringLeave = contactDuringLeave;

    await leaveRequest.save();

    res.json({
      success: true,
      message: 'Leave request updated successfully',
      data: leaveRequest
    });
  } catch (error) {
    console.error('Update leave request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update leave request'
    });
  }
};

// @desc    Get all employees (admin only)
// @route   GET /api/employee/all
// @access  Private/Admin
exports.getAllEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 20, department } = req.query;

    const query = { 
      role: { $in: ['employee', 'admin'] } 
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const employees = await User.find(query)
      .select('-password -__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: employees,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get all employees error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get employees'
    });
  }
};

// @desc    Get employee details (admin only)
// @route   GET /api/employee/:employeeId
// @access  Private/Admin
exports.getEmployeeDetails = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const employee = await User.findOne({
      _id: employeeId,
      role: { $in: ['employee', 'admin'] }
    }).select('-password -__v');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Get employee statistics
    const taskStats = await Task.aggregate([
      { $match: { assignedTo: employee._id } },
      { $group: {
        _id: '$status',
        count: { $sum: 1 }
      }}
    ]);

    const leaveStats = await LeaveRequest.aggregate([
      { $match: { employeeId: employee._id } },
      { $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalDays: { $sum: '$duration' }
      }}
    ]);

    res.json({
      success: true,
      data: {
        ...employee.toObject(),
        statistics: {
          tasks: taskStats,
          leaveRequests: leaveStats
        }
      }
    });
  } catch (error) {
    console.error('Get employee details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get employee details'
    });
  }
};

// @desc    Update employee role (super admin only)
// @route   PUT /api/employee/:employeeId/role
// @access  Private/SuperAdmin
exports.updateEmployeeRole = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { role, permissions } = req.body;

    const employee = await User.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    if (role) employee.role = role;
    if (permissions) employee.permissions = permissions;

    await employee.save();

    res.json({
      success: true,
      message: 'Employee role updated successfully',
      data: {
        id: employee._id,
        email: employee.email,
        role: employee.role,
        permissions: employee.permissions
      }
    });
  } catch (error) {
    console.error('Update employee role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update employee role'
    });
  }
};