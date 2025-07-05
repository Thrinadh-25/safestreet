import React, { useState } from 'react';
import {
  Box, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Chip, 
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  CircularProgress,
  IconButton,
  Alert,
  Snackbar,
  DialogContentText,
  FormControlLabel,
  Switch
} from '@mui/material';
import EngineeringIcon from '@mui/icons-material/Engineering';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { TOKEN_KEY, API_BASE_URL, API_ENDPOINTS } from '../../config/constants';

// Helper function to log API errors
const logApiError = (endpoint, error, response) => {
  console.error(`API Error (${endpoint}):`, {
    error,
    status: response?.status,
    statusText: response?.statusText,
    endpoint
  });
};

const FieldWorkersList = ({ tenantId, fieldWorkers, setFieldWorkers }) => {
  const [openAddFieldWorkerDialog, setOpenAddFieldWorkerDialog] = useState(false);
  const [openEditFieldWorkerDialog, setOpenEditFieldWorkerDialog] = useState(false);
  const [openDeleteFieldWorkerDialog, setOpenDeleteFieldWorkerDialog] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [dialogError, setDialogError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedFieldWorker, setSelectedFieldWorker] = useState(null);
  const [newFieldWorker, setNewFieldWorker] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    phone: '',
    workerId: '',
    specialization: '',
    region: '',
    active: true
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFieldWorker(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setNewFieldWorker(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleAddFieldWorker = async () => {
    try {
      setDialogLoading(true);
      setDialogError('');
      
      if (!newFieldWorker.name || !newFieldWorker.email || !newFieldWorker.password || 
          !newFieldWorker.workerId || !newFieldWorker.specialization || !newFieldWorker.region) {
        setDialogError('All required fields must be filled out');
        setDialogLoading(false);
        return;
      }
      
      const token = localStorage.getItem(TOKEN_KEY);
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TENANTS}/${tenantId}/field-workers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newFieldWorker)
      });
      
      if (!response.ok) {
        let errorMessage = 'Failed to add field worker';
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } else {
            const textResponse = await response.text();
            console.error("Non-JSON error response:", textResponse);
            errorMessage = `Server error (${response.status}): Not a valid JSON response`;
          }
        } catch (e) {
          console.error("Error parsing error response:", e);
        }
        throw new Error(errorMessage);
      }
      
      const newWorkerData = await response.json();
      setFieldWorkers([...fieldWorkers, newWorkerData]);
      
      // Reset form and close dialog
      setNewFieldWorker({ 
        name: '', 
        email: '', 
        password: '', 
        phone: '',
        workerId: '',
        specialization: '',
        region: '',
        active: true
      });
      setOpenAddFieldWorkerDialog(false);
      setSnackbar({
        open: true,
        message: 'Field worker added successfully',
        severity: 'success'
      });
    } catch (err) {
      logApiError(`${API_ENDPOINTS.TENANTS}/${tenantId}/field-workers`, err);
      setDialogError(err.message);
    } finally {
      setDialogLoading(false);
    }
  };
  
  const handleEditFieldWorker = (worker) => {
    setSelectedFieldWorker(worker);
    // Populate the form with the selected worker's details (exclude password)
    setNewFieldWorker({
      name: worker.name,
      email: worker.email,
      password: '', // Don't send the password back for security reasons
      phone: worker.phone || '',
      workerId: worker.workerId,
      specialization: worker.specialization || '',
      region: worker.region || '',
      active: worker.active !== undefined ? worker.active : true
    });
    setOpenEditFieldWorkerDialog(true);
  };
  
  const handleUpdateFieldWorker = async () => {
    try {
      setDialogLoading(true);
      setDialogError('');
      
      if (!newFieldWorker.name || !newFieldWorker.email || !newFieldWorker.workerId || 
          !newFieldWorker.specialization || !newFieldWorker.region) {
        setDialogError('Required fields are missing');
        setDialogLoading(false);
        return;
      }
      
      // Create payload - only include password if it was changed
      const payload = {
        name: newFieldWorker.name,
        email: newFieldWorker.email,
        phone: newFieldWorker.phone,
        specialization: newFieldWorker.specialization,
        region: newFieldWorker.region,
        active: newFieldWorker.active
      };
      
      if (newFieldWorker.password) {
        payload.password = newFieldWorker.password;
      }
      
      const token = localStorage.getItem(TOKEN_KEY);
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TENANTS}/${tenantId}/field-workers/${selectedFieldWorker._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        let errorMessage = 'Failed to update field worker';
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } else {
            const textResponse = await response.text();
            console.error("Non-JSON error response:", textResponse);
            errorMessage = `Server error (${response.status}): Not a valid JSON response`;
          }
        } catch (e) {
          console.error("Error parsing error response:", e);
        }
        throw new Error(errorMessage);
      }
      
      const updatedWorker = await response.json();
      
      // Update field workers list
      setFieldWorkers(
        fieldWorkers.map(worker => 
          worker._id === selectedFieldWorker._id ? updatedWorker : worker
        )
      );
      
      // Reset form and close dialog
      setNewFieldWorker({ 
        name: '', 
        email: '', 
        password: '', 
        phone: '',
        workerId: '',
        specialization: '',
        region: '',
        active: true
      });
      setOpenEditFieldWorkerDialog(false);
      setSnackbar({
        open: true,
        message: 'Field worker updated successfully',
        severity: 'success'
      });
    } catch (err) {
      logApiError(`${API_ENDPOINTS.TENANTS}/${tenantId}/field-workers/${selectedFieldWorker._id}`, err);
      setDialogError(err.message);
    } finally {
      setDialogLoading(false);
    }
  };
  
  const handleDeleteClick = (worker) => {
    setSelectedFieldWorker(worker);
    setOpenDeleteFieldWorkerDialog(true);
  };
  
  const handleConfirmDelete = async () => {
    try {
      setDialogLoading(true);
      
      const token = localStorage.getItem(TOKEN_KEY);
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TENANTS}/${tenantId}/field-workers/${selectedFieldWorker._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        let errorMessage = 'Failed to delete field worker';
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } else {
            const textResponse = await response.text();
            console.error("Non-JSON error response:", textResponse);
            errorMessage = `Server error (${response.status}): Not a valid JSON response`;
          }
        } catch (e) {
          console.error("Error parsing error response:", e);
        }
        throw new Error(errorMessage);
      }
      
      // Remove field worker from list
      setFieldWorkers(fieldWorkers.filter(worker => worker._id !== selectedFieldWorker._id));
      
      // Close dialog and show success message
      setOpenDeleteFieldWorkerDialog(false);
      setSnackbar({
        open: true,
        message: 'Field worker deleted successfully',
        severity: 'success'
      });
    } catch (err) {
      logApiError(`${API_ENDPOINTS.TENANTS}/${tenantId}/field-workers/${selectedFieldWorker._id}`, err);
      setSnackbar({
        open: true,
        message: err.message,
        severity: 'error'
      });
    } finally {
      setDialogLoading(false);
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      {fieldWorkers.length > 0 ? (
        <List>
          {fieldWorkers.map((worker) => (
            <ListItem
              key={worker._id}
              secondaryAction={
                <Box>
                  <Chip 
                    label={worker.active ? 'Active' : 'Inactive'} 
                    color={worker.active ? 'success' : 'default'}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <IconButton size="small" onClick={() => handleEditFieldWorker(worker)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDeleteClick(worker)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              }
              sx={{ borderBottom: '1px solid #f0f0f0' }}
            >
              <ListItemAvatar>
                <Avatar>
                  <EngineeringIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={worker.name}
                secondary={
                  <>
                    {worker.email} • {worker.specialization} • {worker.region}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No field workers for this tenant yet.</Typography>
      )}
      
      <Box mt={2} sx={{ display: 'flex', gap: 2 }}>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => setOpenAddFieldWorkerDialog(true)}
        >
          Add Field Worker
        </Button>
      </Box>

      {/* Add Field Worker Dialog */}
      <Dialog open={openAddFieldWorkerDialog} onClose={() => setOpenAddFieldWorkerDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Field Worker</DialogTitle>
        <DialogContent dividers>
          {dialogError && (
            <Box mb={2}>
              <Typography color="error">{dialogError}</Typography>
            </Box>
          )}
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth
                label="Name"
                name="name"
                value={newFieldWorker.name}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth
                label="Worker ID"
                name="workerId"
                value={newFieldWorker.workerId}
                onChange={handleInputChange}
                required
                helperText="Unique identifier for this worker"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={newFieldWorker.email}
                onChange={handleInputChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={newFieldWorker.password}
                onChange={handleInputChange}
                required
                helperText="Minimum 6 characters"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth
                label="Specialization"
                name="specialization"
                value={newFieldWorker.specialization}
                onChange={handleInputChange}
                required
                helperText="E.g., Pothole Repair, Street Light Maintenance"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth
                label="Region"
                name="region"
                value={newFieldWorker.region}
                onChange={handleInputChange}
                required
                helperText="Geographical working area"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth
                label="Phone Number"
                name="phone"
                value={newFieldWorker.phone}
                onChange={handleInputChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newFieldWorker.active}
                    onChange={handleSwitchChange}
                    name="active"
                    color="success"
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddFieldWorkerDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleAddFieldWorker}
            disabled={dialogLoading}
          >
            {dialogLoading ? <CircularProgress size={24} /> : 'Add Field Worker'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit Field Worker Dialog */}
      <Dialog open={openEditFieldWorkerDialog} onClose={() => setOpenEditFieldWorkerDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Field Worker</DialogTitle>
        <DialogContent dividers>
          {dialogError && (
            <Box mb={2}>
              <Typography color="error">{dialogError}</Typography>
            </Box>
          )}
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth
                label="Name"
                name="name"
                value={newFieldWorker.name}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth
                label="Worker ID"
                name="workerId"
                value={newFieldWorker.workerId}
                onChange={handleInputChange}
                required
                disabled // Don't allow changing the worker ID
                helperText="Worker ID cannot be changed"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={newFieldWorker.email}
                onChange={handleInputChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={newFieldWorker.password}
                onChange={handleInputChange}
                helperText="Leave blank to keep current password"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth
                label="Specialization"
                name="specialization"
                value={newFieldWorker.specialization}
                onChange={handleInputChange}
                required
                helperText="E.g., Pothole Repair, Street Light Maintenance"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth
                label="Region"
                name="region"
                value={newFieldWorker.region}
                onChange={handleInputChange}
                required
                helperText="Geographical working area"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth
                label="Phone Number"
                name="phone"
                value={newFieldWorker.phone}
                onChange={handleInputChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newFieldWorker.active}
                    onChange={handleSwitchChange}
                    name="active"
                    color="success"
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditFieldWorkerDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleUpdateFieldWorker}
            disabled={dialogLoading}
          >
            {dialogLoading ? <CircularProgress size={24} /> : 'Update Field Worker'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Field Worker Confirmation Dialog */}
      <Dialog open={openDeleteFieldWorkerDialog} onClose={() => setOpenDeleteFieldWorkerDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this field worker? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteFieldWorkerDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleConfirmDelete}
            color="error"
            disabled={dialogLoading}
          >
            {dialogLoading ? <CircularProgress size={24} /> : 'Delete Field Worker'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for success/error messages */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FieldWorkersList;
