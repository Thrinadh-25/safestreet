import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color, trend }) => {
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        border: '1px solid #f0f0f0',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: '#6c757d',
                fontWeight: 500,
                mb: 1,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontSize: '0.75rem',
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#1a1a1a',
                mb: trend ? 1 : 0,
              }}
            >
              {value}
            </Typography>
            {trend && (
              <Typography
                variant="body2"
                sx={{
                  color: trend.isPositive ? '#28a745' : '#dc3545',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </Typography>
            )}
          </Box>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: `${color}15`,
              color: color,
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatsCard;