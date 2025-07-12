import React from 'react';
import ReportList from '../components/reports/ReportList';

const ReportsPage = () => {
  return (
    <div>
      <h1 style={{ padding: '20px' }}>All Damage Reports</h1>
      <ReportList />
    </div>
  );
};

export default ReportsPage;
