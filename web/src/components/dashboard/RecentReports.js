import React, { memo } from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Skeleton,
  Paper
} from '@mui/material';
import { formatLocation } from '../../utils/formatters';

const RecentReports = memo(({ reports = [], loading }) => {
  // Helper function to get color based on severity
  const getSeverityColor = (severity) => {
    switch(severity?.toUpperCase()) {
      case 'HIGH':
        return 'error';
      case 'MEDIUM':
        return 'warning';
      case 'LOW':
        return 'success';
      default:
        return 'primary';
    }
  };
  
  // Helper function to get color based on status
  const getStatusColor = (status) => {
    switch(status?.toUpperCase()) {
      case 'COMPLETED':
        return 'success';
      case 'IN PROGRESS':
        return 'info';
      case 'PENDING':
        return 'warning';
      default:
        return 'default';
    }
  };
  
  return (
    <Card 
      elevation={0}
      sx={{ 
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardHeader 
        title={
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Recent Reports
          </Typography>
        }
        sx={{ 
          pb: 0,
          '& .MuiCardHeader-action': { m: 0 }
        }}
      />
      <CardContent sx={{ pt: 2, pb: 1, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <TableContainer component={Paper} elevation={0} sx={{ flexGrow: 1, borderRadius: 2 }}>
          <Table sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from(new Array(3)).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton variant="text" width={150} /></TableCell>
                    <TableCell><Skeleton variant="text" width={100} /></TableCell>
                    <TableCell><Skeleton variant="text" width={80} /></TableCell>
                    <TableCell><Skeleton variant="rounded" width={80} height={24} /></TableCell>
                    <TableCell><Skeleton variant="rounded" width={80} height={24} /></TableCell>
                  </TableRow>
                ))
              ) : reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                      No reports found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report) => (
                  <TableRow key={report.id} hover>
                    <TableCell>{report.title}</TableCell>
                    <TableCell>{formatLocation(report.location)}</TableCell>
                    <TableCell>{report.timestamp}</TableCell>
                    <TableCell>
                      <Chip 
                        label={report.severity} 
                        size="small" 
                        color={getSeverityColor(report.severity)}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={report.status} 
                        size="small" 
                        color={getStatusColor(report.status)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
});

// Set displayName for debugging purposes
RecentReports.displayName = 'RecentReports';

export default RecentReports;
