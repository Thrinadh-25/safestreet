import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  IconButton, 
  Typography, 
  Box,
  Button, 
  Grid, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  CircularProgress,
  Alert,
  FormHelperText
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { aiServices } from '../../utils/aiServices';

const CreateDamageReportDialog = ({ 
  open, 
  onClose, 
  onSubmit,
  selectedAiReport,
  formData,
  onFormChange,
  fieldWorkers,
  onFieldWorkerChange,
  selectedFieldWorker,
  loading,
  error
}) => {
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  // Helper function to check if a field is empty
  const isFieldEmpty = (fieldName) => {
    return formData[fieldName] === '';
  };

  // Required fields for form validation
  const requiredFields = ['region', 'location', 'damageType', 'severity', 'priority'];
  
  // Check if form is valid
  const isFormValid = !requiredFields.some(isFieldEmpty);
  
  // Generate AI summary for description
  const handleGenerateAiSummary = async () => {
    // Required fields for AI summary
    const requiredAiFields = ['location', 'damageType', 'severity', 'priority'];
    
    // Check if required fields are filled
    const missingFields = requiredAiFields.filter(isFieldEmpty);
    if (missingFields.length > 0) {
      setAiError(`Please fill in ${missingFields.join(', ')} before generating a summary`);
      return;
    }
    
    setAiLoading(true);
    setAiError(null);
    
    try {
      // Add a little delay to show the "Generating..." message
      const summaryResponse = await aiServices.generateDamageSummary({
        location: formData.location,
        damageType: formData.damageType,
        severity: formData.severity,
        priority: formData.priority
      });
      
      console.log('Summary response received:', summaryResponse);
      
      if (!summaryResponse || !summaryResponse.summary) {
        throw new Error('No summary generated. Please try again.');
      }
      
      // Update the form data with the generated summary
      onFormChange({
        target: {
          name: 'description',
          value: summaryResponse.summary
        }
      });
      
    } catch (error) {
      setAiError(error.message || 'Failed to generate AI summary. Please try again or enter description manually.');
      console.error('Error generating summary:', error);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#f8f9fa',
        py: 2.5
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssignmentIcon color="primary" />
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
            Create Damage Report
          </Typography>
          {selectedAiReport && (
            <Typography 
              variant="caption" 
              sx={{ 
                backgroundColor: '#e3f2fd', 
                color: '#1976d2', 
                px: 1.5, 
                py: 0.5, 
                borderRadius: 1,
                fontWeight: 500
              }}
            >
              AI-Assisted
            </Typography>
          )}
        </Box>
        <IconButton 
          onClick={onClose} 
          size="small"
          sx={{ 
            backgroundColor: '#fff',
            '&:hover': { backgroundColor: '#f5f5f5' }
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        {/* AI Detected Image Section */}
        {((selectedAiReport?.annotatedImageBase64 && 
           typeof selectedAiReport.annotatedImageBase64 === 'string' && 
           selectedAiReport.annotatedImageBase64.length > 0) ||
          (selectedAiReport?.annotatedImage && 
           typeof selectedAiReport.annotatedImage === 'string' && 
           selectedAiReport.annotatedImage.length > 0)) && (
          <Box sx={{ 
            mb: 3, 
            p: 2, 
            bgcolor: '#f8f9fa', 
            borderRadius: 2,
            border: '1px solid #e9ecef'
          }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: '#1976d2' }}>
              🤖 AI Detected Damage
            </Typography>
            <Box sx={{ textAlign: 'center', mb: 1 }}>
              <img
                src={selectedAiReport.annotatedImageBase64 ? 
                  `data:image/jpeg;base64,${selectedAiReport.annotatedImageBase64}` :
                  selectedAiReport.annotatedImage?.startsWith('data:') ? 
                    selectedAiReport.annotatedImage :
                    `data:image/jpeg;base64,${selectedAiReport.annotatedImage}`
                }
                alt="AI Detected Damage"
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '200px',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ 
              display: 'block', 
              textAlign: 'center',
              fontStyle: 'italic'
            }}>
              This image will be attached as the "before" image in your damage report
            </Typography>
          </Box>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Form Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 600 }}>
            📋 Report Details
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Region"
                name="region"
                value={formData.region}
                onChange={onFormChange}
                fullWidth
                required
                error={isFieldEmpty('region')}
                helperText={isFieldEmpty('region') ? 'Region is required' : ''}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Location"
                name="location"
                value={formData.location}
                onChange={onFormChange}
                fullWidth
                required
                error={isFieldEmpty('location')}
                helperText={isFieldEmpty('location') ? 'Location is required' : ''}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Damage Type"
                name="damageType"
                value={formData.damageType}
                onChange={onFormChange}
                fullWidth
                required
                disabled={!!selectedAiReport}
                error={isFieldEmpty('damageType')}
                helperText={isFieldEmpty('damageType') ? 'Damage type is required' : (selectedAiReport ? 'Pre-filled by AI' : '')}
                variant="outlined"
                sx={{ 
                  '& .MuiOutlinedInput-root': { borderRadius: 2 },
                  '& .MuiInputBase-input:disabled': { 
                    backgroundColor: '#f5f5f5',
                    color: '#666'
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={isFieldEmpty('severity')}>
                <InputLabel>Severity</InputLabel>
                <Select
                  label="Severity"
                  name="severity"
                  value={formData.severity}
                  onChange={onFormChange}
                  disabled={!!selectedAiReport}
                  sx={{ 
                    borderRadius: 2,
                    '& .MuiSelect-select:disabled': { 
                      backgroundColor: '#f5f5f5'
                    }
                  }}
                >
                  <MenuItem value="LOW">🟢 Low</MenuItem>
                  <MenuItem value="MEDIUM">🟡 Medium</MenuItem>
                  <MenuItem value="HIGH">🔴 High</MenuItem>
                </Select>
                {isFieldEmpty('severity') && (
                  <FormHelperText>Severity is required</FormHelperText>
                )}
                {selectedAiReport && !isFieldEmpty('severity') && (
                  <FormHelperText sx={{ color: '#666' }}>Pre-filled by AI</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Priority (1-10)"
                name="priority"
                value={formData.priority}
                onChange={onFormChange}
                fullWidth
                required
                type="number"
                InputProps={{ inputProps: { min: 1, max: 10 } }}
                disabled={!!selectedAiReport}
                error={isFieldEmpty('priority')}
                helperText={isFieldEmpty('priority') ? 'Priority is required' : (selectedAiReport ? 'Pre-filled by AI' : '')}
                variant="outlined"
                sx={{ 
                  '& .MuiOutlinedInput-root': { borderRadius: 2 },
                  '& .MuiInputBase-input:disabled': { 
                    backgroundColor: '#f5f5f5',
                    color: '#666'
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>👷 Assign to Field Worker</InputLabel>
                <Select
                  label="👷 Assign to Field Worker"
                  value={selectedFieldWorker}
                  onChange={onFieldWorkerChange}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">
                    <em>None (Unassigned)</em>
                  </MenuItem>
                  {fieldWorkers.map(worker => (
                    <MenuItem key={worker._id} value={worker._id}>
                      {worker.name} - {worker.specialization}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* Description Section */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 600 }}>
            📝 Description
            {aiLoading && <CircularProgress size={16} sx={{ ml: 1 }} />}
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {aiLoading ? (
              <TextField
                value="✨ Generating professional description..."
                disabled
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                sx={{ 
                  '& .MuiOutlinedInput-root': { borderRadius: 2 },
                  '& .MuiInputBase-input': { fontStyle: 'italic' }
                }}
              />
            ) : (
              <TextField
                name="description"
                value={formData.description}
                onChange={onFormChange}
                fullWidth
                multiline
                rows={4}
                placeholder="Enter a detailed description of the damage or use the AI enhancement button below..."
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                onClick={handleGenerateAiSummary}
                disabled={aiLoading || loading || !isFormValid}
                variant="outlined"
                color="primary"
                startIcon={<AutoAwesomeIcon />}
                size="medium"
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                ✨ Enhance with AI
              </Button>
            </Box>
            
            {aiError && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {aiError}
              </Alert>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ 
        px: 3, 
        py: 2.5, 
        borderTop: '1px solid #e5e7eb',
        backgroundColor: '#fafafa',
        gap: 1
      }}>
        <Button 
          onClick={onClose} 
          color="inherit"
          size="large"
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            px: 3
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={(e) => {
            e.preventDefault();
            onSubmit(formData);
          }}
          variant="contained"
          disabled={loading || !isFormValid}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AssignmentIcon />}
          size="large"
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            minWidth: 140
          }}
        >
          {loading ? 'Creating...' : 'Create Report'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateDamageReportDialog;
