import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Person as PersonIcon,
  Search as SearchIcon,
  Chat as ChatIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { useSocket } from '../../context/SocketContext';
import { chatService } from '../../services/chatService';
import { useAuth } from '../../hooks/useAuth';

const ChatRoomsList = ({ onSelectRoom, selectedRoomId }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { chatNotifications, unreadCounts, clearNotification } = useSocket();
  const { user } = useAuth();

  // Load chat rooms
  const loadChatRooms = useCallback(async () => {
    try {
      setLoading(true);
      
      console.log('User data for chat:', user); // Debug log
      
      // Test auth first
      try {
        const authTest = await chatService.testAuth();
        console.log('Auth test result:', authTest);
      } catch (authError) {
        console.error('Auth test failed:', authError);
        if (authError.response?.status === 401) {
          setError('Authentication failed. Please log in again.');
          // Could also trigger a logout here
          return;
        } else {
          setError('Connection failed. Please check your internet connection.');
          return;
        }
      }
      
      let rooms = [];
      
      if (user.role === 'super-admin') {
        // Super admin sees all tenant chats
        rooms = await chatService.getAllChatRooms();
      } else {
        // Tenant admin sees their support chat with super admin
        rooms = await chatService.getTenantChatRooms();
      }
      
      setChatRooms(rooms);
    } catch (err) {
      console.error('Error loading chat rooms:', err);
      setError('Failed to load chat rooms');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadChatRooms();
  }, [loadChatRooms]);

  // Filter rooms based on search
  const filteredRooms = chatRooms.filter(room => {
    if (user.role === 'super-admin') {
      return room.tenantName.toLowerCase().includes(searchTerm.toLowerCase());
    } else {
      // For tenant admin, show the support contact name
      return (room.contactName || 'Super Administrator').toLowerCase().includes(searchTerm.toLowerCase());
    }
  });

  // Handle room selection
  const handleRoomSelect = (room) => {
    onSelectRoom(room);
    clearNotification(room.tenantId);
  };

  // Get unread count for a room
  const getUnreadCount = (tenantId) => {
    return unreadCounts[tenantId] || 0;
  };

  // Format last message time
  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        height: 600, 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* Header */}
      <Box sx={{ 
        p: 3, 
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
      }}>
        <Typography variant="h6" sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          mb: 2,
          fontWeight: 600,
          color: 'text.primary'
        }}>
          <ChatIcon sx={{ color: 'primary.main' }} />
          {user.role === 'super-admin' ? 'All Tenant Chats' : 'Support Chat'}
        </Typography>
        
        {user.role === 'super-admin' && chatRooms.length > 0 && (
          <TextField
            fullWidth
            size="small"
            placeholder="Search tenants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                '& fieldset': {
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />
        )}
      </Box>

      {/* Chat Rooms List */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(0, 0, 0, 0.05)',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '3px',
          '&:hover': {
            background: 'rgba(0, 0, 0, 0.3)',
          },
        },
      }}>
        {filteredRooms.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <ChatIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
              {searchTerm ? 'No matching chats found' : 'No chats available'}
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {filteredRooms.map((room, index) => {
              const isSelected = selectedRoomId === room.tenantId;
              const unreadCount = getUnreadCount(room.tenantId);
              
              return (
                <React.Fragment key={room._id}>
                  <ListItem disablePadding>
                    <ListItemButton
                      selected={isSelected}
                      onClick={() => handleRoomSelect(room)}
                      sx={{ 
                        py: 2.5,
                        px: 3,
                        borderRadius: 0,
                        '&.Mui-selected': {
                          bgcolor: 'rgba(25, 118, 210, 0.1)',
                          borderRight: '4px solid',
                          borderRightColor: 'primary.main',
                        },
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 0.04)',
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      <ListItemAvatar>
                        <Badge 
                          badgeContent={unreadCount} 
                          color="error"
                          sx={{
                            '& .MuiBadge-badge': {
                              fontSize: '0.7rem',
                              minWidth: '18px',
                              height: '18px',
                              fontWeight: 600,
                            }
                          }}
                        >
                          <Avatar 
                            sx={{ 
                              bgcolor: 'primary.main',
                              width: 48,
                              height: 48,
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            }}
                          >
                            <PersonIcon />
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      
                      <ListItemText
                        sx={{ ml: 1 }}
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography 
                              variant="subtitle1" 
                              sx={{ 
                                fontWeight: isSelected ? 600 : 500,
                                fontSize: '0.95rem',
                                color: 'text.primary'
                              }}
                            >
                              {user.role === 'super-admin' ? room.tenantName : (room.contactName || 'Super Administrator')}
                            </Typography>
                            <Chip 
                              label={user.role === 'super-admin' ? 'Tenant' : 'Support'}
                              size="small"
                              sx={{ 
                                height: 22, 
                                fontSize: '0.7rem',
                                fontWeight: 500,
                                bgcolor: 'primary.main',
                                color: 'white',
                                '& .MuiChip-label': {
                                  px: 1.5
                                }
                              }}
                            />
                          </Box>
                        }
                        secondary={
                          room.lastMessage ? (
                            <Box sx={{ mt: 0.5 }}>
                              <Typography 
                                variant="body2" 
                                noWrap 
                                sx={{ 
                                  maxWidth: '220px',
                                  fontSize: '0.85rem',
                                  color: 'text.secondary'
                                }}
                              >
                                <strong>{room.lastMessage.senderName}:</strong> {room.lastMessage.message}
                              </Typography>
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  color: 'text.disabled',
                                  fontSize: '0.75rem'
                                }}
                              >
                                {formatLastMessageTime(room.lastMessage.timestamp)}
                              </Typography>
                            </Box>
                          ) : (
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: 'text.disabled',
                                fontSize: '0.85rem',
                                fontStyle: 'italic'
                              }}
                            >
                              No messages yet
                            </Typography>
                          )
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  {index < filteredRooms.length - 1 && (
                    <Divider sx={{ ml: 9, opacity: 0.5 }} />
                  )}
                </React.Fragment>
              );
            })}
          </List>
        )}
      </Box>

      {/* Notifications indicator */}
      {chatNotifications.length > 0 && (
        <Box sx={{ 
          p: 2, 
          background: 'rgba(33, 150, 243, 0.1)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(33, 150, 243, 0.2)',
          borderRadius: '0 0 12px 12px'
        }}>
          <Typography variant="caption" sx={{ 
            color: 'primary.main',
            fontSize: '0.8rem',
            fontWeight: 500
          }}>
            {chatNotifications.length} new notification{chatNotifications.length > 1 ? 's' : ''}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ChatRoomsList;
