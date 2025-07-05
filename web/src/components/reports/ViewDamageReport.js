import React, { useEffect, useState, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Chip, 
  Divider,
  Paper,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
// API constants are imported directly
import { API_BASE_URL, API_ENDPOINTS, TOKEN_KEY } from '../../config/constants';
import { formatLocation, getCoordinatesString } from '../../utils/formatters';

const ViewDamageReport = ({ report }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Function to handle reading out the report description
  const handleSpeak = useCallback(() => {
    // If already speaking, stop the speech
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // If no description, nothing to read
    if (!report.description) {
      return;
    }

    // Create the text to speech
    const speech = new SpeechSynthesisUtterance(report.description);
    speech.rate = 0.9; // slightly slower than default
    speech.pitch = 1;
    speech.volume = 1;

    // When speech ends, reset the speaking state
    speech.onend = () => {
      setIsSpeaking(false);
    };

    // If speech is interrupted or errors out
    speech.onerror = () => {
      setIsSpeaking(false);
    };

    // Start speaking
    setIsSpeaking(true);
    window.speechSynthesis.speak(speech);
  }, [report.description, isSpeaking]);

  // Get image URL with authentication token
  const getAuthenticatedImageUrl = (reportId, type) => {
    const token = localStorage.getItem(TOKEN_KEY);
    return `${API_BASE_URL}${API_ENDPOINTS.DAMAGE_REPORTS}/report/${reportId}/image/${type}?token=${token}`;
  };

  useEffect(() => {
    const loadImage = () => {
      // Check for both reportId and _id to ensure we can always find the report identifier
      const id = report?.reportId || report?._id;
      
      if (report && id) {
        setLoading(true);
        console.log('Loading image for report:', id);
        
        // Using direct URL with authentication token
        const directImageUrl = getAuthenticatedImageUrl(id, 'before');
        console.log('Image URL:', directImageUrl);
        
        // Create an image element to test loading
        const img = new Image();
        img.onload = () => {
          console.log('Image loaded successfully for report:', id);
          setImageUrl(directImageUrl);
          setLoading(false);
        };
        img.onerror = (e) => {
          console.error('Error loading image for report:', id, e);
          // Try the other ID format if the first one fails
          if (report.reportId && report._id && report.reportId !== report._id) {
            const altId = id === report.reportId ? report._id : report.reportId;
            const altImageUrl = getAuthenticatedImageUrl(altId, 'before');
            console.log('Trying alternative image URL:', altImageUrl);
            
            const altImg = new Image();
            altImg.onload = () => {
              console.log('Alternative image loaded successfully');
              setImageUrl(altImageUrl);
              setLoading(false);
            };
            altImg.onerror = () => {
              console.error('Both image URLs failed to load');
              setImageUrl(null);
              setLoading(false);
            };
            altImg.src = altImageUrl;
          } else {
            setImageUrl(null);
            setLoading(false);
          }
        };
        img.src = directImageUrl;
      } else {
        console.log('No report ID available, skipping image load');
        setLoading(false);
      }
    };

    loadImage();
    
    return () => {
      // Cancel any ongoing speech when component unmounts
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [report]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'success';
      case 'in progress': return 'info';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'error';
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Report ID and Date */}
        <Grid item xs={12}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5" gutterBottom>
              Report #{report.reportId}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Submitted on {new Date(report.createdAt).toLocaleString()}
            </Typography>
          </Box>
          <Divider />
        </Grid>

        {/* Status and Severity */}
        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle2" gutterBottom>Status</Typography>
            <Chip 
              label={report.status}
              color={getStatusColor(report.status)}
              sx={{ fontWeight: 600 }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle2" gutterBottom>Assignment</Typography>
            <Typography>{report.assignedTo ? report.assignedTo.name : 'Unassigned'}</Typography>
          </Paper>
        </Grid>

        {/* Location Details */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Location Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Region</Typography>
                <Typography variant="body1">{report.region}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Location</Typography>
                <Typography variant="body1">{formatLocation(report.location)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Coordinates</Typography>
                <Typography variant="body1">{getCoordinatesString(report.location)}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Damage Details */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Damage Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">Damage Type</Typography>
                <Typography variant="body1">{report.damageType}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">Severity</Typography>
                <Chip 
                  label={report.severity}
                  color={getSeverityColor(report.severity)}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">Priority</Typography>
                <Typography variant="body1">{report.priority}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Description</Typography>
                  <Tooltip title={isSpeaking ? "Stop reading" : "Read description aloud"}>
                    <IconButton 
                      size="small" 
                      onClick={handleSpeak} 
                      color={isSpeaking ? "primary" : "default"}
                      disabled={!report.description}
                    >
                      {isSpeaking ? <VolumeUpIcon /> : <VolumeOffIcon />}
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {report.description}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">Action Required</Typography>
                <Typography variant="body1">{report.action}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Image */}
        {report && report.reportId && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Damage Image</Typography>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 300,
                  borderRadius: 1,
                  overflow: 'hidden',
                  backgroundColor: '#f9fafb'
                }}
              >
                {loading ? (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%'
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Damage"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
                    onError={(e) => {
                      console.error('Image failed to load in view');
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%'
                    }}
                  >
                    <Typography color="text.secondary">
                      No image available
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ViewDamageReport;
