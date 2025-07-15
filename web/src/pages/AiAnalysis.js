import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  Container,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';
import { api } from '../utils/api';

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

const AiAnalysis = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [annotatedImage, setAnnotatedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('userData');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        setUserEmail(user.email || null);
      } catch (err) {
        console.error("Failed to parse user data", err);
      }
    }
  }, []);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (!(file instanceof File)) {
      setError("Selected image is not a valid File object.");
      return;
    }
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setPrediction(null);
    setAnnotatedImage(null);
    setError(null);
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      if (userEmail) formData.append('email', userEmail);

      const response = await api.postFormData('/analyze-only', formData);

      if (response.success) {
        setPrediction(response.prediction);
        setAnnotatedImage(response.annotatedImage);
        console.log('✅ Prediction response:', response);
      } else {
        throw new Error(response.message || 'Failed to process image');
      }
    } catch (err) {
      console.error('❌ Error analyzing image:', err);
      setError(err.message || 'An error occurred while analyzing the image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ width: '100%', py: 3 }}>
        <Typography variant="h4" gutterBottom>AI Analysis</Typography>

        <Paper elevation={3}>
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Button component="label" variant="contained" startIcon={<ImageIcon />}>
              Choose Image
              <VisuallyHiddenInput type="file" accept="image/*" onChange={handleImageSelect} />
            </Button>

            {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}

            {selectedImage && (
              <Box sx={{ mt: 2, width: '100%' }}>
                <Typography variant="subtitle1" gutterBottom>Selected Image</Typography>
                <Box sx={{
                  width: '100%',
                  height: 300,
                  backgroundImage: `url(${previewUrl})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  border: '1px solid #e0e0e0',
                  borderRadius: 1
                }} />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={analyzeImage}
                  disabled={loading}
                  sx={{ mt: 2 }}
                >
                  {loading ? <><CircularProgress size={24} sx={{ mr: 1 }} />Analyzing...</> : 'Analyze Image'}
                </Button>
              </Box>
            )}

            {annotatedImage && (
              <Box sx={{ mt: 3, width: '100%' }}>
                <Typography variant="h6" gutterBottom>Analysis Results</Typography>

                {/* 1. Annotated image */}
                <Box sx={{
                  width: '100%',
                  height: 300,
                  backgroundImage: `url(${annotatedImage})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  mb: 2
                }} />

                {/* 2. Damage Type */}
                <Typography variant="subtitle1">
                  <strong>Damage Type:</strong> {prediction?.type || 'N/A'}
                </Typography>

                {/* 3. Severity */}
                <Typography variant="subtitle1">
                  <strong>Severity:</strong> {prediction?.severity || 'N/A'}
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AiAnalysis;
