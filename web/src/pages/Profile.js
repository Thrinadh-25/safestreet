import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Button,
  Divider,
  TextField,
  CardContent,
  IconButton,
  Tabs,
  Tab,
  Badge,
  Tooltip,
  Chip as MuiChip,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Email,
  Phone,
  LocationOn,
  Security,
  History,
  Settings,
  Person,
  Dashboard,
} from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";
import { API_BASE_URL, API_ENDPOINTS, TOKEN_KEY } from "../config/constants";

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

const Profile = () => {
  const [tabValue, setTabValue] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { user, updateUser } = useAuth();
  const [userData, setUserData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "admin",
    position: user?.profile?.position || "Administrator",
    phone: user?.profile?.phone || "",
    location: user?.profile?.location || "",
    department: user?.profile?.department || "",
    joinDate: user?.profile?.joinDate ? new Date(user.profile.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Recently joined",
    bio: user?.profile?.bio || "No bio available",
    skills: user?.profile?.skills || []
  });

  // Load user profile data
  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "admin",
        position: user.profile?.position || "Administrator",
        phone: user.profile?.phone || "",
        location: user.profile?.location || "Kmec",
        department: user.profile?.department || "",
        joinDate: user.profile?.joinDate ? new Date(user.profile.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Recently joined",
        bio: user.profile?.bio || "No bio available",
        skills: user.profile?.skills || []
      });
    }
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PROFILE}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          profile: {
            position: userData.position,
            phone: userData.phone,
            location: userData.location,
            department: userData.department,
            bio: userData.bio,
            skills: userData.skills
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      
      // Update local user state
      updateUser(updatedUser);
      setSuccess('Profile updated successfully');
      setEditMode(false);
    } catch (err) {
      setError(err.message || 'An error occurred while updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setError(null);
    setSuccess(null);
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "#f8fafc", py: 4 }}>
      <Container maxWidth="lg">
        {/* Error Snackbar */}
        <Snackbar 
          open={!!error} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
        
        {/* Success Snackbar */}
        <Snackbar 
          open={!!success} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            {success}
          </Alert>
        </Snackbar>
        
        <Box
          sx={{
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Grid container spacing={4}>
            {/* Header */}
            <Grid item xs={12}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`,
                }}
              >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 2
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        variant="dot"
                        color="success"
                      >
                        <Avatar
                          src="/static/images/avatar/sarah.jpg"
                          sx={{ 
                            width: 64, 
                            height: 64, 
                            mr: 2,
                            backgroundColor: colors.primary,
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)" 
                          }}
                        >
                          SJ
                        </Avatar>
                      </Badge>
                      <Box>
                        <Typography variant="h5" fontWeight="600">
                          {userData.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {userData.position}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      {/* <Tooltip title="Notifications">
                        <IconButton
                          color="primary"
                          sx={{
                            bgcolor: colors.border,
                            "&:hover": {
                              bgcolor: "#e2e8f0",
                            },
                          }}
                        >
                          <Badge badgeContent={3} color="error">
                            <Notifications />
                          </Badge>
                        </IconButton>
                      </Tooltip> */}
                      <Button
                        variant="contained"
                        startIcon={editMode ? <SaveIcon /> : <EditIcon />}
                        onClick={editMode ? handleSave : handleEditToggle}
                        disabled={isLoading}
                        sx={{
                          borderRadius: 1.5,
                          px: 3,
                          py: 1,
                          backgroundColor: colors.primary,
                          "&:hover": {
                            backgroundColor: colors.primaryDark,
                          },
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        {isLoading 
                          ? "Saving..." 
                          : editMode 
                            ? "Save Changes" 
                            : "Edit Profile"}
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              {/* Main Content */}
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    height: "100%",
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <Box
                    sx={{
                      p: 3,
                      textAlign: "center",
                      background: colors.primary,
                      color: "white",
                    }}
                  >
                    <Avatar
                      src="/static/images/avatar/sarah.jpg"
                      sx={{ 
                        width: 100, 
                        height: 100, 
                        mx: "auto", 
                        border: "4px solid white",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)"
                      }}
                    />
                    <Typography variant="h5" sx={{ mt: 2, fontWeight: "bold" }}>
                      {userData.name}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      {userData.position}
                    </Typography>
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Email sx={{ mr: 2, color: colors.primary }} />
                      <Typography variant="body2">{userData.email}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Phone sx={{ mr: 2, color: colors.primary }} />
                      <Typography variant="body2">{userData.phone}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <LocationOn sx={{ mr: 2, color: colors.primary }} />
                      <Typography
                        variant="body2"
                        component="a"
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(userData.location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ color: colors.text, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
                      >
                        {userData.location}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="primary">
                      Department
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {userData.department}
                    </Typography>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="primary">
                      Joined
                    </Typography>
                    <Typography variant="body2">{userData.joinDate}</Typography>
                  </CardContent>
                </Paper>
              </Grid>

              <Grid item xs={12} md={8}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    height: "100%",
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    sx={{ 
                      borderBottom: 1, 
                      borderColor: "divider",
                      bgcolor: colors.surface,
                    }}
                    indicatorColor="primary"
                    textColor="primary"
                  >
                    <Tab
                      value="profile"
                      icon={<Person fontSize="small" />}
                      label="Profile"
                      iconPosition="start"
                      sx={{ textTransform: "none", py: 1.5 }}
                    />
                    {/* <Tab
                      icon={<History fontSize="small" />}
                      label="Activity"
                      iconPosition="start"
                      sx={{ textTransform: "none", py: 1.5 }}
                    /> */}
                    <Tab
                      value="settings"
                      icon={<Settings fontSize="small" />}
                      label="Settings"
                      iconPosition="start"
                      sx={{ textTransform: "none", py: 1.5 }}
                    />
                  </Tabs>

                  {tabValue === "profile" && (
                    <Box sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                        About Me
                      </Typography>
                      {editMode ? (
                        <TextField
                          name="bio"
                          value={userData.bio}
                          onChange={handleInputChange}
                          multiline
                          rows={4}
                          fullWidth
                          variant="outlined"
                          sx={{ mb: 3 }}
                        />
                      ) : (
                        <Typography variant="body2" paragraph sx={{ mb: 3 }}>
                          {userData.bio}
                        </Typography>
                      )}

                      <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                        Personal Information
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Full Name"
                            name="name"
                            value={userData.name}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                            disabled={!editMode}
                            size="small"
                            sx={{ mb: 2 }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Job Title"
                            name="position"
                            value={userData.position}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                            disabled={!editMode}
                            size="small"
                            sx={{ mb: 2 }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Email"
                            name="email"
                            value={userData.email}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                            disabled={!editMode}
                            size="small"
                            sx={{ mb: 2 }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Phone"
                            name="phone"
                            value={userData.phone}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                            disabled={!editMode}
                            size="small"
                            sx={{ mb: 2 }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Location"
                            name="location"
                            value={userData.location}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                            disabled={!editMode}
                            size="small"
                            sx={{ mb: 2 }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Department"
                            name="department"
                            value={userData.department}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                            disabled={!editMode}
                            size="small"
                            sx={{ mb: 2 }}
                          />
                        </Grid>
                      </Grid>

                      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 2 }} color="primary">
                        Skills & Expertise
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {(userData.skills && userData.skills.length > 0)
                          ? userData.skills.map((skill) => (
                              <MuiChip 
                                key={skill} 
                                label={skill} 
                                color="primary" 
                                variant="outlined" 
                                size="small"
                                onDelete={editMode ? () => {
                                  setUserData({
                                    ...userData,
                                    skills: userData.skills.filter(s => s !== skill)
                                  });
                                } : undefined}
                              />
                            ))
                          : !editMode && 
                            <Typography variant="body2" color="text.secondary">
                              No skills listed yet.
                            </Typography>
                        }
                        
                        {editMode && (
                          <TextField
                            placeholder="Add skill and press Enter"
                            size="small"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.target.value.trim()) {
                                setUserData({
                                  ...userData,
                                  skills: [...(userData.skills || []), e.target.value.trim()]
                                });
                                e.target.value = '';
                                e.preventDefault();
                              }
                            }}
                            sx={{ ml: 1, mt: 1 }}
                          />
                        )}
                      </Box>
                    </Box>
                  )}

                  {/* {tabValue === 1 && (
                    <Box sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                        Recent Activity
                      </Typography>
                      <Timeline>
                        <TimelineItem
                          title="Approved road repair request"
                          time="Today, 10:30 AM"
                          description="Approved emergency repair for pothole damage on Main Street and 5th Avenue"
                        />
                        <TimelineItem
                          title="Updated damage assessment protocol"
                          time="Yesterday, 2:15 PM"
                          description="Revised the severity classification system for road surface cracks"
                        />
                        <TimelineItem
                          title="Reviewed AI damage detection results"
                          time="Oct 15, 2023"
                          description="Validated AI-detected road damages in the downtown area with 94% accuracy"
                        />
                        <TimelineItem
                          title="Assigned repair crew"
                          time="Oct 12, 2023"
                          description="Dispatched maintenance team to address critical infrastructure issues on Highway 101"
                        />
                        <TimelineItem
                          title="Generated monthly report"
                          time="Oct 1, 2023"
                          description="Created comprehensive analysis of road conditions across the city"
                        />
                      </Timeline>
                    </Box>
                  )} */}

                  {tabValue === "settings" && (
                    <Box sx={{ p: 3 }}>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                            Account Settings
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Paper
                            elevation={0}
                            sx={{ 
                              borderRadius: 2,
                              border: `1px solid ${colors.border}`,
                            }}
                          >
                            <CardContent>
                              <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">
                                Security
                              </Typography>
                              <Grid container spacing={2}>
                                {/* <Grid item xs={12}>
                                  <Button
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<Security />}
                                    sx={{
                                      justifyContent: "flex-start",
                                      textTransform: "none",
                                      py: 1,
                                      mb: 1,
                                      borderRadius: 1.5,
                                    }}
                                  >
                                    Change Password
                                  </Button>
                                </Grid>
                                <Grid item xs={12}>
                                  <Button
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<Security />}
                                    sx={{
                                      justifyContent: "flex-start",
                                      textTransform: "none",
                                      py: 1,
                                      borderRadius: 1.5,
                                    }}
                                  >
                                    Two-Factor Authentication
                                  </Button>
                                </Grid> */}
                                <Grid item xs={12}>
                                  <Typography 
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mt: 2 }}
                                  >
                                    🔒 For any security-related changes, please contact <strong>SafeStreet Support</strong>.
                                  </Typography>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Paper>
                        </Grid>
                        {/* <Grid item xs={12}>
                          <Paper
                            elevation={0}
                            sx={{ 
                              borderRadius: 2,
                              border: `1px solid ${colors.border}`,
                            }}
                          > */}
                            {/* <CardContent>
                              <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">
                                Notifications
                              </Typography>
                              <Grid container spacing={2}>
                                <Grid item xs={12}>
                                  <Button
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<Email />}
                                    sx={{
                                      justifyContent: "flex-start",
                                      textTransform: "none",
                                      py: 1,
                                      mb: 1,
                                      borderRadius: 1.5,
                                    }}
                                  >
                                    Email Notifications
                                  </Button>
                                </Grid>
                                <Grid item xs={12}>
                                  <Button
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<Notifications />}
                                    sx={{
                                      justifyContent: "flex-start",
                                      textTransform: "none",
                                      py: 1,
                                      mb: 1,
                                      borderRadius: 1.5,
                                    }}
                                  >
                                    Damage Alerts
                                  </Button>
                                </Grid>
                                <Grid item xs={12}>
                                  <Button
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<Dashboard />}
                                    sx={{
                                      justifyContent: "flex-start",
                                      textTransform: "none",
                                      py: 1,
                                      borderRadius: 1.5,
                                    }}
                                  >
                                    System Updates
                                  </Button>
                                </Grid>
                              </Grid>
                            </CardContent> */}
                          {/* </Paper>
                        </Grid> */}
                      </Grid>
                    </Box>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    );
};

// Timeline components
const Timeline = ({ children }) => (
  <Box sx={{ mt: 2 }}>
    {children}
  </Box>
);

const TimelineItem = ({ title, time, description }) => (
  <Box 
    sx={{ 
      mb: 3, 
      pb: 3, 
      borderBottom: "1px solid", 
      borderColor: "divider",
      position: "relative",
      pl: 3,
      "&::before": {
        content: '""',
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
        borderRadius: 4,
        backgroundColor: "primary.light",
      }
    }}
  >
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
      <Typography variant="subtitle1" fontWeight="bold">
        {title}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {time}
      </Typography>
    </Box>
    <Typography variant="body2" color="text.secondary">
      {description}
    </Typography>
  </Box>
);

export default Profile;
