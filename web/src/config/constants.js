// Layout
export const DRAWER_WIDTH = 270;

// API
export const API_BASE_URL = 'http://localhost:5030/api';
export const API_ENDPOINTS = {
  DAMAGE_REPORTS: '/damage',
  REPAIRS: '/repairs',
  ANALYTICS: '/analytics',
  AUTH: '/admin/auth',
  PROFILE: '/admin/profile',
  ADMIN: '/admin',
  USERS: '/users',
  FIELD_WORKERS: '/field/workers',
  IMAGES: '/images',
  TENANTS: '/admin/tenants',
  AI: '/ai',
};

// Auth
export const TOKEN_KEY = 'admin_auth_token';
export const USER_KEY = 'admin_data';

// Date formats
export const DATE_FORMAT = 'yyyy-MM-dd';
export const DATE_TIME_FORMAT = 'yyyy-MM-dd HH:mm:ss';

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

// Chart colors
export const CHART_COLORS = {
  primary: '#2196f3',
  secondary: '#f50057',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#00bcd4'
};