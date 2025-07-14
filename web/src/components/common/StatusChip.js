import React from 'react';
import { Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import PendingIcon from '@mui/icons-material/Pending';
import BuildIcon from '@mui/icons-material/Build';

const statusConfig = {
  completed: {
    backgroundColor: '#10b981',
    color: '#ffffff',
    icon: CheckCircleIcon,
    label: 'Completed'
  },
  pending: {
    backgroundColor: '#f59e0b',
    color: '#ffffff',
    icon: PendingIcon,
    label: 'Pending'
  },
  inProgress: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    icon: BuildIcon,
    label: 'In Progress'
  },
  failed: {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    icon: ErrorIcon,
    label: 'Failed'
  },
  critical: {
    backgroundColor: '#dc2626',
    color: '#ffffff',
    icon: ErrorIcon,
    label: 'Critical'
  },
  warning: {
    backgroundColor: '#f59e0b',
    color: '#ffffff',
    icon: WarningIcon,
    label: 'Warning'
  }
};

const StatusChip = ({
  status,
  customLabel,
  size = 'small',
  sx = {}
}) => {

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Chip
      icon={<Icon fontSize="small" />}
      label={customLabel || config.label}
      size={size}
      sx={{
        backgroundColor: config.backgroundColor,
        color: config.color,
        fontWeight: 500,
        borderRadius: 1,
        '& .MuiChip-icon': {
          fontSize: '0.875rem',
          color: config.color,
        },
        ...sx
      }}
    />
  );
};

export default StatusChip; 