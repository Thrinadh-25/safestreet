import React from 'react';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const PageHeader = ({
  title,
  subtitle,
  breadcrumbs = [],
  action,
  sx = {}
}) => {
  return (
    <Box 
      sx={{ 
        mb: 4,
        position: 'relative',
        ...sx 
      }}
    >
      {breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={
            <NavigateNextIcon 
              fontSize="small" 
              sx={{ 
                color: '#9ca3af',
                fontSize: '1rem' 
              }} 
            />
          }
          sx={{ 
            mb: 2,
            '& .MuiBreadcrumbs-li': {
              display: 'flex',
              alignItems: 'center',
            }
          }}
        >
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            
            if (isLast || !crumb.path) {
              return (
                <Typography
                  key={crumb.label}
                  variant="body2"
                  sx={{ 
                    fontSize: '0.875rem',
                    fontWeight: isLast ? 500 : 400,
                    color: isLast ? '#374151' : '#6b7280'
                  }}
                >
                  {crumb.label}
                </Typography>
              );
            }

            return (
              <Link
                key={crumb.label}
                component={RouterLink}
                to={crumb.path}
                color="inherit"
                variant="body2"
                sx={{
                  textDecoration: 'none',
                  color: '#6b7280',
                  '&:hover': {
                    textDecoration: 'underline',
                    color: '#2563eb',
                  },
                }}
              >
                {crumb.label}
              </Link>
            );
          })}
        </Breadcrumbs>
      )}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom={!!subtitle}
            sx={{
              color: '#111827',
              fontWeight: 600,
              fontSize: '1.875rem',
            }}
          >
            {title}
          </Typography>
          
          {subtitle && (
            <Typography
              variant="body1"
              sx={{ 
                mt: -1,
                color: '#6b7280',
                fontSize: '1rem',
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {action && (
          <Box sx={{ ml: 2 }}>
            {action}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PageHeader; 