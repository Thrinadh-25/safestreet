import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Box,
  useTheme,
  alpha,
  Breadcrumbs,
  Link,
  Chip,
  Stack,
  Tooltip,
  useMediaQuery,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReportIcon from '@mui/icons-material/Report';
import MapIcon from '@mui/icons-material/Map';
import AnalyticsIcon from '@mui/icons-material/BarChart';
import RepairIcon from '@mui/icons-material/Build';
import HistoryIcon from '@mui/icons-material/History';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BusinessIcon from '@mui/icons-material/Business';
import CloseIcon from '@mui/icons-material/Close';

// Navigation items
const superAdminMenuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/', badge: null },
  { text: 'Tenants', icon: <BusinessIcon />, path: '/tenants', badge: null },
  { text: 'All Reports', icon: <ReportIcon />, path: '/reports', badge: null },
  { text: 'AI Analysis', icon: <AutoAwesomeIcon />, path: '/ai-analysis', badge: 'AI' }
];

const regularMenuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/', badge: null },
  { text: 'Reports', icon: <ReportIcon />, path: '/reports', badge: null },
<<<<<<< HEAD
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics', badge: null },
=======
>>>>>>> back
  { text: 'Repairs', icon: <RepairIcon />, path: '/repairs', badge: null },
  { text: 'AI Analysis', icon: <AutoAwesomeIcon />, path: '/ai-analysis', badge: 'AI' }
];

