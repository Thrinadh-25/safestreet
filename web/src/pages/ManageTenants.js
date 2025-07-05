import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Chip,
  Stack,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Toolbar,
  Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useTenant } from '../context/TenantContext';
import { useNavigate } from 'react-router-dom';

const ManageTenants = () => {
  const { tenants, loading, error, createTenant, updateTenant, deleteTenant } = useTenant();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const initialFormData = {
    name: '',
    code: '',
    description: '',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    settings: {
      maxFieldWorkers: 10,
      maxAdmins: 2,
      primaryColor: '#1976d2',
      secondaryColor: '#f50057'
    },
    fieldWorkers: [],
    active: true
  };
  
  const [formData, setFormData] = useState(initialFormData);
  
  const [newFieldWorker, setNewFieldWorker] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    workerId: '',
    specialization: '',
    region: ''
  });
  
  const navigate = useNavigate();

  // Handle dialog open/close
  const handleOpenCreateDialog = () => {
    setFormData({...initialFormData});
    setFormError('');
    setOpenCreateDialog(true);
  };
  
  const handleOpenEditDialog = (tenant) => {
    setSelectedTenant(tenant);
    setFormData({
      name: tenant.name,
      code: tenant.code,
      description: tenant.description || '',
      settings: {
        maxFieldWorkers: tenant.settings?.maxFieldWorkers || 10,
        maxAdmins: tenant.settings?.maxAdmins || 2,
        primaryColor: tenant.settings?.primaryColor || '#1976d2',
        secondaryColor: tenant.settings?.secondaryColor || '#f50057'
      },
      fieldWorkers: [], // Initialize with an empty array since we don't edit field workers in edit mode
      active: tenant.active
    });
    setFormError('');
    setOpenEditDialog(true);
  };
  
  const handleOpenDeleteDialog = (tenant) => {
    setSelectedTenant(tenant);
    setOpenDeleteDialog(true);
  };
  
  const handleCloseDialogs = () => {
    setOpenCreateDialog(false);
    setOpenEditDialog(false);
    setOpenDeleteDialog(false);
    setSelectedTenant(null);
    setFormError('');
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...(formData[parent] || {}),
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  // Handle view tenant details
  const handleViewTenant = (tenantId) => {
    navigate(`/tenants/${tenantId}`);
  };
  
  // Handle tenant creation
  const handleCreateTenant = async () => {
    try {
      setFormLoading(true);
      setFormError('');
      
      // Simple validation
      if (!formData.name) {
        setFormError('Name is required');
        setFormLoading(false);
        return;
      }
      
      if (!formData.code) {
        setFormError('Code is required');
        setFormLoading(false);
        return;
      }
      
      if (!formData.adminName || !formData.adminEmail || !formData.adminPassword) {
        setFormError('Admin details are required');
        setFormLoading(false);
        return;
      }
      
      // Ensure fieldWorkers is properly formatted
      console.log('Submitting tenant with fieldWorkers:', formData.fieldWorkers);
      
      // Create tenant with properly formatted data
      const dataToSubmit = {
        ...formData,
        fieldWorkers: formData.fieldWorkers || []
      };
      
      await createTenant(dataToSubmit);
      handleCloseDialogs();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };
  
  // Handle tenant update
  const handleUpdateTenant = async () => {
    try {
      setFormLoading(true);
      setFormError('');
      
      if (!formData.name) {
        setFormError('Name is required');
        setFormLoading(false);
        return;
      }
      
      const updateData = {
        name: formData.name,
        description: formData.description,
        settings: formData.settings,
        active: formData.active
      };
      
      await updateTenant(selectedTenant._id, updateData);
      handleCloseDialogs();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };
  
  // Handle tenant deletion
  const handleDeleteTenant = async () => {
    try {
      setFormLoading(true);
      await deleteTenant(selectedTenant._id);
      handleCloseDialogs();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };
  
  // Field worker management
  const handleFieldWorkerChange = (e) => {
    const { name, value } = e.target;
    setNewFieldWorker({
      ...newFieldWorker,
      [name]: value
    });
  };

  const addFieldWorker = () => {
    // Validate field worker data
    if (!newFieldWorker.name || !newFieldWorker.email || !newFieldWorker.password || 
        !newFieldWorker.workerId || !newFieldWorker.specialization || !newFieldWorker.region) {
      setFormError('All fields marked with * are required for field workers');
      return;
    }

    // Check if we already have max field workers
    const settings = formData.settings || {};
    if ((formData.fieldWorkers || []).length >= (settings.maxFieldWorkers || 10)) {
      setFormError(`Cannot add more than ${settings.maxFieldWorkers || 10} field workers`);
      return;
    }

    // Check for duplicate email
    if ((formData.fieldWorkers || []).some(fw => fw.email === newFieldWorker.email)) {
      setFormError('Field worker with this email already exists');
      return;
    }

    setFormData({
      ...formData,
      fieldWorkers: [...(formData.fieldWorkers || []), { ...newFieldWorker }]
    });

    // Reset the field worker form
    setNewFieldWorker({
      name: '',
      email: '',
      password: '',
      phone: '',
      workerId: '',
      specialization: '',
      region: ''
    });
    
    setFormError('');
  };

  const removeFieldWorker = (index) => {
    setFormData({
      ...formData,
      fieldWorkers: (formData.fieldWorkers || []).filter((_, i) => i !== index)
    });
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <Typography color="error" variant="h6">{error}</Typography>
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={0} sx={{ p: 2, mb: 3 }}>
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h5" component="h1">
            Tenant Management
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={handleOpenCreateDialog}
          >
            Create Tenant
          </Button>
        </Toolbar>
      </Paper>
      
      <Grid container spacing={3}>
        {tenants && tenants.map((tenant) => (
          <Grid item xs={12} md={6} lg={4} key={tenant._id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                border: tenant.active ? 'none' : '1px solid #ccc',
                opacity: tenant.active ? 1 : 0.7
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6" component="div" noWrap>
                    {tenant.name}
                  </Typography>
                  <Chip 
                    label={tenant.active ? 'Active' : 'Inactive'} 
                    color={tenant.active ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
                
                <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                  Code: {tenant.code}
                </Typography>
                
                {tenant.description && (
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {tenant.description}
                  </Typography>
                )}
                
                <Divider sx={{ my: 1.5 }} />
                
                <Stack spacing={1} sx={{ mt: 1.5 }}>
                  <Typography variant="body2">
                    Max Field Workers: {tenant.settings?.maxFieldWorkers || 10}
                  </Typography>
                  <Typography variant="body2">
                    Max Admins: {tenant.settings?.maxAdmins || 2}
                  </Typography>
                </Stack>
              </CardContent>
              
              <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton 
                  size="small" 
                  onClick={() => handleViewTenant(tenant._id)}
                  title="View Details"
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={() => handleOpenEditDialog(tenant)}
                  title="Edit Tenant"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={() => handleOpenDeleteDialog(tenant)}
                  title="Delete Tenant"
                  color="error"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {tenants && tenants.length === 0 && !loading && (
        <Box display="flex" justifyContent="center" alignItems="center" height="40vh">
          <Typography variant="h6" color="text.secondary">
            No tenants found. Create your first tenant to get started.
          </Typography>
        </Box>
      )}
      
      {/* Create Tenant Dialog */}
      <Dialog open={openCreateDialog} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Tenant</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Tenant Name *"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="code"
                label="Tenant Code *"
                value={formData.code}
                onChange={handleInputChange}
                fullWidth
                required
                helperText="Unique identifier for the tenant (e.g., 'acme-corp')"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Tenant Owner Admin Details
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="adminName"
                label="Admin Name *"
                value={formData.adminName}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="adminEmail"
                label="Admin Email *"
                value={formData.adminEmail}
                onChange={handleInputChange}
                type="email"
                fullWidth
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="adminPassword"
                label="Admin Password *"
                value={formData.adminPassword}
                onChange={handleInputChange}
                type="password"
                fullWidth
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Tenant Settings
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="settings.maxFieldWorkers"
                label="Max Field Workers"
                value={formData.settings.maxFieldWorkers}
                onChange={handleInputChange}
                type="number"
                fullWidth
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="settings.maxAdmins"
                label="Max Admins"
                value={formData.settings.maxAdmins}
                onChange={handleInputChange}
                type="number"
                fullWidth
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="settings.primaryColor"
                label="Primary Color"
                value={formData.settings.primaryColor}
                onChange={handleInputChange}
                fullWidth
                type="color"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="settings.secondaryColor"
                label="Secondary Color"
                value={formData.settings.secondaryColor}
                onChange={handleInputChange}
                fullWidth
                type="color"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Field Workers (Optional)
              </Typography>
              
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Add Field Worker
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="name"
                      label="Name *"
                      value={newFieldWorker.name}
                      onChange={handleFieldWorkerChange}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="workerId"
                      label="Worker ID *"
                      value={newFieldWorker.workerId}
                      onChange={handleFieldWorkerChange}
                      fullWidth
                      size="small"
                      helperText="Unique identifier for this worker"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="email"
                      label="Email *"
                      value={newFieldWorker.email}
                      onChange={handleFieldWorkerChange}
                      fullWidth
                      size="small"
                      type="email"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="password"
                      label="Password *"
                      value={newFieldWorker.password}
                      onChange={handleFieldWorkerChange}
                      fullWidth
                      size="small"
                      type="password"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="specialization"
                      label="Specialization *"
                      value={newFieldWorker.specialization}
                      onChange={handleFieldWorkerChange}
                      fullWidth
                      size="small"
                      helperText="E.g., Pothole Repair, Street Light Maintenance"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="region"
                      label="Region *"
                      value={newFieldWorker.region}
                      onChange={handleFieldWorkerChange}
                      fullWidth
                      size="small"
                      helperText="Geographical working area"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="phone"
                      label="Phone"
                      value={newFieldWorker.phone}
                      onChange={handleFieldWorkerChange}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      onClick={addFieldWorker}
                      fullWidth
                      startIcon={<AddIcon />}
                    >
                      Add Field Worker
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
              
              {(formData.fieldWorkers || []).length > 0 && (
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Added Field Workers ({(formData.fieldWorkers || []).length}/{(formData.settings || {}).maxFieldWorkers || 10})
                  </Typography>
                  {(formData.fieldWorkers || []).map((worker, index) => (
                    <Box 
                      key={index} 
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1,
                        mb: 1,
                        borderRadius: 1,
                        bgcolor: 'background.default'
                      }}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{worker.name}</Typography>
                        <Typography variant="caption">{worker.email}</Typography>
                      </Box>
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => removeFieldWorker(index)}
                        title="Remove Field Worker"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Paper>
              )}
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1, mt: 2 }}>
                Field Workers
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Button 
                variant="outlined" 
                onClick={addFieldWorker}
                disabled={formLoading}
                sx={{ mb: 2 }}
                startIcon={formLoading && <CircularProgress size={20} />}
              >
                Add Field Worker
              </Button>
            </Grid>
            
            {(formData.fieldWorkers || []).map((fw, index) => (
              <Grid item xs={12} key={index}>
                <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        name="name"
                        label="Name"
                        value={fw.name}
                        onChange={(e) => {
                          const { value } = e.target;
                          setFormData((prev) => {
                            const updatedFW = [...prev.fieldWorkers];
                            updatedFW[index].name = value;
                            return { ...prev, fieldWorkers: updatedFW };
                          });
                        }}
                        fullWidth
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        name="email"
                        label="Email"
                        value={fw.email}
                        onChange={(e) => {
                          const { value } = e.target;
                          setFormData((prev) => {
                            const updatedFW = [...prev.fieldWorkers];
                            updatedFW[index].email = value;
                            return { ...prev, fieldWorkers: updatedFW };
                          });
                        }}
                        fullWidth
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        name="password"
                        label="Password"
                        value={fw.password}
                        onChange={(e) => {
                          const { value } = e.target;
                          setFormData((prev) => {
                            const updatedFW = [...prev.fieldWorkers];
                            updatedFW[index].password = value;
                            return { ...prev, fieldWorkers: updatedFW };
                          });
                        }}
                        type="password"
                        fullWidth
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        name="phone"
                        label="Phone"
                        value={fw.phone}
                        onChange={(e) => {
                          const { value } = e.target;
                          setFormData((prev) => {
                            const updatedFW = [...prev.fieldWorkers];
                            updatedFW[index].phone = value;
                            return { ...prev, fieldWorkers: updatedFW };
                          });
                        }}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                      variant="outlined" 
                      color="error"
                      onClick={() => removeFieldWorker(index)}
                      disabled={formLoading}
                      startIcon={formLoading && <CircularProgress size={20} />}
                    >
                      Remove Field Worker
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
            
            {formError && (
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                {formError}
              </Typography>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button 
            onClick={handleCreateTenant} 
            variant="contained" 
            disabled={formLoading}
            startIcon={formLoading && <CircularProgress size={20} />}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit Tenant Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Tenant</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Tenant Name *"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="active"
                    checked={formData.active}
                    onChange={handleSwitchChange}
                    color="primary"
                  />
                }
                label="Active"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Tenant Settings
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="settings.maxFieldWorkers"
                label="Max Field Workers"
                value={formData.settings.maxFieldWorkers || 10}
                onChange={handleInputChange}
                type="number"
                fullWidth
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="settings.maxAdmins"
                label="Max Admins"
                value={formData.settings.maxAdmins || 2}
                onChange={handleInputChange}
                type="number"
                fullWidth
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="settings.primaryColor"
                label="Primary Color"
                value={formData.settings.primaryColor || '#1976d2'}
                onChange={handleInputChange}
                fullWidth
                type="color"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="settings.secondaryColor"
                label="Secondary Color"
                value={formData.settings.secondaryColor || '#f50057'}
                onChange={handleInputChange}
                fullWidth
                type="color"
              />
            </Grid>
          </Grid>
          
          {formError && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {formError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button 
            onClick={handleUpdateTenant} 
            variant="contained" 
            disabled={formLoading}
            startIcon={formLoading && <CircularProgress size={20} />}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDialogs}>
        <DialogTitle>Delete Tenant</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the tenant <strong>{selectedTenant?.name}</strong>?
          </Typography>
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            This action cannot be undone. All associated data will be permanently deleted.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button 
            onClick={handleDeleteTenant} 
            variant="contained" 
            color="error"
            disabled={formLoading}
            startIcon={formLoading && <CircularProgress size={20} />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageTenants;
