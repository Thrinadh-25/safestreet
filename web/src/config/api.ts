const API_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5000/api'
  : 'https://your-production-api.com/api';

export default API_URL;

export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  
  // User
  PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
  DELETE_ACCOUNT: '/user/delete',
  
  // Uploads
  UPLOADS: '/uploads',
  UPLOAD_DETAIL: (id: string) => `/uploads/${id}`,
  DELETE_UPLOAD: (id: string) => `/uploads/${id}`,
  
  // Dashboard
  DASHBOARD_STATS: '/dashboard/stats',
  
  // Admin (future)
  USERS: '/admin/users',
  SYSTEM_STATS: '/admin/stats',
} as const;