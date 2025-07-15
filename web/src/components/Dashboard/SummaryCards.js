// src/components/Dashboard/SummaryCards.jsx
import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';

const SummaryCards = ({ reports }) => {
  if (!Array.isArray(reports)) return null; // or return loading spinner or empty chart

  const getSeverityCount = (level) => reports.filter(r => r.severity === level).length;

  const summary = [
    { label: 'Total Reports', value: reports.length },
    { label: 'High Severity', value: getSeverityCount('High') },
    { label: 'Medium Severity', value: getSeverityCount('Medium') },
    { label: 'Low Severity', value: getSeverityCount('Low') },
  ];

  return (
    <Grid container spacing={2} mb={4}>
      {summary.map((item, i) => (
        <Grid item xs={12} sm={6} md={3} key={i}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6">{item.label}</Typography>
              <Typography variant="h4">{item.value}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SummaryCards;
