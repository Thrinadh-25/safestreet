import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  TextField, 
  Button, 
  Box, 
  Card, 
  CardContent, 
  CardMedia, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  Chip,
  IconButton,
  Tooltip as MuiTooltip,
  Alert,
  Snackbar
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format } from 'date-fns';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { api } from '../utils/api';
import { API_BASE_URL, API_ENDPOINTS, TOKEN_KEY } from '../config/constants';

const Historical = () => {
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [region, setRegion] = useState('all');
  const [damageType, setDamageType] = useState('all');
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [view, setView] = useState('reports'); // 'reports', 'trends'
  const [trendData, setTrendData] = useState([]);
  const [regionData, setRegionData] = useState([]);
  const [severityData, setSeverityData] = useState([]);
  const [stats, setStats] = useState({
    totalReports: 0,
    repaired: 0,
    inProgress: 0,
    highSeverity: 0
  });
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  
  // Fetch data from the API
  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        setLoading(true);
        const data = await api.get(`${API_ENDPOINTS.DAMAGE_REPORTS}/reports`);
        setReports(data);
        
        // Process data for trends and analysis
        processDataForAnalytics(data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching reports data:', err);
        setError(err.message || 'Failed to fetch reports data');
        setSnackbar({
          open: true,
          message: 'Error loading reports: ' + (err.message || 'Unknown error'),
          severity: 'error'
        });
        setLoading(false);
      }
    };
    
    fetchReportsData();
  }, []);

  // Process API data for analytics
  const processDataForAnalytics = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      console.warn('No data available for analytics processing');
      return;
    }

    // Group reports by month
    const reportsByMonth = {};
    const reportsByRegion = {};
    const reportsBySeverity = {};

    // Count reports by status and severity
    let completed = 0;
    let inProgress = 0;
    let highSeverity = 0;

    data.forEach(report => {
      // Extract month from createdAt
      const date = new Date(report.createdAt);
      const monthKey = format(date, 'MMM');
      
      // Initialize month data if it doesn't exist
      if (!reportsByMonth[monthKey]) {
        reportsByMonth[monthKey] = {
          month: monthKey,
          waterDamage: 0,
          structural: 0,
          electrical: 0,
          other: 0
        };
      }

      // Count by damage type
      const normalizedDamageType = report.damageType.toLowerCase();
      if (normalizedDamageType.includes('water')) {
        reportsByMonth[monthKey].waterDamage++;
      } else if (normalizedDamageType.includes('structural')) {
        reportsByMonth[monthKey].structural++;
      } else if (normalizedDamageType.includes('electrical')) {
        reportsByMonth[monthKey].electrical++;
      } else {
        reportsByMonth[monthKey].other++;
      }

      // Count by region
      if (!reportsByRegion[report.region]) {
        reportsByRegion[report.region] = 0;
      }
      reportsByRegion[report.region]++;

      // Initialize severity data if it doesn't exist
      if (!reportsBySeverity[monthKey]) {
        reportsBySeverity[monthKey] = {
          month: monthKey,
          high: 0,
          medium: 0,
          low: 0
        };
      }

      // Count by severity
      const normalizedSeverity = report.severity.toLowerCase();
      if (normalizedSeverity.includes('high')) {
        reportsBySeverity[monthKey].high++;
        highSeverity++;
      } else if (normalizedSeverity.includes('medium')) {
        reportsBySeverity[monthKey].medium++;
      } else {
        reportsBySeverity[monthKey].low++;
      }

      // Status counts
      if (report.status === 'Completed' || report.status === 'Repaired') {
        completed++;
      } else if (report.status === 'In Progress' || report.status === 'Assigned') {
        inProgress++;
      }
    });

    // Convert to array format for charts
    const trendDataArray = Object.values(reportsByMonth);
    setTrendData(trendDataArray);
    
    // Prepare region data
    const regionDataArray = Object.keys(reportsByRegion).map(region => ({
      name: region,
      value: reportsByRegion[region]
    }));
    setRegionData(regionDataArray);
    
    // Prepare severity data
    const severityDataArray = Object.values(reportsBySeverity);
    setSeverityData(severityDataArray);
    
    // Set statistics
    setStats({
      totalReports: data.length,
      repaired: completed,
      inProgress,
      highSeverity
    });
  };

  const handleFilter = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      let queryParams = [];
      
      if (startDate) {
        queryParams.push(`startDate=${format(startDate, 'yyyy-MM-dd')}`);
      }
      
      if (endDate) {
        queryParams.push(`endDate=${format(endDate, 'yyyy-MM-dd')}`);
      }
      
      if (region && region !== 'all') {
        queryParams.push(`region=${region}`);
      }
      
      if (damageType && damageType !== 'all') {
        queryParams.push(`damageType=${damageType}`);
      }
      
      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      
      const filteredData = await api.get(`${API_ENDPOINTS.DAMAGE_REPORTS}/reports${queryString}`);
      setReports(filteredData);
      
      // Process filtered data for analytics if in trends view
      if (view === 'trends') {
        processDataForAnalytics(filteredData);
      }
      
      setSnackbar({
        open: true,
        message: `Found ${filteredData.length} reports matching your criteria`,
        severity: 'success'
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error applying filters:', err);
      setError(err.message || 'Failed to apply filters');
      setSnackbar({
        open: true,
        message: 'Error filtering reports: ' + (err.message || 'Unknown error'),
        severity: 'error'
      });
      setLoading(false);
    }
  };

  const handleExportData = () => {
    // Create CSV content
    const headers = ['ID', 'Date', 'Location', 'Region', 'Damage Type', 'Status', 'Severity', 'Description'];
    const csvContent = [
      headers.join(','),
      ...reports.map(report => [
        report.reportId,
        format(new Date(report.createdAt), 'yyyy-MM-dd'),
        report.location,
        report.region,
        report.damageType,
        report.status,
        report.severity,
        `"${report.description ? report.description.replace(/"/g, '""') : ''}"`
      ].join(','))
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `damage_reports_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setSnackbar({
      open: true,
      message: 'Report data exported successfully',
      severity: 'success'
    });
  };

  // Get image URL with authentication token
  const getAuthenticatedImageUrl = (reportId, type) => {
    const token = localStorage.getItem(TOKEN_KEY);
    return `${API_BASE_URL}${API_ENDPOINTS.DAMAGE_REPORTS}/report/${reportId}/image/${type}?token=${token}`;
  };
  
  // View a specific report
  const viewReport = async (reportId) => {
    try {
      setLoading(true);
      setError(null);
      
      const reportData = await api.get(`${API_ENDPOINTS.DAMAGE_REPORTS}/report/${reportId}`);
      console.log('Retrieved report data:', reportData);
      
      // Check if reportId is in the correct format
      const reportIdToUse = reportData.reportId || reportId;
      
      const beforeImageUrl = getAuthenticatedImageUrl(reportIdToUse, 'before');
      const afterImageUrl = reportData.afterImage ? 
        getAuthenticatedImageUrl(reportIdToUse, 'after') : 
        'https://via.placeholder.com/300x200?text=No+After+Image';
      
      console.log('Using image URLs:', { 
        beforeImageUrl, 
        afterImageUrl, 
        reportIdUsed: reportIdToUse
      });
      
      setSelectedReport({
        ...reportData,
        beforeImage: beforeImageUrl,
        afterImage: afterImageUrl
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching report details:', err);
      setError(err.message || 'Failed to fetch report details');
      setSnackbar({
        open: true,
        message: 'Error loading report details: ' + (err.message || 'Unknown error'),
        severity: 'error'
      });
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const STATUS_COLORS = {
    'Repaired': '#4caf50',
    'Completed': '#4caf50',
    'Pending': '#ff9800',
    'Assigned': '#2196f3',
    'In Progress': '#2196f3',
    'In-Progress': '#2196f3'
  };
  
  const SEVERITY_COLORS = {
    'High': '#f44336',
    'Medium': '#ff9800',
    'Low': '#4caf50'
  };

  const getStatusChip = (status) => {
    return (
      <Chip 
        label={status} 
        size="small" 
        sx={{ 
          backgroundColor: STATUS_COLORS[status] || '#757575',
          color: 'white',
          fontWeight: 'bold'
        }} 
      />
    );
  };

  const getSeverityChip = (severity) => {
    return (
      <Chip 
        label={severity} 
        size="small" 
        sx={{ 
          backgroundColor: SEVERITY_COLORS[severity] || '#757575',
          color: 'white',
          fontWeight: 'bold'
        }} 
      />
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <FilterAltIcon sx={{ mr: 1 }} />
          Filter Reports
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
                slotProps={{ textField: { fullWidth: true, variant: 'outlined' } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
                slotProps={{ textField: { fullWidth: true, variant: 'outlined' } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Region</InputLabel>
              <Select
                value={region}
                label="Region"
                onChange={(e) => setRegion(e.target.value)}
              >
                <MenuItem value="all">All Regions</MenuItem>
                <MenuItem value="North">North</MenuItem>
                <MenuItem value="South">South</MenuItem>
                <MenuItem value="East">East</MenuItem>
                <MenuItem value="West">West</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Damage Type</InputLabel>
              <Select
                value={damageType}
                label="Damage Type"
                onChange={(e) => setDamageType(e.target.value)}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="Water Damage">Water Damage</MenuItem>
                <MenuItem value="Structural">Structural</MenuItem>
                <MenuItem value="Electrical">Electrical</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                onClick={handleFilter}
                disabled={loading}
                sx={{ height: '56px', borderRadius: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Apply Filters'}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleExportData}
                disabled={loading || reports.length === 0}
                sx={{ minWidth: 'auto', height: '56px', borderRadius: 2 }}
              >
                <FileDownloadIcon />
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mb: 3 }}>
        <Tabs 
          value={view} 
          onChange={(e, newValue) => setView(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Archived Reports" value="reports" />
          <Tab label="Trend Analysis" value="trends" />
        </Tabs>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && !loading && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && reports.length === 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          No reports found matching the criteria. Try changing your filters.
        </Alert>
      )}

      {!loading && view === 'reports' && (
        <>
          {selectedReport ? (
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>
              <Button 
                variant="outlined" 
                sx={{ mb: 3 }}
                onClick={() => setSelectedReport(null)}
                startIcon={<ArrowBackIcon />}
              >
                Back to Reports
              </Button>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                Report #{selectedReport.reportId} - {selectedReport.location}
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="textSecondary">Date:</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {format(new Date(selectedReport.createdAt), 'yyyy-MM-dd')}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="textSecondary">Region:</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{selectedReport.region}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="textSecondary">Damage Type:</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{selectedReport.damageType}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="textSecondary">Status:</Typography>
                        {getStatusChip(selectedReport.status)}
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="textSecondary">Severity:</Typography>
                        {getSeverityChip(selectedReport.severity)}
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="textSecondary">Assigned To:</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{selectedReport.assignedTo ? selectedReport.assignedTo.name : 'Unassigned'}</Typography>
                      </Grid>
                      {selectedReport.resolvedAt && (
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" color="textSecondary">Resolved At:</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {format(new Date(selectedReport.resolvedAt), 'yyyy-MM-dd')}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                  <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Description:</Typography>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Typography paragraph>{selectedReport.description || 'No description provided.'}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Before/After Comparison</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Card sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
                        <Box sx={{ position: 'relative', height: 200 }}>
                          <CardMedia
                            component="img"
                            height="200"
                            image={selectedReport.beforeImage}
                            alt="Before repair"
                            sx={{ objectFit: 'cover' }}
                            onError={(e) => {
                              console.log('Before image load error');
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/300x200?text=No+Before+Image';
                            }}
                          />
                        </Box>
                        <CardContent sx={{ bgcolor: '#f5f5f5' }}>
                          <Typography variant="body2" sx={{ fontWeight: 'medium', textAlign: 'center' }}>Before Repair</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6}>
                      <Card sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
                        <Box sx={{ position: 'relative', height: 200 }}>
                          <CardMedia
                            component="img"
                            height="200"
                            image={selectedReport.afterImage}
                            alt="After repair"
                            sx={{ objectFit: 'cover' }}
                            onError={(e) => {
                              console.log('After image load error');
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/300x200?text=No+After+Image';
                            }}
                          />
                        </Box>
                        <CardContent sx={{ bgcolor: '#f5f5f5' }}>
                          <Typography variant="body2" sx={{ fontWeight: 'medium', textAlign: 'center' }}>After Repair</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          ) : (
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Archived Reports
              </Typography>
              <Grid container spacing={3}>
                {reports.map((report) => (
                  <Grid item xs={12} md={4} key={report._id}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer', 
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        borderRadius: 2,
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 6
                        }
                      }} 
                      onClick={() => viewReport(report.reportId)}
                    >
                      <Box sx={{ height: 140, bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img 
                          src={getAuthenticatedImageUrl(report.reportId, 'before')} 
                          alt={report.location} 
                          style={{ 
                            maxHeight: '100%', 
                            maxWidth: '100%', 
                            objectFit: 'cover',
                            width: '100%' 
                          }}
                          onError={(e) => {
                            console.log('Image load error for report:', report.reportId);
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                          }}
                        />
                      </Box>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {report.location}
                          </Typography>
                          <MuiTooltip title="View details">
                            <IconButton size="small" color="primary">
                              <VisibilityIcon />
                            </IconButton>
                          </MuiTooltip>
                        </Box>
                        <Typography color="textSecondary" variant="body2" sx={{ mb: 1 }}>
                          ID: #{report.reportId} | {format(new Date(report.createdAt), 'yyyy-MM-dd')}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                          <Chip 
                            label={report.damageType} 
                            size="small" 
                            sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }} 
                          />
                          {getStatusChip(report.status)}
                          {getSeverityChip(report.severity)}
                        </Box>
                        <Typography variant="body2" sx={{ 
                          mt: 1, 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}>
                          {report.description || 'No description provided.'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}
        </>
      )}

      {!loading && view === 'trends' && (
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2', mb: 3 }}>
            Damage Analysis Dashboard
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 1, mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Damage Type Trends by Month
                </Typography>
                <Box sx={{ height: 350, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={trendData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip contentStyle={{ borderRadius: 8 }} />
                      <Legend />
                      <Bar dataKey="waterDamage" name="Water Damage" stackId="a" fill="#8884d8" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="structural" name="Structural" stackId="a" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="electrical" name="Electrical" stackId="a" fill="#ffc658" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="other" name="Other" stackId="a" fill="#ff8042" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
              
              <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 1 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Severity Trends Over Time
                </Typography>
                <Box sx={{ height: 300, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={severityData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip contentStyle={{ borderRadius: 8 }} />
                      <Legend />
                      <Line type="monotone" dataKey="high" name="High Severity" stroke="#f44336" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="medium" name="Medium Severity" stroke="#ff9800" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="low" name="Low Severity" stroke="#4caf50" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 1, mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Repairs by Region
                </Typography>
                <Box sx={{ height: 300, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={regionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {regionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: 8 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
              
              <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 1 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Key Statistics
                </Typography>
                <Box sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>{stats.totalReports}</Typography>
                        <Typography variant="body2">Total Reports</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, bgcolor: '#e8f5e9', borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>{stats.repaired}</Typography>
                        <Typography variant="body2">Repaired</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, bgcolor: '#fff3e0', borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800' }}>{stats.inProgress}</Typography>
                        <Typography variant="body2">In Progress</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, bgcolor: '#ffebee', borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f44336' }}>{stats.highSeverity}</Typography>
                        <Typography variant="body2">High Severity</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Container>
  );
};

export default Historical;
