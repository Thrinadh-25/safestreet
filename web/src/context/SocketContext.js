import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chatNotifications, setChatNotifications] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const { user } = useAuth();
  const token = localStorage.getItem('admin_auth_token');

  const connect = useCallback(() => {
    if (!token || socket) return;

    const newSocket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5030', {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      // Authenticate with the server
      newSocket.emit('authenticate', token);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    newSocket.on('authenticated', (userInfo) => {
      console.log('Authenticated:', userInfo);
    });

    newSocket.on('auth_error', (error) => {
      console.error('Authentication error:', error);
    });

    newSocket.on('chat_notification', (notification) => {
      setChatNotifications(prev => [notification, ...prev].slice(0, 10)); // Keep last 10 notifications
      
      // Update unread count for the specific tenant
      setUnreadCounts(prev => ({
        ...prev,
        [notification.tenantId]: (prev[notification.tenantId] || 0) + 1
      }));
    });

    newSocket.on('new_message', (message) => {
      // This will be handled by individual chat components
    });

    newSocket.on('user_typing', (data) => {
      // This will be handled by individual chat components
    });

    newSocket.on('messages_read', (data) => {
      // Reset unread count when messages are read
      if (data.tenantId) {
        setUnreadCounts(prev => ({
          ...prev,
          [data.tenantId]: 0
        }));
      }
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    setSocket(newSocket);
  }, [token, socket]);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  }, [socket]);

  const joinChat = useCallback((tenantId) => {
    if (socket && isConnected) {
      socket.emit('join_chat', tenantId);
    }
  }, [socket, isConnected]);

  const sendMessage = useCallback((tenantId, message, messageType = 'text', attachmentUrl = null) => {
    if (socket && isConnected) {
      socket.emit('send_message', {
        tenantId,
        message,
        messageType,
        attachmentUrl
      });
    }
  }, [socket, isConnected]);

  const markAsRead = useCallback((tenantId) => {
    if (socket && isConnected) {
      socket.emit('mark_read', tenantId);
      setUnreadCounts(prev => ({
        ...prev,
        [tenantId]: 0
      }));
    }
  }, [socket, isConnected]);

  const startTyping = useCallback((tenantId) => {
    if (socket && isConnected) {
      socket.emit('typing', { tenantId, isTyping: true });
    }
  }, [socket, isConnected]);

  const stopTyping = useCallback((tenantId) => {
    if (socket && isConnected) {
      socket.emit('typing', { tenantId, isTyping: false });
    }
  }, [socket, isConnected]);

  const clearNotification = useCallback((tenantId) => {
    setChatNotifications(prev => prev.filter(notif => notif.tenantId !== tenantId));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setChatNotifications([]);
  }, []);

  // Connect when user is authenticated
  useEffect(() => {
    if (user && token) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [user, token, connect, disconnect]);

  const value = {
    socket,
    isConnected,
    chatNotifications,
    unreadCounts,
    joinChat,
    sendMessage,
    markAsRead,
    startTyping,
    stopTyping,
    clearNotification,
    clearAllNotifications
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
