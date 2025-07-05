import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Chip,
  Tabs,
  Tab,
  Paper,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { API_BASE_URL, API_ENDPOINTS, TOKEN_KEY } from '../config/constants';

// Import components
import TenantInfo from '../components/tenant/TenantInfo';
import AdminsList from '../components/tenant/AdminsList';
import FieldWorkersList from '../components/tenant/FieldWorkersList';
import ReportsList from '../components/tenant/ReportsList';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tenant-tabpanel-${index}`}
      aria-labelledby={`tenant-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const TenantDetails = () => {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [fieldWorkers, setFieldWorkers] = useState([]);
  const [reports, setReports] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem(TOKEN_KEY);
        
        // Fetch tenant details
        const tenantRes = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TENANTS}/${tenantId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!tenantRes.ok) {
          const errorData = await tenantRes.json();
          throw new Error(errorData.message || 'Failed to load tenant details');
        }
        
        const tenantData = await tenantRes.json();
        setTenant(tenantData);
        
        // Fetch tenant admins
        const adminsRes = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADMIN}/tenants/${tenantId}/admins`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (adminsRes.ok) {
          const adminsData = await adminsRes.json();
          setAdmins(adminsData);
        }
        
        // Fetch tenant field workers
        const workersRes = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADMIN}/tenants/${tenantId}/field-workers`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (workersRes.ok) {
          const workersData = await workersRes.json();
          setFieldWorkers(workersData);
        }
        
        // Fetch tenant reports
        const reportsRes = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADMIN}/tenants/${tenantId}/reports`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (reportsRes.ok) {
          const reportsData = await reportsRes.json();
          setReports(reportsData);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tenant details:', err);
        setError(err.message || 'Failed to fetch tenant details. Please check your authorization.');
        setLoading(false);
      }
    };
    
    fetchTenantData();
  }, [tenantId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleBackToTenants = () => {
    navigate('/tenants');
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error || !tenant) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" gap={2} height="60vh" justifyContent="center">
        <Typography color="error" variant="h6">{error || 'Tenant not found'}</Typography>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBackToTenants}>
          Back to Tenants
        </Button>
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          mb: 3, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={handleBackToTenants}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" component="h1">
            {tenant.name}
          </Typography>
          <Chip 
            label={tenant.active ? 'Active' : 'Inactive'} 
            color={tenant.active ? 'success' : 'default'}
            size="small"
            sx={{ ml: 1 }}
          />
        </Box>

      </Paper>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <TenantInfo tenant={tenant} />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                aria-label="tenant tabs"
                sx={{ px: 2 }}
              >
                <Tab label="Overview" />
                <Tab label={`Admins (${admins.length})`} />
                <Tab label={`Field Workers (${fieldWorkers.length})`} />
                <Tab label={`Reports (${reports.length})`} />
              </Tabs>
            </Box>
            
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" gutterBottom>
                    Admin Access
                  </Typography>
                  <Typography variant="body1">
                    This tenant has {admins.length} admin{admins.length !== 1 ? 's' : ''}.
                  </Typography>
                  <Button 
                    sx={{ mt: 1 }}
                    variant="outlined" 
                    onClick={() => setTabValue(1)}
                  >
                    Manage Admins
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" gutterBottom>
                    Field Workers
                  </Typography>
                  <Typography variant="body1">
                    This tenant has {fieldWorkers.length} field worker{fieldWorkers.length !== 1 ? 's' : ''}.
                  </Typography>
                  <Button 
                    sx={{ mt: 1 }}
                    variant="outlined" 
                    onClick={() => setTabValue(2)}
                  >
                    Manage Field Workers
                  </Button>
                </Grid>
                {reports.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                      Recent Activity
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {reports.length} damage report{reports.length !== 1 ? 's' : ''} in the system.
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <AdminsList 
                tenantId={tenantId} 
                admins={admins} 
                setAdmins={setAdmins} 
              />
            </TabPanel>
            
            <TabPanel value={tabValue} index={2}>
              <FieldWorkersList 
                tenantId={tenantId} 
                fieldWorkers={fieldWorkers} 
                setFieldWorkers={setFieldWorkers} 
              />
            </TabPanel>
            
            <TabPanel value={tabValue} index={3}>
              <ReportsList reports={reports} />
            </TabPanel>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TenantDetails;
