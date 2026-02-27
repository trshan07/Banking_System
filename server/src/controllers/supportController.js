// src/controllers/supportController.js
const SupportTicket = require('../models/SupportTicket');
const User = require('../models/User');
const Task = require('../models/Task');

// @desc    Get user tickets
// @route   GET /api/support/tickets
// @access  Private
exports.getUserTickets = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, category } = req.query;

    const query = { userId: req.user._id };
    if (status) query.status = status;
    if (category) query.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tickets = await SupportTicket.find(query)
      .populate('assignedTo', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await SupportTicket.countDocuments(query);

    res.json({
      success: true,
      data: tickets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get user tickets error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get tickets'
    });
  }
};

// @desc    Get ticket details
// @route   GET /api/support/tickets/:ticketId
// @access  Private
exports.getTicketDetails = async (req, res) => {
  try {
    const ticket = await SupportTicket.findOne({
      _id: req.params.ticketId,
      userId: req.user._id
    })
      .populate('userId', 'firstName lastName email')
      .populate('assignedTo', 'firstName lastName email')
      .populate('messages.sender', 'firstName lastName email role')
      .populate('attachments');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    res.json({
      success: true,
      data: ticket
    });
  } catch (error) {
    console.error('Get ticket details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get ticket details'
    });
  }
};

// @desc    Create support ticket
// @route   POST /api/support/tickets
// @access  Private
exports.createTicket = async (req, res) => {
  try {
    const { category, subject, message, priority = 'medium' } = req.body;

    const ticket = new SupportTicket({
      id: 'tkt_' + Date.now(),
      userId: req.user._id,
      category,
      priority,
      subject,
      description: message,
      status: 'open',
      messages: [{
        sender: req.user._id,
        message,
        isStaff: false,
        createdAt: new Date()
      }]
    });

    await ticket.save();

    // Create task for support team (optional)
    const task = new Task({
      id: 'task_' + Date.now(),
      title: `New Support Ticket: ${subject}`,
      description: message,
      type: 'ticket_response',
      priority,
      status: 'pending',
      assignedTo: null, // Will be assigned by admin
      assignedBy: req.user._id,
      relatedTo: {
        entityType: 'ticket',
        entityId: ticket._id
      }
    });

    await task.save();

    res.status(201).json({
      success: true,
      message: 'Support ticket created successfully',
      data: ticket
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create ticket'
    });
  }
};

// @desc    Add message to ticket
// @route   POST /api/support/tickets/:ticketId/messages
// @access  Private
exports.addMessage = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const ticket = await SupportTicket.findOne({
      _id: ticketId,
      userId: req.user._id
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    if (ticket.status === 'closed' || ticket.status === 'resolved') {
      return res.status(400).json({
        success: false,
        message: `Cannot add message to ${ticket.status} ticket`
      });
    }

    // Add message
    ticket.messages.push({
      sender: req.user._id,
      message,
      isStaff: false,
      createdAt: new Date()
    });

    // Update status if it was awaiting reply
    if (ticket.status === 'awaiting_reply') {
      ticket.status = 'in_progress';
    }

    await ticket.save();

    res.json({
      success: true,
      message: 'Message added successfully',
      data: ticket
    });
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add message'
    });
  }
};

// @desc    Get all tickets (admin/employee only)
// @route   GET /api/support/admin/tickets
// @access  Private/Employee
exports.getAllTickets = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      category, 
      priority,
      assignedTo 
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tickets = await SupportTicket.find(query)
      .populate('userId', 'firstName lastName email')
      .populate('assignedTo', 'firstName lastName email')
      .sort({ priority: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await SupportTicket.countDocuments(query);

    // Get statistics
    const stats = {
      open: await SupportTicket.countDocuments({ status: 'open' }),
      inProgress: await SupportTicket.countDocuments({ status: 'in_progress' }),
      awaitingReply: await SupportTicket.countDocuments({ status: 'awaiting_reply' }),
      resolved: await SupportTicket.countDocuments({ status: 'resolved' }),
      closed: await SupportTicket.countDocuments({ status: 'closed' })
    };

    res.json({
      success: true,
      data: tickets,
      stats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get all tickets error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get tickets'
    });
  }
};

// @desc    Assign ticket to staff
// @route   PUT /api/support/tickets/:ticketId/assign
// @access  Private/Admin
exports.assignTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { staffId } = req.body;

    const ticket = await SupportTicket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Verify staff exists and is employee or admin
    const staff = await User.findOne({
      _id: staffId,
      role: { $in: ['employee', 'admin', 'super_admin'] }
    });

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    ticket.assignedTo = staffId;
    ticket.status = 'in_progress';

    // Add system message
    ticket.messages.push({
      sender: req.user._id,
      message: `Ticket assigned to ${staff.firstName} ${staff.lastName}`,
      isStaff: true,
      createdAt: new Date()
    });

    await ticket.save();

    // Update related task if exists
    await Task.findOneAndUpdate(
      { 'relatedTo.entityId': ticket._id, 'relatedTo.entityType': 'ticket' },
      { assignedTo: staffId }
    );

    res.json({
      success: true,
      message: 'Ticket assigned successfully',
      data: ticket
    });
  } catch (error) {
    console.error('Assign ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign ticket'
    });
  }
};

// @desc    Update ticket status
// @route   PUT /api/support/tickets/:ticketId/status
// @access  Private/Employee
exports.updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status, comment } = req.body;

    const ticket = await SupportTicket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    const oldStatus = ticket.status;
    ticket.status = status;

    // Add system message if status changed
    if (oldStatus !== status) {
      ticket.messages.push({
        sender: req.user._id,
        message: comment || `Status changed from ${oldStatus} to ${status}`,
        isStaff: true,
        createdAt: new Date()
      });
    }

    // Set resolved/closed timestamps
    if (status === 'resolved') {
      ticket.resolvedAt = new Date();
    } else if (status === 'closed') {
      ticket.closedAt = new Date();
    }

    await ticket.save();

    // Update related task if exists
    if (status === 'resolved' || status === 'closed') {
      await Task.findOneAndUpdate(
        { 'relatedTo.entityId': ticket._id, 'relatedTo.entityType': 'ticket' },
        { status: 'completed', completedAt: new Date() }
      );
    }

    res.json({
      success: true,
      message: `Ticket status updated to ${status}`,
      data: ticket
    });
  } catch (error) {
    console.error('Update ticket status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update ticket status'
    });
  }
};