import React from 'react';
import {
  Box, 
  Typography, 
  Divider 
} from '@mui/material';
import { format } from 'date-fns';

const TenantInfo = ({ tenant }) => {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Tenant Information
      </Typography>
      
      <Divider sx={{ my: 1.5 }} />
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Code
        </Typography>
        <Typography variant="body1">
          {tenant.code}
        </Typography>
      </Box>
      
      {tenant.description && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Description
          </Typography>
          <Typography variant="body1">
            {tenant.description}
          </Typography>
        </Box>
      )}
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Status
        </Typography>
        <Typography variant="body1">
          {tenant.active ? 'Active' : 'Inactive'}
        </Typography>
      </Box>
      
      <Divider sx={{ my: 1.5 }} />
      
      <Typography variant="subtitle2" sx={{ mt: 2 }}>
        Configuration
      </Typography>
      
      <Box sx={{ mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Max Field Workers
        </Typography>
        <Typography variant="body1">
          {tenant.settings?.maxFieldWorkers || 10}
        </Typography>
      </Box>
      
      <Box sx={{ mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Max Admins
        </Typography>
        <Typography variant="body1">
          {tenant.settings?.maxAdmins || 2}
        </Typography>
      </Box>
      
      <Divider sx={{ my: 1.5 }} />
      
      <Typography variant="subtitle2" sx={{ mt: 2 }}>
        System Information
      </Typography>
      
      <Box sx={{ mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Created
        </Typography>
        <Typography variant="body1">
          {tenant.createdAt ? format(new Date(tenant.createdAt), 'MMM dd, yyyy') : 'N/A'}
        </Typography>
      </Box>
      
      <Box sx={{ mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Last Updated
        </Typography>
        <Typography variant="body1">
          {tenant.updatedAt ? format(new Date(tenant.updatedAt), 'MMM dd, yyyy') : 'N/A'}
        </Typography>
      </Box>
    </>
  );
};

export default TenantInfo;
