import React, { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, CardActions,
  Button, Chip, Divider, IconButton, Tooltip, alpha,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem,
  FormHelperText, Avatar, useTheme, Paper
} from '@mui/material';
import {
  AssignmentInd,
  LocationOn,
  AccessTime,
  Refresh,
  CheckCircle
} from '@mui/icons-material';

function PendingAssignments({ pendingRepairs = [], fieldWorkers = [], onAssignRepair = () => {} }) {
  const theme = useTheme();
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState('');
  const [assignmentNotes, setAssignmentNotes] = useState('');

  const handleAssignDialogOpen = (repair) => {
    setSelectedRepair(repair);
    setAssignDialogOpen(true);
  };

  const handleAssignDialogClose = () => {
    setAssignDialogOpen(false);
    setSelectedWorker('');
    setAssignmentNotes('');
    setSelectedRepair(null);
  };

  const handleAssignRepair = () => {
    if (!selectedRepair || !selectedWorker) return;
    
    // Call the parent handler with the correct parameters
    onAssignRepair(selectedRepair._id || selectedRepair.id, selectedWorker, assignmentNotes);
    handleAssignDialogClose();
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Low': return theme.palette.info.main;
      case 'Medium': return theme.palette.warning.main;
      case 'High': return theme.palette.error.main;
      case 'Critical': return theme.palette.secondary.main;
      default: return theme.palette.grey[500];
    }
  };

  return (
    <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Pending Damage Reports
        </Typography>
        <Tooltip title="Refresh">
          <IconButton>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>
      <Divider sx={{ mb: 2 }} />

      {pendingRepairs.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <CheckCircle color="success" sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h6">No pending repairs</Typography>
          <Typography variant="body2" color="text.secondary">
            All damage reports have been assigned
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {pendingRepairs.map((repair) => (
            <Grid item xs={12} md={6} lg={4} key={repair._id || repair.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderLeft: `4px solid ${getSeverityColor(repair.severity)}`,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {repair.reportId || repair._id || repair.id}
                    </Typography>
                    <Chip
                      size="small"
                      label={repair.severity}
                      sx={{
                        bgcolor: alpha(getSeverityColor(repair.severity), 0.1),
                        color: getSeverityColor(repair.severity),
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <LocationOn fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    {repair.region} Region
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <AccessTime fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    Reported: {repair.dateReported ? new Date(repair.dateReported).toLocaleDateString() : '-'}
                  </Typography>

                  <Divider sx={{ my: 1 }} />

                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Type:</strong> {repair.damageType}
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Reporter:</strong> {repair.reporter}
                  </Typography>

                  <Typography variant="body2">
                    <strong>Description:</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {repair.description && repair.description.length > 100 
                      ? `${repair.description.substring(0, 100)}...` 
                      : repair.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    startIcon={<AssignmentInd />}
                    fullWidth
                    onClick={() => handleAssignDialogOpen(repair)}
                  >
                    Assign Repair
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Assignment Dialog */}
      <Dialog open={assignDialogOpen} onClose={handleAssignDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Repair Task</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, mt: 1 }}>
            <Typography variant="subtitle1">
              Damage Report: {selectedRepair?.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedRepair?.description}
            </Typography>
          </Box>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Assign to Field Worker</InputLabel>
            <Select
              value={selectedWorker}
              label="Assign to Field Worker"
              onChange={(e) => {
                console.log('Selected worker:', e.target.value);
                setSelectedWorker(e.target.value);
              }}
            >
              {fieldWorkers.map(worker => (
                <MenuItem
                  key={worker.id}
                  value={worker.id}
                  disabled={worker.status === 'Busy'}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        mr: 1,
                        bgcolor: worker.status === 'Available' ? theme.palette.success.main : theme.palette.warning.main
                      }}
                    >
                      {worker.name
                        ? worker.name.split(' ').map(n => n[0]).join('')
                        : '?'}
                    </Avatar>
                    <Box>
                      {worker.name}
                      <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                        {worker.specialization} • {worker.region} • {worker.activeAssignments ?? 0} active tasks
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select an available field worker to assign this repair task</FormHelperText>
          </FormControl>

          <TextField
            label="Assignment Notes"
            multiline
            rows={4}
            fullWidth
            value={assignmentNotes}
            onChange={(e) => setAssignmentNotes(e.target.value)}
            placeholder="Add any specific instructions or notes for the field worker..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAssignDialogClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAssignRepair}
            disabled={!selectedWorker}
          >
            Assign Task
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default PendingAssignments;
