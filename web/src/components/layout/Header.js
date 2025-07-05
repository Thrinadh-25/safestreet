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
  Paper,
  InputBase,
  Breadcrumbs,
  Link,
  Chip,
  Stack,
  Tooltip,
  useMediaQuery,
  CircularProgress,
  ClickAwayListener,
  Button,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ClearIcon from '@mui/icons-material/Clear';
import ReportIcon from '@mui/icons-material/Report';
import PersonIcon from '@mui/icons-material/Person';
import BuildIcon from '@mui/icons-material/Build';
import { DRAWER_WIDTH } from '../../config/constants';
import { useSearch } from '../../context/SearchContext';

const Header = ({ onDrawerToggle }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { performSearch, isSearching, clearSearch } = useSearch();

  // State for quick search results
  const [quickSearchResults, setQuickSearchResults] = useState({
    reports: [],
    fieldWorkers: [],
    analytics: [],
    repairs: []
  });
  
  // Effect to perform quick search when typing
  useEffect(() => {
    const performQuickSearch = async () => {
      if (searchValue.length >= 2) {
        try {
          // Use the API to fetch quick search results
          const { api } = await import('../../utils/api');
          const { API_ENDPOINTS } = await import('../../config/constants');
          
          const response = await api.get(`${API_ENDPOINTS.DAMAGE_REPORTS}/search?q=${encodeURIComponent(searchValue)}&quick=true`);
          
          // Ensure we have valid response data
          if (response) {
            setQuickSearchResults({
              reports: Array.isArray(response.reports) ? response.reports.slice(0, 3) : [],
              fieldWorkers: Array.isArray(response.fieldWorkers) ? response.fieldWorkers.slice(0, 2) : [],
              analytics: Array.isArray(response.analytics) ? response.analytics.slice(0, 2) : [],
              repairs: Array.isArray(response.repairs) ? response.repairs.slice(0, 2) : [],
            });
            
            setShowSearchResults(true);
          }
        } catch (error) {
          console.error('Quick search error:', error);
          // Clear results on error
          setQuickSearchResults({
            reports: [],
            fieldWorkers: [],
            analytics: [],
            repairs: []
          });
        }
      } else {
        setShowSearchResults(false);
      }
    };
    
    // Debounce the search to avoid too many requests
    const debounceTimer = setTimeout(() => {
      if (searchValue.length >= 2) {
        performQuickSearch();
      }
    }, 300);
    
    return () => clearTimeout(debounceTimer);
  }, [searchValue]);
  
  // Reset search when changing routes
  useEffect(() => {
    setSearchValue('');
    setShowSearchResults(false);
  }, [location.pathname]);

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
  
  // Handler functions are now inlined in the component

  // Get page title from current route
  const getPageTitle = () => {
    const pathMap = {
      '/': 'Dashboard',
      '/reports': 'Damage Reports',
      '/map': 'Map View',
      '/analytics': 'Analytics',
      '/repairs': 'Repair Management',
      '/historical': 'Historical Analysis',
      '/ai-analysis': 'AI Analysis',
      '/profile': 'Profile Settings'
    };
    return pathMap[location.pathname] || 'Dashboard';
  };

  // Generate breadcrumbs
  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter(x => x);
    const breadcrumbMap = {
      '': 'Home',
      'reports': 'Reports',
      'map': 'Map',
      'analytics': 'Analytics',
      'repairs': 'Repairs',
      'historical': 'Historical',
      'ai-analysis': 'AI Analysis',
      'profile': 'Profile'
    };

    return [
      { label: 'Home', path: '/' },
      ...pathnames.map((name, index) => {
        const path = `/${pathnames.slice(0, index + 1).join('/')}`;
        return {
          label: breadcrumbMap[name] || name.charAt(0).toUpperCase() + name.slice(1),
          path: path
        };
      })
    ];
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

  // Simulate current time
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { md: `${DRAWER_WIDTH}px` },
        background: '#ffffff',
        borderBottom: '0.5px solid #e5e7eb',
        color: theme.palette.text.primary,
        zIndex: theme.zIndex.drawer + 1,
        borderRadius: '0 0 0px 0px',
        height: '68px',
      }}
    >
      <Toolbar sx={{ 
        justifyContent: 'space-between',
        height: 64,
        minHeight: 64,
        px: { xs: 2, sm: 3 },
        gap: 1,
      }}>
        {/* Left Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          <IconButton
            color="primary"
            edge="start"
            onClick={onDrawerToggle}
            sx={{ 
              display: { md: 'none' },
              color: '#374151',
              '&:hover': {
                backgroundColor: alpha('#374151', 0.04),
              }
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Typography variant="h5" sx={{ 
              fontWeight: 600,
              fontSize: '1.25rem',
              color: '#111827',
              mb: 0.25,
            }}>
              {getPageTitle()}
            </Typography>
            
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" sx={{ color: '#9ca3af' }} />}
              sx={{ fontSize: '0.875rem' }}
            >
              {getBreadcrumbs().map((breadcrumb, index) => (
                index === getBreadcrumbs().length - 1 ? (
                  <Typography 
                    key={breadcrumb.path}
                    color="text.secondary" 
                    sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}
                  >
                    {breadcrumb.label}
                  </Typography>
                ) : (
                  <Link
                    key={breadcrumb.path}
                    color="inherit"
                    href={breadcrumb.path}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(breadcrumb.path);
                    }}
                    sx={{ 
                      fontSize: '0.875rem',
                      textDecoration: 'none',
                      color: '#6b7280',
                      '&:hover': {
                        textDecoration: 'underline',
                        color: theme.palette.primary.main,
                      }
                    }}
                  >
                    {breadcrumb.label}
                  </Link>
                )
              ))}
            </Breadcrumbs>
          </Box>
        </Box>          {/* Center Section - Search */}
        <Box 
          sx={{ 
            flex: 1, 
            maxWidth: isMobile ? '100%' : 400, 
            mx: isMobile ? 0 : 2,
            width: isMobile ? '100%' : 'auto',
            position: 'relative',
          }}
        >
          <Paper
            sx={{
              display: 'flex',
              alignItems: 'center',
              background: '#f9fafb',
              px: 2,
              py: 0.5,
              border: '1px solid #d1d5db',
              transition: 'all 0.15s ease',
              '&:hover': {
                background: '#ffffff',
                borderColor: '#9ca3af',
              },
              '&:focus-within': {
                background: '#ffffff',
                borderColor: theme.palette.primary.main,
                boxShadow: `0 0 0 1px ${alpha(theme.palette.primary.main, 0.1)}`,
              }
            }}
          >
            <SearchIcon sx={{ color: '#6b7280', mr: 1 }} />
            <InputBase
              placeholder="Search across all pages..."
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                if (e.target.value.length >= 2) {
                  setShowSearchResults(true);
                } else {
                  setShowSearchResults(false);
                }
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && searchValue.trim()) {
                  performSearch(searchValue);
                  setShowSearchResults(false);
                  e.target.blur(); // Remove focus from search input
                }
              }}
              inputRef={searchInputRef}
              sx={{ 
                flex: 1,
                fontSize: '0.875rem',
                '& .MuiInputBase-input': {
                  padding: '6px 0',
                }
              }}
              fullWidth
            />
            {isSearching && (
              <CircularProgress size={20} sx={{ mr: 1, color: theme.palette.primary.main }} />
            )}
            {searchValue && (
              <IconButton 
                size="small" 
                onClick={() => {
                  setSearchValue('');
                  clearSearch();
                  if (searchInputRef.current) {
                    searchInputRef.current.focus();
                  }
                }}
                sx={{ padding: 0.5, color: '#6b7280' }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            )}
          </Paper>
          
          {showSearchResults && searchValue.length >= 2 ? (
            <ClickAwayListener onClickAway={() => setShowSearchResults(false)}>
              <Paper
                sx={{
                  position: 'absolute',
                  width: '100%',
                  mt: 0.5,
                  zIndex: 1000,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  borderRadius: 1,
                  maxHeight: 400,
                  overflow: 'auto'
                }}
              >
                {/* Quick search preview results */}
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Quick Results
                  </Typography>
                  
                  {/* Empty state */}
                  {!quickSearchResults.reports.length && !quickSearchResults.fieldWorkers.length && 
                   !quickSearchResults.repairs.length && !quickSearchResults.analytics.length && (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        No matching results found
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Try different keywords or search all results
                      </Typography>
                    </Box>
                  )}
                  
                  {/* Damage Reports Preview */}
                  {quickSearchResults.reports.length > 0 && (
                    <>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#4b5563', display: 'flex', alignItems: 'center', mt: 1 }}>
                        <ReportIcon fontSize="inherit" sx={{ mr: 0.5 }} /> DAMAGE REPORTS
                      </Typography>
                      <List dense disablePadding>
                        {quickSearchResults.reports.map((report) => (
                          <ListItemButton 
                            key={report._id}
                            onClick={() => {
                              navigate(`/reports/${report.reportId}`);
                              setShowSearchResults(false);
                            }}
                            sx={{ borderRadius: 1, py: 0.5 }}
                          >
                            <ListItemText 
                              primary={`${report.reportId} - ${report.damageType}`}
                              secondary={`${report.location} - ${report.severity}`}
                              primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
                              secondaryTypographyProps={{ fontSize: '0.75rem' }}
                            />
                          </ListItemButton>
                        ))}
                      </List>
                    </>
                  )}
                  
                  {/* Field Workers Preview */}
                  {quickSearchResults.fieldWorkers.length > 0 && (
                    <>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#4b5563', display: 'flex', alignItems: 'center', mt: 1 }}>
                        <PersonIcon fontSize="inherit" sx={{ mr: 0.5 }} /> FIELD WORKERS
                      </Typography>
                      <List dense disablePadding>
                        {quickSearchResults.fieldWorkers.map((worker) => (
                          <ListItemButton 
                            key={worker._id}
                            onClick={() => {
                              // Navigate to search-results with filter for fieldworkers instead
                              // as there's no dedicated field-worker detail page
                              navigate(`/search-results?type=fieldWorker&id=${worker._id}`);
                              setShowSearchResults(false);
                            }}
                            sx={{ borderRadius: 1, py: 0.5 }}
                          >
                            <ListItemText 
                              primary={worker.name}
                              secondary={worker.specialization}
                              primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
                              secondaryTypographyProps={{ fontSize: '0.75rem' }}
                            />
                          </ListItemButton>
                        ))}
                      </List>
                    </>
                  )}
                  
                  {/* Repairs Preview */}
                  {quickSearchResults.repairs.length > 0 && (
                    <>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#4b5563', display: 'flex', alignItems: 'center', mt: 1 }}>
                        <BuildIcon fontSize="inherit" sx={{ mr: 0.5 }} /> REPAIRS
                      </Typography>
                      <List dense disablePadding>
                        {quickSearchResults.repairs.map((repair) => (
                          <ListItemButton 
                            key={repair._id}
                            onClick={() => {
                              // First check if we have a repairId or reportId to navigate with
                              const id = repair.repairId || repair._id;
                              // Navigate to repairs page
                              navigate(`/repairs?id=${id}`);
                              setShowSearchResults(false);
                            }}
                            sx={{ borderRadius: 1, py: 0.5 }}
                          >
                            <ListItemText 
                              primary={`${repair.repairId || repair._id} - ${repair.status}`}
                              secondary={repair.description?.substring(0, 40) + (repair.description?.length > 40 ? '...' : '')}
                              primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
                              secondaryTypographyProps={{ fontSize: '0.75rem' }}
                            />
                          </ListItemButton>
                        ))}
                      </List>
                    </>
                  )}
                </Box>
                
                <Divider />
                
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    variant="contained" 
                    onClick={() => {
                      performSearch(searchValue);
                      setShowSearchResults(false);
                    }}
                    sx={{ flex: 1 }}
                    startIcon={<SearchIcon />}
                  >
                    View All Results
                  </Button>
                  
                  <Button 
                    variant="outlined"
                    onClick={() => {
                      navigate('/map?q=' + encodeURIComponent(searchValue));
                      setShowSearchResults(false);
                    }}
                    sx={{ flex: 1 }}
                  >
                    View on Map
                  </Button>
                </Box>
                </Box>
              </Paper>
            </ClickAwayListener>
          ) : null}
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Time */}
          {!isMobile && (
            <Typography variant="body2" sx={{ 
              color: '#6b7280',
              fontWeight: 500,
              mr: 2,
            }}>
              {currentTime}
            </Typography>
          )}

          {/* Notifications */}
          <Tooltip title="Notifications">
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
          </Tooltip>

          {/* Profile */}
          <Tooltip title="Profile">
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{ 
                ml: 1,
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
      </Toolbar>
    </AppBar>
  );
};

export default Header; 