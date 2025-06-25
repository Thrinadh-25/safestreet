import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import API_URL from '../config/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'authority' | 'viewer';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      // TODO: Verify token with backend
      // For now, mock user data
      setUser({
        id: '1',
        email: 'admin@safestreet.com',
        name: 'Admin User',
        role: 'admin'
      });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // TODO: Replace with actual API call
      // const response = await axios.post(`${API_URL}/admin/login`, { email, password });
      // const { token, user } = response.data;
      
      // Mock login for demo
      const mockUser = {
        id: '1',
        email,
        name: 'Admin User',
        role: 'admin' as const
      };
      
      localStorage.setItem('adminToken', 'mock-admin-token');
      setUser(mockUser);
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};