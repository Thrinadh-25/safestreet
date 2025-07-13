import React from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  Typography, 
  Chip, 
  Stack,
  Button,
  alpha,
  useTheme,
  CardContent
} from '@mui/material';
import { formatLocation } from '../../utils/formatters';
import TimelineIcon from '@mui/icons-material/Timeline';
import ReportIcon from '@mui/icons-material/Report';
import BuildIcon from '@mui/icons-material/Build';
import PeopleIcon from '@mui/icons-material/People';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import { ModernCard } from './StatCard';

const ActivityFeed = ({ activities = [] }) => {
  const theme = useTheme();

  const getSeverityColor = (severity) => {
    switch(severity?.toLowerCase()) {
      case 'critical': return theme.palette.error.main;
      case 'high': return theme.palette.error.main;
      case 'medium': return theme.palette.info.main;
      case 'low': return theme.palette.success.main;
      case 'success': return theme.palette.success.main;
      case 'info': return theme.palette.info.main;
      case 'warning': return theme.palette.warning.main;
      default: return theme.palette.primary.main;
    }
  };

  const getActivityIcon = (type) => {
    switch(type) {
      case 'report': return <ReportIcon fontSize="small" />;
      case 'repair': return <BuildIcon fontSize="small" />;
      case 'analysis': return <AutoAwesomeIcon fontSize="small" />;
      case 'assignment': return <PeopleIcon fontSize="small" />;
      default: return <NotificationImportantIcon fontSize="small" />;
    }
  };

  return (
    <ModernCard gradient>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ p: 3, pb: 0 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Recent Activity
            </Typography>
            <TimelineIcon color="primary" />
          </Stack>
        </Box>
        
        <List sx={{ p: 0 }}>
          {activities.map((activity, index) => (
            <ListItem
              key={activity.id}
              sx={{
                borderBottom: index < activities.length - 1 
                  ? '1px solid rgba(0, 0, 0, 0.06)' 
                  : 'none',
                py: 2,
                px: 3,
              }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    backgroundColor: alpha(getSeverityColor(activity.severity), 0.1),
                    color: getSeverityColor(activity.severity),
                    width: 32,
                    height: 32,
                  }}
                >
                  {getActivityIcon(activity.type)}
                </Avatar>
              </ListItemAvatar>
              
              <ListItemText
                primary={
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {activity.title}
                  </Typography>
                }
                secondary={
                  <Stack spacing={0.5}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      {activity.description}
                    </Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                        {activity.time}
                      </Typography>
                      <Chip
                        label={typeof activity.location === 'object' ? formatLocation(activity.location) : activity.location}
                        size="small"
                        sx={{
                          height: 16,
                          fontSize: '0.65rem',
                          fontWeight: 600,
                          '& .MuiChip-label': { px: 1 },
                        }}
                      />
                    </Stack>
                  </Stack>
                }
              />
            </ListItem>
          ))}
        </List>
        
        <Box sx={{ p: 2, textAlign: 'center', borderTop: '1px solid rgba(0, 0, 0, 0.06)' }}>
          <Button variant="text" size="small" sx={{ borderRadius: 2, fontWeight: 600 }}>
            View All Activity
          </Button>
        </Box>
      </CardContent>
    </ModernCard>
  );
};

export default ActivityFeed;
