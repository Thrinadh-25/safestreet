import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import {
  CloudUpload,
  Schedule,
  CheckCircle,
  Warning,
  TrendingUp,
  Refresh,
  MoreVert,
  LocationOn,
  Image,
} from '@mui/icons-material';
import StatsCard from '../components/Dashboard/StatsCard';
import { DashboardStats } from '../types';
import { format } from 'date-fns';

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
            imageUri: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg',
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
            imageUri: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg',
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F5A623';
      case 'processing': return '#4A90E2';
      case 'success': return '#7ED321';
      case 'failed': return '#D0021B';
      default: return '#9E9E9E';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low': return '#7ED321';
      case 'Medium': return '#F5A623';
      case 'High': return '#FF6B35';
      case 'Critical': return '#D0021B';
      default: return '#9E9E9E';
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
            Welcome back, Admin! 👋
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Here's what's happening with SafeStreets today
          </Typography>
        </Box>
        
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={loadDashboardStats}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Refresh
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Total Reports"
            value={stats.totalUploads.toLocaleString()}
            icon={<CloudUpload />}
            color="#4A90E2"
            trend={{ value: 12.5, isPositive: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Pending"
            value={stats.pendingReports}
            icon={<Schedule />}
            color="#F5A623"
            trend={{ value: -8.2, isPositive: false }}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Completed"
            value={stats.completedRepairs.toLocaleString()}
            icon={<CheckCircle />}
            color="#7ED321"
            trend={{ value: 15.3, isPositive: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Critical Issues"
            value={stats.criticalIssues}
            icon={<Warning />}
            color="#D0021B"
            trend={{ value: -25.0, isPositive: true }}
          />
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Recent Reports */}
        <Grid item xs={12} lg={8}>
          <Card
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              mb: 3,
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Recent Reports
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Latest damage reports from the field
                  </Typography>
                </Box>
                <Button
                  variant="text"
                  endIcon={<TrendingUp />}
                  sx={{ textTransform: 'none', fontWeight: 500 }}
                >
                  View All
                </Button>
              </Box>

              <List sx={{ px: 2 }}>
                {stats.recentUploads.map((upload, index) => (
                  <ListItem
                    key={upload.id}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: 'primary.light',
                          color: 'primary.main',
                        }}
                      >
                        <Image />
                      </Avatar>
                    </ListItemAvatar>
                    
                    <ListItemText
                      disableTypography
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {upload.aiAnalysis?.damageType || 'Processing...'}
                          </Typography>
                          {upload.aiAnalysis?.severity && (
                            <Chip
                              label={upload.aiAnalysis.severity}
                              size="small"
                              sx={{
                                bgcolor: `${getSeverityColor(upload.aiAnalysis.severity)}15`,
                                color: getSeverityColor(upload.aiAnalysis.severity),
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                height: 20,
                              }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                            <LocationOn sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {upload.location.latitude.toFixed(4)}, {upload.location.longitude.toFixed(4)}
                            </Typography>
                          </Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {format(new Date(upload.createdAt), 'MMM dd, yyyy • HH:mm')}
                          </Typography>
                        </Box>
                      }
                    />
                    
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={upload.status.toUpperCase()}
                          size="small"
                          sx={{
                            bgcolor: `${getStatusColor(upload.status)}15`,
                            color: getStatusColor(upload.status),
                            fontWeight: 600,
                            fontSize: '0.7rem',
                          }}
                        />
                        <IconButton size="small">
                          <MoreVert fontSize="small" />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>

              {stats.recentUploads.length === 0 && (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    No recent uploads
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} lg={4}>
          <Card
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Quick Actions
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: '2px dashed',
                      borderColor: 'primary.main',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        bgcolor: 'primary.light',
                        borderColor: 'primary.dark',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <CloudUpload sx={{ color: 'primary.main', fontSize: 32, mb: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Reports
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: '2px dashed',
                      borderColor: 'secondary.main',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        bgcolor: 'secondary.light',
                        borderColor: 'secondary.dark',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <TrendingUp sx={{ color: 'secondary.main', fontSize: 32, mb: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Analytics
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;