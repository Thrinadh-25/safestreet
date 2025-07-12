import React, { Component } from 'react';
import { Box, Typography, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by error boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="400px"
          textAlign="center"
          p={3}
        >
          <Typography variant="h4" gutterBottom sx={{ color: '#dc2626', fontWeight: 600 }}>
            Oops! Something went wrong.
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 4, color: '#6b7280' }}>
            We're sorry for the inconvenience. Please try refreshing the page.
          </Typography>

          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={() => window.location.reload()}
            sx={{
              backgroundColor: '#2563eb',
              color: 'white',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#1d4ed8',
              }
            }}
          >
            Refresh Page
          </Button>

          {process.env.NODE_ENV === 'development' && (
            <Box sx={{ mt: 4, maxWidth: '600px', overflow: 'auto' }}>
              <Typography variant="caption" component="pre" sx={{ color: '#dc2626' }}>
                {this.state.error?.toString()}
              </Typography>
            </Box>
          )}
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 