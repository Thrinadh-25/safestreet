// src/components/Dashboard/SeverityChart.jsx
import React from 'react';
import { Paper, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const SeverityChart = ({ reports }) => {
  if (!Array.isArray(reports)) return null; // or return loading spinner or empty chart

  const getSeverityCount = (level) => reports.filter(r => r.severity === level).length;

  const data = ['High', 'Medium', 'Low'].map(sev => ({
    name: sev,
    count: getSeverityCount(sev),
  }));

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
      <Typography variant="h6" gutterBottom>Severity Breakdown</Typography>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#1976d2" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default SeverityChart;
