import React, { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import TopNavigation from './TopNavigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopNavigation handleDrawerToggle={handleDrawerToggle} mobileOpen={mobileOpen} />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          minHeight: 'calc(100vh - 72px)',
          bgcolor: 'background.default',
          transition: 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Toolbar sx={{ minHeight: '72px !important' }} />
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;