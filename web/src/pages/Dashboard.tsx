import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  CloudUpload,
  Schedule,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import StatsCard from '../components/Dashboard/StatsCard';
import RecentUploads from '../components/Dashboard/RecentUploads';
import { DashboardStats } from '../types';
import { dashboardService } from '../services/dashboardService';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

const COLORS = ['#007AFF', '#34C759', '#FF9500', '#FF3B30'];

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      setError('');
      
      // For demo purposes, we'll use mock data
      // In production, uncomment the line below:
      // const data = await dashboardService.getDashboardStats();
      
      // Mock data for demonstration
      const mockStats: DashboardStats = {
        totalUploads: 1247,
        pendingReports: 23,
        completedRepairs: 892,
        criticalIssues: 5,
        recentUploads: [
          {
            id: '1',
            userId: 'user1',
            imageUri: 'https://example.com/image1.jpg',
            imageMetadata: {
              originalName: 'pothole1.jpg',
              size: 2048000,
              mimeType: 'image/jpeg',
              dimensions: { width: 1920, height: 1080 }
            },
            location: {
              latitude: 40.7128,
              longitude: -74.0060,
              address: 'New York, NY'
            },
            status: 'success',
            aiAnalysis: {
              damageType: 'Pothole',
              severity: 'High',
              confidence: 0.95,
              recommendations: ['Immediate repair required'],
              processingTime: 2.3,
              modelVersion: '1.0.0'
            },
            repairStatus: 'In Progress',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '2',
            userId: 'user2',
            imageUri: 'https://example.com/image2.jpg',
            imageMetadata: {
              originalName: 'crack1.jpg',
              size: 1536000,
              mimeType: 'image/jpeg',
              dimensions: { width: 1920, height: 1080 }
            },
            location: {
              latitude: 40.7589,
              longitude: -73.9851,
              address: 'Manhattan, NY'
            },
            status: 'processing',
            repairStatus: 'Reported',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            updatedAt: new Date(Date.now() - 3600000).toISOString(),
          },
        ],
        damageTypeDistribution: [
          { type: 'Pothole', count: 456, percentage: 36.6 },
          { type: 'Crack', count: 321, percentage: 25.7 },
          { type: 'Surface Wear', count: 289, percentage: 23.2 },
          { type: 'Edge Damage', count: 181, percentage: 14.5 },
        ],
        severityDistribution: [
          { severity: 'Low', count: 523, percentage: 41.9 },
          { severity: 'Medium', count: 398, percentage: 31.9 },
          { severity: 'High', count: 251, percentage: 20.1 },
          { severity: 'Critical', count: 75, percentage: 6.0 },
        ],
        monthlyTrends: [
          { month: 'Jan', uploads: 89, completed: 67 },
          { month: 'Feb', uploads: 102, completed: 89 },
          { month: 'Mar', uploads: 134, completed: 112 },
          { month: 'Apr', uploads: 156, completed: 134 },
          { month: 'May', uploads: 178, completed: 156 },
          { month: 'Jun', uploads: 201, completed: 178 },
        ],
      };
      
      setStats(mockStats);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!stats) {
    return (
      <Alert severity="info" sx={{ borderRadius: 2 }}>
        No dashboard data available
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" sx={{ color: '#6c757d' }}>
          Monitor road damage reports and repair progress
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Reports"
            value={stats.totalUploads.toLocaleString()}
            icon={<CloudUpload />}
            color="#007AFF"
            trend={{ value: 12.5, isPositive: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Pending"
            value={stats.pendingReports}
            icon={<Schedule />}
            color="#FF9500"
            trend={{ value: -8.2, isPositive: false }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Completed"
            value={stats.completedRepairs.toLocaleString()}
            icon={<CheckCircle />}
            color="#34C759"
            trend={{ value: 15.3, isPositive: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Critical Issues"
            value={stats.criticalIssues}
            icon={<Warning />}
            color="#FF3B30"
            trend={{ value: -25.0, isPositive: true }}
          />
        </Grid>
      </Grid>

      {/* Charts and Recent Uploads */}
      <Grid container spacing={3}>
        {/* Monthly Trends */}
        <Grid item xs={12} lg={8}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '1px solid #f0f0f0',
              mb: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Monthly Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6c757d" />
                  <YAxis stroke="#6c757d" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e9ecef',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="uploads"
                    stroke="#007AFF"
                    strokeWidth={3}
                    dot={{ fill: '#007AFF', strokeWidth: 2, r: 4 }}
                    name="Reports"
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#34C759"
                    strokeWidth={3}
                    dot={{ fill: '#34C759', strokeWidth: 2, r: 4 }}
                    name="Completed"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Damage Type Distribution */}
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '1px solid #f0f0f0',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Damage Type Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.damageTypeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="type" stroke="#6c757d" />
                  <YAxis stroke="#6c757d" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e9ecef',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Bar dataKey="count" fill="#007AFF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Severity Distribution */}
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '1px solid #f0f0f0',
              mb: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Severity Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={stats.severityDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {stats.severityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e9ecef',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ mt: 2 }}>
                {stats.severityDistribution.map((item, index) => (
                  <Box
                    key={item.severity}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: COLORS[index % COLORS.length],
                        }}
                      />
                      <Typography variant="body2">{item.severity}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.count} ({item.percentage}%)
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Recent Uploads */}
          <RecentUploads uploads={stats.recentUploads} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;