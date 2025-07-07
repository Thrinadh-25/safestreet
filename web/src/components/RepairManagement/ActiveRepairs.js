import React, { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, CardActions,
  Button, Chip, Divider, IconButton, Tooltip, alpha,
  TextField, FormControl, InputLabel, Select, MenuItem,
  Avatar, useTheme, Paper
} from '@mui/material';
import {
  AssignmentInd,
  LocationOn,
  AccessTime,
  Refresh,
  CheckCircle,
  SearchIcon
} from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RefreshIcon from '@mui/icons-material/Refresh';
import CircularProgress from '@mui/material/CircularProgress';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

function PendingAssignments({ pendingRepairs = [], fieldWorkers = [], onAssignRepair = () => {} }) {
  const theme = useTheme();
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState('');
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [workerFilter, setWorkerFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [changingStatusIds, setChangingStatusIds] = useState([]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <HourglassEmptyIcon color="warning" />;
      case 'Assigned': return <AssignmentIndIcon color="info" />;
      case 'In-Progress': return <BuildIcon color="primary" />;
      case 'On Hold': return <HourglassEmptyIcon color="error" />;
      case 'Resolved': return <CheckCircleIcon color="success" />;
      case 'Rejected': return <CancelIcon color="error" />;
      default: return <HourglassEmptyIcon color="warning" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return theme.palette.warning.main;
      case 'Assigned': return theme.palette.info.main;
      case 'In-Progress': return theme.palette.primary.main;
      case 'On Hold': return theme.palette.error.light;
      case 'Resolved': return theme.palette.success.main;
      case 'Rejected': return theme.palette.error.main;
      default: return theme.palette.warning.main;
    }
  };

  const filteredAssignedRepairs = assignedRepairs.filter(repair => {
    const matchesStatus = statusFilter === 'all' || repair.status === statusFilter;
    const assignedWorkerName = repair.assignedTo ? repair.assignedTo.name : null;
    const matchesWorker = workerFilter === 'all' || assignedWorkerName === workerFilter;
    const matchesRegion = regionFilter === 'all' || repair.region === regionFilter;

    return matchesStatus && matchesWorker && matchesRegion;
  });

  return (
    <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Active Repair Tasks
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh">
            <IconButton>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All Statuses</MenuItem>
            <MenuItem value="Assigned">Assigned</MenuItem>
            <MenuItem value="In-Progress">In Progress</MenuItem>
            <MenuItem value="On Hold">On Hold</MenuItem>
            <MenuItem value="Resolved">Resolved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Field Worker</InputLabel>
          <Select
            value={workerFilter}
            label="Field Worker"
            onChange={(e) => setWorkerFilter(e.target.value)}
          >
            <MenuItem value="all">All Workers</MenuItem>
            {fieldWorkers.map(worker => (
              <MenuItem key={worker.id} value={worker.name}>{worker.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Region</InputLabel>
          <Select
            value={regionFilter}
            label="Region"
            onChange={(e) => setRegionFilter(e.target.value)}
          >
            <MenuItem value="all">All Regions</MenuItem>
            <MenuItem value="North">North</MenuItem>
            <MenuItem value="South">South</MenuItem>
            <MenuItem value="East">East</MenuItem>
            <MenuItem value="West">West</MenuItem>
            <MenuItem value="Central">Central</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {filteredAssignedRepairs.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <SearchIcon color="action" sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h6">No matching repairs found</Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filter criteria
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filteredAssignedRepairs.map((repair) => (
            <Grid item xs={12} md={6} lg={4} key={repair._id || repair.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderLeft: `4px solid ${getStatusColor(repair.status)}`,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {repair.reportId || repair.id}
                    </Typography>
                    <Chip
                      size="small"
                      icon={getStatusIcon(repair.status)}
                      label={repair.status}
                      sx={{
                        bgcolor: alpha(getStatusColor(repair.status), 0.1),
                        color: getStatusColor(repair.status),
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: theme.palette.primary.main }}>
                      <PersonIcon sx={{ fontSize: 16 }} />
                    </Avatar>
                    <Typography variant="body2">
                      {repair.assignedTo ? repair.assignedTo.name : 'Unassigned'}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <LocationOnIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    {repair.region} Region
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <AccessTimeIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    Assigned: {repair.assignedDate ? new Date(repair.assignedDate).toLocaleDateString() : 'N/A'}
                  </Typography>

                  <Divider sx={{ my: 1 }} />

                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Type:</strong> {repair.damageType}
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Severity:</strong> {repair.severity}
                  </Typography>

                  <Typography variant="body2">
                    <strong>Notes:</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {repair.notes}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between' }}>
                  <FormControl size="small" sx={{ minWidth: 140, position: 'relative' }}>
                    <InputLabel>Update Status</InputLabel>
                    {changingStatusIds.includes(repair._id || repair.id) && (
                      <CircularProgress
                        size={24}
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          marginTop: '-12px',
                          marginLeft: '-12px',
                          zIndex: 1,
                        }}
                      />
                    )}
                    <Select
                      label="Update Status"
                      value={repair.status || ''}
                      onChange={(e) => {
                        const newStatus = e.target.value;
                        const repairId = repair._id || repair.id;
                        
                        // Show visual feedback that something is happening
                        setChangingStatusIds(prev => [...prev, repairId]);
                        
                        // Call the status change handler
                        if (onStatusChange) {
                          onStatusChange(repairId, newStatus)
                            .finally(() => {
                              // Remove from loading state whether successful or not
                              setChangingStatusIds(prev => prev.filter(id => id !== repairId));
                            });
                        }
                      }}
                      disabled={changingStatusIds.includes(repair._id || repair.id)}
                      MenuProps={{
                        PaperProps: {
                          elevation: 3,
                          sx: { maxHeight: 200 }
                        }
                      }}
                    >
                      <MenuItem value="Assigned">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AssignmentIndIcon fontSize="small" sx={{ mr: 1, color: theme.palette.info.main }} />
                          Assigned
                        </Box>
                      </MenuItem>
                      <MenuItem value="In-Progress">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <BuildIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                          In Progress
                        </Box>
                      </MenuItem>
                      <MenuItem value="On Hold">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <HourglassEmptyIcon fontSize="small" sx={{ mr: 1, color: theme.palette.error.light }} />
                          On Hold
                        </Box>
                      </MenuItem>
                      <MenuItem value="Resolved">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CheckCircleIcon fontSize="small" sx={{ mr: 1, color: theme.palette.success.main }} />
                          Resolved
                        </Box>
                      </MenuItem>
                      <MenuItem value="Rejected">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CancelIcon fontSize="small" sx={{ mr: 1, color: theme.palette.error.main }} />
                          Rejected
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <Tooltip title="View Details">
                    <IconButton color="primary">
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Paper>
  );
}

export default ActiveRepairs;