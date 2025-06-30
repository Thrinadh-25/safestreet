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
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

const COLORS = ['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#5AC8FA', '#AF52DE'];

const Analytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('30d');
  
  // Mock data for demonstration
  const [analyticsData] = useState({
    damageTypesByMonth: [
      { month: 'Jan', Pothole: 45, Crack: 32, 'Surface Wear': 28, 'Edge Damage': 18 },
      { month: 'Feb', Pothole: 52, Crack: 38, 'Surface Wear': 31, 'Edge Damage': 22 },
      { month: 'Mar', Pothole: 48, Crack: 41, 'Surface Wear': 35, 'Edge Damage': 25 },
      { month: 'Apr', Pothole: 61, Crack: 45, 'Surface Wear': 38, 'Edge Damage': 28 },
      { month: 'May', Pothole: 58, Crack: 48, 'Surface Wear': 42, 'Edge Damage': 31 },
      { month: 'Jun', Pothole: 65, Crack: 52, 'Surface Wear': 45, 'Edge Damage': 34 },
    ],
    severityTrends: [
      { month: 'Jan', Low: 89, Medium: 67, High: 34, Critical: 12 },
      { month: 'Feb', Low: 95, Medium: 72, High: 38, Critical: 15 },
      { month: 'Mar', Low: 102, Medium: 78, High: 42, Critical: 18 },
      { month: 'Apr', Low: 108, Medium: 85, High: 45, Critical: 21 },
      { month: 'May', Low: 115, Medium: 91, High: 48, Critical: 24 },
      { month: 'Jun', Low: 122, Medium: 98, High: 52, Critical: 28 },
    ],
    responseTimeAnalysis: [
      { category: 'Critical', avgHours: 2.5, target: 4 },
      { category: 'High', avgHours: 12.3, target: 24 },
      { category: 'Medium', avgHours: 48.7, target: 72 },
      { category: 'Low', avgHours: 168.2, target: 240 },
    ],
    geographicDistribution: [
      { area: 'Downtown', count: 234, percentage: 28.5 },
      { area: 'Midtown', count: 189, percentage: 23.0 },
      { area: 'Uptown', count: 156, percentage: 19.0 },
      { area: 'East Side', count: 134, percentage: 16.3 },
      { area: 'West Side', count: 108, percentage: 13.2 },
    ],
    completionRates: [
      { month: 'Jan', completed: 85, total: 102 },
      { month: 'Feb', completed: 92, total: 108 },
      { month: 'Mar', completed: 98, total: 115 },
      { month: 'Apr', completed: 105, total: 123 },
      { month: 'May', completed: 112, total: 131 },
      { month: 'Jun', completed: 118, total: 138 },
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
          <Typography variant="body1" sx={{ color: '#6c757d' }}>
            Comprehensive analysis of road damage patterns and repair efficiency
          </Typography>
        </Box>
        
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="7d">Last 7 days</MenuItem>
            <MenuItem value="30d">Last 30 days</MenuItem>
            <MenuItem value="90d">Last 3 months</MenuItem>
            <MenuItem value="1y">Last year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {/* Damage Types by Month */}
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
                Damage Types Over Time
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={analyticsData.damageTypesByMonth}>
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
                  <Area
                    type="monotone"
                    dataKey="Pothole"
                    stackId="1"
                    stroke="#007AFF"
                    fill="#007AFF"
                    fillOpacity={0.8}
                  />
                  <Area
                    type="monotone"
                    dataKey="Crack"
                    stackId="1"
                    stroke="#34C759"
                    fill="#34C759"
                    fillOpacity={0.8}
                  />
                  <Area
                    type="monotone"
                    dataKey="Surface Wear"
                    stackId="1"
                    stroke="#FF9500"
                    fill="#FF9500"
                    fillOpacity={0.8}
                  />
                  <Area
                    type="monotone"
                    dataKey="Edge Damage"
                    stackId="1"
                    stroke="#FF3B30"
                    fill="#FF3B30"
                    fillOpacity={0.8}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Geographic Distribution */}
        <Grid item xs={12} lg={4}>
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
                Geographic Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={analyticsData.geographicDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {analyticsData.geographicDistribution.map((entry, index) => (
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
                {analyticsData.geographicDistribution.map((item, index) => (
                  <Box
                    key={item.area}
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
                      <Typography variant="body2">{item.area}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.count} ({item.percentage}%)
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Severity Trends */}
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
                Severity Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.severityTrends}>
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
                    dataKey="Low"
                    stroke="#34C759"
                    strokeWidth={3}
                    dot={{ fill: '#34C759', strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Medium"
                    stroke="#FF9500"
                    strokeWidth={3}
                    dot={{ fill: '#FF9500', strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="High"
                    stroke="#FF6B35"
                    strokeWidth={3}
                    dot={{ fill: '#FF6B35', strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Critical"
                    stroke="#FF3B30"
                    strokeWidth={3}
                    dot={{ fill: '#FF3B30', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Response Time Analysis */}
        <Grid item xs={12} lg={4}>
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
                Response Time Analysis
              </Typography>
              <Box sx={{ mb: 3 }}>
                {analyticsData.responseTimeAnalysis.map((item, index) => (
                  <Box key={item.category} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {item.category}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6c757d' }}>
                        {item.avgHours}h avg
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: '100%',
                        height: 8,
                        bgcolor: '#f0f0f0',
                        borderRadius: 4,
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          width: `${Math.min((item.avgHours / item.target) * 100, 100)}%`,
                          height: '100%',
                          bgcolor: item.avgHours <= item.target ? '#34C759' : '#FF3B30',
                          borderRadius: 4,
                        }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ color: '#6c757d' }}>
                      Target: {item.target}h
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Completion Rates */}
        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '1px solid #f0f0f0',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Completion Rates
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.completionRates}>
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
                    formatter={(value, name) => [
                      value,
                      name === 'completed' ? 'Completed' : 'Total Reports'
                    ]}
                  />
                  <Bar dataKey="total" fill="#E5E5EA" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" fill="#34C759" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;