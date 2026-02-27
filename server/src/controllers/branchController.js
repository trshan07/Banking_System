// backend/src/controllers/branchController.js
const Branch = require('../models/Branch');

// @desc    Get all branches
// @route   GET /api/branches
// @access  Public
exports.getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find();
    
    res.json({
      success: true,
      data: branches
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
      data: branch
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
    const { name, address, latitude, longitude, services } = req.body;
    
    const branch = new Branch({
      name,
      address,
      latitude,
      longitude,
      services
    });
    
    await branch.save();
    
    res.status(201).json({
      success: true,
      message: 'Branch created successfully',
      data: branch
    });
  } catch (error) {
    console.error('Create branch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create branch'
    });
  }
};

// @desc    Update branch (admin only)
// @route   PUT /api/branches/:branchId
// @access  Private/Admin
exports.updateBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndUpdate(
      req.params.branchId,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Branch updated successfully',
      data: branch
    });
  } catch (error) {
    console.error('Update branch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update branch'
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
    
    res.json({
      success: true,
      message: 'Branch deleted successfully'
    });
  } catch (error) {
    console.error('Delete branch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete branch'
    });
  }
};