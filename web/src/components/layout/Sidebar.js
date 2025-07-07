import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Typography,
  Avatar,
  useTheme,
  alpha,
  useMediaQuery,
  Button,
  Chip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReportIcon from '@mui/icons-material/Report';
import MapIcon from '@mui/icons-material/Map';
import AnalyticsIcon from '@mui/icons-material/BarChart';
import RepairIcon from '@mui/icons-material/Build';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/ExitToApp';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BusinessIcon from '@mui/icons-material/Business';
import { DRAWER_WIDTH } from '../../config/constants';

// Super admin menu items
const superAdminMenuItems = [
  { 
    text: 'Dashboard', 
    icon: <DashboardIcon />, 
    path: '/', 
    badge: null,
  },
  {
    text: 'Tenant Management',
    icon: <BusinessIcon />,
    path: '/tenants',
    badge: null,
  },
  { 
    text: 'All Reports', 
    icon: <ReportIcon />, 
    path: '/reports', 
    badge: null,
  },
  { 
    text: 'AI Analysis', 
    icon: <AutoAwesomeIcon />, 
    path: '/ai-analysis', 
    badge: 'AI',
  }
];

// Regular admin menu items
const regularMenuItems = [
  { 
    text: 'Dashboard', 
    icon: <DashboardIcon />, 
    path: '/', 
    badge: null,
  },
  { 
    text: 'Damage Reports', 
    icon: <ReportIcon />, 
    path: '/reports', 
    badge: 12,
  },
  { 
    text: 'Map View', 
    icon: <MapIcon />, 
    path: '/map', 
    badge: null,
  },
  { 
    text: 'Analytics', 
    icon: <AnalyticsIcon />, 
    path: '/analytics', 
    badge: null,
  },
  { 
    text: 'Repair Management', 
    icon: <RepairIcon />, 
    path: '/repairs', 
    badge: 5,
  },
  { 
    text: 'Historical Analysis', 
    icon: <HistoryIcon />, 
    path: '/historical', 
    badge: null,
  },
  { 
    text: 'AI Analysis', 
    icon: <AutoAwesomeIcon />, 
    path: '/ai-analysis', 
    badge: 'AI',
  }
];

const Sidebar = ({ mobileOpen, onDrawerToggle, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Get user from localStorage for role-based rendering
  const userString = localStorage.getItem('admin_data');
  const user = userString ? JSON.parse(userString) : null;
  const userRole = user?.role || 'admin';

  const handleNav = (path) => {
    navigate(path);
    if (isMobile) {
      onDrawerToggle();
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const drawer = (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#ffffff',
      position: 'relative',
    }}>
      {/* Header Section */}
      <Box sx={{
        p: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        background: '#f8f9fa',
        borderBottom: '1px solid #e9ecef',
      }}>
      {/* Avatar image replaced here – change the src path below if needed */}
      <Avatar
        src="/safestreet.png"
        alt="Admin Avatar"
        sx={{
          width: 48,
          height: 48,
        }}
      />

        <Box>
          <Typography variant="h6" sx={{
            fontWeight: 600,
            fontSize: '1.125rem',
            color: '#1f2937',
            mb: 0,
          }}>
            SafeStreet
          </Typography>
          <Typography variant="caption" sx={{
            color: '#6b7280',
            fontSize: '0.75rem',
            fontWeight: 500,
          }}>
            Admin Portal
          </Typography>
        </Box>
      </Box>

      {/* Navigation Section */}
      <Box sx={{ flex: 1, py: 2, overflow: 'auto' }}>
        <Typography 
          variant="overline" 
          sx={{
            color: '#6b7280',
            px: 3,
            mb: 1,
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            display: 'block',
          }}
        >
          NAVIGATION
        </Typography>
        
        <List sx={{ p: 0 }}>
          {(userRole === 'super-admin' ? superAdminMenuItems : regularMenuItems)
            .map((item) => {
              const isSelected = location.pathname === item.path;
              return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNav(item.path)}
                  selected={isSelected}
                  sx={{
                    minHeight: 48,
                    px: 3,
                    py: 1.5,
                    mx: 1,
                    borderRadius: 1,
                    transition: 'all 0.15s ease',
                    '&:before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: isSelected ? '20%' : '50%',
                      height: isSelected ? '60%' : 0,
                      width: 3,
                      backgroundColor: theme.palette.primary.main,
                      transition: 'all 0.15s ease',
                    },
                    '&.Mui-selected': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.12),
                      },
                      '& .MuiListItemIcon-root': {
                        color: theme.palette.primary.main,
                      },
                      '& .MuiListItemText-primary': {
                        fontWeight: 600,
                        color: theme.palette.primary.main,
                      },
                    },
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    }
                  }}
                >
                  <ListItemIcon sx={{
                    minWidth: 40,
                    color: isSelected 
                      ? theme.palette.primary.main 
                      : '#6b7280',
                    transition: 'color 0.15s ease',
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: isSelected ? 600 : 500,
                      color: isSelected ? theme.palette.primary.main : '#374151',
                    }}
                  />

                  {/* Badge */}
                  {item.badge && (
                    <Box sx={{ ml: 1 }}>
                      {typeof item.badge === 'number' ? (
                        <Chip 
                          label={item.badge} 
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            backgroundColor: '#dc2626',
                            color: 'white',
                            '& .MuiChip-label': { px: 1 },
                          }}
                        />
                      ) : (
                        <Chip 
                          label={item.badge} 
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            fontWeight: 600,
                            backgroundColor: '#2563eb',
                            color: 'white',
                            '& .MuiChip-label': { px: 1 },
                          }}
                        />
                      )}
                    </Box>
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Footer Section */}
      <Box sx={{ p: 2, borderTop: '1px solid #e9ecef' }}>
        <Button
          variant="outlined"
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          fullWidth
          sx={{
            borderRadius: 1,
            py: 1,
            textTransform: 'none',
            fontWeight: 500,
            borderColor: '#d1d5db',
            color: '#6b7280',
            '&:hover': {
              borderColor: '#dc2626',
              backgroundColor: alpha('#dc2626', 0.04),
              color: '#dc2626',
            },
            transition: 'all 0.15s ease',
          }}
        >
          Sign Out
        </Button>

        <Typography variant="caption" sx={{ 
          mt: 2, 
          color: '#9ca3af', 
          textAlign: 'center',
          display: 'block',
          fontSize: '0.7rem',
        }}>
          SafeStreet web v1.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ 
        width: { md: DRAWER_WIDTH }, 
        flexShrink: { md: 0 },
      }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            borderRight: 'none',
            boxShadow: theme.shadows[8],
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            borderRight: '1px solid rgba(0, 0, 0, 0.06)',
            boxShadow: '2px 0 10px rgba(0, 0, 0, 0.05)',
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar; 