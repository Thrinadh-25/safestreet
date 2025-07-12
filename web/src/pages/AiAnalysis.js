import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Paper,
  Grid,
  Divider,
  Container,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { api } from '../utils/api';
import { TOKEN_KEY } from '../config/constants';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const AiAnalysis = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');
  const [locationData, setLocationData] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 1) {
      fetchReports();
    }
  };

  const fetchReports = async () => {
    setReportsLoading(true);
    try {
      const data = await api.get('/images/reports');
      setReports(data.reports);
    } catch (err) {
      setError(err.message);
    } finally {
      setReportsLoading(false);
    }
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setPrediction(null);
      setError(null);
    }
  };

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        setLocationStatus('Geolocation is not supported by your browser');
        reject('Geolocation not supported');
        return;
      }

      setLocationStatus('Fetching location...');
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Get address using reverse geocoding
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );
              const data = await response.json();
              
              const locationInfo = {
                latitude,
                longitude,
                address: data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
              };
              
              setLocationData(locationInfo);
              setLocationStatus('Location fetched successfully');
              resolve(locationInfo);
            } catch (error) {
              console.error('Error getting address:', error);
              const locationInfo = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
              };
              setLocationData(locationInfo);
              setLocationStatus('Location coordinates fetched (address lookup failed)');
              resolve(locationInfo);
            }
          } catch (error) {
            console.error('Error processing location:', error);
            setLocationStatus('Error processing location data');
            reject(error);
          }
        },
        (error) => {
          let errorMsg = 'Unable to fetch location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMsg = 'Location access denied. Please enable location permissions.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMsg = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMsg = 'Location request timed out.';
              break;
            default:
              errorMsg = 'An unknown error occurred while fetching location.';
          }
          setLocationStatus(errorMsg);
          console.error('Error getting location:', error);
          reject(error);
        },
        { 
          maximumAge: 60000,        // Use cached position if less than 1 minute old
          timeout: 10000,           // Wait up to 10 seconds
          enableHighAccuracy: false // Don't need high accuracy, save battery
        }
      );
    });
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);

    try {
      // Get location first
      let locationInfo = null;
      try {
        locationInfo = await getLocation();
      } catch (error) {
        console.warn('Could not get location:', error);
      }

      console.log('Processing image:', {
        name: selectedImage.name,
        type: selectedImage.type,
        size: selectedImage.size
      });

      // Create form data
      const formData = new FormData();
      formData.append('image', selectedImage);
      
      // Add location data if available
      if (locationInfo) {
        formData.append('latitude', locationInfo.latitude.toString());
        formData.append('longitude', locationInfo.longitude.toString());
        if (locationInfo.address) {
          formData.append('address', locationInfo.address);
        }
      }

      // Log the form data to ensure it's properly set
      console.log('Form data entries:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, typeof value === 'object' ? 'File object' : value);
      }

      // Use the new postFormData method instead of post
      const response = await api.postFormData('/images/upload', formData);

      if (response.success) {
        setPrediction(response.prediction);
        console.log('Response:', response);
      } else {
        throw new Error(response.message || 'Failed to process image');
      }
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError(err.message || 'An error occurred while analyzing the image');
    } finally {
      setLoading(false);
    }
  };

  // Reports are now rendered directly in the JSX of TabPanel with index 1

  return (
    <Container maxWidth="lg">
      <Box sx={{ width: '100%', py: 3 }}>
        <Typography variant="h4" gutterBottom>
          AI Analysis
        </Typography>
        
        {locationStatus && (
          <Alert 
            severity={locationStatus.includes('successfully') ? 'success' : 'info'} 
            sx={{ mb: 2 }}
          >
            {locationStatus}
          </Alert>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            aria-label="AI analysis tabs"
          >
            <Tab 
              label="Upload Image" 
              icon={<CloudUploadIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="View Reports" 
              icon={<AssessmentIcon />} 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Paper elevation={3}>
            <Box sx={{ p: 3 }}>
              {/* Image Upload Section */}
              <Box 
                sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<ImageIcon />}
                >
                  Choose Image
                  <VisuallyHiddenInput 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageSelect}
                  />
                </Button>

                {error && (
                  <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                    {error}
                  </Alert>
                )}

                {selectedImage && (
                  <Box sx={{ mt: 2, width: '100%' }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Selected Image
                    </Typography>
                    <Box
                      sx={{
                        width: '100%',
                        height: 300,
                        backgroundImage: `url(${previewUrl})`,
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        border: '1px solid #e0e0e0',
                        borderRadius: 1
                      }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={analyzeImage}
                      disabled={loading}
                      sx={{ mt: 2 }}
                    >
                      {loading ? (
                        <>
                          <CircularProgress size={24} sx={{ mr: 1 }} />
                          Analyzing...
                        </>
                      ) : (
                        'Analyze Image'
                      )}
                    </Button>
                  </Box>
                )}

                {locationData && (
                  <Box sx={{ mt: 2, width: '100%' }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Location Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Latitude: {locationData.latitude}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Longitude: {locationData.longitude}
                        </Typography>
                      </Grid>
                      {locationData.address && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">
                            Address: {locationData.address}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                )}

                {prediction && (
                  <Box sx={{ mt: 3, width: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      Analysis Results
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1">
                          Damage Type: <Chip label={prediction.damageType} color="primary" size="small" />
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1">
                          Severity: <Chip label={prediction.severity} color="error" size="small" />
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1">
                          Priority: <Chip label={prediction.priority} color="warning" size="small" />
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => {
                            handleTabChange(null, 1);
                          }}
                        >
                          View All Reports
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Box>
            </Box>
          </Paper>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ px: { xs: 1, sm: 3 }, py: 3 }}>
            {reportsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : reports.length === 0 ? (
              <Paper sx={{ p: 4, borderRadius: 2, textAlign: 'center', bgcolor: '#f5f5f5' }}>
                <AssessmentIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
                <Typography variant="h6" gutterBottom>No Reports Available</Typography>
                <Typography variant="body2" color="text.secondary">
                  Upload and analyze images to create damage reports
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {reports.map((report) => (
                  <Grid item xs={12} md={6} lg={4} key={report.id}>
                    <Paper 
                      elevation={2} 
                      sx={{ 
                        p: 0,
                        borderRadius: 2,
                        overflow: 'hidden',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4
                        }
                      }}
                    >
                      {report.annotatedImage && (
                        <Box sx={{ 
                          width: '100%',
                          height: 200, 
                          overflow: 'hidden',
                          backgroundColor: '#f0f0f0'
                        }}>
                          <img
                            src={report.annotatedImage}
                            alt="Annotated damage"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        </Box>
                      )}
                      
                      <Box sx={{ p: 2.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 500 }}>
                            Damage Report
                          </Typography>
                          <Chip 
                            size="small" 
                            label={report.severity} 
                            color={report.severity === 'High' ? 'error' : report.severity === 'Medium' ? 'warning' : 'success'} 
                          />
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Type</Typography>
                            <Typography variant="body2" fontWeight="medium">{report.damageType}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Priority</Typography>
                            <Typography variant="body2" fontWeight="medium">{report.priority}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Date</Typography>
                            <Typography variant="body2">{new Date(report.createdAt).toLocaleDateString()}</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </TabPanel>
      </Box>
    </Container>
  );
};

export default AiAnalysis;