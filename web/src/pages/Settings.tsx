import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Avatar,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Lock,
  Notifications,
  Security,
  Save,
  Delete,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Settings: React.FC = () => {
  const { state, updateUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const [profileData, setProfileData] = useState({
    fullName: state.user?.fullName || '',
    email: state.user?.email || '',
    phone: state.user?.phone || '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    reportUpdates: true,
    systemAlerts: true,
  });

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError('');
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError('');
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profileData.fullName || !profileData.email) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // In production, make API call to update profile
      updateUser(profileData);
      setSuccess('Profile updated successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError('Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // In production, make API call to update password
      setSuccess('Password updated successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // In production, make API call to delete account
      await logout();
      // Redirect will be handled by auth context
    } catch (err: any) {
      setError(err.message || 'Failed to delete account');
    }
    setDeleteDialogOpen(false);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Settings
        </Typography>
        <Typography variant="body1" sx={{ color: '#6c757d' }}>
          Manage your account settings and preferences
        </Typography>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Settings */}
        <Grid item xs={12} lg={8}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '1px solid #f0f0f0',
              mb: 3,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <Person sx={{ color: '#007AFF' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Profile Information
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleProfileSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={profileData.fullName}
                      onChange={(e) => handleProfileChange('fullName', e.target.value)}
                      disabled={loading}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      disabled={loading}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={profileData.phone}
                      onChange={(e) => handleProfileChange('phone', e.target.value)}
                      disabled={loading}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                      disabled={loading}
                      sx={{
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #007AFF 0%, #0A84FF 100%)',
                        boxShadow: '0 4px 12px rgba(0,122,255,0.3)',
                      }}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>

          {/* Password Settings */}
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '1px solid #f0f0f0',
              mb: 3,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <Lock sx={{ color: '#007AFF' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Change Password
                </Typography>
              </Box>

              <Box component="form" onSubmit={handlePasswordSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      disabled={loading}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="New Password"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      disabled={loading}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      disabled={loading}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                      disabled={loading}
                      sx={{
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #007AFF 0%, #0A84FF 100%)',
                        boxShadow: '0 4px 12px rgba(0,122,255,0.3)',
                      }}
                    >
                      {loading ? 'Updating...' : 'Update Password'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Profile Card */}
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '1px solid #f0f0f0',
              mb: 3,
            }}
          >
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: '#007AFF',
                  fontSize: '2rem',
                  fontWeight: 600,
                  mx: 'auto',
                  mb: 2,
                }}
              >
                {state.user?.fullName.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {state.user?.fullName}
              </Typography>
              <Typography variant="body2" sx={{ color: '#6c757d', mb: 2 }}>
                {state.user?.email}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6c757d' }}>
                Administrator
              </Typography>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '1px solid #f0f0f0',
              mb: 3,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Notifications sx={{ color: '#007AFF' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Notifications
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => handleNotificationChange('emailNotifications', e.target.checked)}
                    />
                  }
                  label="Email Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onChange={(e) => handleNotificationChange('pushNotifications', e.target.checked)}
                    />
                  }
                  label="Push Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.reportUpdates}
                      onChange={(e) => handleNotificationChange('reportUpdates', e.target.checked)}
                    />
                  }
                  label="Report Updates"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.systemAlerts}
                      onChange={(e) => handleNotificationChange('systemAlerts', e.target.checked)}
                    />
                  }
                  label="System Alerts"
                />
              </Box>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '1px solid #ffebee',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Security sx={{ color: '#ff3b30' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#ff3b30' }}>
                  Danger Zone
                </Typography>
              </Box>

              <Typography variant="body2" sx={{ color: '#6c757d', mb: 3 }}>
                Once you delete your account, there is no going back. Please be certain.
              </Typography>

              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={() => setDeleteDialogOpen(true)}
                sx={{ borderRadius: 2 }}
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Delete Account Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: '#ff3b30' }}>Delete Account</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Are you sure you want to delete your account? This action cannot be undone and will:
          </Typography>
          <Box component="ul" sx={{ pl: 2, color: '#6c757d' }}>
            <li>Permanently delete your profile and account data</li>
            <li>Remove all your uploaded reports and images</li>
            <li>Cancel any pending operations</li>
            <li>Revoke access to the dashboard</li>
          </Box>
          <Typography sx={{ mt: 2, fontWeight: 600, color: '#ff3b30' }}>
            This action is irreversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained">
            Delete My Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;