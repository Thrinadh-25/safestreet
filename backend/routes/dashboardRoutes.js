const express = require('express');
const Upload = require('../models/Upload');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/dashboard/stats
router.get('/stats', async (req, res) => {
  try {
    // Get basic stats
    const stats = await Upload.getDashboardStats();
    
    // Get recent uploads
    const recentUploads = await Upload.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'fullName email');

    // Get damage type distribution
    const damageTypeDistribution = await Upload.aggregate([
      { $match: { 'aiAnalysis.damageType': { $exists: true } } },
      { $group: { _id: '$aiAnalysis.damageType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Calculate percentages for damage types
    const totalAnalyzed = damageTypeDistribution.reduce((sum, item) => sum + item.count, 0);
    const damageTypeWithPercentages = damageTypeDistribution.map(item => ({
      type: item._id,
      count: item.count,
      percentage: totalAnalyzed > 0 ? ((item.count / totalAnalyzed) * 100).toFixed(1) : 0,
    }));

    // Get severity distribution
    const severityDistribution = await Upload.aggregate([
      { $match: { 'aiAnalysis.severity': { $exists: true } } },
      { $group: { _id: '$aiAnalysis.severity', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Calculate percentages for severity
    const severityWithPercentages = severityDistribution.map(item => ({
      severity: item._id,
      count: item.count,
      percentage: totalAnalyzed > 0 ? ((item.count / totalAnalyzed) * 100).toFixed(1) : 0,
    }));

    // Get monthly trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrends = await Upload.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          uploads: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$repairStatus', 'Completed'] }, 1, 0] },
          },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Format monthly trends
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedTrends = monthlyTrends.map(item => ({
      month: monthNames[item._id.month - 1],
      uploads: item.uploads,
      completed: item.completed,
    }));

    res.json({
      success: true,
      data: {
        ...stats,
        recentUploads,
        damageTypeDistribution: damageTypeWithPercentages,
        severityDistribution: severityWithPercentages,
        monthlyTrends: formattedTrends,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard statistics',
    });
  }
});

// GET /api/dashboard/analytics
router.get('/analytics', async (req, res) => {
  try {
    const { timeRange = '30d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Get analytics data for the specified time range
    const totalReports = await Upload.countDocuments({
      createdAt: { $gte: startDate },
    });

    const avgResponseTime = await Upload.aggregate([
      { $match: { createdAt: { $gte: startDate }, processedAt: { $exists: true } } },
      {
        $project: {
          responseTime: {
            $divide: [
              { $subtract: ['$processedAt', '$createdAt'] },
              1000 * 60 * 60, // Convert to hours
            ],
          },
        },
      },
      { $group: { _id: null, avgTime: { $avg: '$responseTime' } } },
    ]);

    const completionRate = await Upload.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$repairStatus', 'Completed'] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          rate: { $multiply: [{ $divide: ['$completed', '$total'] }, 100] },
        },
      },
    ]);

    const criticalIssues = await Upload.countDocuments({
      createdAt: { $gte: startDate },
      'aiAnalysis.severity': 'Critical',
    });

    res.json({
      success: true,
      data: {
        summary: {
          totalReports,
          avgResponseTime: avgResponseTime[0]?.avgTime?.toFixed(1) + ' hours' || '0 hours',
          completionRate: completionRate[0]?.rate?.toFixed(1) + '%' || '0%',
          criticalIssues,
        },
        timeRange,
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics data',
    });
  }
});

module.exports = router;