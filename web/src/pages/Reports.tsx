import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from '@mui/material';
import {
  Visibility,
  Edit,
  Delete,
  FilterList,
} from '@mui/icons-material';

interface Report {
  id: string;
  location: string;
  coordinates: { lat: number; lng: number };
  damageType: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Pending' | 'In Progress' | 'Completed' | 'Rejected';
  description: string;
  imageUrl: string;
  reportedAt: string;
  reportedBy: string;
  aiAnalysis: string;
}

const Reports = (): React.ReactElement => {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  useEffect(() => {
    // TODO: Replace with actual API call
    // Mock data for demo
    const mockReports: Report[] = [
      {
        id: '1',
        location: 'Main St & 5th Ave',
        coordinates: { lat: 40.7128, lng: -74.0060 },
        damageType: 'Pothole',
        severity: 'High',
        status: 'Pending',
        description: 'Large pothole causing traffic issues',
        imageUrl: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg',
        reportedAt: '2025-01-15T10:30:00Z',
        reportedBy: 'John Doe',
        aiAnalysis: 'Type: Pothole, Severity: High, Priority: Urgent - Immediate repair recommended',
      },
      {
        id: '2',
        location: 'Highway 101, Mile 45',
        coordinates: { lat: 40.7589, lng: -73.9851 },
        damageType: 'Crack',
        severity: 'Medium',
        status: 'In Progress',
        description: 'Longitudinal crack in asphalt',
        imageUrl: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg',
        reportedAt: '2025-01-15T09:15:00Z',
        reportedBy: 'Jane Smith',
        aiAnalysis: 'Type: Crack, Severity: Medium, Priority: Moderate - Schedule repair within 30 days',
      },
      {
        id: '3',
        location: 'Oak Street Bridge',
        coordinates: { lat: 40.7505, lng: -73.9934 },
        damageType: 'Surface Wear',
        severity: 'Critical',
        status: 'Pending',
        description: 'Severe surface deterioration on bridge deck',
        imageUrl: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg',
        reportedAt: '2025-01-15T08:45:00Z',
        reportedBy: 'Mike Johnson',
        aiAnalysis: 'Type: Surface Wear, Severity: Critical, Priority: Emergency - Immediate attention required',
      },
    ];
    
    setReports(mockReports);
    setFilteredReports(mockReports);
  }, []);

  useEffect(() => {
    let filtered = reports;

    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.damageType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reportedBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    if (severityFilter) {
      filtered = filtered.filter(report => report.severity === severityFilter);
    }

    setFilteredReports(filtered);
    setPage(0);
  }, [searchTerm, statusFilter, severityFilter, reports]);

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setViewDialogOpen(true);
  };

  const handleStatusChange = (reportId: string, newStatus: string) => {
    // TODO: API call to update status
    setReports(prev =>
      prev.map(report =>
        report.id === reportId ? { ...report, status: newStatus as any } : report
      )
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low': return 'success';
      case 'Medium': return 'warning';
      case 'High': return 'error';
      case 'Critical': return 'error';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'In Progress': return 'info';
      case 'Completed': return 'success';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Road Damage Reports
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Severity</InputLabel>
              <Select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                label="Severity"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Critical">Critical</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
                setSeverityFilter('');
              }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Reports Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Location</TableCell>
                <TableCell>Damage Type</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Reported By</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReports
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.location}</TableCell>
                    <TableCell>{report.damageType}</TableCell>
                    <TableCell>
                      <Chip
                        label={report.severity}
                        color={getSeverityColor(report.severity) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={report.status}
                          onChange={(e) => handleStatusChange(report.id, e.target.value)}
                        >
                          <MenuItem value="Pending">Pending</MenuItem>
                          <MenuItem value="In Progress">In Progress</MenuItem>
                          <MenuItem value="Completed">Completed</MenuItem>
                          <MenuItem value="Rejected">Rejected</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>{report.reportedBy}</TableCell>
                    <TableCell>
                      {new Date(report.reportedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleViewReport(report)}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton size="small" color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredReports.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* View Report Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Report Details</DialogTitle>
        <DialogContent>
          {selectedReport && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardMedia
                    component="img"
                    height="300"
                    image={selectedReport.imageUrl}
                    alt="Road damage"
                  />
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Location: {selectedReport.location}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Coordinates: {selectedReport.coordinates.lat}, {selectedReport.coordinates.lng}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Damage Type: {selectedReport.damageType}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Chip
                      label={selectedReport.severity}
                      color={getSeverityColor(selectedReport.severity) as any}
                      size="small"
                    />
                    <Chip
                      label={selectedReport.status}
                      color={getStatusColor(selectedReport.status) as any}
                      size="small"
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Description:
                  </Typography>
                  <Typography variant="body2">
                    {selectedReport.description}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    AI Analysis:
                  </Typography>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    {selectedReport.aiAnalysis}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Reported by: {selectedReport.reportedBy}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date: {new Date(selectedReport.reportedAt).toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          <Button variant="contained" color="primary">
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Reports;