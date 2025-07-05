import React, { useState, useEffect} from 'react';
import { 
  Box, Paper, Typography, Grid, TextField, MenuItem, 
  Button, FormControl, InputLabel, Select, Chip, Stack,
  Card, CardContent, IconButton,
  Pagination, Menu, ListItemIcon, ListItemText, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, Snackbar
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import GridViewIcon from '@mui/icons-material/GridView';
import TableRowsIcon from '@mui/icons-material/TableRows';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BusinessIcon from '@mui/icons-material/Business';
import ViewDamageReport from '../components/reports/ViewDamageReport';
import ReportActions from '../components/reports/ReportActions';
import AiReportsDialog from '../components/dashboard/AiReportsDialog';
import CreateDamageReportDialog from '../components/dashboard/CreateDamageReportDialog';
import { useAuth } from '../hooks/useAuth';
import { useTenant } from '../context/TenantContext';
import { api } from '../utils/api';
import { API_BASE_URL, TOKEN_KEY, API_ENDPOINTS } from '../config/constants';

// Professional color palette
const colors = {
  primary: '#2563eb',
  primaryDark: '#1d4ed8',
  secondary: '#64748b',
  success: '#059669',
  warning: '#d97706',
  error: '#dc2626',
  surface: '#ffffff',
  border: '#e2e8f0',
  text: {
    primary: '#1e293b',
    secondary: '#64748b'
  }
};

function Reports() {
  const { user } = useAuth();
  const { tenants } = useTenant();
  const isSuperAdmin = user?.role === 'super-admin';
  
  // Tenant selection state for super admin
  const [selectedTenant, setSelectedTenant] = useState('');
  const [allTenantsReports, setAllTenantsReports] = useState(false);
  
  const [filters, setFilters] = useState({
    dateFrom: null,
    dateTo: null,
    severity: '',
    region: '',
    damageType: '',
    priority: '',
  });
  const [viewMode, setViewMode] = useState('table');
  const [page, setPage] = useState(1);
  const [sortField] = useState('createdAt');
  const [sortDirection] = useState('desc');
  const [anchorEl, setAnchorEl] = useState(null);
  const [filtersDialogOpen, setFiltersDialogOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewReportOpen, setViewReportOpen] = useState(false);
  const [editReportOpen, setEditReportOpen] = useState(false);
  const [editReportData, setEditReportData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // AI Reports state
  const [aiReports, setAiReports] = useState([]);
  const [aiReportsLoading, setAiReportsLoading] = useState(false);
  const [aiReportsError, setAiReportsError] = useState(null);
  const [aiReportsOpen, setAiReportsOpen] = useState(false);
  const [selectedAiReport, setSelectedAiReport] = useState(null);
  
  // Create Report state
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

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // success, error, warning, info

  const exportMenuOpen = Boolean(anchorEl);

  // Pagination
  const pageSize = 6;
  const totalPages = Math.ceil(filteredReports().length / pageSize);

  // Fetch reports from API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setFetchError(null);

        let endpoint = '/damage/reports';
        let data = [];

        // For super admin, fetch reports based on tenant selection
        if (isSuperAdmin) {
          if (selectedTenant) {
            // Fetch reports for specific tenant
            endpoint = `/admin/tenants/${selectedTenant}/reports`;
            data = await api.get(endpoint);
          } else if (allTenantsReports) {
            // Fetch reports from all tenants
            const tenantsData = tenants || [];
            const reportPromises = tenantsData.map(async (tenant) => {
              try {
                const tenantReports = await api.get(`/admin/tenants/${tenant._id}/reports`);
                return tenantReports.map(report => ({
                  ...report,
                  tenantInfo: {
                    id: tenant._id,
                    name: tenant.name,
                    organizationName: tenant.organizationName
                  }
                }));
              } catch (error) {
                console.error(`Error fetching reports for tenant ${tenant.name}:`, error);
                return [];
              }
            });
            
            const allReports = await Promise.all(reportPromises);
            data = allReports.flat();
          } else {
            // No tenant selected, show empty or prompt to select
            data = [];
          }
        } else {
          // Regular admin - use existing endpoint with filters
          const queryParams = new URLSearchParams();
          if (filters.dateFrom) queryParams.append('startDate', filters.dateFrom);
          if (filters.dateTo) queryParams.append('endDate', filters.dateTo);
          if (filters.severity) queryParams.append('severity', filters.severity);
          if (filters.region) queryParams.append('region', filters.region);
          if (filters.priority) queryParams.append('priority', filters.priority);
          
          const query = queryParams.toString();
          endpoint = `/damage/reports${query ? `?${query}` : ''}`;
          data = await api.get(endpoint);
        }

        setReports(data);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setFetchError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [filters, isSuperAdmin, selectedTenant, allTenantsReports, tenants]); 

  // AI Reports functions
  const fetchAiReports = async () => {
    try {
      setAiReportsLoading(true);
      setAiReportsError(null);
      const response = await api.get(`${API_ENDPOINTS.IMAGES}/reports`);
      
      let reportsData = [];
      if (Array.isArray(response)) {
        reportsData = response;
      } else if (response?.reports && Array.isArray(response.reports)) {
        reportsData = response.reports;
      } else if (response && typeof response === 'object') {
        const possibleReports = Object.values(response).find(val => Array.isArray(val));
        reportsData = Array.isArray(possibleReports) ? possibleReports : [];
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
      const workers = await api.get(`${API_ENDPOINTS.FIELD_WORKERS}`);
      const workersData = Array.isArray(workers) ? workers : 
                         (workers.fieldWorkers || workers.workers || []);
      
      setFieldWorkers(workersData);
    } catch (error) {
      console.error('Error fetching field workers:', error);
      setFieldWorkers([]);
    }
  };

  const handleViewAiReports = async () => {
    try {
      setAiReportsLoading(true);
      await Promise.all([
        fetchAiReports(),
        fetchFieldWorkers()
      ]);
      setAiReportsOpen(true);
    } catch (error) {
      console.error('Error in View AI Reports handler:', error);
      setAiReportsOpen(true);
    }
  };

  const handleSelectAiReport = (report) => {
    if (report.damageReportGenerated) {
      alert('A damage report has already been generated from this AI report. Each AI report can only generate one damage report.');
      return;
    }
    
    // Log detailed information about the AI report
    console.log('Selected AI report:', {
      id: report._id || report.id,
      damageType: report.damageType,
      hasAnnotatedImage: !!report.annotatedImageBase64,
      imageLength: report.annotatedImageBase64?.length || 0,
      imageId: report.imageId,
      fullReport: report
    });
    
    setSelectedAiReport(report);
    setReportFormData({
      region: '',
      location: report.location?.address || `${report.location?.coordinates?.[1]}, ${report.location?.coordinates?.[0]}` || '',
      damageType: report.damageType || '',
      severity: report.severity || '',
      priority: report.priority || '',
      description: report.description || `AI-detected ${report.damageType} damage`,
      reporter: 'admin@example.com',
      aiReportId: report._id || report.id,
      assignToWorker: false
    });
    setAiReportsOpen(false);
    setCreateReportOpen(true);
  };

  const handleAiReportsClose = () => {
    setAiReportsOpen(false);
    setSelectedAiReport(null);
  };

  const handleDialogClose = () => {
    setCreateReportOpen(false);
    setSelectedAiReport(null);
    setCreateReportError(null);
    setSelectedFieldWorker('');
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
  };

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    setReportFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFieldWorkerChange = (e) => {
    setSelectedFieldWorker(e.target.value);
    setReportFormData(prev => ({
      ...prev,
      assignToWorker: !!e.target.value
    }));
  };

  const handleCreateReport = async (data) => {
    try {
      setCreateReportLoading(true);
      setCreateReportError(null);
      
      // If passed an event object accidentally, use our formData from state
      // Otherwise use the data parameter directly (which should be the formData)
      const dataToUse = data && data.preventDefault ? reportFormData : data;
      
      // Validate that we have correct data before proceeding
      if (!dataToUse || typeof dataToUse !== 'object') {
        throw new Error('Invalid report data format');
      }

      const reportData = {
        ...dataToUse,
        assignedWorker: dataToUse.assignToWorker ? selectedFieldWorker : null,
        status: 'Pending',
        reporter: 'Admin', // Add reporter field which is required by the backend
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Remove any event objects or circular references before sending to API
      let dataToSend = reportData;
      if (reportData.target || reportData.currentTarget) {
        console.warn('Removing event properties from report data');
        const { target, currentTarget, ...cleanData } = reportData;
        dataToSend = cleanData;
      }

      console.log('Creating damage report with data:', dataToSend);

      let response;
      
      // Use createFromAiReport endpoint if we have a selected AI report
      // This will properly handle the image transfer from AI report to damage report
      if (selectedAiReport && (selectedAiReport._id || selectedAiReport.id)) {
        const aiReportId = selectedAiReport._id || selectedAiReport.id;
        console.log('Creating damage report from AI report:', selectedAiReport);
        console.log('AI report ID:', aiReportId);
        
        // Create the payload with all required fields including the AI report ID
        const aiPayload = {
          ...dataToSend,
          aiReportId: aiReportId
        };
        
        // Make sure the aiReportId is properly formatted
        if (typeof aiReportId === 'object' && aiReportId !== null) {
          aiPayload.aiReportId = aiReportId.toString();
        }
        
        console.log('Payload for create-from-ai:', aiPayload);
        
        // Use the correct endpoint path as defined in damageRoutes.js
        response = await api.post(`${API_ENDPOINTS.DAMAGE_REPORTS}/reports/create-from-ai`, aiPayload);
        
        console.log('Response from create-from-ai:', response);
        
        // Update the AI report to mark it as used
        try {
          const reportId = response?._id || response?.id || response?.report?.id;
          await api.put(`${API_ENDPOINTS.IMAGES}/reports/${selectedAiReport._id}`, {
            damageReportGenerated: true,
            damageReportId: reportId
          });
          console.log('AI report updated with damage report reference:', reportId);
        } catch (updateError) {
          console.warn('Failed to update AI report reference:', updateError);
        }
      } else {
        // Standard creation without AI report
        response = await api.post(`${API_ENDPOINTS.DAMAGE_REPORTS}/reports`, dataToSend);
      }

      // Check response for success flag
      if (response && response.success) {
        // Refresh reports list
        const updatedReports = await api.get(`${API_ENDPOINTS.DAMAGE_REPORTS}/reports`);
        setReports(updatedReports);

        handleDialogClose();
        setSnackbarOpen(true);
        setSnackbarMessage(selectedAiReport ? 'Damage report with AI image created successfully!' : 'Damage report created successfully!');
        setSnackbarSeverity('success');
        
        console.log('Damage report created:', response.report || response);
      } else {
        throw new Error(response?.message || 'Failed to create report');
      }
    } catch (error) {
      console.error('Error creating damage report:', error);
      setCreateReportError(error.message || 'Failed to create damage report');
    } finally {
      setCreateReportLoading(false);
    }
  };

  // Snackbar handler
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  // Utility functions
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in progress':
        return 'info';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'error';
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getSeverityBarColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return colors.error;
      case 'high':
        return colors.error;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.success;
      default:
        return colors.secondary;
    }
  };

  function filteredReports() {
    return reports.filter(report => {
      if (filters.dateFrom && new Date(report.createdAt) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(report.createdAt) > new Date(filters.dateTo)) return false;
      if (filters.severity && report.severity !== filters.severity) return false;
      if (filters.region && report.region !== filters.region) return false;
      if (filters.damageType && report.damageType !== filters.damageType) return false;
      if (filters.priority && report.priority !== filters.priority) return false;
      return true;
    });
  }

  // Sorting logic
  function sortedReports() {
    const arr = [...filteredReports()];
    arr.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortField === 'createdAt') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }

  // Paginated data
  function paginatedReports() {
    const sorted = sortedReports();
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }

  const handleFilterChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value
    });
    setPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: null,
      dateTo: null,
      severity: '',
      region: '',
      damageType: '',
      priority: '',
    });
    setPage(1);
  };

  // Tenant selection handlers for super admin
  const handleTenantChange = (tenantId) => {
    setSelectedTenant(tenantId);
    setAllTenantsReports(false);
    setPage(1);
  };

  const handleAllTenantsToggle = () => {
    setAllTenantsReports(!allTenantsReports);
    setSelectedTenant('');
    setPage(1);
  };

  const handleExportMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExport = (format) => {
    const reportsToExport = filteredReports();
    
    if (reportsToExport.length === 0) {
      // TODO: Show notification that there are no reports to export
      handleExportMenuClose();
      return;
    }
    
    if (format === 'csv') {
      exportToCSV(reportsToExport);
    } else if (format === 'pdf') {
      exportToPDF(reportsToExport);
    }
    
    handleExportMenuClose();
  };
  
  const exportToCSV = (data) => {
    // Format the data for CSV
    const headers = [
      'ReportID', 
      'Date', 
      'Region', 
      'Location', 
      'Damage Type', 
      'Severity', 
      'Priority', 
      'Status',
      'Description'
    ];
    
    const csvRows = [
      headers.join(','),
      ...data.map(report => [
        report.reportId,
        new Date(report.createdAt).toLocaleDateString(),
        report.region || '',
        report.location || '',
        report.damageType || '',
        report.severity || '',
        report.priority || '',
        report.status || '',
        `"${(report.description || '').replace(/"/g, '""')}"`, // Escape quotes in CSV
      ].join(','))
    ];
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `damage-reports-${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const exportToPDF = (data) => {
    // For PDF export, we'll use client-side HTML to PDF conversion
    // Create a new window with formatted content
    const newWindow = window.open('', '_blank');
    
    // Base styles for the PDF
    const styles = `
      body { font-family: Arial, sans-serif; margin: 20px; }
      h1 { color: #2563eb; margin-bottom: 20px; }
      .report-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
      .report-table th, .report-table td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; }
      .report-table th { background-color: #f8fafc; color: #1e293b; }
      .low { color: #059669; }
      .medium { color: #d97706; }
      .high, .critical { color: #dc2626; }
      .pending { color: #d97706; }
      .completed { color: #059669; }
      .in-progress { color: #2563eb; }
    `;
    
    // Create HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Damage Reports - ${new Date().toLocaleDateString()}</title>
        <style>${styles}</style>
      </head>
      <body>
        <h1>Damage Reports - ${new Date().toLocaleDateString()}</h1>
        <table class="report-table">
          <thead>
            <tr>
              <th>Report ID</th>
              <th>Date</th>
              <th>Region</th>
              <th>Damage Type</th>
              <th>Severity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(report => `
              <tr>
                <td>${report.reportId}</td>
                <td>${new Date(report.createdAt).toLocaleDateString()}</td>
                <td>${report.region || ''}</td>
                <td>${report.damageType || ''}</td>
                <td class="${report.severity?.toLowerCase() || ''}">${report.severity || ''}</td>
                <td class="${report.status?.toLowerCase().replace(' ', '-') || ''}">${report.status || ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <p><em>Generated on ${new Date().toLocaleString()}</em></p>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;
    
    newWindow.document.write(htmlContent);
    newWindow.document.close();
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setViewReportOpen(true);
  };

  const handleCloseReport = () => {
    setViewReportOpen(false);
    setSelectedReport(null);
  };

  const handleFilterDelete = (key) => {
    setFilters({
      ...filters,
      [key]: '',
    });
  };

  const handleEditReport = (report) => {
    setEditReportData({...report});
    setEditReportOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      setActionLoading(true);
      const response = await api.put(`/damage/report/${editReportData.reportId}`, editReportData);
      
      // Update the reports state with the updated report
      setReports(reports.map(r => 
        r.reportId === response.report.reportId ? {...r, ...response.report} : r
      ));
      
      setEditReportOpen(false);
      setEditReportData(null);
    } catch (err) {
      console.error('Error updating report:', err);
      // TODO: Add error notification
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteReport = (report) => {
    setReportToDelete(report);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteReport = async () => {
    try {
      setActionLoading(true);
      await api.delete(`/damage/report/${reportToDelete.reportId}`);
      
      // Remove the deleted report from the state
      setReports(reports.filter(r => r.reportId !== reportToDelete.reportId));
      
      setDeleteDialogOpen(false);
      setReportToDelete(null);
    } catch (err) {
      console.error('Error deleting report:', err);
      // TODO: Add error notification
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadReport = async (report) => {
    try {
      setActionLoading(true);
      
      // Show loading notification
      setSnackbarOpen(true);
      setSnackbarMessage('Generating PDF report...');
      setSnackbarSeverity('info');
      
      // Fetch the report data with complete details
      const reportData = await api.get(`/damage/report/${report.reportId}`);
      
      // Get the authenticated image URL
      const imageUrl = `${API_BASE_URL}/damage/report/${report.reportId}/image/before?token=${localStorage.getItem(TOKEN_KEY)}`;
      
      // Import the PDF utility dynamically to reduce initial load time
      const { generateReportPDF } = await import('../utils/pdfUtils');
      
      // Generate and download the PDF
      await generateReportPDF(reportData, imageUrl);
      
      // Show success notification
      setSnackbarOpen(true);
      setSnackbarMessage('PDF report downloaded successfully!');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Error downloading report:', error);
      setSnackbarOpen(true);
      setSnackbarMessage('Error generating PDF report. Please try again.');
      setSnackbarSeverity('error');
    } finally {
      setActionLoading(false);
    }
  };

  // Build options from data
  const severityOptions = Array.from(new Set(reports.map(r => r.severity))).filter(Boolean);
  const regionOptions = Array.from(new Set(reports.map(r => r.region))).filter(Boolean);
  const damageTypeOptions = Array.from(new Set(reports.map(r => r.damageType))).filter(Boolean);
  const priorityOptions = Array.from(new Set(reports.map(r => r.priority))).filter(Boolean);

  // Filter Dialog
  const FilterDialog = () => (
    <Dialog 
      open={filtersDialogOpen} 
      onClose={() => setFiltersDialogOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ 
        pb: 2, 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6">Filter Reports</Typography>
        <IconButton 
          onClick={() => setFiltersDialogOpen(false)}
          size="small"
          sx={{
            color: colors.text.secondary,
            '&:hover': { color: colors.text.primary }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date From"
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date To"
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Severity</InputLabel>
              <Select
                value={filters.severity}
                label="Severity"
                onChange={(e) => handleFilterChange('severity', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {severityOptions.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Region</InputLabel>
              <Select
                value={filters.region}
                label="Region"
                onChange={(e) => handleFilterChange('region', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {regionOptions.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Damage Type</InputLabel>
              <Select
                value={filters.damageType}
                label="Damage Type"
                onChange={(e) => handleFilterChange('damageType', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {damageTypeOptions.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={filters.priority}
                label="Priority"
                onChange={(e) => handleFilterChange('priority', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {priorityOptions.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={() => {
            clearFilters();
            setFiltersDialogOpen(false);
          }}
          color="inherit"
          sx={{ mr: 1 }}
        >
          Clear All
        </Button>
        <Button 
          variant="contained" 
          onClick={() => setFiltersDialogOpen(false)}
        >
          Apply Filters
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderTable = () => (
    <Paper 
      elevation={0}
      sx={{ 
        borderRadius: 2,
        border: `1px solid ${colors.border}`,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: 8, borderBottom: '1px solid #eee' }}>Report ID</th>
              {isSuperAdmin && allTenantsReports && (
                <th style={{ padding: 8, borderBottom: '1px solid #eee' }}>Tenant</th>
              )}
              <th style={{ padding: 8, borderBottom: '1px solid #eee' }}>Date</th>
              <th style={{ padding: 8, borderBottom: '1px solid #eee' }}>Region</th>
              <th style={{ padding: 8, borderBottom: '1px solid #eee' }}>Type</th>
              <th style={{ padding: 8, borderBottom: '1px solid #eee' }}>Severity</th>
              <th style={{ padding: 8, borderBottom: '1px solid #eee' }}>Status</th>
              <th style={{ padding: 8, borderBottom: '1px solid #eee' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedReports().map((report, index) => (
              <tr 
                key={report.id}
                style={{
                  backgroundColor: index % 2 === 0 ? '#f8fafc' : 'inherit'
                }}
              >
                <td style={{ padding: 8, fontWeight: 500, color: colors.primary }}>
                  {report.reportId}
                </td>
                {isSuperAdmin && allTenantsReports && (
                  <td style={{ padding: 8 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BusinessIcon fontSize="small" color="primary" />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {report.tenantInfo?.organizationName || report.tenantInfo?.name || 'Unknown'}
                      </Typography>
                    </Box>
                  </td>
                )}
                <td style={{ padding: 8 }}>
                  {new Date(report.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: 8 }}>{report.region}</td>
                <td style={{ padding: 8 }}>{report.damageType}</td>
                <td style={{ padding: 8 }}>
                  <Chip 
                    label={report.severity}
                    color={getSeverityColor(report.severity)}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      borderRadius: 1,
                    }}
                  />
                </td>
                <td style={{ padding: 8 }}>
                  <Chip 
                    label={report.status}
                    color={getStatusColor(report.status)}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      borderRadius: 1,
                    }}
                  />
                </td>
                <td style={{ padding: 8 }}>
                  <ReportActions 
                    report={report}
                    onView={handleViewReport}
                    onEdit={handleEditReport}
                    onDelete={handleDeleteReport}
                    onDownload={handleDownloadReport}
                    colors={colors}
                  />
                </td>
              </tr>
            ))}
            {paginatedReports().length === 0 && (
              <tr>
                <td colSpan={isSuperAdmin && allTenantsReports ? 8 : 7} style={{ textAlign: 'center', padding: 24, color: '#888' }}>
                  {isSuperAdmin && !selectedTenant && !allTenantsReports ? 
                    'Please select a tenant or choose "Show All Tenants" to view reports.' :
                    'No reports found.'
                  }
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Box>
    </Paper>
  );

  const renderGrid = () => (
    <Grid container spacing={3}>
      {paginatedReports().length === 0 ? (
        <Grid item xs={12}>
          <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#f8fafc' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {isSuperAdmin && !selectedTenant && !allTenantsReports ? 
                '🏢 Select a tenant to view reports' :
                '📄 No reports found'
              }
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isSuperAdmin && !selectedTenant && !allTenantsReports ? 
                'Please select a tenant from the dropdown above or choose "Show All Tenants" to view reports.' :
                'Try adjusting your filters or check back later.'
              }
            </Typography>
          </Paper>
        </Grid>
      ) : (
        paginatedReports().map(report => (
          <Grid item xs={12} sm={6} md={4} key={report.id}>
            <Card 
              sx={{ 
                height: '100%',
                borderRadius: 2,
                transition: 'box-shadow 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                },
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'visible',
                border: `1px solid ${colors.border}`,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: getSeverityBarColor(report.severity),
                  borderRadius: '8px 8px 0 0',
                }
              }}
            >
              <CardContent sx={{ flex: 1 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" component="div" gutterBottom>
                    {report.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </Typography>
                  
                  {/* Show tenant info for super admin viewing all tenants */}
                  {isSuperAdmin && allTenantsReports && report.tenantInfo && (
                    <Box sx={{ mt: 1, p: 1, bgcolor: '#e3f2fd', borderRadius: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <BusinessIcon fontSize="small" color="primary" />
                        <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
                          {report.tenantInfo.organizationName || report.tenantInfo.name}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
                
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Chip 
                    label={report.severity}
                    color={getSeverityColor(report.severity)}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                  <Chip 
                    label={report.status}
                    color={getStatusColor(report.status)}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Stack>

                <Typography variant="body2" paragraph>
                  {report.description}
                </Typography>

                <Box sx={{ mt: 'auto' }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {report.region} • {report.damageType}
                  </Typography>
                </Box>
              </CardContent>

              <Box 
                sx={{ 
                  p: 2, 
                  pt: 0,
                  borderTop: `1px solid ${colors.border}`,
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}
              >
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => handleViewReport(report)}
                  sx={{
                    bgcolor: colors.primary,
                    color: 'white',
                    '&:hover': {
                      bgcolor: colors.primaryDark,
                    },
                  }}
                >
                  View Details
                </Button>
              </Box>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );

  // Edit Report Dialog
  const EditReportDialog = () => (
    <Dialog 
      open={editReportOpen} 
      onClose={() => {
        if (!actionLoading) {
          setEditReportOpen(false);
          setEditReportData(null);
        }
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ 
        pb: 2, 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6">Edit Report</Typography>
        <IconButton 
          onClick={() => {
            if (!actionLoading) {
              setEditReportOpen(false);
              setEditReportData(null);
            }
          }}
          size="small"
          disabled={actionLoading}
          sx={{
            color: colors.text.secondary,
            '&:hover': { color: colors.text.primary }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {editReportData && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Report ID"
                value={editReportData.reportId || ''}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date Created"
                value={new Date(editReportData.createdAt).toLocaleString() || ''}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Damage Type</InputLabel>
                <Select
                  value={editReportData.damageType || ''}
                  label="Damage Type"
                  onChange={(e) => setEditReportData({...editReportData, damageType: e.target.value})}
                  disabled={actionLoading}
                >
                  {damageTypeOptions.map(option => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Severity</InputLabel>
                <Select
                  value={editReportData.severity || ''}
                  label="Severity"
                  onChange={(e) => setEditReportData({...editReportData, severity: e.target.value})}
                  disabled={actionLoading}
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={editReportData.priority || ''}
                  label="Priority"
                  onChange={(e) => setEditReportData({...editReportData, priority: e.target.value})}
                  disabled={actionLoading}
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editReportData.status || ''}
                  label="Status"
                  onChange={(e) => setEditReportData({...editReportData, status: e.target.value})}
                  disabled={actionLoading}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Assigned">Assigned</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Region"
                value={editReportData.region || ''}
                onChange={(e) => setEditReportData({...editReportData, region: e.target.value})}
                disabled={actionLoading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                value={editReportData.location || ''}
                onChange={(e) => setEditReportData({...editReportData, location: e.target.value})}
                disabled={actionLoading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={editReportData.description || ''}
                onChange={(e) => setEditReportData({...editReportData, description: e.target.value})}
                disabled={actionLoading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Action Required"
                multiline
                rows={2}
                value={editReportData.action || ''}
                onChange={(e) => setEditReportData({...editReportData, action: e.target.value})}
                disabled={actionLoading}
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={() => {
            if (!actionLoading) {
              setEditReportOpen(false);
              setEditReportData(null);
            }
          }}
          color="inherit"
          disabled={actionLoading}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSaveEdit}
          disabled={actionLoading}
          startIcon={actionLoading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {actionLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
  
  // Delete Confirmation Dialog
  const DeleteConfirmationDialog = () => (
    <Dialog 
      open={deleteDialogOpen} 
      onClose={() => {
        if (!actionLoading) {
          setDeleteDialogOpen(false);
          setReportToDelete(null);
        }
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Typography variant="h6">Confirm Delete</Typography>
      </DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete the report {reportToDelete?.reportId}? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={() => {
            if (!actionLoading) {
              setDeleteDialogOpen(false);
              setReportToDelete(null);
            }
          }}
          color="inherit"
          disabled={actionLoading}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          color="error"
          onClick={confirmDeleteReport}
          disabled={actionLoading}
          startIcon={actionLoading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {actionLoading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <Box sx={{ py: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', md: 'center' },
            mb: 4,
            gap: 2,
          }}
        >
          {/* Super Admin Tenant Selection */}
          {isSuperAdmin && (
            <Box sx={{ mb: { xs: 2, md: 0 } }}>
              <Typography variant="h6" sx={{ mb: 2, color: colors.primary, fontWeight: 600 }}>
                🏢 Tenant Reports
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Select Tenant</InputLabel>
                  <Select
                    value={selectedTenant}
                    label="Select Tenant"
                    onChange={(e) => handleTenantChange(e.target.value)}
                    disabled={allTenantsReports}
                  >
                    <MenuItem value="">
                      <em>Choose a tenant...</em>
                    </MenuItem>
                    {(tenants || []).map((tenant) => (
                      <MenuItem key={tenant._id} value={tenant._id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <BusinessIcon fontSize="small" />
                          <Typography variant="body2">
                            {tenant.organizationName || tenant.name}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <Button
                  variant={allTenantsReports ? 'contained' : 'outlined'}
                  onClick={handleAllTenantsToggle}
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    ...(allTenantsReports ? {
                      bgcolor: colors.warning,
                      color: 'white',
                      '&:hover': {
                        bgcolor: '#b45309',
                      },
                    } : {
                      borderColor: colors.warning,
                      color: colors.warning,
                      '&:hover': {
                        bgcolor: '#fef3c7',
                      },
                    })
                  }}
                >
                  {allTenantsReports ? 'Showing All Tenants' : 'Show All Tenants'}
                </Button>
              </Stack>
              
              {/* Current Selection Info */}
              {(selectedTenant || allTenantsReports) && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#f0f9ff', borderRadius: 2, border: '1px solid #bfdbfe' }}>
                  <Typography variant="body2" color="primary">
                    {allTenantsReports 
                      ? `📊 Showing reports from all ${(tenants || []).length} tenants`
                      : `📋 Showing reports for: ${(tenants || []).find(t => t._id === selectedTenant)?.organizationName || 'Selected Tenant'}`
                    }
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ minWidth: { sm: '400px' } }}
          >
            <Button
              variant="contained"
              startIcon={<FilterListIcon />}
              onClick={() => setFiltersDialogOpen(true)}
              sx={{
                bgcolor: colors.primary,
                color: 'white',
                '&:hover': {
                  bgcolor: colors.primaryDark,
                },
                px: 3,
              }}
            >
              Filters
            </Button>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('grid')}
                sx={{
                  minWidth: 'auto',
                  px: 2,
                  ...(viewMode === 'grid' ? {
                    bgcolor: colors.primary,
                    color: 'white',
                    '&:hover': {
                      bgcolor: colors.primaryDark,
                    },
                  } : {
                    borderColor: colors.border,
                  })
                }}
              >
                <GridViewIcon />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('table')}
                sx={{
                  minWidth: 'auto',
                  px: 2,
                  ...(viewMode === 'table' ? {
                    bgcolor: colors.primary,
                    color: 'white',
                    '&:hover': {
                      bgcolor: colors.primaryDark,
                    },
                  } : {
                    borderColor: colors.border,
                  })
                }}
              >
                <TableRowsIcon />
              </Button>
            </Box>

            <Button
              variant="contained"
              startIcon={<AssignmentIcon />}
              onClick={handleViewAiReports}
              sx={{
                bgcolor: colors.warning,
                color: 'white',
                '&:hover': {
                  bgcolor: '#b45309',
                },
              }}
            >
              AI Reports
            </Button>

            <Button
              variant="contained"
              startIcon={<FileDownloadIcon />}
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{
                bgcolor: colors.success,
                '&:hover': {
                  bgcolor: '#047857',
                },
              }}
            >
              Export
            </Button>
          </Stack>
        </Box>

        {/* Tenant Summary Stats for Super Admin */}
        {isSuperAdmin && allTenantsReports && reports.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Paper sx={{ p: 3, borderRadius: 2, bgcolor: '#f8f9fa' }}>
              <Typography variant="h6" sx={{ mb: 2, color: colors.primary, fontWeight: 600 }}>
                📊 Tenant Summary
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: colors.primary }}>
                      {(tenants || []).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Tenants
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: colors.success }}>
                      {reports.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Reports
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: colors.error }}>
                      {reports.filter(r => r.severity === 'HIGH' || r.severity === 'CRITICAL').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      High Priority
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: colors.warning }}>
                      {reports.filter(r => r.status === 'Pending').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        )}

        {/* Active Filters */}
        <Box sx={{ mb: 3 }}>
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            sx={{ gap: 1 }}
          >
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null;
              return (
                <Chip
                  key={key}
                  label={`${key}: ${value}`}
                  onDelete={() => handleFilterDelete(key)}
                  sx={{
                    bgcolor: colors.border,
                    color: colors.text.primary,
                    '& .MuiChip-deleteIcon': {
                      color: colors.text.secondary,
                    },
                    fontWeight: 500,
                  }}
                />
              );
            })}
          </Stack>
        </Box>

        {/* Main Content */}
        <Box sx={{ position: 'relative' }}>
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px',
                gap: 2
              }}
            >
              <CircularProgress size={60} />
              <Typography variant="h6" color="text.secondary">
                {isSuperAdmin && allTenantsReports 
                  ? 'Loading reports from all tenants...' 
                  : isSuperAdmin && selectedTenant 
                    ? `Loading reports for ${(tenants || []).find(t => t._id === selectedTenant)?.organizationName || 'selected tenant'}...`
                    : 'Loading reports...'
                }
              </Typography>
            </Box>
          ) : fetchError ? (
            <Paper
              sx={{
                p: 3,
                textAlign: 'center',
                bgcolor: '#fef2f2',
                border: `1px solid ${colors.error}`,
                borderRadius: 2,
              }}
            >
              <Typography color="error.main">{fetchError}</Typography>
            </Paper>
          ) : (
            <>
              <Box sx={{ mb: 3 }}>
                {viewMode === 'table' ? renderTable() : renderGrid()}
              </Box>
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  mt: 4,
                }}
              >
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                  siblingCount={1}
                  boundaryCount={1}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      borderRadius: 1,
                    },
                  }}
                />
              </Box>
            </>
          )}
        </Box>

        {/* Filters Dialog */}
        <FilterDialog />

        {/* Edit Report Dialog */}
        <EditReportDialog />
        
        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog />

        {/* Render Export Menu */}
        <Menu
          anchorEl={anchorEl}
          open={exportMenuOpen}
          onClose={handleExportMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={() => handleExport('csv')}>
            <ListItemIcon>
              <FileDownloadIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Export as CSV</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleExport('pdf')}>
            <ListItemIcon>
              <FileDownloadIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Export as PDF</ListItemText>
          </MenuItem>
        </Menu>

        {/* Render View Report Dialog */}
        <Dialog
          open={viewReportOpen}
          onClose={handleCloseReport}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ 
            pb: 2, 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="h6">Report Details</Typography>
            <IconButton 
              onClick={handleCloseReport}
              size="small"
              sx={{
                color: colors.text.secondary,
                '&:hover': { color: colors.text.primary }
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {selectedReport && <ViewDamageReport report={selectedReport} />}
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={handleCloseReport}>Close</Button>
          </DialogActions>
        </Dialog>

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
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Reports;