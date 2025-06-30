import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Dashboard,
  CloudUpload,
  Analytics,
  Settings,
  People,
  ExitToApp,
  Shield,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 280;

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Reports', icon: <CloudUpload />, path: '/reports' },
  { text: 'Analytics', icon: <Analytics />, path: '/analytics' },
  { text: 'Users', icon: <People />, path: '/users' },
  { text: 'Settings', icon: <Settings />, path: '/settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, handleDrawerToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, logout } = useAuth();

  const handleNavigation = (path: string) => {
    navigate(path);
    if (mobileOpen) {
      handleDrawerToggle();
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ px: 3, py: 2 }}>
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
            }}
          >
            <Shield sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
            Safe Street
          </Typography>
        </Box>
      </Toolbar>

      <Divider />

      {/* User Profile Section */}
      {state.user && (
        <Box sx={{ p: 3, bgcolor: '#f8f9fa' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: '#007AFF',
                fontSize: '1.2rem',
                fontWeight: 600,
              }}
            >
              {state.user.fullName.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: '#1a1a1a', mb: 0.5 }}
                noWrap
              >
                {state.user.fullName}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: '#6c757d', fontSize: '0.875rem' }}
                noWrap
              >
                {state.user.email}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      <Divider />

      {/* Navigation Menu */}
      <List sx={{ flex: 1, px: 2, py: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 2,
                py: 1.5,
                px: 2,
                '&.Mui-selected': {
                  bgcolor: '#007AFF',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#0056CC',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
                '&:hover': {
                  bgcolor: '#f0f8ff',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: location.pathname === item.path ? 'white' : '#6c757d',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 600 : 500,
                  fontSize: '0.95rem',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Logout Button */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            py: 1.5,
            px: 2,
            color: '#dc3545',
            '&:hover': {
              bgcolor: '#fff5f5',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: '#dc3545' }}>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontWeight: 500,
              fontSize: '0.95rem',
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            border: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            border: 'none',
            borderRight: '1px solid #e9ecef',
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