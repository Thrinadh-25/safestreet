import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5030';

// Create axios instance with default config
const chatAPI = axios.create({
  baseURL: `${API_URL}/api/chat`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
chatAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_auth_token');
  console.log('Chat API request - Token found:', !!token, 'URL:', config.url);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('No auth token found for chat API request');
  }
  return config;
});

// Add response interceptor to handle auth errors
chatAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Chat API error:', error.response?.status, error.response?.data?.message);
    if (error.response?.status === 401) {
      console.error('Authentication failed in chat API');
      // Could redirect to login or show error
    }
    return Promise.reject(error);
  }
);

export const chatService = {
  // Test auth
  testAuth: async () => {
    const response = await chatAPI.get('/test');
    return response.data;
  },

  // Get all chat rooms (for super admin)
  getAllChatRooms: async () => {
    const response = await chatAPI.get('/rooms');
    return response.data;
  },

  // Get tenant chat rooms (for tenant admins)
  getTenantChatRooms: async () => {
    const response = await chatAPI.get('/tenant-rooms');
    return response.data;
  },

  // Get or create chat room for a tenant
  getChatRoom: async (tenantId) => {
    const response = await chatAPI.get(`/room/${tenantId}`);
    return response.data;
  },

  // Get messages for a chat room
  getChatMessages: async (tenantId, page = 1, limit = 50) => {
    const response = await chatAPI.get(`/room/${tenantId}/messages`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Send a message
  sendMessage: async (tenantId, messageData) => {
    const response = await chatAPI.post(`/room/${tenantId}/message`, messageData);
    return response.data;
  },

  // Mark messages as read
  markMessagesAsRead: async (tenantId) => {
    const response = await chatAPI.put(`/room/${tenantId}/read`);
    return response.data;
  },

  // Get chat rooms based on user role (enhanced version)
  getChatRoomsByRole: async () => {
    const response = await chatAPI.get('/rooms-by-role');
    return response.data;
  },
};

export default chatService;
