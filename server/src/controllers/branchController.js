// backend/src/controllers/branchController.js
const AuditLog = require('../models/AuditLog');
const Branch = require('../models/Branch');

const BRANCH_STATUSES = ['active', 'maintenance', 'closed'];
const createErrorResponse = (error) => {
  if (error?.code === 11000) {
    if (error.keyPattern?.code) {
      return { status: 400, message: 'Branch code already exists' };
    }

    return { status: 400, message: 'Duplicate branch data detected' };
  }

  if (error?.name === 'ValidationError') {
    const firstMessage = Object.values(error.errors || {})[0]?.message || 'Invalid branch data';
    return { status: 400, message: firstMessage };
  }

  if (error?.name === 'CastError') {
    return { status: 400, message: 'Invalid branch identifier' };
  }

  return { status: 500, message: 'Failed to process branch request' };
};

const normalizeBranchPayload = (payload = {}) => {
  const normalized = { ...payload };
  const trimToUndefined = (value) => {
    if (typeof value !== 'string') {
      return value;
    }

    const trimmed = value.trim();
    return trimmed === '' ? undefined : trimmed;
  };

  if (Object.prototype.hasOwnProperty.call(normalized, 'manager')) {
    normalized.managerName = normalized.manager;
    delete normalized.manager;
  }
  if (Object.prototype.hasOwnProperty.call(normalized, 'employees')) {
    normalized.employeeCount = normalized.employees;
    delete normalized.employees;
  }
  if (Object.prototype.hasOwnProperty.call(normalized, 'customers')) {
    normalized.customerCount = normalized.customers;
    delete normalized.customers;
  }
  if (typeof normalized.code === 'string') {
    normalized.code = normalized.code.trim().toUpperCase();
  }
  normalized.name = trimToUndefined(normalized.name);
  normalized.address = trimToUndefined(normalized.address);
  normalized.phone = trimToUndefined(normalized.phone);
  normalized.email = trimToUndefined(normalized.email);
  normalized.managerName = trimToUndefined(normalized.managerName);
  normalized.city = trimToUndefined(normalized.city);
  normalized.state = trimToUndefined(normalized.state);
  normalized.country = trimToUndefined(normalized.country);
  normalized.established = trimToUndefined(normalized.established);
  if (typeof normalized.email === 'string') {
    normalized.email = normalized.email.toLowerCase();
  }
  if (typeof normalized.status === 'string') {
    normalized.status = normalized.status.trim().toLowerCase();
  }
  if (normalized.established) {
    normalized.established = new Date(normalized.established);
  }
  if (normalized.established instanceof Date && Number.isNaN(normalized.established.getTime())) {
    normalized.established = undefined;
  }

  return normalized;
};

const createAuditEntry = async (req, action, branch, details, metadata = {}) => {
  try {
    await AuditLog.create({
      userId: req.user?._id || null,
      userEmail: req.user?.email || 'system',
      action,
      entity: 'branch',
      entityId: branch?._id ? String(branch._id) : null,
      target: branch?.name || branch?.code || 'branch',
      details,
      status: 'success',
      ipAddress: req.ip || req.connection?.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent') || '',
      metadata,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Branch audit logging error:', error);
  }
};

const formatBranch = (branch) => ({
  id: branch._id,
  code: branch.code,
  name: branch.name,
  address: branch.address,
  city: branch.city || '',
  state: branch.state || '',
  country: branch.country || '',
  phone: branch.phone,
  email: branch.email || '',
  manager: branch.managerName || '',
  status: branch.status || (branch.isActive ? 'active' : 'closed'),
  employees: branch.employeeCount || 0,
  customers: branch.customerCount || 0,
  revenue: branch.revenue || 0,
  established: branch.established || branch.createdAt,
  latitude: branch.latitude,
  longitude: branch.longitude,
  services: branch.services || [],
  createdAt: branch.createdAt,
  updatedAt: branch.updatedAt,
});

// @desc    Get all branches
// @route   GET /api/branches
// @access  Public
exports.getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find().sort({ createdAt: -1 }).lean();
    
    res.json({
      success: true,
      data: {
        branches: branches.map(formatBranch)
      }
    });
  } catch (error) {
    console.error('Get branches error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get branches'
    });
  }
};

