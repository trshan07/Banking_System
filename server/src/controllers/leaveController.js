const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');

// Create new leave request
exports.createLeaveRequest = async (req, res) => {
  try {
    const {
      leaveType,
      startDate,
      endDate,
      reason,
      priority,
      emergencyContact,
      backupArrangement
    } = req.body;

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      return res.status(400).json({
        success: false,
        error: 'Start date cannot be after end date'
      });
    }

    // Check for overlapping leaves
    const overlapping = await LeaveRequest.checkOverlappingLeaves(
      req.userId,
      start,
      end
    );

    if (overlapping.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'You already have a leave request for this period',
        overlapping: overlapping.map(l => ({
          requestId: l.requestId,
          startDate: l.startDate,
          endDate: l.endDate,
          status: l.status
        }))
      });
    }

    // Get employee details
    const employee = await User.findById(req.userId);
    
    // Calculate leave balance (simplified - you can implement actual balance logic)
    const leaveBalance = {
      annual: 20, // Default annual leaves
      sick: 10,
      casual: 5,
      used: {
        annual: 0,
        sick: 0,
        casual: 0
      }
    };

    const leaveRequest = new LeaveRequest({
      employeeId: req.userId,
      employeeName: employee.name,
      employeeEmail: employee.email,
      employeeDepartment: employee.department || 'operations',
      leaveType,
      startDate: start,
      endDate: end,
      reason,
      priority: priority || 'medium',
      emergencyContact,
      backupArrangement,
      leaveBalance,
      createdBy: req.userId
    });

    await leaveRequest.save();

    res.status(201).json({
      success: true,
      message: 'Leave request submitted successfully',
      data: leaveRequest
    });
  } catch (error) {
    console.error('Error creating leave request:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get leave balance for current user
exports.getLeaveBalance = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get current year
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31);
    
    // Get all approved leaves for the year
    const approvedLeaves = await LeaveRequest.find({
      employeeId: userId,
      finalStatus: 'approved',
      startDate: { $gte: startOfYear, $lte: endOfYear }
    });
    
    // Calculate used days by type
    const usedAnnual = approvedLeaves.filter(l => l.leaveType === 'annual').reduce((sum, l) => sum + l.totalDays, 0);
    const usedSick = approvedLeaves.filter(l => l.leaveType === 'sick').reduce((sum, l) => sum + l.totalDays, 0);
    const usedPersonal = approvedLeaves.filter(l => l.leaveType === 'personal').reduce((sum, l) => sum + l.totalDays, 0);
    const usedCasual = approvedLeaves.filter(l => l.leaveType === 'casual').reduce((sum, l) => sum + l.totalDays, 0);
    const usedStudy = approvedLeaves.filter(l => l.leaveType === 'study').reduce((sum, l) => sum + l.totalDays, 0);
    const usedMaternity = approvedLeaves.filter(l => l.leaveType === 'maternity').reduce((sum, l) => sum + l.totalDays, 0);
    const usedPaternity = approvedLeaves.filter(l => l.leaveType === 'paternity').reduce((sum, l) => sum + l.totalDays, 0);
    const usedBereavement = approvedLeaves.filter(l => l.leaveType === 'bereavement').reduce((sum, l) => sum + l.totalDays, 0);
    const usedUnpaid = approvedLeaves.filter(l => l.leaveType === 'unpaid').reduce((sum, l) => sum + l.totalDays, 0);
    
    // Get pending leaves
    const pendingLeaves = await LeaveRequest.find({
      employeeId: userId,
      finalStatus: 'pending'
    });
    
    const pendingAnnual = pendingLeaves.filter(l => l.leaveType === 'annual').reduce((sum, l) => sum + l.totalDays, 0);
    const pendingPersonal = pendingLeaves.filter(l => l.leaveType === 'personal').reduce((sum, l) => sum + l.totalDays, 0);
    const pendingSick = pendingLeaves.filter(l => l.leaveType === 'sick').reduce((sum, l) => sum + l.totalDays, 0);
    
    // Default leave entitlements (can be fetched from company policy)
    const entitlements = {
      annual: 18,
      sick: 12,
      personal: 6,
      casual: 5,
      study: 10,
      maternity: 84,
      paternity: 10,
      bereavement: 5,
      unpaid: 30
    };
    
    res.json({
      success: true,
      data: {
        annual: { 
          total: entitlements.annual, 
          used: usedAnnual, 
          remaining: Math.max(0, entitlements.annual - usedAnnual), 
          pending: pendingAnnual 
        },
        sick: { 
          total: entitlements.sick, 
          used: usedSick, 
          remaining: Math.max(0, entitlements.sick - usedSick), 
          pending: pendingSick 
        },
        personal: { 
          total: entitlements.personal, 
          used: usedPersonal, 
          remaining: Math.max(0, entitlements.personal - usedPersonal), 
          pending: pendingPersonal 
        },
        casual: { 
          total: entitlements.casual, 
          used: usedCasual, 
          remaining: Math.max(0, entitlements.casual - usedCasual), 
          pending: 0 
        },
        study: { 
          total: entitlements.study, 
          used: usedStudy, 
          remaining: Math.max(0, entitlements.study - usedStudy), 
          pending: 0 
        },
        maternity: { 
          total: entitlements.maternity, 
          used: usedMaternity, 
          remaining: Math.max(0, entitlements.maternity - usedMaternity), 
          pending: 0 
        },
        paternity: { 
          total: entitlements.paternity, 
          used: usedPaternity, 
          remaining: Math.max(0, entitlements.paternity - usedPaternity), 
          pending: 0 
        },
        bereavement: { 
          total: entitlements.bereavement, 
          used: usedBereavement, 
          remaining: Math.max(0, entitlements.bereavement - usedBereavement), 
          pending: 0 
        },
        unpaid: { 
          total: entitlements.unpaid, 
          used: usedUnpaid, 
          remaining: Math.max(0, entitlements.unpaid - usedUnpaid), 
          pending: 0 
        }
      }
    });
  } catch (error) {
    console.error('Error getting leave balance:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Get pending approvals (for managers)
exports.getPendingApprovals = async (req, res) => {
  try {
    const { department } = req.query;
    
    let query = { 
      finalStatus: 'pending',
      status: 'pending'
    };
    
    // Filter by department if specified
    if (department && department !== 'all') {
      query.employeeDepartment = department;
    }
    
    // If user is not admin/superadmin, only show their department
    if (req.user.role === 'hr' && !department) {
      query.employeeDepartment = req.user.department;
    }
    
    const pendingRequests = await LeaveRequest.find(query)
      .populate('employeeId', 'name email department avatar')
      .sort({ createdAt: -1 });
    
    const formattedRequests = pendingRequests.map(req => ({
      id: req._id,
      _id: req._id,
      requestId: req.requestId,
      employee: req.employeeId?.name || req.employeeName,
      employeeName: req.employeeId?.name || req.employeeName,
      employeeId: req.employeeId?._id || req.employeeId,
      department: req.employeeDepartment,
      type: req.leaveType,
      leaveType: req.leaveType,
      fromDate: req.startDate,
      toDate: req.endDate,
      days: req.totalDays,
      totalDays: req.totalDays,
      reason: req.reason,
      appliedOn: req.createdAt,
      createdAt: req.createdAt,
      attachments: req.attachments || [],
      avatar: req.employeeId?.avatar || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 60) + 1}.jpg`,
      conflict: false // You can implement actual conflict detection
    }));
    
    res.json({
      success: true,
      data: formattedRequests
    });
  } catch (error) {
    console.error('Error getting pending approvals:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Get all leave requests (with filters)
exports.getLeaveRequests = async (req, res) => {
  try {
    const {
      status,
      leaveType,
      employeeId,
      department,
      startDate,
      endDate,
      page = 1,
      limit = 20
    } = req.query;

    let query = { isActive: true };

    // Role-based filtering
    if (req.user.role === 'employee') {
      // Employees can only see their own requests
      query.employeeId = req.userId;
    } else if (req.user.role === 'admin' || req.user.role === 'superadmin') {
      // Admins can see all, but can filter by department
      if (department) {
        query.employeeDepartment = department;
      }
      if (employeeId) {
        query.employeeId = employeeId;
      }
    } else if (req.user.role === 'hr') {
      // HR can see all requests
      if (department) {
        query.employeeDepartment = department;
      }
    }

    // Apply filters
    if (status && status !== 'all') {
      query.finalStatus = status;
    }
    
    if (leaveType && leaveType !== 'all') {
      query.leaveType = leaveType;
    }
    
    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) query.startDate.$gte = new Date(startDate);
      if (endDate) query.startDate.$lte = new Date(endDate);
    }

    const leaveRequests = await LeaveRequest.find(query)
      .populate('employeeId', 'name email department')
      .populate('decision.madeBy', 'name email')
      .populate('approvalFlow.firstLevel.approvedBy', 'name')
      .populate('approvalFlow.secondLevel.approvedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await LeaveRequest.countDocuments(query);

    res.json({
      success: true,
      data: {
        leaveRequests,
        pagination: {
          total,
          totalPages: Math.ceil(total / limit),
          currentPage: parseInt(page),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error getting leave requests:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get my leave requests (shortcut for employees)
exports.getMyLeaveRequests = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    let query = { 
      employeeId: req.userId,
      isActive: true 
    };
    
    if (status && status !== 'all') {
      query.finalStatus = status;
    }
    
    const leaveRequests = await LeaveRequest.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await LeaveRequest.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        leaveRequests,
        pagination: {
          total,
          totalPages: Math.ceil(total / limit),
          currentPage: parseInt(page),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error getting my leave requests:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get single leave request
exports.getLeaveRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const leaveRequest = await LeaveRequest.findById(id)
      .populate('employeeId', 'name email department phoneNumber')
      .populate('decision.madeBy', 'name email')
      .populate('backupArrangement.employeeId', 'name email');
    
    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        error: 'Leave request not found'
      });
    }

    // Check permissions
    if (req.user.role === 'employee' && leaveRequest.employeeId._id.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: leaveRequest
    });
  } catch (error) {
    console.error('Error getting leave request:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update leave request (only if pending)
exports.updateLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const leaveRequest = await LeaveRequest.findById(id);
    
    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        error: 'Leave request not found'
      });
    }
    
    // Only allow updates if status is pending
    if (leaveRequest.finalStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        error: `Cannot update leave request with status: ${leaveRequest.finalStatus}`
      });
    }
    
    // Check permissions
    if (req.user.role === 'employee' && leaveRequest.employeeId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }
    
    // Allowed updates
    const allowedUpdates = ['leaveType', 'startDate', 'endDate', 'reason', 'priority', 'emergencyContact'];
    const updateData = {};
    
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        updateData[field] = updates[field];
      }
    });
    
    // Recalculate total days if dates changed
    if (updateData.startDate || updateData.endDate) {
      const start = updateData.startDate || leaveRequest.startDate;
      const end = updateData.endDate || leaveRequest.endDate;
      const diffTime = Math.abs(new Date(end) - new Date(start));
      updateData.totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }
    
    const updatedRequest = await LeaveRequest.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Leave request updated successfully',
      data: updatedRequest
    });
  } catch (error) {
    console.error('Error updating leave request:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Cancel leave request
exports.cancelLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    
    const leaveRequest = await LeaveRequest.findById(id);
    
    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        error: 'Leave request not found'
      });
    }
    
    // Only pending or approved leaves can be cancelled
    if (!['pending', 'approved'].includes(leaveRequest.finalStatus)) {
      return res.status(400).json({
        success: false,
        error: `Cannot cancel leave request with status: ${leaveRequest.finalStatus}`
      });
    }
    
    leaveRequest.finalStatus = 'cancelled';
    leaveRequest.status = 'cancelled';
    leaveRequest.updatedAt = Date.now();
    await leaveRequest.save();
    
    res.json({
      success: true,
      message: 'Leave request cancelled successfully',
      data: leaveRequest
    });
  } catch (error) {
    console.error('Error cancelling leave request:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Approve leave request (with multi-level approval)
exports.approveLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { comments, level } = req.body;
    
    const leaveRequest = await LeaveRequest.findById(id);
    
    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        error: 'Leave request not found'
      });
    }
    
    if (leaveRequest.finalStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        error: `Cannot approve leave request with status: ${leaveRequest.finalStatus}`
      });
    }
    
    const approvalLevel = level || 'firstLevel';
    
    if (approvalLevel === 'firstLevel') {
      leaveRequest.approvalFlow.firstLevel = {
        approvedBy: req.userId,
        approvedByName: req.user.name,
        approvedAt: new Date(),
        status: 'approved',
        comments: comments || ''
      };
      leaveRequest.status = 'approved';
      
      // If no second level required, mark as fully approved
      if (leaveRequest.leaveType === 'annual' && leaveRequest.totalDays > 5) {
        // Needs second level approval
        leaveRequest.approvalFlow.secondLevel.status = 'pending';
      } else {
        leaveRequest.finalStatus = 'approved';
        leaveRequest.decision = {
          madeBy: req.userId,
          madeByName: req.user.name,
          madeAt: new Date(),
          comments: comments || ''
        };
      }
    } else if (approvalLevel === 'secondLevel') {
      leaveRequest.approvalFlow.secondLevel = {
        approvedBy: req.userId,
        approvedByName: req.user.name,
        approvedAt: new Date(),
        status: 'approved',
        comments: comments || ''
      };
      leaveRequest.finalStatus = 'approved';
      leaveRequest.decision = {
        madeBy: req.userId,
        madeByName: req.user.name,
        madeAt: new Date(),
        comments: comments || ''
      };
    }
    
    await leaveRequest.save();
    
    res.json({
      success: true,
      message: `Leave request ${approvalLevel === 'firstLevel' ? 'initially' : 'fully'} approved`,
      data: leaveRequest
    });
  } catch (error) {
    console.error('Error approving leave request:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Reject leave request
exports.rejectLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, comments } = req.body;
    
    if (!reason) {
      return res.status(400).json({
        success: false,
        error: 'Rejection reason is required'
      });
    }
    
    const leaveRequest = await LeaveRequest.findById(id);
    
    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        error: 'Leave request not found'
      });
    }
    
    leaveRequest.finalStatus = 'rejected';
    leaveRequest.status = 'rejected';
    leaveRequest.decision = {
      madeBy: req.userId,
      madeByName: req.user.name,
      madeAt: new Date(),
      comments: comments || '',
      rejectionReason: reason
    };
    
    await leaveRequest.save();
    
    res.json({
      success: true,
      message: 'Leave request rejected',
      data: leaveRequest
    });
  } catch (error) {
    console.error('Error rejecting leave request:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get leave statistics
exports.getLeaveStatistics = async (req, res) => {
  try {
    const { year, department } = req.query;
    const targetYear = parseInt(year) || new Date().getFullYear();
    
    const startDate = new Date(targetYear, 0, 1);
    const endDate = new Date(targetYear, 11, 31);
    
    let query = {
      createdAt: { $gte: startDate, $lte: endDate },
      isActive: true
    };
    
    if (department && department !== 'all') {
      query.employeeDepartment = department;
    }
    
    if (req.user.role === 'employee') {
      query.employeeId = req.userId;
    }
    
    const statistics = await LeaveRequest.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            status: '$finalStatus',
            leaveType: '$leaveType',
            month: { $month: '$startDate' }
          },
          count: { $sum: 1 },
          totalDays: { $sum: '$totalDays' }
        }
      }
    ]);
    
    // Get pending approvals count
    const pendingApprovals = await LeaveRequest.countDocuments({
      finalStatus: 'pending',
      ...(department && department !== 'all' ? { employeeDepartment: department } : {})
    });
    
    // Get approved leaves summary
    const approvedLeaves = await LeaveRequest.aggregate([
      { $match: { ...query, finalStatus: 'approved' } },
      {
        $group: {
          _id: '$leaveType',
          totalDays: { $sum: '$totalDays' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        year: targetYear,
        pendingApprovals,
        statistics,
        summary: {
          totalApprovedLeaves: approvedLeaves.reduce((sum, l) => sum + l.count, 0),
          totalApprovedDays: approvedLeaves.reduce((sum, l) => sum + l.totalDays, 0),
          byType: approvedLeaves
        }
      }
    });
  } catch (error) {
    console.error('Error getting leave statistics:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};