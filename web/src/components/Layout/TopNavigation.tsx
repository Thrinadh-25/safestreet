import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Button,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications,
  AccountCircle,
  Settings,
  ExitToApp,
  Shield,
  Dashboard,
  CloudUpload,
  Analytics,
  People,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface TopNavigationProps {
  handleDrawerToggle?: () => void;
}

const navigationItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
  { label: 'Reports', path: '/reports', icon: <CloudUpload /> },
  { label: 'Analytics', path: '/analytics', icon: <Analytics /> },
  { label: 'Users', path: '/users', icon: <People /> },
];

const TopNavigation: React.FC<TopNavigationProps> = ({ handleDrawerToggle }) => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate('/settings');
    handleClose();
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
    handleClose();
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  const getCurrentTab = () => {
    const currentPath = location.pathname;
    const matchingItem = navigationItems.find(item => item.path === currentPath);
    return matchingItem ? currentPath : false;
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: '72px !important' }}>
        {/* Left Section - Logo and Navigation */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #007AFF 0%, #0A84FF 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 122, 255, 0.3)',
              }}
            >
              <Shield sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Safe Street
            </Typography>
          </Box>

          {/* Navigation Tabs */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Tabs
              value={getCurrentTab()}
              onChange={handleTabChange}
              textColor="inherit"
              indicatorColor="primary"
              sx={{
                '& .MuiTab-root': {
                  minHeight: 48,
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    color: 'primary.main',
                    fontWeight: 600,
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: 'primary.main',
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                },
              }}
            >
              {navigationItems.map((item) => (
                <Tab
                  key={item.path}
                  label={item.label}
                  value={item.path}
                  icon={item.icon}
                  iconPosition="start"
                  sx={{ gap: 1 }}
                />
              ))}
            </Tabs>
          </Box>
        </Box>

        {/* Right Section - Actions and User */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 1, 
              display: { md: 'none' },
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Notifications */}
          <IconButton
            size="large"
            color="inherit"
            sx={{
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* User Menu */}
          <IconButton
            size="large"
            onClick={handleMenu}
            color="inherit"
            sx={{
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'primary.main',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              {state.user?.fullName.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                minWidth: 200,
                borderRadius: 2,
                '& .MuiMenuItem-root': {
                  px: 2,
                  py: 1.5,
                  borderRadius: 1,
                  mx: 1,
                  my: 0.5,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {state.user?.fullName}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {state.user?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleProfile}>
              <Settings sx={{ mr: 2, fontSize: 20 }} />
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <ExitToApp sx={{ mr: 2, fontSize: 20 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavigation;