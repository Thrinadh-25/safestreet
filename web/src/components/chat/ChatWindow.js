import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  Avatar,
  Chip,
  InputAdornment,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Send as SendIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { format, isToday, isYesterday } from 'date-fns';
import { useSocket } from '../../context/SocketContext';
import { chatService } from '../../services/chatService';
import { useAuth } from '../../hooks/useAuth';

const ChatWindow = ({ tenantId, tenantName, contactName, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { socket, joinChat, markAsRead, startTyping, stopTyping } = useSocket();
  const { user } = useAuth();

  // Format message timestamp
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'MMM dd, HH:mm');
    }
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load messages
  const loadMessages = useCallback(async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const response = await chatService.getChatMessages(tenantId, pageNum);
      
      if (append) {
        setMessages(prev => [...response.messages, ...prev]);
      } else {
        setMessages(response.messages);
        setTimeout(scrollToBottom, 100);
      }
      
      setHasMore(response.hasMore);
      setPage(pageNum);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [tenantId]);

  // Load more messages
  const loadMoreMessages = () => {
    if (hasMore && !loadingMore) {
      loadMessages(page + 1, true);
    }
  };

  // Handle sending message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const messageText = newMessage.trim();
    setNewMessage('');

    try {
      // Send via API only (socket will receive the message via backend broadcast)
      await chatService.sendMessage(tenantId, {
        message: messageText,
        messageType: 'text'
      });
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
      setNewMessage(messageText); // Restore message on error
    } finally {
      setSending(false);
    }
  };

  // Handle typing
  const handleTyping = () => {
    startTyping(tenantId);
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Stop typing after 3 seconds
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(tenantId);
    }, 3000);
  };

  // Initialize chat
  useEffect(() => {
    if (tenantId) {
      joinChat(tenantId);
      loadMessages();
      markAsRead(tenantId);
    }
  }, [tenantId, joinChat, loadMessages, markAsRead]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      if (message.chatId === `tenant_${tenantId}`) {
        setMessages(prev => [...prev, message]);
        setTimeout(scrollToBottom, 100);
        
        // Mark as read if not from current user
        if (message.senderId !== user._id && message.senderId !== user.id) {
          markAsRead(tenantId);
        }
      }
    };

    const handleUserTyping = (data) => {
      if (data.userId !== user._id && data.userId !== user.id) {
        setTypingUsers(prev => {
          if (data.isTyping) {
            return prev.includes(data.userName) ? prev : [...prev, data.userName];
          } else {
            return prev.filter(name => name !== data.userName);
          }
        });
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('user_typing', handleUserTyping);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('user_typing', handleUserTyping);
    };
  }, [socket, tenantId, user._id, user.id, markAsRead]);

  // Cleanup typing timeout
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <CircularProgress />
      </Box>
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* Header */}
      <Box sx={{ 
        p: 3, 
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between' 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            sx={{ 
              bgcolor: 'primary.main',
              width: 48,
              height: 48,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
            }}
          >
            <PersonIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {user.role === 'super-admin' ? tenantName : (contactName || 'Super Administrator')}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
              {user.role === 'super-admin' ? 'Tenant Admin Chat' : 'Support Chat'}
            </Typography>
          </Box>
        </Box>
        <IconButton 
          onClick={onClose}
          sx={{ 
            bgcolor: 'rgba(0, 0, 0, 0.05)',
            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.1)' }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Messages */}
      <Box 
        ref={messagesContainerRef}
        sx={{ 
          flex: 1, 
          overflow: 'auto', 
          p: 2,
          display: 'flex',
          flexDirection: 'column',
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
        }}
        onScroll={(e) => {
          const { scrollTop } = e.target;
          if (scrollTop === 0 && hasMore) {
            loadMoreMessages();
          }
        }}
      >
        {loadingMore && (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress size={24} sx={{ color: 'primary.main' }} />
          </Box>
        )}

        <List sx={{ flex: 1, py: 0 }}>
          {messages.map((message, index) => {
            const isOwn = message.senderId === user._id || message.senderId === user.id;
            const showTime = index === 0 || 
              new Date(messages[index - 1].createdAt).getTime() < new Date(message.createdAt).getTime() - 300000; // 5 minutes

            return (
              <ListItem
                key={message._id}
                sx={{
                  flexDirection: 'column',
                  alignItems: isOwn ? 'flex-end' : 'flex-start',
                  py: 1,
                  px: 0
                }}
              >
                {showTime && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'text.secondary', 
                      mb: 1, 
                      fontSize: '0.75rem',
                      opacity: 0.7
                    }}
                  >
                    {formatMessageTime(message.createdAt)}
                  </Typography>
                )}
                
                <Box
                  sx={{
                    maxWidth: '75%',
                    bgcolor: isOwn 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                      : 'rgba(255, 255, 255, 0.9)',
                    color: isOwn ? 'white' : 'text.primary',
                    p: 2,
                    borderRadius: isOwn ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                    border: isOwn ? 'none' : '1px solid rgba(0, 0, 0, 0.05)',
                    background: isOwn 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                      : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    position: 'relative',
                    '&::before': isOwn ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      right: -6,
                      width: 0,
                      height: 0,
                      borderLeft: '6px solid transparent',
                      borderTop: '6px solid',
                      borderTopColor: 'inherit',
                    } : {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: -6,
                      width: 0,
                      height: 0,
                      borderRight: '6px solid rgba(255, 255, 255, 0.9)',
                      borderTop: '6px solid transparent',
                    }
                  }}
                >
                  {!isOwn && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      {message.senderRole === 'super_admin' ? (
                        <AdminIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                      ) : (
                        <PersonIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                      )}
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        {message.senderName}
                      </Typography>
                      <Chip 
                        label={message.senderRole === 'super_admin' ? 'Super Admin' : 'Tenant Admin'}
                        size="small"
                        sx={{ 
                          height: 18, 
                          fontSize: '0.65rem',
                          bgcolor: 'primary.main',
                          color: 'white',
                          fontWeight: 500
                        }}
                      />
                    </Box>
                  )}
                  
                  <Typography variant="body2" sx={{ fontSize: '0.9rem', lineHeight: 1.4 }}>
                    {message.message}
                  </Typography>
                </Box>
              </ListItem>
            );
          })}
        </List>

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <Box sx={{ 
            px: 3, 
            py: 2,
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            margin: '0 16px 8px',
            border: '1px solid rgba(0, 0, 0, 0.05)'
          }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary', 
                fontStyle: 'italic',
                fontSize: '0.8rem'
              }}
            >
              {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
            </Typography>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* Error display */}
      {error && (
        <Alert 
          severity="error" 
          onClose={() => setError(null)} 
          sx={{ 
            m: 2,
            borderRadius: 2,
            '& .MuiAlert-message': {
              fontSize: '0.9rem'
            }
          }}
        >
          {error}
        </Alert>
      )}

      {/* Message input */}
      <Box sx={{ 
        p: 3, 
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(0, 0, 0, 0.08)'
      }}>
        <TextField
          fullWidth
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={sending}
          multiline
          maxRows={4}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '24px',
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              '& fieldset': {
                borderColor: 'rgba(0, 0, 0, 0.1)',
              },
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
                borderWidth: '2px',
              },
            },
            '& .MuiOutlinedInput-input': {
              fontSize: '0.95rem',
              '&::placeholder': {
                opacity: 0.7,
              },
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sending}
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    width: 40,
                    height: 40,
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '&.Mui-disabled': {
                      bgcolor: 'rgba(0, 0, 0, 0.1)',
                      color: 'rgba(0, 0, 0, 0.3)',
                    },
                  }}
                >
                  {sending ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Paper>
  );
};

export default ChatWindow;
