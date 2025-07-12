import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { 
  Box, 
  useTheme, 
  Container,
  useMediaQuery
} from '@mui/material';
import Header from './Header';

const MainLayout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1f1c2c 0%, #928dab 100%)',
        }}
      >
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid white',
            animation: 'spin 1s linear infinite',
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            },
          }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header with Navigation */}
      <Header />

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: '#f8fafc',
          position: 'relative',
        }}
      >
        {/* Content container */}
        <Container
          maxWidth="xl"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            pt: { xs: 11, sm: 12 }, // Account for header height
            pb: 4,
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              maxWidth: '1400px',
              width: '100%',
              mx: 'auto',
            }}
          >
            {/* Page Title Section */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 1,
            }}>
              {/* This could be used for page-specific actions or breadcrumbs */}
            </Box>

            {/* Main Content */}
            <Box sx={{ flex: 1 }}>
              <Outlet />
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;