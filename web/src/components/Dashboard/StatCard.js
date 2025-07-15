import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Avatar, 
  Chip, 
  Box, 
  alpha, 
  useTheme, 
  Stack,
  Skeleton
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

// Modern card with shadow and hover effect
const ModernCard = ({ children, gradient = false, ...props }) => {  
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        background: gradient 
          ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
          : '#ffffff',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
        },
        '&::before': gradient ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="rgba(102,126,234,0.1)" fill-rule="evenodd"%3E%3Cpath d="m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.4,
          pointerEvents: 'none',
        } : {},
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Card>
  );
};

const StatCard = ({ icon, title, value, change, color = 'primary', loading = false }) => {
  const theme = useTheme();
  
  if (loading) {
    return (
      <ModernCard>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Skeleton variant="circular" width={48} height={48} />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </Stack>
        </CardContent>
      </ModernCard>
    );
  }

  return (
    <ModernCard>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Avatar
              sx={{
                background: `linear-gradient(135deg, ${theme.palette[color].main} 0%, ${theme.palette[color].dark} 100%)`,
                width: 48,
                height: 48,
                boxShadow: `0 8px 16px ${alpha(theme.palette[color].main, 0.3)}`,
              }}
            >
              {icon}
            </Avatar>
              
              {change && (
                <Chip
                  icon={change > 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                  label={`${change > 0 ? '+' : ''}${change}%`}
                  size="small"
                  color={change > 0 ? 'success' : 'error'}
                  sx={{
                    fontWeight: 600,
                    '& .MuiChip-icon': {
                      fontSize: '1rem',
                    },
                  }}
                />
              )}
            </Stack>
            
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  fontSize: '2rem',
                  background: `linear-gradient(135deg, ${theme.palette[color].main} 0%, ${theme.palette[color].dark} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 0.5,
                }}
              >
                {value.toLocaleString()}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                {title}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </ModernCard>
  );
};

export default StatCard;
export { ModernCard };
