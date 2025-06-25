import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Save, Notifications, Security } from '@mui/icons-material';

const Settings = (): React.ReactElement => {
  const [settings, setSettings] = useState({
    siteName: 'Safe Street Admin',
    adminEmail: 'admin@safestreet.com',
    notificationsEnabled: true,
    emailAlerts: true,
    autoAssignment: false,
    maintenanceMode: false,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // TODO: API call to save settings
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        System Settings
      </Typography>

      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* General Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              General Settings
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Site Name"
                value={settings.siteName}
                onChange={(e) => handleSettingChange('siteName', e.target.value)}
                fullWidth
              />
              <TextField
                label="Admin Email"
                type="email"
                value={settings.adminEmail}
                onChange={(e) => handleSettingChange('adminEmail', e.target.value)}
                fullWidth
              />
            </Box>
          </Paper>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              <Notifications sx={{ mr: 1, verticalAlign: 'middle' }} />
              Notifications
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notificationsEnabled}
                    onChange={(e) => handleSettingChange('notificationsEnabled', e.target.checked)}
                  />
                }
                label="Enable Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.emailAlerts}
                    onChange={(e) => handleSettingChange('emailAlerts', e.target.checked)}
                  />
                }
                label="Email Alerts"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoAssignment}
                    onChange={(e) => handleSettingChange('autoAssignment', e.target.checked)}
                  />
                }
                label="Auto-assign Reports"
              />
            </Box>
          </Paper>
        </Grid>

        {/* System Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              <Security sx={{ mr: 1, verticalAlign: 'middle' }} />
              System
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                  />
                }
                label="Maintenance Mode"
              />
            </Box>
          </Paper>
        </Grid>

        {/* API Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              API Configuration
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Configure your backend API endpoints in the config file
            </Alert>
            <Typography variant="body2" color="text.secondary">
              Current API URL: {process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api' : 'Production URL'}
            </Typography>
          </Paper>
        </Grid>

        {/* Database Integration */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Database Integration Guide
            </Typography>
            <Typography variant="body2" paragraph>
              To connect this web dashboard to your MongoDB database, implement the following API endpoints:
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Required Admin API Endpoints:
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText primary="POST /api/admin/login" secondary="Admin authentication" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="GET /api/admin/dashboard" secondary="Dashboard statistics" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="GET /api/admin/reports" secondary="All user reports" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="PUT /api/admin/reports/:id" secondary="Update report status" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="GET /api/admin/users" secondary="User management" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="PUT /api/admin/users/:id" secondary="Update user status" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Database Collections:
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText primary="users" secondary="User accounts and profiles" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="uploads" secondary="Road damage reports" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="admins" secondary="Admin user accounts" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="settings" secondary="System configuration" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Implementation Note:</strong> Update the API_URL in <code>src/config/api.js</code> to point to your backend server.
                The current implementation uses mock data for demonstration purposes.
              </Typography>
            </Alert>
          </Paper>
        </Grid>

        {/* Save Button */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              size="large"
            >
              Save Settings
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;