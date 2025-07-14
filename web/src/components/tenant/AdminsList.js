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
  DialogContentText
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { TOKEN_KEY, API_BASE_URL, API_ENDPOINTS } from '../../config/constants';

const AdminsList = ({ tenantId, admins, setAdmins }) => {
  const [openAddAdminDialog, setOpenAddAdminDialog] = useState(false);
  const [openEditAdminDialog, setOpenEditAdminDialog] = useState(false);
  const [openDeleteAdminDialog, setOpenDeleteAdminDialog] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [dialogError, setDialogError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddAdmin = async () => {
    try {
      setDialogLoading(true);
      setDialogError('');
      
      if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
        setDialogError('All fields are required');
        setDialogLoading(false);
        return;
      }
      
      const token = localStorage.getItem(TOKEN_KEY);
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADMIN}/tenants/${tenantId}/admins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newAdmin)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add admin');
      }
      
      const newAdminData = await response.json();
      setAdmins([...admins, newAdminData]);
      
      // Reset form and close dialog
      setNewAdmin({ name: '', email: '', password: '' });
      setOpenAddAdminDialog(false);
    } catch (err) {
      setDialogError(err.message);
    } finally {
      setDialogLoading(false);
    }
  };
  
  const handleEditAdmin = (admin) => {
    setSelectedAdmin(admin);
    // Populate the form with the selected admin's details (exclude password)
    setNewAdmin({
      name: admin.name,
      email: admin.email,
      password: '' // Don't send the password back for security reasons
    });
    setOpenEditAdminDialog(true);
  };
  
  const handleUpdateAdmin = async () => {
    try {
      setDialogLoading(true);
      setDialogError('');
      
      if (!newAdmin.name || !newAdmin.email) {
        setDialogError('Name and email are required');
        setDialogLoading(false);
        return;
      }
      
      // Create payload - only include password if it was changed
      const payload = {
        name: newAdmin.name,
        email: newAdmin.email
      };
      
      if (newAdmin.password) {
        payload.password = newAdmin.password;
      }
      
      const token = localStorage.getItem(TOKEN_KEY);
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADMIN}/tenants/${tenantId}/admins/${selectedAdmin._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update admin');
      }
      
      const updatedAdmin = await response.json();
      
      // Update admins list
      setAdmins(
        admins.map(admin => 
          admin._id === selectedAdmin._id ? updatedAdmin : admin
        )
      );
      
      // Reset form and close dialog
      setNewAdmin({ name: '', email: '', password: '' });
      setOpenEditAdminDialog(false);
      setSnackbar({
        open: true,
        message: 'Admin updated successfully',
        severity: 'success'
      });
    } catch (err) {
      setDialogError(err.message);
    } finally {
      setDialogLoading(false);
    }
  };
  
  const handleDeleteClick = (admin) => {
    setSelectedAdmin(admin);
    setOpenDeleteAdminDialog(true);
  };
  
  const handleConfirmDelete = async () => {
    try {
      setDialogLoading(true);
      
      const token = localStorage.getItem(TOKEN_KEY);
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADMIN}/tenants/${tenantId}/admins/${selectedAdmin._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete admin');
      }
      
      // Remove admin from list
      setAdmins(admins.filter(admin => admin._id !== selectedAdmin._id));
      
      // Close dialog and show success message
      setOpenDeleteAdminDialog(false);
      setSnackbar({
        open: true,
        message: 'Admin deleted successfully',
        severity: 'success'
      });
    } catch (err) {
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
      {admins.length > 0 ? (
        <List>
          {admins.map((admin) => (
            <ListItem
              key={admin._id}
              secondaryAction={
                <Box>
                  <Chip 
                    label={admin.role === 'tenant-owner' ? 'Owner' : 'Admin'} 
                    color={admin.role === 'tenant-owner' ? 'primary' : 'default'}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  {admin.role !== 'tenant-owner' && (
                    <>
                      <IconButton size="small" onClick={() => handleEditAdmin(admin)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDeleteClick(admin)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </>
                  )}
                </Box>
              }
              sx={{ borderBottom: '1px solid #f0f0f0' }}
            >
              <ListItemAvatar>
                <Avatar>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={admin.name}
                secondary={admin.email}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No admin users for this tenant yet.</Typography>
      )}
      
      <Box mt={2} sx={{ display: 'flex', gap: 2 }}>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => setOpenAddAdminDialog(true)}
        >
          Add Admin
        </Button>
      </Box>

      {/* Add Admin Dialog */}
      <Dialog open={openAddAdminDialog} onClose={() => setOpenAddAdminDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Admin</DialogTitle>
        <DialogContent dividers>
          {dialogError && (
            <Box mb={2}>
              <Typography color="error">{dialogError}</Typography>
            </Box>
          )}
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField 
                fullWidth
                label="Name"
                name="name"
                value={newAdmin.name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField 
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={newAdmin.email}
                onChange={handleInputChange}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField 
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={newAdmin.password}
                onChange={handleInputChange}
                required
                helperText="Minimum 6 characters"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddAdminDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleAddAdmin}
            disabled={dialogLoading}
          >
            {dialogLoading ? <CircularProgress size={24} /> : 'Add Admin'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Admin Dialog */}
      <Dialog open={openEditAdminDialog} onClose={() => setOpenEditAdminDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Admin</DialogTitle>
        <DialogContent dividers>
          {dialogError && (
            <Box mb={2}>
              <Typography color="error">{dialogError}</Typography>
            </Box>
          )}
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField 
                fullWidth
                label="Name"
                name="name"
                value={newAdmin.name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField 
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={newAdmin.email}
                onChange={handleInputChange}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField 
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={newAdmin.password}
                onChange={handleInputChange}
                helperText="Leave blank to keep current password"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditAdminDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleUpdateAdmin}
            disabled={dialogLoading}
          >
            {dialogLoading ? <CircularProgress size={24} /> : 'Update Admin'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Admin Confirmation Dialog */}
      <Dialog open={openDeleteAdminDialog} onClose={() => setOpenDeleteAdminDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this admin? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteAdminDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleConfirmDelete}
            color="error"
            disabled={dialogLoading}
          >
            {dialogLoading ? <CircularProgress size={24} /> : 'Delete Admin'}
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

export default AdminsList;
