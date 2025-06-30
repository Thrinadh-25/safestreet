import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import { MoreVert, Image, LocationOn } from '@mui/icons-material';
import { Upload } from '../../types';
import { format } from 'date-fns';

interface RecentUploadsProps {
  uploads: Upload[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return '#ff9500';
    case 'processing':
      return '#007AFF';
    case 'success':
      return '#34c759';
    case 'failed':
      return '#ff3b30';
    default:
      return '#6c757d';
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'Low':
      return '#34c759';
    case 'Medium':
      return '#ff9500';
    case 'High':
      return '#ff6b35';
    case 'Critical':
      return '#ff3b30';
    default:
      return '#6c757d';
  }
};

const RecentUploads: React.FC<RecentUploadsProps> = ({ uploads }) => {
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        border: '1px solid #f0f0f0',
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ p: 3, pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Recent Reports
          </Typography>
          <Typography variant="body2" sx={{ color: '#6c757d' }}>
            Latest damage reports from the field
          </Typography>
        </Box>

        <List sx={{ px: 2 }}>
          {uploads.map((upload, index) => (
            <ListItem
              key={upload.id}
              sx={{
                borderRadius: 2,
                mb: 1,
                '&:hover': {
                  bgcolor: '#f8f9fa',
                },
              }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: '#f0f8ff',
                    color: '#007AFF',
                  }}
                >
                  <Image />
                </Avatar>
              </ListItemAvatar>
              
              <ListItemText
                disableTypography
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {upload.aiAnalysis?.damageType || 'Processing...'}
                    </Typography>
                    {upload.aiAnalysis?.severity && (
                      <Chip
                        label={upload.aiAnalysis.severity}
                        size="small"
                        sx={{
                          bgcolor: `${getSeverityColor(upload.aiAnalysis.severity)}15`,
                          color: getSeverityColor(upload.aiAnalysis.severity),
                          fontWeight: 600,
                          fontSize: '0.75rem',
                        }}
                      />
                    )}
                  </Box>
                }
                secondary={
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                      <LocationOn sx={{ fontSize: 14, color: '#6c757d' }} />
                      <Typography variant="caption" sx={{ color: '#6c757d' }}>
                        {upload.location.latitude.toFixed(4)}, {upload.location.longitude.toFixed(4)}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: '#6c757d' }}>
                      {format(new Date(upload.createdAt), 'MMM dd, yyyy • HH:mm')}
                    </Typography>
                  </Box>
                }
              />
              
              <ListItemSecondaryAction>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={upload.status.toUpperCase()}
                    size="small"
                    sx={{
                      bgcolor: `${getStatusColor(upload.status)}15`,
                      color: getStatusColor(upload.status),
                      fontWeight: 600,
                      fontSize: '0.7rem',
                    }}
                  />
                  <IconButton size="small">
                    <MoreVert fontSize="small" />
                  </IconButton>
                </Box>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        {uploads.length === 0 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#6c757d' }}>
              No recent uploads
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentUploads;