const User = require('../models/User');
const Ticket = require('../models/Ticket');
const FraudReport = require('../models/FraudReport');
const KYCApplication = require('../models/KYCApplication');

// Get dashboard statistics
exports.getStats = async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({ role: 'customer', status: 'active' });
    const pendingKYC = await KYCApplication.countDocuments({ status: 'pending' });
    const openTickets = await Ticket.countDocuments({ status: { $in: ['open', 'in-progress'] } });
    const flaggedFrauds = await FraudReport.countDocuments({ status: 'pending' });
    
    // Get recent counts for trends
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const newCustomersLastWeek = await User.countDocuments({ 
      role: 'customer', 
      createdAt: { $gte: lastWeek } 
    });
    
    const resolvedTicketsLastWeek = await Ticket.countDocuments({ 
      status: 'resolved', 
      updatedAt: { $gte: lastWeek } 
    });
    
    res.json({ 
      success: true,
      data: {
        totalCustomers, 
        pendingKYC, 
        openTickets, 
        flaggedFrauds,
        trends: {
          newCustomers: newCustomersLastWeek,
          resolvedTickets: resolvedTicketsLastWeek
        }
      }
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Get recent activities
exports.getRecentActivities = async (req, res) => {
  try {
    // Get recent KYC applications
    const recentKYC = await KYCApplication.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email');
    
    // Get recent tickets
    const recentTickets = await Ticket.find()
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate('customerId', 'name email');
    
    // Get recent fraud reports
    const recentFraud = await FraudReport.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('reportedBy', 'name email');
    
    const activities = [
      ...recentKYC.map(k => ({ 
        id: k._id,
        description: `KYC ${k.status} for ${k.userFullName || k.userId?.name || 'Customer'}`, 
        time: k.updatedAt, 
        type: 'kyc',
        status: k.status
      })),
      ...recentTickets.map(t => ({ 
        id: t._id,
        description: `Ticket #${t.ticketId}: ${t.status} - ${t.subject}`, 
        time: t.updatedAt, 
        type: 'support',
        status: t.status
      })),
      ...recentFraud.map(f => ({ 
        id: f._id,
        description: `Fraud report #${f.reportId}: ${f.status} - ${f.fraudType}`, 
        time: f.createdAt, 
        type: 'fraud',
        status: f.status
      }))
    ];
    
    // Sort by time and get latest 10
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    
    res.json({
      success: true,
      data: activities.slice(0, 10)
    });
  } catch (error) {
    console.error('Error getting activities:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Get employee-specific statistics
exports.getEmployeeStats = async (req, res) => {
  try {
    const employeeId = req.userId;
    
    // Tickets assigned to this employee
    const assignedTickets = await Ticket.countDocuments({ 
      assignedTo: employeeId,
      status: { $in: ['open', 'in-progress'] }
    });
    
    // Tickets resolved by this employee this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const resolvedTickets = await Ticket.countDocuments({
      'resolution.resolvedBy': employeeId,
      'resolution.resolvedAt': { $gte: startOfMonth }
    });
    
    // Fraud reports investigated
    const investigatedFraud = await FraudReport.countDocuments({
      assignedInvestigator: employeeId
    });
    
    res.json({
      success: true,
      data: {
        assignedTickets,
        resolvedTicketsThisMonth: resolvedTickets,
        investigatedFraudCases: investigatedFraud,
        performance: {
          resolutionRate: assignedTickets > 0 ? (resolvedTickets / assignedTickets) * 100 : 0
        }
      }
    });
  } catch (error) {
    console.error('Error getting employee stats:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Get all customers with filters
exports.getCustomers = async (req, res) => {
  try {
    const { search, kycStatus, page = 1, limit = 20 } = req.query;
    
    let query = { role: 'customer' };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { accountNumber: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (kycStatus && kycStatus !== 'all') {
      query.kycStatus = kycStatus;
    }
    
    const customers = await User.find(query)
      .select('name email kycStatus accountNumber phoneNumber createdAt status')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await User.countDocuments(query);
    
    // Get KYC details for each customer
    const customersWithKYC = await Promise.all(
      customers.map(async (customer) => {
        const kyc = await KYCApplication.findOne({ userId: customer._id });
        return {
          ...customer.toObject(),
          kycApplication: kyc || null
        };
      })
    );
    
    res.json({
      success: true,
      data: {
        customers: customersWithKYC,
        pagination: {
          total,
          totalPages: Math.ceil(total / limit),
          currentPage: parseInt(page),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error getting customers:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Get customer details
exports.getCustomerDetails = async (req, res) => {
  try {
    const { customerId } = req.params;
    
    const customer = await User.findOne({ _id: customerId, role: 'customer' })
      .select('-password -refreshToken -__v');
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }
    
    // Get KYC application
    const kycApplication = await KYCApplication.findOne({ userId: customerId });
    
    // Get customer's tickets
    const tickets = await Ticket.find({ customerId }).sort({ createdAt: -1 }).limit(10);
    
    // Get customer's fraud reports
    const fraudReports = await FraudReport.find({ reportedBy: customerId }).sort({ createdAt: -1 }).limit(5);
    
    res.json({
      success: true,
      data: {
        customer,
        kycApplication,
        recentTickets: tickets,
        recentFraudReports: fraudReports
      }
    });
  } catch (error) {
    console.error('Error getting customer details:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Approve KYC
exports.approveKYC = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { notes } = req.body;
    
    // Update KYC application
    const kycApplication = await KYCApplication.findOneAndUpdate(
      { userId: customerId },
      { 
        status: 'approved',
        approvedAt: new Date(),
        verification: {
          reviewedBy: req.userId,
          reviewedByName: req.user.name,
          reviewedAt: new Date(),
          verificationScore: 85,
          reviewerNotes: notes || ''
        }
      },
      { new: true }
    );
    
    if (!kycApplication) {
      return res.status(404).json({ 
        success: false,
        error: 'KYC application not found' 
      });
    }
    
    // Update user's KYC status
    await User.findByIdAndUpdate(customerId, { 
      kycStatus: 'approved',
      kycApprovedAt: new Date(),
      kycApprovedBy: req.userId
    });
    
    res.json({ 
      success: true,
      message: 'KYC approved successfully',
      data: { application: kycApplication }
    });
  } catch (error) {
    console.error('Error approving KYC:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Reject KYC
exports.rejectKYC = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { reason, notes } = req.body;
    
    if (!reason) {
      return res.status(400).json({
        success: false,
        error: 'Rejection reason is required'
      });
    }
    
    // Update KYC application
    const kycApplication = await KYCApplication.findOneAndUpdate(
      { userId: customerId },
      { 
        status: 'rejected',
        verification: {
          reviewedBy: req.userId,
          reviewedByName: req.user.name,
          reviewedAt: new Date(),
          rejectionReason: reason,
          rejectionNotes: notes || ''
        }
      },
      { new: true }
    );
    
    if (!kycApplication) {
      return res.status(404).json({ 
        success: false,
        error: 'KYC application not found' 
      });
    }
    
    // Update user's KYC status
    await User.findByIdAndUpdate(customerId, { 
      kycStatus: 'rejected',
      kycRejectedAt: new Date(),
      kycRejectedBy: req.userId,
      kycRejectionReason: reason
    });
    
    res.json({ 
      success: true,
      message: 'KYC rejected',
      data: { application: kycApplication }
    });
  } catch (error) {
    console.error('Error rejecting KYC:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Get all tickets
exports.getTickets = async (req, res) => {
  try {
    const { status, priority, assignedToMe, page = 1, limit = 20 } = req.query;
    
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (priority && priority !== 'all') {
      query.priority = priority;
    }
    
    if (assignedToMe === 'true') {
      query.assignedTo = req.userId;
    }
    
    const tickets = await Ticket.find(query)
      .populate('customerId', 'name email phoneNumber')
      .populate('assignedTo', 'name email')
      .sort({ priority: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Ticket.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        tickets,
        pagination: {
          total,
          totalPages: Math.ceil(total / limit),
          currentPage: parseInt(page),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error getting tickets:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Update ticket status
exports.updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status, resolution, assignedTo } = req.body;
    
    const updateData = { status };
    
    if (assignedTo) {
      updateData.assignedTo = assignedTo;
    }
    
    if (status === 'resolved' || status === 'closed') {
      updateData.resolution = {
        message: resolution || 'Ticket resolved',
        resolvedAt: new Date(),
        resolvedBy: req.userId
      };
      updateData.status = 'resolved';
    }
    
    const ticket = await Ticket.findOneAndUpdate(
      { ticketId: ticketId },
      updateData,
      { new: true }
    ).populate('customerId', 'name email');
    
    if (!ticket) {
      return res.status(404).json({ 
        success: false,
        error: 'Ticket not found' 
      });
    }
    
    res.json({ 
      success: true,
      message: 'Ticket status updated',
      data: { ticket }
    });
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Get fraud reports
exports.getFraudReports = async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 20 } = req.query;
    
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (priority && priority !== 'all') {
      query.priority = priority;
    }
    
    const fraudReports = await FraudReport.find(query)
      .populate('reportedBy', 'name email accountNumber')
      .populate('assignedInvestigator', 'name email')
      .sort({ priority: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await FraudReport.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        fraudReports,
        pagination: {
          total,
          totalPages: Math.ceil(total / limit),
          currentPage: parseInt(page),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error getting fraud reports:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Update fraud report status
exports.updateFraudStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status, actionTaken, notes, assignToMe } = req.body;
    
    const updateData = { status };
    
    if (assignToMe === true && !updateData.assignedInvestigator) {
      updateData.assignedInvestigator = req.userId;
    }
    
    if (notes) {
      updateData.$push = {
        investigationNotes: {
          note: notes,
          addedBy: req.userId,
          addedByName: req.user.name,
          addedAt: new Date()
        }
      };
    }
    
    if (actionTaken) {
      updateData.actionTaken = actionTaken;
    }
    
    if (status === 'resolved' || status === 'confirmed') {
      updateData.resolvedAt = new Date();
      updateData.resolvedBy = req.userId;
    }
    
    const fraudReport = await FraudReport.findOneAndUpdate(
      { reportId: reportId },
      updateData,
      { new: true }
    ).populate('reportedBy', 'name email');
    
    if (!fraudReport) {
      return res.status(404).json({ 
        success: false,
        error: 'Fraud report not found' 
      });
    }
    
    res.json({ 
      success: true,
      message: 'Fraud report status updated',
      data: { fraudReport }
    });
  } catch (error) {
    console.error('Error updating fraud report:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};