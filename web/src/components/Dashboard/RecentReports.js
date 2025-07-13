// src/components/Dashboard/RecentReports.jsx
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const RecentReports = ({ reports }) => {
  if (!Array.isArray(reports)) return <div>No reports available.</div>;
  const recent = reports.slice(0, 5);

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Recent Reports</Typography>
      {recent.map((r, i) => (
        <Box key={i} mb={2}>
          <Typography>
            📍 {r.location} — {r.damageType} ({r.severity})
          </Typography>
        </Box>
      ))}
    </Paper>
  );
};

export default RecentReports;
