// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import SummaryCards from '../components/Dashboard/SummaryCards';
import SeverityChart from '../components/Dashboard/SeverityChart';
import RecentReports from '../components/Dashboard/RecentReports';
import { getAllReports } from '../utils/api';

const DashboardPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getAllReports()
    .then((data) => {
      console.log("✅ Cleaned API Data", data); // Check what this logs!
      setReports(data); // make sure this is the array
      setLoading(false);
    })
    .catch((err) => {
      console.error("Error fetching reports:", err);
      setLoading(false);
    });
  }, []);


  // useEffect(() => {
  //   api.get('/images/reports')
  //     .then(res => {
  //       setReports(res.data);
  //       setLoading(false);
  //     })
  //     .catch(err => {
  //       console.error('Error fetching reports:', err);
  //       setLoading(false);
  //     });
  // }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>SafeStreet Dashboard</Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <SummaryCards reports={reports} />
          <SeverityChart reports={reports} />
          <RecentReports reports={reports} />
        </>
      )}
    </Box>
  );
};

export default DashboardPage;