// @desc    Get nearby branches
// @route   GET /api/branches/nearby
// @access  Public
exports.getNearbyBranches = async (req, res) => {
  try {
    const { lat, lng, distance = 10 } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }
    
    // Simple distance calculation (in production, use geospatial queries)
    const branches = await Branch.find();
    
    const nearbyBranches = branches.filter(branch => {
      if (!branch.latitude || !branch.longitude) return false;
      
      const R = 6371; // Earth's radius in km
      const dLat = (branch.latitude - parseFloat(lat)) * Math.PI / 180;
      const dLon = (branch.longitude - parseFloat(lng)) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(parseFloat(lat) * Math.PI / 180) * Math.cos(branch.latitude * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const d = R * c;
      
      return d <= parseFloat(distance);
    });
    
    res.json({
      success: true,
      data: nearbyBranches
    });
  } catch (error) {
    console.error('Get nearby branches error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get nearby branches'
    });
  }
};

// @desc    Get branch by ID
// @route   GET /api/branches/:branchId
// @access  Public
exports.getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.branchId);
    
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found'
      });
    }
    
    res.json({
      success: true,
      data: { branch: formatBranch(branch) }
    });
  } catch (error) {
    console.error('Get branch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get branch'
    });
  }
};

// @desc    Create branch (admin only)
// @route   POST /api/branches
// @access  Private/Admin
exports.createBranch = async (req, res) => {
  try {
    const payload = normalizeBranchPayload(req.body);
    const {
      code,
      name,
      address,
      phone,
      email,
      managerName,
      city,
      state,
      country,
      status,
      employeeCount,
      customerCount,
      revenue,
      established,
      latitude,
      longitude,
      services,
    } = payload;

    const existingBranch = await Branch.findOne({ code });
    if (existingBranch) {
      return res.status(400).json({
        success: false,
        message: 'Branch code already exists'
      });
    }

    if (status && !BRANCH_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid branch status'
      });
    }
    
    const branch = new Branch({
      code,
      name,
      address,
      phone,
      email,
      managerName,
      city,
      state,
      country,
      status: status || 'active',
      employeeCount: employeeCount ?? 0,
      customerCount: customerCount ?? 0,
      revenue: revenue ?? 0,
      established,
      latitude,
      longitude,
      services
    });
    
    await branch.save();
    await createAuditEntry(
      req,
      'Branch created',
      branch,
      `Created branch ${branch.name} (${branch.code}).`,
      { status: branch.status }
    );
    
    res.status(201).json({
      success: true,
      message: 'Branch created successfully',
      data: { branch: formatBranch(branch) }
    });
  } catch (error) {
    console.error('Create branch error:', error);
    const { status, message } = createErrorResponse(error);
    res.status(status).json({
      success: false,
      message
    });
  }
};

// @desc    Update branch (admin only)
// @route   PUT /api/branches/:branchId
// @access  Private/Admin
exports.updateBranch = async (req, res) => {
  try {
    const updates = normalizeBranchPayload(req.body);

    if (updates.code) {
      const existingBranch = await Branch.findOne({ code: updates.code, _id: { $ne: req.params.branchId } });
      if (existingBranch) {
        return res.status(400).json({
          success: false,
          message: 'Branch code already exists'
        });
      }
    }

    if (updates.status && !BRANCH_STATUSES.includes(updates.status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid branch status'
      });
    }
    if (updates.status) {
      updates.isActive = updates.status === 'active';
    }

    const branch = await Branch.findByIdAndUpdate(
      req.params.branchId,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found'
      });
    }

    await createAuditEntry(
      req,
      'Branch updated',
      branch,
      `Updated branch ${branch.name} (${branch.code}).`,
      { updatedFields: Object.keys(req.body) }
    );
    
    res.json({
      success: true,
      message: 'Branch updated successfully',
      data: { branch: formatBranch(branch) }
    });
  } catch (error) {
    console.error('Update branch error:', error);
    const { status, message } = createErrorResponse(error);
    res.status(status).json({
      success: false,
      message
    });
  }
};

// @desc    Delete branch (super admin only)
// @route   DELETE /api/branches/:branchId
// @access  Private/SuperAdmin
exports.deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.branchId);
    
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found'
      });
    }

    await createAuditEntry(
      req,
      'Branch deleted',
      branch,
      `Deleted branch ${branch.name} (${branch.code}).`
    );
    
    res.json({
      success: true,
      message: 'Branch deleted successfully'
    });
  } catch (error) {
    console.error('Delete branch error:', error);
    const { status, message } = createErrorResponse(error);
    res.status(status).json({
      success: false,
      message
    });
  }
};
