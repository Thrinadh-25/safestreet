import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container,
  Tabs,
  Tab,
  Paper,
  List,
  ListItemText,
  ListItemAvatar,
  ListItemButton,
  Avatar,
  Divider,
  Chip,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Button,
  useTheme,
  alpha
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';

// Icons
import ReportIcon from '@mui/icons-material/Report';
import BuildIcon from '@mui/icons-material/Build';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PersonIcon from '@mui/icons-material/Person';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import TodayIcon from '@mui/icons-material/Today';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WarningIcon from '@mui/icons-material/Warning';

const SearchResults = () => {
  const { 
    searchTerm, 
    searchResults, 
    isSearching, 
    searchPerformed, 
    performSearch 
  } = useSearch();
  const navigate = useNavigate();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Parse query params
  const queryParams = new URLSearchParams(window.location.search);
  const filterType = queryParams.get('type');
  const filterId = queryParams.get('id');

  // Re-perform search if the component mounts but we don't have results yet
  // or handle direct navigation via query params
  useEffect(() => {
    // If we have query params, set appropriate starting tab
    if (filterType) {
      if (filterType === 'fieldWorker') {
        setActiveTab(1); // Set to field workers tab
      } else if (filterType === 'repair') {
        setActiveTab(3); // Set to repairs tab
      } else if (filterType === 'report') {
        setActiveTab(0); // Set to reports tab
      } else if (filterType === 'analytics') {
        setActiveTab(2); // Set to analytics tab
      }
    }
    
    // If we have an ID filter, we could highlight that specific item
    if (filterId) {
      // This would be implemented based on the UI requirements
      // For now we just log it
      console.log(`Filtering for specific item with ID: ${filterId}`);
    }
    
    // Re-perform search if needed
    if (searchTerm && !searchPerformed && !isSearching) {
      performSearch(searchTerm);
    }
  }, [searchTerm, searchPerformed, isSearching, performSearch, filterType, filterId]);

  // Get total results count
  const getTotalCount = () => {
    return (
      searchResults.reports.length +
      searchResults.fieldWorkers.length +
      searchResults.analytics.length +
      searchResults.repairs.length
    );
  };

  // No results view
  const NoResults = () => (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        py: 8
      }}
    >
      <SearchOffIcon sx={{ fontSize: 64, color: '#9ca3af', mb: 2 }} />
      <Typography variant="h5" sx={{ mb: 1, fontWeight: 600, color: '#4b5563' }}>
        No results found
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, color: '#6b7280', maxWidth: 450, textAlign: 'center' }}>
        We couldn't find any matches for "{searchTerm}"
      </Typography>
      <Button 
        variant="contained"
        onClick={() => navigate('/')}
        sx={{ 
          px: 3,
          backgroundColor: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.9),
          }
        }}
      >
        Return to Dashboard
      </Button>
    </Box>
  );

  // Loading view
  if (isSearching) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Search Results
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {getTotalCount()} results found for "{searchTerm}"
        </Typography>
      </Box>

      {getTotalCount() === 0 ? (
        <NoResults />
      ) : (
        <>
          <Paper 
            sx={{ 
              mb: 3, 
              borderRadius: 1,
              boxShadow: 'rgb(0 0 0 / 5%) 0px 1px 2px 0px',
            }}
          >
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              indicatorColor="primary"
              textColor="primary"
              sx={{
                borderBottom: '1px solid #e5e7eb',
                '& .MuiTab-root': {
                  fontWeight: 500,
                  py: 2,
                  minWidth: 120,
                }
              }}
            >
              <Tab label="All" />
              <Tab 
                label={`Reports (${searchResults.reports.length})`} 
                disabled={searchResults.reports.length === 0}
              />
              <Tab 
                label={`Repairs (${searchResults.repairs.length})`} 
                disabled={searchResults.repairs.length === 0}
              />
              <Tab 
                label={`Field Workers (${searchResults.fieldWorkers.length})`} 
                disabled={searchResults.fieldWorkers.length === 0}
              />
              <Tab 
                label={`Analytics (${searchResults.analytics.length})`} 
                disabled={searchResults.analytics.length === 0}
              />
            </Tabs>
          </Paper>

          {/* All Results */}
          {activeTab === 0 && (
            <Grid container spacing={3}>
              {/* Damage Reports Section */}
              {searchResults.reports.length > 0 && (
                <Grid item xs={12}>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ReportIcon /> Damage Reports
                    </Typography>
                    <Button 
                      variant="text" 
                      onClick={() => navigate('/reports')}
                      sx={{ fontWeight: 500 }}
                    >
                      View All Reports
                    </Button>
                  </Box>
                  <Paper 
                    sx={{ 
                      borderRadius: 1,
                      boxShadow: 'rgb(0 0 0 / 5%) 0px 1px 2px 0px',
                      overflow: 'hidden'
                    }}
                  >
                    <List disablePadding>
                      {searchResults.reports.slice(0, 5).map((report, index) => (
                        <React.Fragment key={report._id || report.id || index}>
                          <ListItemButton>
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: getSeverityColor(report.severity) }}>
                                <ReportIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                  {report.reportId} - {report.damageType}
                                </Typography>
                              }
                              secondary={
                                <>
                                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                                    <Chip 
                                      label={report.status} 
                                      size="small" 
                                      sx={{ 
                                        backgroundColor: getStatusColor(report.status),
                                        color: 'white',
                                        height: 20,
                                        fontSize: '0.75rem'
                                      }} 
                                    />
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                      <LocationOnIcon sx={{ fontSize: '0.875rem', color: '#6b7280' }} />
                                      <Typography variant="body2" color="text.secondary">
                                        {report.location}
                                      </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                      <TodayIcon sx={{ fontSize: '0.875rem', color: '#6b7280' }} />
                                      <Typography variant="body2" color="text.secondary">
                                        {new Date(report.createdAt).toLocaleDateString()}
                                      </Typography>
                                    </Box>
                                  </Box>
                                  
                                  {/* Action buttons */}
                                  <Box sx={{ display: 'flex', mt: 1, gap: 1 }}>
                                    <Button 
                                      variant="outlined" 
                                      size="small"
                                      onClick={() => navigate(`/reports/${report.reportId}`)}
                                      sx={{ 
                                        fontSize: '0.75rem',
                                        py: 0.25,
                                        minHeight: 0,
                                        minWidth: 0,
                                        textTransform: 'none'
                                      }}
                                    >
                                      View Details
                                    </Button>
                                    
                                    <Button
                                      variant="outlined"
                                      size="small"
                                      onClick={() => navigate(`/map?highlight=${report.reportId}`)}
                                      sx={{ 
                                        fontSize: '0.75rem',
                                        py: 0.25,
                                        minHeight: 0,
                                        minWidth: 0,
                                        textTransform: 'none'
                                      }}
                                    >
                                      View on Map
                                    </Button>
                                    
                                    {report.status !== "Completed" && (
                                      <Button
                                        variant="outlined"
                                        color="primary"
                                        size="small"
                                        onClick={() => navigate(`/repairs?reportId=${report.reportId}`)}
                                        sx={{ 
                                          fontSize: '0.75rem',
                                          py: 0.25,
                                          minHeight: 0,
                                          minWidth: 0,
                                          textTransform: 'none'
                                        }}
                                      >
                                        Schedule Repair
                                      </Button>
                                    )}
                                  </Box>
                                </>
                              }
                            />
                          </ListItemButton>
                          {index < searchResults.reports.slice(0, 5).length - 1 && (
                            <Divider variant="inset" component="li" />
                          )}
                        </React.Fragment>
                      ))}
                    </List>
                  </Paper>
                </Grid>
              )}

              {/* Repairs Section */}
              {searchResults.repairs.length > 0 && (
                <Grid item xs={12}>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BuildIcon /> Repairs
                    </Typography>
                    <Button 
                      variant="text" 
                      onClick={() => navigate('/repairs')}
                      sx={{ fontWeight: 500 }}
                    >
                      View All Repairs
                    </Button>
                  </Box>
                  <Paper sx={{ borderRadius: 1, boxShadow: 'rgb(0 0 0 / 5%) 0px 1px 2px 0px', overflow: 'hidden' }}>
                    <List disablePadding>
                      {searchResults.repairs.slice(0, 5).map((repair, index) => (
                        <React.Fragment key={repair._id || repair.id || index}>
                          <ListItemButton>
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: '#3b82f6' }}>
                                <BuildIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                  {repair.repairId || repair._id} - {repair.description}
                                </Typography>
                              }
                              secondary={
                                <>
                                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                                    <Chip 
                                      label={repair.status} 
                                      size="small" 
                                      sx={{ 
                                        backgroundColor: getStatusColor(repair.status),
                                        color: 'white',
                                        height: 20,
                                        fontSize: '0.75rem'
                                      }} 
                                    />
                                    {repair.assignedTo && (
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <PersonIcon sx={{ fontSize: '0.875rem', color: '#6b7280' }} />
                                        <Typography variant="body2" color="text.secondary">
                                          {typeof repair.assignedTo === 'object' ? repair.assignedTo.name : 'Assigned'}
                                        </Typography>
                                      </Box>
                                    )}
                                  </Box>
                                  
                                  {/* Action buttons */}
                                  <Box sx={{ display: 'flex', mt: 1, gap: 1 }}>
                                    <Button 
                                      variant="outlined" 
                                      size="small"
                                      onClick={() => navigate(`/repairs/${repair.repairId || repair._id}`)}
                                      sx={{ 
                                        fontSize: '0.75rem',
                                        py: 0.25,
                                        minHeight: 0,
                                        minWidth: 0,
                                        textTransform: 'none'
                                      }}
                                    >
                                      View Details
                                    </Button>
                                    
                                    <Button
                                      variant="outlined"
                                      size="small"
                                      onClick={() => navigate(`/map?highlight=${repair.repairId || repair._id}`)}
                                      sx={{ 
                                        fontSize: '0.75rem',
                                        py: 0.25,
                                        minHeight: 0,
                                        minWidth: 0,
                                        textTransform: 'none'
                                      }}
                                    >
                                      View on Map
                                    </Button>
                                    
                                    {repair.status === "Assigned" && (
                                      <Button
                                        variant="outlined"
                                        color="secondary"
                                        size="small"
                                        onClick={() => navigate(`/repairs/${repair.repairId || repair._id}/track`)}
                                        sx={{ 
                                          fontSize: '0.75rem',
                                          py: 0.25,
                                          minHeight: 0,
                                          minWidth: 0,
                                          textTransform: 'none'
                                        }}
                                      >
                                        Track Progress
                                      </Button>
                                    )}
                                  </Box>
                                </>
                              }
                            />
                          </ListItemButton>
                          {index < searchResults.repairs.slice(0, 5).length - 1 && (
                            <Divider variant="inset" component="li" />
                          )}
                        </React.Fragment>
                      ))}
                    </List>
                  </Paper>
                </Grid>
              )}

              {/* Field Workers Section */}
              {searchResults.fieldWorkers.length > 0 && (
                <Grid item xs={12}>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon /> Field Workers
                    </Typography>
                    <Button 
                      variant="text" 
                      onClick={() => navigate('/field-workers')}
                      sx={{ fontWeight: 500 }}
                    >
                      View All Workers
                    </Button>
                  </Box>
                  <Grid container spacing={2}>
                    {searchResults.fieldWorkers.slice(0, 4).map((worker) => (
                      <Grid item xs={12} sm={6} md={3} key={worker._id || worker.id}>
                        <Card 
                          sx={{ 
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 12px 20px -10px rgba(0,0,0,0.1)',
                            },
                            borderRadius: 1,
                            boxShadow: 'rgb(0 0 0 / 5%) 0px 1px 2px 0px',
                          }}
                        >
                          <CardContent sx={{ textAlign: 'center', p: 3 }}>
                            <Avatar
                              sx={{
                                width: 64,
                                height: 64,
                                margin: '0 auto 12px',
                                backgroundColor: getSpecializationColor(worker.specialization),
                                fontSize: '1.5rem',
                                fontWeight: 600,
                              }}
                            >
                              {getInitials(worker.name)}
                            </Avatar>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {worker.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {worker.specialization}
                            </Typography>
                            <Chip 
                              label={worker.activeAssignments > 0 ? 'Active' : 'Available'} 
                              size="small" 
                              sx={{ 
                                backgroundColor: worker.activeAssignments > 0 ? '#f59e0b' : '#10b981',
                                color: 'white',
                                fontWeight: 500,
                                mb: 2
                              }} 
                            />
                            
                            {/* Action buttons */}
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
                              <Button 
                                variant="outlined" 
                                size="small"
                                onClick={() => navigate(`/field-workers/${worker._id || worker.id}`)}
                                sx={{ fontSize: '0.75rem', textTransform: 'none' }}
                              >
                                View Profile
                              </Button>
                              
                              <Button 
                                variant="outlined" 
                                color="primary"
                                size="small"
                                onClick={() => navigate(`/field-workers/${worker._id || worker.id}/assignments`)}
                                sx={{ fontSize: '0.75rem', textTransform: 'none' }}
                              >
                                View Tasks
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              )}
              
              {/* Analytics Section */}
              {searchResults.analytics.length > 0 && (
                <Grid item xs={12}>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AnalyticsIcon /> Analytics
                    </Typography>
                    <Button 
                      variant="text" 
                      onClick={() => navigate('/analytics')}
                      sx={{ fontWeight: 500 }}
                    >
                      View All Analytics
                    </Button>
                  </Box>
                  <Grid container spacing={2}>
                    {searchResults.analytics.slice(0, 4).map((item, index) => (
                      <Grid item xs={12} sm={6} md={3} key={item._id || item.id || index}>
                        <Card 
                          sx={{ 
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 12px 20px -10px rgba(0,0,0,0.1)',
                            },
                            borderRadius: 1,
                            boxShadow: 'rgb(0 0 0 / 5%) 0px 1px 2px 0px',
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                              {item.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {item.description || 'Analysis report'}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                              <Chip 
                                label={item.type || 'Report'} 
                                size="small" 
                                sx={{ 
                                  backgroundColor: getAnalyticsColor(item.type),
                                  color: 'white',
                                  fontWeight: 500,
                                }} 
                              />
                              <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                {item.date ? new Date(item.date).toLocaleDateString() : 'Recent'}
                              </Typography>
                            </Box>
                            
                            {/* Action buttons */}
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button 
                                variant="outlined" 
                                size="small"
                                fullWidth
                                onClick={() => navigate(`/analytics/${item.type.toLowerCase().replace(' ', '-')}`)}
                                sx={{ fontSize: '0.75rem', textTransform: 'none' }}
                              >
                                View Report
                              </Button>
                              
                              <Button 
                                variant="outlined"
                                color="primary"
                                size="small"
                                fullWidth
                                onClick={() => navigate(`/analytics/${item.type.toLowerCase().replace(' ', '-')}/export`)}
                                sx={{ fontSize: '0.75rem', textTransform: 'none' }}
                              >
                                Export PDF
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              )}
            </Grid>
          )}

          {/* Reports Tab */}
          {activeTab === 1 && (
            <Paper sx={{ borderRadius: 1, boxShadow: 'rgb(0 0 0 / 5%) 0px 1px 2px 0px' }}>
              <List disablePadding>
                {searchResults.reports.length === 0 ? (
                  <NoResults />
                ) : (
                  searchResults.reports.map((report, index) => (
                    <React.Fragment key={report._id || report.id || index}>
                      <ListItemButton onClick={() => navigate(`/reports/${report.reportId}`)}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: getSeverityColor(report.severity) }}>
                            <WarningIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                              {report.reportId} - {report.damageType}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                              <Chip 
                                label={report.status} 
                                size="small" 
                                sx={{ 
                                  backgroundColor: getStatusColor(report.status),
                                  color: 'white',
                                  height: 20,
                                  fontSize: '0.75rem'
                                }} 
                              />
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <LocationOnIcon sx={{ fontSize: '0.875rem', color: '#6b7280' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {report.location}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <TodayIcon sx={{ fontSize: '0.875rem', color: '#6b7280' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {new Date(report.createdAt).toLocaleDateString()}
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                      </ListItemButton>
                      {index < searchResults.reports.length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </React.Fragment>
                  ))
                )}
              </List>
            </Paper>
          )}

          {/* Similar implementation for other tabs */}
          {activeTab === 2 && (
            <Paper sx={{ borderRadius: 1, boxShadow: 'rgb(0 0 0 / 5%) 0px 1px 2px 0px' }}>
              {searchResults.repairs.length === 0 ? (
                <NoResults />
              ) : (
                <List disablePadding>
                  {searchResults.repairs.map((repair, index) => (
                    <React.Fragment key={repair._id || repair.id || index}>
                      <ListItemButton onClick={() => navigate(`/repairs/${repair.repairId || repair._id}`)}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: '#3b82f6' }}>
                            <BuildIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                              {repair.repairId || repair._id} - {repair.description}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                              <Chip 
                                label={repair.status} 
                                size="small" 
                                sx={{ 
                                  backgroundColor: getStatusColor(repair.status),
                                  color: 'white',
                                  height: 20,
                                  fontSize: '0.75rem'
                                }} 
                              />
                              {repair.assignedTo && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <PersonIcon sx={{ fontSize: '0.875rem', color: '#6b7280' }} />
                                  <Typography variant="body2" color="text.secondary">
                                    {typeof repair.assignedTo === 'object' ? repair.assignedTo.name : 'Assigned'}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          }
                        />
                      </ListItemButton>
                      {index < searchResults.repairs.length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Paper>
          )}

          {/* Field Workers Tab */}
          {activeTab === 3 && (
            <Grid container spacing={3}>
              {searchResults.fieldWorkers.length === 0 ? (
                <Grid item xs={12}>
                  <NoResults />
                </Grid>
              ) : (
                searchResults.fieldWorkers.map((worker) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={worker._id || worker.id}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 20px -10px rgba(0,0,0,0.1)',
                        },
                        borderRadius: 1,
                        boxShadow: 'rgb(0 0 0 / 5%) 0px 1px 2px 0px',
                      }}
                      onClick={() => navigate(`/field-workers/${worker._id || worker.id}`)}
                    >
                      <CardContent sx={{ textAlign: 'center', p: 3 }}>
                        <Avatar
                          sx={{
                            width: 80,
                            height: 80,
                            margin: '0 auto 16px',
                            backgroundColor: getSpecializationColor(worker.specialization),
                            fontSize: '2rem',
                            fontWeight: 600,
                          }}
                        >
                          {getInitials(worker.name)}
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {worker.name}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                          {worker.specialization}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Chip 
                            label={worker.activeAssignments > 0 ? 'Active' : 'Available'} 
                            size="small" 
                            sx={{ 
                              backgroundColor: worker.activeAssignments > 0 ? '#f59e0b' : '#10b981',
                              color: 'white',
                              fontWeight: 500,
                            }} 
                          />
                          <Chip 
                            label={`${worker.activeAssignments} Tasks`} 
                            size="small" 
                            sx={{ 
                              backgroundColor: theme.palette.grey[100],
                              fontWeight: 500,
                            }} 
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          )}

          {/* Analytics Tab */}
          {activeTab === 4 && (
            <Grid container spacing={3}>
              {searchResults.analytics.length === 0 ? (
                <Grid item xs={12}>
                  <NoResults />
                </Grid>
              ) : (
                searchResults.analytics.map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} key={item._id || item.id || index}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 20px -10px rgba(0,0,0,0.1)',
                        },
                        borderRadius: 1,
                        boxShadow: 'rgb(0 0 0 / 5%) 0px 1px 2px 0px',
                        height: '100%'
                      }}
                      onClick={() => navigate(`/analytics/${item.type.toLowerCase().replace(' ', '-')}`)}
                    >
                      <CardContent sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {item.description || 'Analysis report'}
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          mt: 'auto'
                        }}>
                          <Chip 
                            label={item.type || 'Report'} 
                            size="small" 
                            sx={{ 
                              backgroundColor: getAnalyticsColor(item.type),
                              color: 'white',
                              fontWeight: 500,
                            }} 
                          />
                          <Typography variant="caption" sx={{ color: '#6b7280' }}>
                            {item.date ? new Date(item.date).toLocaleDateString() : 'Recent'}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          )}
        </>
      )}
    </Container>
  );
};

// Helper functions for color coding
const getSeverityColor = (severity) => {
  switch(severity) {
    case 'Critical': return '#dc2626';
    case 'High': return '#f97316';
    case 'Medium': return '#f59e0b';
    case 'Low': return '#22c55e';
    default: return '#6b7280';
  }
};

const getStatusColor = (status) => {
  switch(status) {
    case 'Pending': return '#f59e0b';
    case 'Assigned': return '#3b82f6';
    case 'In Progress': return '#8b5cf6';
    case 'Completed': return '#10b981';
    case 'Cancelled': return '#ef4444';
    default: return '#6b7280';
  }
};

const getSpecializationColor = (specialization) => {
  if (!specialization) return '#6b7280';
  
  const specializations = {
    'Road Repair': '#3b82f6',
    'Bridge Maintenance': '#8b5cf6',
    'Drainage': '#06b6d4',
    'Lighting': '#f59e0b',
    'Signage': '#ef4444',
    'Landscaping': '#10b981',
  };

  return specializations[specialization] || '#6b7280';
};

const getAnalyticsColor = (type) => {
  if (!type) return '#6b7280';
  
  const types = {
    'Report': '#3b82f6',
    'Performance': '#8b5cf6',
    'Budget': '#f59e0b',
    'Prediction': '#ef4444',
    'Trends': '#10b981',
  };

  return types[type] || '#6b7280';
};

const getInitials = (name) => {
  if (!name) return 'FW';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

export default SearchResults;
