import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ message = 'Loading...', size = 'default' }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight={size === 'small' ? '120px' : '200px'}
      sx={{
        position: 'relative',
      }}
    >
      <CircularProgress 
        size={size === 'small' ? 32 : 40}
        thickness={4}
        sx={{
          color: '#2563eb',
        }}
      />
      {message && (
        <Typography
          variant="body2"
          sx={{ 
            mt: 2,
            color: '#6b7280',
            fontWeight: 500,
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingSpinner; 