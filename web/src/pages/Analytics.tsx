import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Chip,
  Stack,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Assessment,
  Timeline,
} from '@mui/icons-material';

const Analytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('30d');
  
  // Mock data for demonstration
  const [analyticsData] = useState({
    summary: {
      totalReports: 1247,
      avgResponseTime: '4.2 hours',
      completionRate: '89.3%',
      criticalIssues: 5,
    },
    trends: [
      { metric: 'Total Reports', value: '+12.5%', isPositive: true },
      { metric: 'Response Time', value: '-8.2%', isPositive: true },
      { metric: 'Completion Rate', value: '+15.3%', isPositive: true },
      { metric: 'Critical Issues', value: '-25.0%', isPositive: true },
    ],
    damageTypes: [
      { type: 'Pothole', count: 456, percentage: 36.6, trend: '+5.2%' },
      { type: 'Surface Crack', count: 321, percentage: 25.7, trend: '+2.1%' },
      { type: 'Surface Wear', count: 289, percentage: 23.2, trend: '-1.5%' },
      { type: 'Edge Damage', count: 181, percentage: 14.5, trend: '+3.8%' },
    ],
    severityBreakdown: [
      { severity: 'Low', count: 523, percentage: 41.9, color: '#7ED321' },
      { severity: 'Medium', count: 398, percentage: 31.9, color: '#F5A623' },
      { severity: 'High', count: 251, percentage: 20.1, color: '#FF6B35' },
      { severity: 'Critical', count: 75, percentage: 6.0, color: '#D0021B' },
    ],
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeRange]);

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

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Analytics & Insights
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Comprehensive analysis of road damage patterns and repair efficiency
          </Typography>
        </Box>
        
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="7d">Last 7 days</MenuItem>
            <MenuItem value="30d">Last 30 days</MenuItem>
            <MenuItem value="90d">Last 3 months</MenuItem>
            <MenuItem value="1y">Last year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Assessment sx={{ color: 'primary.main', fontSize: 32 }} />
                    <Chip
                      label="+12.5%"
                      size="small"
                      sx={{
                        bgcolor: 'success.light',
                        color: 'success.main',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {analyticsData.summary.totalReports}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Total Reports
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Timeline sx={{ color: 'secondary.main', fontSize: 32 }} />
                    <Chip
                      label="-8.2%"
                      size="small"
                      sx={{
                        bgcolor: 'success.light',
                        color: 'success.main',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {analyticsData.summary.avgResponseTime}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Avg Response Time
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <TrendingUp sx={{ color: 'success.main', fontSize: 32 }} />
                    <Chip
                      label="+15.3%"
                      size="small"
                      sx={{
                        bgcolor: 'success.light',
                        color: 'success.main',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {analyticsData.summary.completionRate}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Completion Rate
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <TrendingDown sx={{ color: 'error.main', fontSize: 32 }} />
                    <Chip
                      label="-25.0%"
                      size="small"
                      sx={{
                        bgcolor: 'success.light',
                        color: 'success.main',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {analyticsData.summary.criticalIssues}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Critical Issues
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Damage Types Analysis */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              height: '100%',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Damage Types Distribution
              </Typography>
              
              <Stack spacing={2}>
                {analyticsData.damageTypes.map((item, index) => (
                  <Box key={item.type}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {item.type}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {item.count}
                        </Typography>
                        <Chip
                          label={item.trend}
                          size="small"
                          sx={{
                            bgcolor: item.trend.startsWith('+') ? 'success.light' : 'error.light',
                            color: item.trend.startsWith('+') ? 'success.main' : 'error.main',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                          }}
                        />
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        width: '100%',
                        height: 8,
                        bgcolor: 'action.hover',
                        borderRadius: 4,
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          width: `${item.percentage}%`,
                          height: '100%',
                          bgcolor: 'primary.main',
                          borderRadius: 4,
                          transition: 'width 1s ease-in-out',
                        }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {item.percentage}%
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Severity Breakdown */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              height: '100%',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Severity Breakdown
              </Typography>
              
              <Stack spacing={2}>
                {analyticsData.severityBreakdown.map((item, index) => (
                  <Box key={item.severity}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: item.color,
                          }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {item.severity}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {item.count}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: '100%',
                        height: 8,
                        bgcolor: 'action.hover',
                        borderRadius: 4,
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          width: `${item.percentage}%`,
                          height: '100%',
                          bgcolor: item.color,
                          borderRadius: 4,
                          transition: 'width 1s ease-in-out',
                        }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {item.percentage}%
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;