import React from 'react';
import { Stack, Tooltip, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const ReportActions = ({ report, onView, onEdit, onDelete, onDownload, colors }) => (
  <Stack direction="row" spacing={1}>
    <Tooltip title="View Details" arrow>
      <IconButton 
        size="small"
        onClick={() => onView(report)}
        sx={{ 
          color: colors.primary,
          '&:hover': { 
            backgroundColor: colors.border,
          }
        }}
      >
        <VisibilityIcon fontSize="small" />
      </IconButton>
    </Tooltip>
    <Tooltip title="Edit Report" arrow>
      <IconButton 
        size="small"
        onClick={() => onEdit(report)}
        sx={{ 
          color: colors.warning,
          '&:hover': { 
            backgroundColor: colors.border,
          }
        }}
      >
        <EditIcon fontSize="small" />
      </IconButton>
    </Tooltip>
    <Tooltip title="Delete Report" arrow>
      <IconButton 
        size="small"
        onClick={() => onDelete(report)}
        sx={{ 
          color: colors.error,
          '&:hover': { 
            backgroundColor: colors.border,
          }
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Tooltip>
    <Tooltip title="Download Report" arrow>
      <IconButton 
        size="small"
        onClick={() => onDownload(report)}
        sx={{ 
          color: colors.success,
          '&:hover': { 
            backgroundColor: colors.border,
          }
        }}
      >
        <FileDownloadIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  </Stack>
);

export default ReportActions;
