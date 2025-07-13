import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  IconButton, 
  Typography, 
  Box, 
  Button,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { formatLocation, getCoordinatesString } from '../../utils/formatters';

const AiReportsDialog = ({ 
  open, 
  onClose, 
  reports = [], 
  loading, 
  error,
  onSelectReport 
}) => {
  // Helper function to get color based on severity
  const getSeverityColor = (severity) => {
    switch(severity?.toUpperCase()) {
      case 'HIGH':
        return 'error';
      case 'MEDIUM':
        return 'warning';
      case 'LOW':
        return 'success';
      default:
        return 'primary';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <Typography variant="h6">AI Generated Reports</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        ) : reports.length === 0 ? (
          <Alert severity="info" sx={{ my: 2 }}>
            No AI reports found. Upload images in the AI Analysis section to generate reports.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {reports.map((report) => (
              <Grid item xs={12} sm={6} md={4} key={report._id}>
                <Card 
                  sx={{ 
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    transition: 'transform 0.2s ease-in-out',
                    opacity: report.damageReportGenerated ? 0.7 : 1,
                    border: report.damageReportGenerated ? '2px solid #4caf50' : 'none',
                    '&:hover': {
                      transform: report.damageReportGenerated ? 'none' : 'translateY(-4px)',
                      boxShadow: report.damageReportGenerated 
                        ? '0 4px 12px rgba(0, 0, 0, 0.05)' 
                        : '0 12px 24px rgba(0, 0, 0, 0.1)',
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" gutterBottom sx={{ mb: 0 }}>
                        {report.damageType || 'Damage Report'}
                      </Typography>
                      {report.damageReportGenerated && (
                        <Chip 
                          label="Report Generated"
                          color="success"
                          size="small"
                        />
                      )}
                    </Box>
                    <Stack spacing={1}>
                      <Typography variant="body2" color="text.secondary">
                        Priority: {report.priority}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Location: {formatLocation(report.location)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Coordinates: {getCoordinatesString(report.location)}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          label={`Severity: ${report.severity}`}
                          color={getSeverityColor(report.severity)}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                      </Box>
                    </Stack>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<AssignmentIcon />}
                        onClick={(e) => {
                          // Prevent passing the entire event object to avoid circular references
                          e.preventDefault();
                          
                          console.log('Original AI report:', report);
                          
                          // Pass only the data needed from the report, but ensure annotatedImageBase64 is included
                          const cleanReport = {
                            _id: report._id || report.id,
                            id: report._id || report.id,
                            imageId: report.imageId,
                            damageType: report.damageType,
                            severity: report.severity,
                            priority: report.priority,
                            predictionClass: report.predictionClass,
                            location: report.location,
                            annotatedImageBase64: report.annotatedImageBase64,
                            createdAt: report.createdAt
                          };
                          
                          console.log('Clean report before passing to parent:', {
                            ...cleanReport,
                            hasAnnotatedImage: !!cleanReport.annotatedImageBase64,
                            imageLength: cleanReport.annotatedImageBase64?.length || 0
                          });
                          
                          onSelectReport(cleanReport);
                        }}
                        disabled={report.damageReportGenerated}
                      >
                        Generate Report
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AiReportsDialog;
