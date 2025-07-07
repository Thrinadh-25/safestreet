import React, { useState, useEffect, useCallback } from 'react';
import { 
  Grid, 
  Box, 
  Typography, 
  IconButton, 
  Button,
  Stack,
  Tooltip,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Tabs,
  Tab
} from '@mui/material';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReportIcon from '@mui/icons-material/Report';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; 
import WarningIcon from '@mui/icons-material/Warning';
import RefreshIcon from '@mui/icons-material/Refresh';
import BusinessIcon from '@mui/icons-material/Business';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';

// Custom Components
import StatCard from '../components/dashboard/StatCard';
import RecentReports from '../components/dashboard/RecentReports';
import QuickActions from '../components/dashboard/QuickActions';
import AiReportsDialog from '../components/dashboard/AiReportsDialog';
import CreateDamageReportDialog from '../components/dashboard/CreateDamageReportDialog';

// Auth
import { useAuth } from '../hooks/useAuth';

// API
import { api } from '../utils/api';
import { API_ENDPOINTS } from '../config/constants';

// Import formatters
import { formatLocation } from '../utils/formatters';

const Dashboard = () => {
  // Get user data to check role
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super-admin';
  
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalReports: 0,
    pendingRepairs: 0,
    completedRepairs: 0,
    criticalDamages: 0,
    recentReports: []
  });
  
  // Super admin specific state
  const [tenants, setTenants] = useState([]);
  const [tenantsLoading, setTenantsLoading] = useState(false);
  const [tenantsError, setTenantsError] = useState(null);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminUsersLoading, setAdminUsersLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  
  const [aiReports, setAiReports] = useState([]);
  const [aiReportsLoading, setAiReportsLoading] = useState(false);
  const [aiReportsError, setAiReportsError] = useState(null);
  const [aiReportsOpen, setAiReportsOpen] = useState(false);
  const [selectedAiReport, setSelectedAiReport] = useState(null);
  
  const [fieldWorkers, setFieldWorkers] = useState([]);
  const [selectedFieldWorker, setSelectedFieldWorker] = useState('');
  
  const [createReportOpen, setCreateReportOpen] = useState(false);
  const [reportFormData, setReportFormData] = useState({
    region: '',
    location: '',
    damageType: '',
    severity: '',
    priority: '',
    description: '',
    reporter: 'admin@example.com', 
    aiReportId: null, 
    assignToWorker: false
  });
  const [createReportLoading, setCreateReportLoading] = useState(false);
  const [createReportError, setCreateReportError] = useState(null);
  
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      console.log('Fetching dashboard data...');
      
      // Different API calls based on user role
      if (user?.role === 'super-admin') {
        // Fetch tenants data for super admin
        setTenantsLoading(true);
        try {
          const tenantsData = await api.get(`${API_ENDPOINTS.TENANTS}`);
          setTenants(tenantsData);
          console.log('Tenants data fetched:', tenantsData.length || 0, 'tenants');
        } catch (error) {
          console.error('Error fetching tenants:', error);
          setTenantsError(error.message || 'Failed to load tenants');
        } finally {
          setTenantsLoading(false);
        }
        
        // Fetch admin users across all tenants
        setAdminUsersLoading(true);
        try {
          const adminsData = await api.get(`${API_ENDPOINTS.ADMIN}/all`);
          setAdminUsers(adminsData);
        } catch (error) {
          console.error('Error fetching admins:', error);
        } finally {
          setAdminUsersLoading(false);
        }
      }
      
      // Fetch reports data (for both admin and super-admin)
      const reportsData = await api.get(`${API_ENDPOINTS.DAMAGE_REPORTS}/reports`);
      console.log('Reports data fetched:', reportsData.length || 0, 'reports');
      
      const totalReports = reportsData.length || 0;
      const pendingRepairs = reportsData.filter(r => r.status === 'Pending').length;
      const completedRepairs = reportsData.filter(r => r.status === 'Completed').length;
      const criticalDamages = reportsData.filter(r => r.severity === 'HIGH' || r.severity === 'Critical').length;
      
      let recentReports = [];
      if (Array.isArray(reportsData) && reportsData.length > 0) {
        const sortedReports = [...reportsData].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        recentReports = sortedReports.slice(0, 3).map(report => ({
          id: report._id,
          title: `${report.damageType} ${report.location?.address ? `at ${report.location.address}` : ''}`,
          severity: report.severity,
          location: report.location || { address: 'Location not available' }, // Ensure location is an object
          timestamp: new Date(report.createdAt).toLocaleDateString(),
          status: report.status
        }));
      }
      
      
      setDashboardData({
        totalReports,
        pendingRepairs,
        completedRepairs,
        criticalDamages,
        recentReports
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData({
        totalReports: 0,
        pendingRepairs: 0,
        completedRepairs: 0,
        criticalDamages: 0,
        recentReports: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);


  const fetchAiReports = async () => {
    try {
      setAiReportsLoading(true);
      setAiReportsError(null);
      const response = await api.get(`${API_ENDPOINTS.IMAGES}/reports`);
      
      console.log('Raw API response for AI reports:', response);
      
      let reportsData = [];
      if (Array.isArray(response)) {
        reportsData = response;
      } else if (response?.reports && Array.isArray(response.reports)) {
        reportsData = response.reports;
      } else if (response && typeof response === 'object') {
        const possibleReports = Object.values(response).find(val => Array.isArray(val));
        reportsData = Array.isArray(possibleReports) ? possibleReports : [];
      }
      
      console.log('Processed reports data:', reportsData);
      if (reportsData.length > 0) {
        console.log('First report sample:', {
          ...reportsData[0],
          annotatedImageBase64: reportsData[0].annotatedImageBase64 ? 
            `[${reportsData[0].annotatedImageBase64.length} chars]` : 'missing'
        });
      }
      
      setAiReports(reportsData || []);
    } catch (error) {
      console.error('Error fetching AI reports:', error);
      setAiReportsError(error.message || 'Failed to fetch AI reports');
      setAiReports([]);
    } finally {
      setAiReportsLoading(false);
    }
  };

  const fetchFieldWorkers = async () => {
    try {
      // Use appropriate endpoint based on user role
      const endpoint = user?.role === 'super-admin' 
        ? `${API_ENDPOINTS.ADMIN}/field-workers/all`
        : `${API_ENDPOINTS.FIELD_WORKERS}`;
      
      const workers = await api.get(endpoint);
      const workersData = Array.isArray(workers) ? workers : 
                         (workers.fieldWorkers || workers.workers || []);
      
      setFieldWorkers(workersData);
    } catch (error) {
      console.error('Error fetching field workers:', error);
      setFieldWorkers([]);
    }
  };

  const handleViewAnalytics = async () => {
    try {
      
      setAiReportsLoading(true);
      
      await Promise.all([
        fetchAiReports(),
        fetchFieldWorkers()
      ]);
      
      setAiReportsOpen(true);
    } catch (error) {
      console.error('Error in View Analytics handler:', error);
      setAiReportsOpen(true);
    }
  };

  const handleSelectAiReport = (report) => {
    if (report.damageReportGenerated) {
      alert('Damage report already generated for this AI report.');
      return;
    }
    setSelectedAiReport(report);

    setReportFormData({
      ...reportFormData,
      region: reportFormData.region || '',
      location: reportFormData.location || '',
      damageType: report.damageType || '',
      severity: report.severity || '',
      priority: report.priority?.toString() || '',
      aiReportId: report.id,
      reporter: 'admin@example.com',
    });


    setCreateReportOpen(true);
  };

  const resetFormData = () => {
    setReportFormData({
      region: '',
      location: '',
      damageType: '',
      severity: '',
      priority: '',
      description: '',
      reporter: 'admin@example.com',
      aiReportId: null,
      assignToWorker: false
    });
    setSelectedFieldWorker('');
    setSelectedAiReport(null);
    setCreateReportError(null);
  };

  const handleDialogClose = () => {
    resetFormData();
    setCreateReportOpen(false);
  };

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    setReportFormData({
      ...reportFormData,
      [name]: value
    });
  };

  const handleFieldWorkerChange = (e) => {
    setSelectedFieldWorker(e.target.value);
    setReportFormData({
      ...reportFormData,
      assignToWorker: !!e.target.value
    });
  };

  const handleCreateReport = async () => {
    try {
      setCreateReportLoading(true);
      setCreateReportError(null);
      
      const aiReportId = reportFormData.aiReportId || (selectedAiReport?.id);
      
      if (!aiReportId) {
        setCreateReportError('AI Report ID is missing. Please select an AI report first.');
        setCreateReportLoading(false);
        return;
      }
      

      const requiredFields = ['region', 'location', 'damageType', 'severity', 'priority'];
      const missingFields = requiredFields.filter(field => !reportFormData[field]);
      
      if (missingFields.length > 0) {
        setCreateReportError(`Please fill in all required fields: ${missingFields.join(', ')}`);
        setCreateReportLoading(false);
        return;
      }

      let endpoint = `${API_ENDPOINTS.DAMAGE_REPORTS}/reports/create-from-ai`;
      let payload = { 
        ...reportFormData,
        aiReportId
      };



      if (reportFormData.assignToWorker && selectedFieldWorker) {
        endpoint = `${API_ENDPOINTS.DAMAGE_REPORTS}/reports/create-and-assign`;
        payload.workerId = selectedFieldWorker;
      }

      const response = await api.post(endpoint, payload);
      
      const isSuccess = response.success || response.report || 
                       (response.message && response.message.includes('success'));
      
      if (isSuccess) {
        resetFormData();
        
        setCreateReportOpen(false);
        setAiReportsOpen(false);
        
        setTimeout(() => {
          fetchDashboardData();
        }, 1000); 
      } else {
        throw new Error(response.message || 'Failed to create damage report');
      }
    } catch (error) {
      console.error('Error creating damage report:', error);
      setCreateReportError(error.message || 'Failed to create damage report');
    } finally {
      setCreateReportLoading(false);
    }
  };

  const handleAiReportsClose = () => {
    setAiReportsOpen(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                {user?.role === 'super-admin' ? 
                  'Welcome, Super Admin! 👋' : 
                  'Welcome back, Admin! 👋'
                }
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                {user?.role === 'super-admin' ?
                  'Manage all tenants and system-wide operations' :
                  'Here\'s what\'s happening with SafeStreets today'
                }
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={2}>
              <Tooltip title="Refresh Dashboard">
                <IconButton 
                  onClick={fetchDashboardData}
                  disabled={loading}
                  sx={{
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
                      transform: 'rotate(180deg)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              {/* Activity Feed was here */}
              <Button
                variant="contained"
                startIcon={<DashboardIcon />}
                onClick={handleViewAnalytics}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 3,
                  px: 3,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                AI Reports
              </Button>
            </Stack>
          </Stack>
        </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<ReportIcon />}
            title="Total Reports"
            value={dashboardData.totalReports}
            change={12}
            color="primary"
            loading={loading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<BuildIcon />}
            title="Pending Repairs"
            value={dashboardData.pendingRepairs}
            change={-8}
            color="warning"
            loading={loading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<CheckCircleIcon />}
            title="Completed Repairs"
            value={dashboardData.completedRepairs}
            change={15}
            color="success"
            loading={loading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<WarningIcon />}
            title="Critical Issues"
            value={dashboardData.criticalDamages}
            change={-5}
            color="error"
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {user?.role === 'super-admin' ? (
          <>
            {/* Super Admin Content */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                  <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
                    <Tab label="Tenants Overview" />
                    <Tab label="System Statistics" />
                    <Tab label="Recent Reports" />
                  </Tabs>
                </Box>
                
                {/* Tenants Overview Tab Panel */}
                {selectedTab === 0 && (
                  <Box sx={{ py: 2 }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      startIcon={<BusinessIcon />}
                      onClick={() => window.location.href = '/tenants'}
                      sx={{ mb: 3 }}
                    >
                      Manage Tenants
                    </Button>
                    
                    <List>
                      {tenants.map(tenant => (
                        <ListItem 
                          key={tenant._id} 
                          sx={{ 
                            border: '1px solid #e0e0e0', 
                            borderRadius: 1, 
                            mb: 1,
                            backgroundColor: tenant.active ? '#f5f9ff' : '#f5f5f5'
                          }}
                        >
                          <ListItemIcon>
                            <BusinessIcon color={tenant.active ? 'primary' : 'disabled'} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={tenant.name} 
                            secondary={`Code: ${tenant.code} | Status: ${tenant.active ? 'Active' : 'Inactive'}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
                
                {/* System Statistics Tab Panel */}
                {selectedTab === 1 && (
                  <Box sx={{ py: 2 }}>
                    {/* Show the same stats cards but in a different layout */}
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Typography variant="h6" sx={{ mb: 2 }}>System-wide Statistics</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <RecentReports reports={dashboardData.recentReports} loading={loading} />
                      </Grid>
                    </Grid>
                  </Box>
                )}
                
                {/* Recent Reports Tab Panel */}
                {selectedTab === 2 && (
                  <Box sx={{ py: 2 }}>
                    <RecentReports reports={dashboardData.recentReports} loading={loading} />
                  </Box>
                )}
              </Paper>
            </Grid>
          </>
        ) : (
          <>
            {/* Regular Admin Content */}
            <Grid item xs={12} lg={8}>
              <RecentReports reports={dashboardData.recentReports} loading={loading} />
            </Grid>

            <Grid item xs={12}>
              <QuickActions />
            </Grid>
          </>
        )}
      </Grid>

      {/* AI Reports Dialog */}
      <AiReportsDialog
        open={aiReportsOpen}
        onClose={handleAiReportsClose}
        reports={aiReports}
        loading={aiReportsLoading}
        error={aiReportsError}
        onSelectReport={handleSelectAiReport}
      />

      {/* Create Damage Report Dialog */}
      <CreateDamageReportDialog 
        open={createReportOpen}
        onClose={handleDialogClose}
        onSubmit={handleCreateReport}
        selectedAiReport={selectedAiReport}
        formData={reportFormData}
        onFormChange={handleFormInputChange}
        fieldWorkers={fieldWorkers}
        onFieldWorkerChange={handleFieldWorkerChange}
        selectedFieldWorker={selectedFieldWorker}
        loading={createReportLoading}
        error={createReportError}
      />
    </Box>
  );
};

export default Dashboard;