const Header = ({ onDrawerToggle }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Get user role
  const userString = localStorage.getItem('admin_data');
  const user = userString ? JSON.parse(userString) : null;
  const userRole = user?.role || 'admin';
  const menuItems = userRole === 'super-admin' ? superAdminMenuItems : regularMenuItems;

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  // Get page title from current route
  const getPageTitle = () => {
    const pathMap = {
      '/': 'Dashboard',
      '/tenants': 'Tenant Management',
      '/reports': 'Damage Reports',
      '/analytics': 'Analytics',
      '/repairs': 'Repair Management',
      '/ai-analysis': 'AI Analysis',
      '/profile': 'Profile Settings'
    };
    return pathMap[location.pathname] || 'Dashboard';
  };

  const notifications = [
    { 
      id: 1, 
      title: "Critical Damage Detected",
      message: "New high-priority damage report in Downtown area", 
      time: "2 min ago",
      type: "critical",
      unread: true
    },
    { 
      id: 2, 
      title: "Repair Completed",
      message: "Road repair on Main St has been completed", 
      time: "1 hour ago",
      type: "success",
      unread: true
    },
    { 
      id: 3, 
      title: "Weekly Analytics Report",
      message: "Your weekly analytics report is now available", 
      time: "3 hours ago",
      type: "info",
      unread: false
    }
  ];

  const getNotificationColor = (type) => {
    switch(type) {
      case 'critical': return theme.palette.error.main;
      case 'success': return theme.palette.success.main;
      case 'info': return theme.palette.info.main;
      default: return theme.palette.grey[500];
    }
  };

  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          color: theme.palette.text.primary,
          zIndex: theme.zIndex.drawer + 1,
          height: '72px',
        }}
      >
        <Toolbar sx={{ 
          justifyContent: 'space-between',
          height: 72,
          minHeight: 72,
          px: { xs: 2, sm: 3 },
          gap: 2,
        }}>
          {/* Left Section - Logo and Navigation */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0, flex: 1 }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 4 }}>
              <Avatar
                src="/safestreet.png"
                alt="SafeStreet Logo"
                sx={{ width: 40, height: 40 }}
              />
              <Box>
                <Typography variant="h6" sx={{
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  color: '#1f2937',
                  lineHeight: 1,
                }}>
                  SafeStreet
                </Typography>
                <Typography variant="caption" sx={{
                  color: '#6b7280',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  lineHeight: 1,
                }}>
                  Admin Web
                </Typography>
              </Box>
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ 
              display: { xs: 'none', lg: 'flex' }, 
              alignItems: 'center', 
              gap: 0.5,
              flex: 1 
            }}>
              {menuItems.map((item) => {
                const isSelected = location.pathname === item.path;
                return (
                  <Button
                    key={item.text}
                    onClick={() => handleNavigation(item.path)}
                    startIcon={item.icon}
                    sx={{
                      minHeight: 44,
                      px: 2,
                      py: 1,
                      borderRadius: 1,
                      textTransform: 'none',
                      fontWeight: isSelected ? 600 : 500,
                      fontSize: '0.875rem',
                      color: isSelected ? theme.palette.primary.main : '#6b7280',
                      backgroundColor: isSelected ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                      border: isSelected ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}` : '1px solid transparent',
                      position: 'relative',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                        color: theme.palette.primary.main,
                      },
                      '&:after': isSelected ? {
                        content: '""',
                        position: 'absolute',
                        bottom: -1,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '60%',
                        height: 2,
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: '2px 2px 0 0',
                      } : {},
                      '& .MuiButton-startIcon': {
                        marginRight: 1,
                        '& svg': {
                          fontSize: '1.1rem',
                        }
                      },
                    }}
                  >
                    {item.text}
                    {item.badge && (
                      <Chip 
                        label={item.badge} 
                        size="small"
                        sx={{
                          ml: 1,
                          height: 18,
                          fontSize: '0.65rem',
                          fontWeight: 600,
                          backgroundColor: typeof item.badge === 'number' ? '#dc2626' : '#2563eb',
                          color: 'white',
                          '& .MuiChip-label': { px: 0.75 },
                        }}
                      />
                    )}
                  </Button>
                );
              })}
            </Box>
          </Box>

          {/* Right Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Mobile Menu Button */}
            <IconButton
              onClick={handleMobileMenuToggle}
              sx={{ 
                display: { lg: 'none' },
                color: '#374151',
                '&:hover': {
                  backgroundColor: alpha('#374151', 0.04),
                }
              }}
            >
              <MenuIcon />
            </IconButton>

            {/* Time - Hidden on mobile */}
            {!isTablet && (
              <Typography variant="body2" sx={{ 
                color: '#6b7280',
                fontWeight: 500,
                mr: 1,
                fontSize: '0.875rem',
              }}>
                {currentTime}
              </Typography>
            )}

            {/* Notifications */}
<<<<<<< HEAD
            <Tooltip title="Notifications">
=======
            {/*<Tooltip title="Notifications">
>>>>>>> back
              <IconButton 
                onClick={handleNotificationOpen}
                sx={{ 
                  color: '#374151',
                  '&:hover': {
                    backgroundColor: alpha('#374151', 0.04),
                  },
                }}
              >
                <Badge 
                  badgeContent={notifications.filter(n => n.unread).length} 
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: '#dc2626',
                      color: 'white',
                    }
                  }}
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
<<<<<<< HEAD
            </Tooltip>
=======
            </Tooltip>*/}
>>>>>>> back

            {/* Profile */}
            <Tooltip title="Profile">
              <IconButton
                onClick={handleProfileMenuOpen}
                sx={{ 
                  color: '#374151',
                  '&:hover': {
                    backgroundColor: alpha('#374151', 0.04),
                  },
                }}
              >
                <Avatar 
                  sx={{ 
                    backgroundColor: '#2563eb',
                    width: 32,
                    height: 32,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  AD
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
        sx={{
          display: { lg: 'none' },
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            pt: 2,
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, pb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Navigation
          </Typography>
          <IconButton onClick={handleMobileMenuToggle}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => {
            const isSelected = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  selected={isSelected}
                  sx={{
                    minHeight: 48,
                    px: 2,
                    py: 1.5,
                    '&.Mui-selected': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.12),
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ 
                    minWidth: 40,
                    color: isSelected ? theme.palette.primary.main : '#6b7280' 
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontWeight: isSelected ? 600 : 500,
                        color: isSelected ? theme.palette.primary.main : '#374151',
                      }
                    }}
                  />
                  {item.badge && (
                    <Chip 
                      label={item.badge} 
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        backgroundColor: typeof item.badge === 'number' ? '#dc2626' : '#2563eb',
                        color: 'white',
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Divider sx={{ mt: 2 }} />
        <Box sx={{ p: 2 }}>
          <Button
            variant="outlined"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            fullWidth
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              borderColor: '#d1d5db',
              color: '#6b7280',
              '&:hover': {
                borderColor: '#dc2626',
                backgroundColor: alpha('#dc2626', 0.04),
                color: '#dc2626',
              },
            }}
          >
            Sign Out
          </Button>
        </Box>
      </Drawer>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: {
            width: 280,
            boxShadow: theme.shadows[4],
            mt: 1,
            background: '#ffffff',
            border: '1px solid #e5e7eb',
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 3, textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              margin: '0 auto 12px',
              backgroundColor: '#2563eb',
              fontSize: '1.25rem',
              fontWeight: 600,
            }}
          >
            AD
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: '#111827' }}>
            Admin User
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ color: '#6b7280' }}>
            admin@safestreets.com
          </Typography>
          <Chip 
            label="Administrator" 
            size="small" 
            sx={{ 
              mt: 1,
              backgroundColor: '#2563eb',
              color: 'white',
              fontWeight: 500,
            }} 
          />
        </Box>
        
        <MenuItem onClick={() => {
          handleProfileMenuClose();
          navigate('/profile');
        }} sx={{ py: 1.5, px: 3 }}>
          <ListItemIcon sx={{ color: '#6b7280' }}>
            <AccountCircleIcon />
          </ListItemIcon>
          <Typography sx={{ color: '#374151' }}>My Profile</Typography>
        </MenuItem>
        
        <MenuItem onClick={() => {
          handleProfileMenuClose();
          navigate('/login');
        }} sx={{ py: 1.5, px: 3, color: '#dc2626' }}>
          <ListItemIcon>
            <LogoutIcon sx={{ color: '#dc2626' }} />
          </ListItemIcon>
          <Typography sx={{ color: '#dc2626' }}>Logout</Typography>
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        PaperProps={{
          sx: {
            width: 380,
            maxHeight: 500,
            boxShadow: theme.shadows[4],
            mt: 1,
            background: '#ffffff',
            border: '1px solid #e5e7eb',
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 3, borderBottom: '1px solid #e5e7eb' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827' }}>
              Notifications
            </Typography>
            <Chip 
              label={`${notifications.filter(n => n.unread).length} new`}
              size="small"
              sx={{ 
                backgroundColor: '#2563eb',
                color: 'white',
                fontWeight: 500,
              }}
            />
          </Stack>
        </Box>
        
        <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
          {notifications.map((notification) => (
            <MenuItem 
              key={notification.id}
              sx={{ 
                py: 2,
                px: 3,
                borderBottom: '1px solid #e5e7eb',
                '&:last-child': { borderBottom: 'none' },
                opacity: notification.unread ? 1 : 0.7,
              }}
            >
              <Box sx={{ width: '100%' }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      backgroundColor: getNotificationColor(notification.type),
                      mt: 1,
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, color: '#111827' }}>
                      {notification.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, color: '#6b7280' }}>
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                      {notification.time}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </MenuItem>
          ))}
        </Box>
      </Menu>
    </>
  );
};

export default Header;