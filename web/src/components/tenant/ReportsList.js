import React from 'react';
import {
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Chip, 
  Typography
} from '@mui/material';
import ReportIcon from '@mui/icons-material/Report';
import { format } from 'date-fns';

const ReportsList = ({ reports }) => {
  return (
    <>
      {reports.length > 0 ? (
        <List>
          {reports.map((report) => (
            <ListItem
              key={report._id}
              secondaryAction={
                <Chip 
                  label={report.status} 
                  color={getStatusColor(report.status)}
                  size="small"
                />
              }
              sx={{ borderBottom: '1px solid #f0f0f0' }}
            >
              <ListItemAvatar>
                <Avatar>
                  <ReportIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={report.title || report.location}
                secondary={
                  <>
                    {report.createdAt && format(new Date(report.createdAt), 'MMM dd, yyyy')}
                    {report.description && ` - ${report.description.slice(0, 50)}${report.description.length > 50 ? '...' : ''}`}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No damage reports for this tenant yet.</Typography>
      )}
    </>
  );
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'open':
      return 'warning';
    case 'in progress':
      return 'info';
    case 'resolved':
      return 'success';
    case 'closed':
      return 'default';
    default:
      return 'default';
  }
};

export default ReportsList;
