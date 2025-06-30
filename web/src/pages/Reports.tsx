import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Pagination,
  InputAdornment,
} from '@mui/material';
import {
  Search,
  FilterList,
  Download,
  Visibility,
  Delete,
  LocationOn,
  Schedule,
  CheckCircle,
  Error,
  Image,
} from '@mui/icons-material';
import { Upload, PaginatedResponse } from '../types';
import { uploadService } from '../services/uploadService';
import { format } from 'date-fns';

const Reports: React.FC = () => {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUpload, setSelectedUpload] = useState<Upload | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [uploadToDelete, setUploadToDelete] = useState<Upload | null>(null);
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    severity: '',
    damageType: '',
    dateFrom: '',
    dateTo: '',
  });
  
  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  useEffect(() => {
    loadUploads();
  }, [filters, pagination.currentPage]);

  const loadUploads = async () => {
    try {
      setLoading(true);
      setError('');
      
      // For demo purposes, we'll use mock data
      // In production, uncomment the line below:
      // const response = await uploadService.getUploads({
      //   ...filters,
      //   page: pagination.currentPage,
      //   limit: 10,
      // });
      
      // Mock data for demonstration
      const mockUploads: Upload[] = [
        {
          id: '1',
          userId: 'user1',
          user: {
            id: 'user1',
            fullName: 'John Doe',
            email: 'john@example.com',
            createdAt: '2024-01-01T00:00:00Z',
            isActive: true,
          },
          imageUri: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg',
          imageMetadata: {
            originalName: 'pothole_main_st.jpg',
            size: 2048000,
            mimeType: 'image/jpeg',
            dimensions: { width: 1920, height: 1080 }
          },
          location: {
            latitude: 40.7128,
            longitude: -74.0060,
            address: '123 Main St, New York, NY 10001'
          },
          status: 'success',
          aiAnalysis: {
            damageType: 'Pothole',
            severity: 'High',
            confidence: 0.95,
            recommendations: ['Immediate repair required', 'Traffic diversion recommended'],
            processingTime: 2.3,
            modelVersion: '1.0.0'
          },
          repairStatus: 'In Progress',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T14:20:00Z',
          processedAt: '2024-01-15T10:32:00Z',
        },
        {
          id: '2',
          userId: 'user2',
          user: {
            id: 'user2',
            fullName: 'Jane Smith',
            email: 'jane@example.com',
            createdAt: '2024-01-01T00:00:00Z',
            isActive: true,
          },
          imageUri: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg',
          imageMetadata: {
            originalName: 'crack_elm_ave.jpg',
            size: 1536000,
            mimeType: 'image/jpeg',
            dimensions: { width: 1920, height: 1080 }
          },
          location: {
            latitude: 40.7589,
            longitude: -73.9851,
            address: '456 Elm Ave, Manhattan, NY 10002'
          },
          status: 'processing',
          repairStatus: 'Reported',
          createdAt: '2024-01-15T09:15:00Z',
          updatedAt: '2024-01-15T09:15:00Z',
        },
        {
          id: '3',
          userId: 'user3',
          user: {
            id: 'user3',
            fullName: 'Mike Johnson',
            email: 'mike@example.com',
            createdAt: '2024-01-01T00:00:00Z',
            isActive: true,
          },
          imageUri: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg',
          imageMetadata: {
            originalName: 'surface_wear_oak_st.jpg',
            size: 1800000,
            mimeType: 'image/jpeg',
            dimensions: { width: 1920, height: 1080 }
          },
          location: {
            latitude: 40.7505,
            longitude: -73.9934,
            address: '789 Oak St, Brooklyn, NY 11201'
          },
          status: 'success',
          aiAnalysis: {
            damageType: 'Surface Wear',
            severity: 'Medium',
            confidence: 0.87,
            recommendations: ['Schedule routine maintenance', 'Monitor for progression'],
            processingTime: 1.8,
            modelVersion: '1.0.0'
          },
          repairStatus: 'Completed',
          createdAt: '2024-01-14T16:45:00Z',
          updatedAt: '2024-01-15T11:30:00Z',
          processedAt: '2024-01-14T16:47:00Z',
        },
      ];
      
      setUploads(mockUploads);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: mockUploads.length,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleViewDetails = (upload: Upload) => {
    setSelectedUpload(upload);
    setDetailDialogOpen(true);
  };

  const handleDeleteClick = (upload: Upload) => {
    setUploadToDelete(upload);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!uploadToDelete) return;
    
    try {
      await uploadService.deleteUpload(uploadToDelete.id);
      setUploads(prev => prev.filter(u => u.id !== uploadToDelete.id));
      setDeleteDialogOpen(false);
      setUploadToDelete(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete upload');
    }
  };

  const handleExport = async () => {
    try {
      const blob = await uploadService.exportUploads(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reports_${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setError(err.message || 'Failed to export reports');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#ff9500';
      case 'processing': return '#007AFF';
      case 'success': return '#34c759';
      case 'failed': return '#ff3b30';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Schedule />;
      case 'processing': return <Schedule />;
      case 'success': return <CheckCircle />;
      case 'failed': return <Error />;
      default: return <Schedule />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low': return '#34c759';
      case 'Medium': return '#ff9500';
      case 'High': return '#ff6b35';
      case 'Critical': return '#ff3b30';
      default: return '#6c757d';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Reports Management
        </Typography>
        <Typography variant="body1" sx={{ color: '#6c757d' }}>
          View, filter, and manage road damage reports
        </Typography>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search reports..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#6c757d' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="processing">Processing</MenuItem>
                  <MenuItem value="success">Success</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Severity</InputLabel>
                <Select
                  value={filters.severity}
                  label="Severity"
                  onChange={(e) => handleFilterChange('severity', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Damage Type</InputLabel>
                <Select
                  value={filters.damageType}
                  label="Damage Type"
                  onChange={(e) => handleFilterChange('damageType', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Pothole">Pothole</MenuItem>
                  <MenuItem value="Crack">Crack</MenuItem>
                  <MenuItem value="Surface Wear">Surface Wear</MenuItem>
                  <MenuItem value="Edge Damage">Edge Damage</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Download />}
                onClick={handleExport}
                sx={{ height: 56 }}
              >
                Export
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Reports List */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {uploads.map((upload) => (
              <Grid item xs={12} key={upload.id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    border: '1px solid #f0f0f0',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                      {/* Image */}
                      <Avatar
                        src={upload.imageUri}
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: 2,
                          bgcolor: '#f0f8ff',
                        }}
                      >
                        <Image sx={{ color: '#007AFF' }} />
                      </Avatar>

                      {/* Content */}
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                              {upload.aiAnalysis?.damageType || 'Processing...'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#6c757d', mb: 1 }}>
                              Reported by {upload.user?.fullName || 'Unknown User'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#6c757d' }}>
                              {format(new Date(upload.createdAt), 'MMM dd, yyyy • HH:mm')}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip
                              icon={getStatusIcon(upload.status)}
                              label={upload.status.toUpperCase()}
                              size="small"
                              sx={{
                                bgcolor: `${getStatusColor(upload.status)}15`,
                                color: getStatusColor(upload.status),
                                fontWeight: 600,
                              }}
                            />
                            {upload.aiAnalysis?.severity && (
                              <Chip
                                label={upload.aiAnalysis.severity}
                                size="small"
                                sx={{
                                  bgcolor: `${getSeverityColor(upload.aiAnalysis.severity)}15`,
                                  color: getSeverityColor(upload.aiAnalysis.severity),
                                  fontWeight: 600,
                                }}
                              />
                            )}
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                          <LocationOn sx={{ fontSize: 16, color: '#6c757d' }} />
                          <Typography variant="body2" sx={{ color: '#6c757d' }}>
                            {upload.location.address || `${upload.location.latitude.toFixed(4)}, ${upload.location.longitude.toFixed(4)}`}
                          </Typography>
                        </Box>

                        {upload.aiAnalysis && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ color: '#1a1a1a', mb: 1 }}>
                              <strong>AI Analysis:</strong> {upload.aiAnalysis.recommendations.join(', ')}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#6c757d' }}>
                              Confidence: {(upload.aiAnalysis.confidence * 100).toFixed(1)}% • 
                              Processing time: {upload.aiAnalysis.processingTime}s
                            </Typography>
                          </Box>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Chip
                            label={`Repair: ${upload.repairStatus}`}
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 500 }}
                          />
                          
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleViewDetails(upload)}
                              sx={{ color: '#007AFF' }}
                            >
                              <Visibility />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(upload)}
                              sx={{ color: '#ff3b30' }}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.currentPage}
                onChange={(_, page) => setPagination(prev => ({ ...prev, currentPage: page }))}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      {/* Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Report Details</DialogTitle>
        <DialogContent>
          {selectedUpload && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <img
                    src={selectedUpload.imageUri}
                    alt="Damage"
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '8px',
                      maxHeight: '300px',
                      objectFit: 'cover',
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {selectedUpload.aiAnalysis?.damageType || 'Processing...'}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#6c757d', mb: 1 }}>
                      <strong>Status:</strong> {selectedUpload.status}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6c757d', mb: 1 }}>
                      <strong>Repair Status:</strong> {selectedUpload.repairStatus}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6c757d', mb: 1 }}>
                      <strong>Reported by:</strong> {selectedUpload.user?.fullName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6c757d', mb: 1 }}>
                      <strong>Date:</strong> {format(new Date(selectedUpload.createdAt), 'PPpp')}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#6c757d', mb: 1 }}>
                      <strong>Location:</strong>
                    </Typography>
                    <Typography variant="body2">
                      {selectedUpload.location.address || 'No address available'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6c757d' }}>
                      {selectedUpload.location.latitude.toFixed(6)}, {selectedUpload.location.longitude.toFixed(6)}
                    </Typography>
                  </Box>

                  {selectedUpload.aiAnalysis && (
                    <Box>
                      <Typography variant="body2" sx={{ color: '#6c757d', mb: 1 }}>
                        <strong>AI Analysis:</strong>
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Severity: {selectedUpload.aiAnalysis.severity}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Confidence: {(selectedUpload.aiAnalysis.confidence * 100).toFixed(1)}%
                      </Typography>
                      <Typography variant="body2">
                        Recommendations: {selectedUpload.aiAnalysis.recommendations.join(', ')}
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Report</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this report? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Reports;