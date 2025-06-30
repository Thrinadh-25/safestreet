import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Pagination,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Search,
  PersonAdd,
  Edit,
  Delete,
  Block,
  CheckCircle,
  Email,
  Phone,
} from '@mui/icons-material';
import { User } from '../types';
import { format } from 'date-fns';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  
  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  useEffect(() => {
    loadUsers();
  }, [searchTerm, pagination.currentPage]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Mock data for demonstration
      const mockUsers: User[] = [
        {
          id: '1',
          fullName: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          createdAt: '2024-01-15T10:30:00Z',
          isActive: true,
          lastLogin: '2024-01-20T14:22:00Z',
        },
        {
          id: '2',
          fullName: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '+1 (555) 987-6543',
          createdAt: '2024-01-10T09:15:00Z',
          isActive: true,
          lastLogin: '2024-01-19T16:45:00Z',
        },
        {
          id: '3',
          fullName: 'Mike Johnson',
          email: 'mike.johnson@example.com',
          phone: '+1 (555) 456-7890',
          createdAt: '2024-01-05T11:20:00Z',
          isActive: false,
          lastLogin: '2024-01-18T10:30:00Z',
        },
        {
          id: '4',
          fullName: 'Sarah Wilson',
          email: 'sarah.wilson@example.com',
          phone: '+1 (555) 321-0987',
          createdAt: '2024-01-12T15:45:00Z',
          isActive: true,
          lastLogin: '2024-01-21T09:15:00Z',
        },
        {
          id: '5',
          fullName: 'David Brown',
          email: 'david.brown@example.com',
          createdAt: '2024-01-08T13:30:00Z',
          isActive: true,
          lastLogin: '2024-01-20T11:20:00Z',
        },
      ];
      
      // Filter users based on search term
      const filteredUsers = mockUsers.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setUsers(filteredUsers);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: filteredUsers.length,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setDetailDialogOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    
    try {
      // In production, make API call to delete user
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
    }
  };

  const handleToggleUserStatus = async (user: User) => {
    try {
      // In production, make API call to toggle user status
      setUsers(prev => prev.map(u => 
        u.id === user.id ? { ...u, isActive: !u.isActive } : u
      ));
    } catch (err: any) {
      setError(err.message || 'Failed to update user status');
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            User Management
          </Typography>
          <Typography variant="body1" sx={{ color: '#6c757d' }}>
            Manage user accounts and permissions
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          sx={{
            borderRadius: 2,
            background: 'linear-gradient(135deg, #007AFF 0%, #0A84FF 100%)',
            boxShadow: '0 4px 12px rgba(0,122,255,0.3)',
          }}
        >
          Add User
        </Button>
      </Box>

      {/* Search */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: 3 }}>
          <TextField
            fullWidth
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#6c757d' }} />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Users Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #f0f0f0',
          }}
        >
          <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Contact</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Joined</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Last Login</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    sx={{
                      '&:hover': {
                        bgcolor: '#f8f9fa',
                      },
                    }}
                  >
                    <TableCell sx={{ py: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: '#007AFF',
                            fontSize: '1rem',
                            fontWeight: 600,
                          }}
                        >
                          {user.fullName.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {user.fullName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#6c757d' }}>
                            ID: {user.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell sx={{ py: 2 }}>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Email sx={{ fontSize: 14, color: '#6c757d' }} />
                          <Typography variant="body2">{user.email}</Typography>
                        </Box>
                        {user.phone && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Phone sx={{ fontSize: 14, color: '#6c757d' }} />
                            <Typography variant="body2" sx={{ color: '#6c757d' }}>
                              {user.phone}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    
                    <TableCell sx={{ py: 2 }}>
                      <Chip
                        icon={user.isActive ? <CheckCircle /> : <Block />}
                        label={user.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        sx={{
                          bgcolor: user.isActive ? '#34c75915' : '#ff3b3015',
                          color: user.isActive ? '#34c759' : '#ff3b30',
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2">
                        {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                      </Typography>
                    </TableCell>
                    
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ color: '#6c757d' }}>
                        {user.lastLogin 
                          ? format(new Date(user.lastLogin), 'MMM dd, HH:mm')
                          : 'Never'
                        }
                      </Typography>
                    </TableCell>
                    
                    <TableCell sx={{ py: 2 }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(user)}
                          sx={{ color: '#007AFF' }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleUserStatus(user)}
                          sx={{ color: user.isActive ? '#ff9500' : '#34c759' }}
                        >
                          {user.isActive ? <Block /> : <CheckCircle />}
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(user)}
                          sx={{ color: '#ff3b30' }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {users.length === 0 && !loading && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" sx={{ color: '#6c757d' }}>
                No users found
              </Typography>
            </Box>
          )}
        </Card>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.currentPage}
            onChange={(_, page) => setPagination(prev => ({ ...prev, currentPage: page }))}
            color="primary"
          />
        </Box>
      )}

      {/* User Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: '#007AFF',
                      fontSize: '2rem',
                      fontWeight: 600,
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {selectedUser.fullName.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {selectedUser.fullName}
                  </Typography>
                
                  <Chip
                    icon={selectedUser.isActive ? <CheckCircle /> : <Block />}
                    label={selectedUser.isActive ? 'Active' : 'Inactive'}
                    size="small"
                    sx={{
                      bgcolor: selectedUser.isActive ? '#34c75915' : '#ff3b3015',
                      color: selectedUser.isActive ? '#34c759' : '#ff3b30',
                      fontWeight: 600,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#6c757d', mb: 1 }}>
                      <strong>Email:</strong>
                    </Typography>
                    <Typography variant="body1">{selectedUser.email}</Typography>
                  </Box>
                  
                  {selectedUser.phone && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: '#6c757d', mb: 1 }}>
                        <strong>Phone:</strong>
                      </Typography>
                      <Typography variant="body1">{selectedUser.phone}</Typography>
                    </Box>
                  )}
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#6c757d', mb: 1 }}>
                      <strong>Member Since:</strong>
                    </Typography>
                    <Typography variant="body1">
                      {format(new Date(selectedUser.createdAt), 'MMMM dd, yyyy')}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#6c757d', mb: 1 }}>
                      <strong>Last Login:</strong>
                    </Typography>
                    <Typography variant="body1">
                      {selectedUser.lastLogin 
                        ? format(new Date(selectedUser.lastLogin), 'MMMM dd, yyyy • HH:mm')
                        : 'Never logged in'
                      }
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
          <Button variant="contained" color="primary">
            Edit User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this user? This action cannot be undone and will remove all associated data.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;