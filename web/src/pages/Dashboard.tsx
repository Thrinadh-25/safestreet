import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
} from '@mui/material';
import {
  TrendingUp,
  Warning,
  CheckCircle,
  Schedule,
  Visibility,
  Edit,
} from '@mui/icons-material';

interface DashboardStats {
  totalReports: number;
  pendingReports: number;
  completedReports: number;
  criticalReports: number;
}

interface RecentReport {
  id: string;
  location: string;
  damageType: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Pending' | 'In Progress' | 'Completed';
  reportedAt: string;
  reportedBy: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalReports: 0,
    pendingReports: 0,
    completedReports: 0,
    criticalReports: 0,
  });

  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);

  useEffect(() => {
    // TODO: Replace with actual API calls
    // Mock data for demo
    setStats({
      totalReports: 1247,
      pendingReports: 89,
      completedReports: 1158,
      criticalReports: 23,
    });

    setRecentReports([
      {
        id: '1',
        location: 'Main St & 5th Ave',
        damageType: 'Pothole',
        severity: 'High',
        status: 'Pending',
        reportedAt: '2025-01-15T10:30:00Z',
        reportedBy: 'John Doe',
      },
      {
        id: '2',
        location: 'Highway 101, Mile 45',
        damageType: 'Crack',
        severity: 'Medium',
        status: 'In Progress',
        reportedAt: '2025-01-15T09:15:00Z',
        reportedBy: 'Jane Smith',
      },
      {
        id: '3',
        location: 'Oak Street Bridge',
        damageType: 'Surface Wear',
        severity: 'Critical',
        status: 'Pending',
        reportedAt: '2025-01-15T08:45:00Z',
        reportedBy: 'Mike Johnson',
      },
    ]);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low': return 'success';
      case 'Medium': return 'warning';
      case 'High': return 'error';
      case 'Critical': return 'error';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'In Progress': return 'info';
      case 'Completed': return 'success';
      default: return 'default';
    }
  };

  const StatCard = ({ title, value, icon, color }: any) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" component="h2">
              {value.toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ color, opacity: 0.8 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Reports"
            value={stats.totalReports}
            icon={<TrendingUp sx={{ fontSize: 40 }} />}
            color="#007AFF"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Reports"
            value={stats.pendingReports}
            icon={<Schedule sx={{ fontSize: 40 }} />}
            color="#FF9500"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed"
            value={stats.completedReports}
            icon={<CheckCircle sx={{ fontSize: 40 }} />}
            color="#34C759"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Critical Issues"
            value={stats.criticalReports}
            icon={<Warning sx={{ fontSize: 40 }} />}
            color="#FF3B30"
          />
        </Grid>
      </Grid>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Recent Reports</Typography>
          <Button variant="outlined" href="/reports">
            View All Reports
          </Button>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Location</TableCell>
                <TableCell>Damage Type</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Reported By</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.location}</TableCell>
                  <TableCell>{report.damageType}</TableCell>
                  <TableCell>
                    <Chip
                      label={report.severity}
                      color={getSeverityColor(report.severity) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={report.status}
                      color={getStatusColor(report.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{report.reportedBy}</TableCell>
                  <TableCell>
                    {new Date(report.reportedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary">
                      <Visibility />
                    </IconButton>
                    <IconButton size="small" color="primary">
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Dashboard;