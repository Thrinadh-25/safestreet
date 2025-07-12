import React from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  alpha, 
  useTheme,
  CardContent 
} from '@mui/material';
import ReportIcon from '@mui/icons-material/Report';
import BuildIcon from '@mui/icons-material/Build';
import SpeedIcon from '@mui/icons-material/Speed';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { ModernCard } from './StatCard';

const QuickAction = ({ icon, title, color, onClick }) => {
  const theme = useTheme();

  return (
    <Paper
      onClick={onClick}
      sx={{
        p: 2,
        textAlign: 'center',
        borderRadius: 3,
        border: '2px dashed',
        borderColor: alpha(theme.palette[color].main, 0.3),
        background: alpha(theme.palette[color].main, 0.05),
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: theme.palette[color].main,
          background: alpha(theme.palette[color].main, 0.1),
          transform: 'translateY(-2px)',
        },
      }}
    >
      {icon}
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
    </Paper>
  );
};

const QuickActions = () => {
  const theme = useTheme();

  const actions = [
    {
      title: 'Reports',
      icon: <ReportIcon sx={{ fontSize: 32, color: theme.palette.primary.main, mb: 1 }} />,
      color: 'primary',
      link: '/reports'
    },
    {
      title: 'Schedule Repair',
      icon: <BuildIcon sx={{ fontSize: 32, color: theme.palette.success.main, mb: 1 }} />,
      color: 'success',
      link: '/repairs'
    },
    {
      title: 'Analytics',
      icon: <SpeedIcon sx={{ fontSize: 32, color: theme.palette.info.main, mb: 1 }} />,
      color: 'info',
      link: '/historical'
    },
    {
      title: 'AI Analysis',
      icon: <AutoAwesomeIcon sx={{ fontSize: 32, color: theme.palette.warning.main, mb: 1 }} />,
      color: 'warning',
      link: '/ai-analysis'
    }
  ];

  return (
    <ModernCard>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Quick Actions
        </Typography>

        <Grid container spacing={2}>
          {actions.map((action, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <QuickAction 
                title={action.title}
                icon={action.icon}
                color={action.color}
                onClick={() => window.location.href = action.link}
              />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </ModernCard>
  );
};

export default QuickActions;
