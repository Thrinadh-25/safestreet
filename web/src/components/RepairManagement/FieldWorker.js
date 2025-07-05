import { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, CardActions,
  Button, Chip, Divider, IconButton, Tooltip, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Paper, Alert, Snackbar
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';

function FieldWorker({ fieldWorkers = [], onAddWorker = () => {}, onEditWorker = () => {}, onDeleteWorker = () => {} }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [workerData, setWorkerData] = useState({
    name: '',
    workerId: '',
    email: '',
    phone: '',
    specialization: '',
    region: '',
    status: 'Available'
  });

  const resetWorkerData = () => ({
    name: '',
    workerId: '',
    email: '',
    phone: '',
    specialization: '',
    region: '',
    status: 'Available'
  });

  const handleDialogOpen = (mode, worker = null) => {
    setEditMode(mode === 'edit');
    setSelectedWorker(worker);
    setErrors({});

    if (mode === 'edit' && worker) {
      setWorkerData({
        name: worker.name || '',
        workerId: worker.workerId || '',
        email: worker.email || '',
        phone: worker.profile?.phone || '',
        specialization: worker.specialization || '',
        region: worker.region || '',
        status: worker.status || 'Available'
      });
    } else {
      setWorkerData(resetWorkerData());
    }

    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedWorker(null);
    setWorkerData(resetWorkerData());
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({...prev, [name]: ''}));
    }

    setWorkerData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!workerData.name.trim()) newErrors.name = 'Name is required';
    if (!workerData.specialization.trim()) newErrors.specialization = 'Specialization is required';
    if (!workerData.region.trim()) newErrors.region = 'Region is required';
    
    // Only validate workerId and email for new workers
    if (!editMode) {
      if (!workerData.workerId.trim()) newErrors.workerId = 'Worker ID is required';
      if (!workerData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(workerData.email)) {
        newErrors.email = 'Email is invalid';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    if (editMode && selectedWorker) {
      // Use the correct field for the worker ID - could be id or workerId
      const workerId = selectedWorker.workerId || selectedWorker.id;
      if (!workerId) {
        console.error('Cannot edit worker: Missing worker ID', selectedWorker);
        setErrors({ general: 'Missing worker ID' });
        return;
      }
      
      console.log('Editing worker with ID:', workerId, workerData);
      onEditWorker(workerId, workerData);
      
      setSnackbar({ 
        open: true, 
        message: `Field worker ${workerData.name} was successfully updated`, 
        severity: 'success' 
      });
    } else {
      // For new workers, make sure we have a workerId
      if (!workerData.workerId) {
        setErrors({ workerId: 'Worker ID is required' });
        return;
      }
      
      console.log('Adding new worker:', workerData);
      onAddWorker(workerData);
      
      setSnackbar({ 
        open: true, 
        message: `Field worker ${workerData.name} was successfully added`, 
        severity: 'success' 
      });
    }
    
    handleDialogClose();
  };

  const handleDeleteWorker = (workerId) => {
    if (!workerId) {
      console.error('Cannot delete worker: Missing worker ID');
      setSnackbar({
        open: true,
        message: 'Cannot delete worker: Missing worker ID',
        severity: 'error'
      });
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this worker?')) {
      console.log('Deleting worker with ID:', workerId);
      onDeleteWorker(workerId);
      setSnackbar({ open: true, message: 'Worker deleted successfully', severity: 'info' });
    }
  };

  // Optionally, add a refresh handler if needed
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Field Worker Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<PersonIcon />}
            size="small"
            onClick={() => handleDialogOpen('add')}
          >
            Add Worker
          </Button>
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={2}>
        {fieldWorkers.length === 0 ? (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No field workers found.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click "Add Worker" to create a new field worker.
              </Typography>
            </Box>
          </Grid>
        ) : (
          fieldWorkers.map((worker) => (
            <Grid item xs={12} sm={6} md={4} key={worker.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: '#2563eb',
                        width: 56,
                        height: 56,
                        mr: 2
                      }}
                    >
                      {worker.name
                        ? worker.name.split(' ').map(n => n[0]).join('')
                        : '?'}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{worker.name || 'Unnamed'}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        ID: {worker.workerId}
                      </Typography>
                      <Chip
                        size="small"
                        label={worker.status || 'Available'}
                        color={worker.status === 'Available' ? 'success' : worker.status === 'Busy' ? 'warning' : 'default'}
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  <Typography variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                    <EmailIcon fontSize="small" sx={{ mr: 1 }} />
                    {worker.email || 'No email'}
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                    <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
                    {worker.profile?.phone || 'No phone'}
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Specialization:</strong> {worker.specialization || '-'}
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Region:</strong> {worker.region || '-'}
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Active Assignments:</strong> {worker.activeAssignments ?? 0}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between' }}>
                  <Button
                    size="small"
                    startIcon={<AssignmentIcon />}
                    disabled={worker.status !== 'Available'}
                  >
                    View Assignments
                  </Button>
                  <Box>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleDialogOpen('edit', worker)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>                      <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteWorker(worker.workerId || worker.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Add/Edit Worker Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Field Worker' : 'Add New Field Worker'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Full Name"
              name="name"
              fullWidth
              value={workerData.name}
              onChange={handleInputChange}
              required
              error={!!errors.name}
              helperText={errors.name}
              autoFocus
            />

            {!editMode && (
              <TextField
                label="Worker ID"
                name="workerId"
                fullWidth
                value={workerData.workerId}
                onChange={handleInputChange}
                placeholder="Unique identifier (e.g., FW001)"
                required
                error={!!errors.workerId}
                helperText={errors.workerId}
              />
            )}

            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              value={workerData.email}
              onChange={handleInputChange}
              disabled={editMode} // Can't change email in edit mode
              required={!editMode}
              error={!!errors.email}
              helperText={errors.email || (editMode ? 'Email cannot be changed' : '')}
            />

            <TextField
              label="Phone Number"
              name="phone"
              fullWidth
              value={workerData.phone}
              onChange={handleInputChange}
              placeholder="Contact phone number"
            />

            <TextField
              label="Specialization"
              name="specialization"
              fullWidth
              value={workerData.specialization}
              onChange={handleInputChange}
              placeholder="e.g., Electrical, Plumbing, Structural"
              required
              error={!!errors.specialization}
              helperText={errors.specialization}
            />

            <TextField
              label="Region"
              name="region"
              fullWidth
              value={workerData.region}
              onChange={handleInputChange}
              placeholder="e.g., North, South, East, West, Central"
              required
              error={!!errors.region}
              helperText={errors.region}
            />

            <TextField
              select
              label="Status"
              name="status"
              fullWidth
              value={workerData.status}
              onChange={handleInputChange}
              SelectProps={{
                native: true,
              }}
            >
              <option value="Available">Available</option>
              <option value="Busy">Busy</option>
              <option value="On Leave">On Leave</option>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
          >
            {editMode ? 'Save Changes' : 'Add Worker'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default FieldWorker;
