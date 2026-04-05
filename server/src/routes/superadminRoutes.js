const express = require('express');
const router = express.Router();
const { authMiddleware, checkRole } = require('../middleware/auth');

// All superadmin routes require authentication and superadmin role
router.use(authMiddleware);
router.use(checkRole('superadmin'));

// Get dashboard statistics
router.get('/stats', (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        totalUsers: 15420,
        activeUsers: 12890,
        totalAdmins: 45,
        totalBranches: 28,
        totalTransactions: 45678,
        totalVolume: 12500000,
        pendingApprovals: 23,
        systemUptime: '99.99%',
        avgResponseTime: '245ms',
        errorRate: '0.05%'
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get system health
router.get('/system-health', (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        cpu: {
          usage: 35.2,
          cores: 8,
          temperature: 45
        },
        memory: {
          used: 8.5,
          total: 16,
          percentage: 53.1
        },
        disk: {
          used: 250,
          total: 500,
          percentage: 50
        },
        database: {
          status: 'healthy',
          responseTime: '2ms',
          connections: 45,
          maxConnections: 100
        },
        uptime: '45 days 12 hours',
        lastChecked: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching system health:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get audit logs
router.get('/audit-logs', (req, res) => {
  try {
    const { limit = 50, skip = 0 } = req.query;

    res.json({
      success: true,
      data: {
        logs: [
          {
            id: 1,
            action: 'User Created',
            user: 'admin@example.com',
            timestamp: new Date(Date.now() - 3600000),
            ipAddress: '192.168.1.100',
            status: 'success',
            details: 'New user account created'
          },
          {
            id: 2,
            action: 'Permission Changed',
            user: 'superadmin@example.com',
            timestamp: new Date(Date.now() - 7200000),
            ipAddress: '192.168.1.101',
            status: 'success',
            details: 'Admin permissions updated'
          },
          {
            id: 3,
            action: 'System Settings Modified',
            user: 'superadmin@example.com',
            timestamp: new Date(Date.now() - 10800000),
            ipAddress: '192.168.1.101',
            status: 'success',
            details: 'API rate limit changed'
          }
        ],
        total: 3,
        limit: parseInt(limit),
        skip: parseInt(skip)
      }
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get performance data
router.get('/performance', (req, res) => {
  try {
    const { period = 'month' } = req.query;

    const getPerformanceData = () => {
      if (period === 'week') {
        return [
          { day: 'Mon', transactions: 450, users: 180, errors: 5 },
          { day: 'Tue', transactions: 520, users: 210, errors: 3 },
          { day: 'Wed', transactions: 480, users: 190, errors: 4 },
          { day: 'Thu', transactions: 610, users: 220, errors: 2 },
          { day: 'Fri', transactions: 580, users: 210, errors: 6 },
          { day: 'Sat', transactions: 390, users: 140, errors: 1 },
          { day: 'Sun', transactions: 280, users: 100, errors: 2 }
        ];
      }

      return [
        { date: '2024-01-01', transactions: 1200, users: 450, errors: 15 },
        { date: '2024-01-08', transactions: 1350, users: 520, errors: 12 },
        { date: '2024-01-15', transactions: 1480, users: 580, errors: 18 },
        { date: '2024-01-22', transactions: 1620, users: 650, errors: 10 },
        { date: '2024-01-29', transactions: 1780, users: 720, errors: 14 }
      ];
    };

    res.json({
      success: true,
      data: {
        period,
        performance: getPerformanceData(),
        summary: {
          totalTransactions: 6830,
          totalNewUsers: 2920,
          totalErrors: 69,
          avgResponseTime: '245ms',
          peakLoadTime: '14:30'
        }
      }
    });
  } catch (error) {
    console.error('Error fetching performance data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update system settings
router.put('/settings', (req, res) => {
  try {
    const { settings } = req.body;

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: {
        settings: settings || {}
      }
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Maintenance mode endpoint
router.post('/maintenance', (req, res) => {
  try {
    const { mode, duration } = req.body;

    res.json({
      success: true,
      message: `Maintenance mode ${mode === 'on' ? 'enabled' : 'disabled'}`,
      data: {
        maintenanceMode: mode === 'on',
        duration,
        startedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error setting maintenance mode:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
