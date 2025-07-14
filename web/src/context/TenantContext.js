import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { API_BASE_URL, API_ENDPOINTS, TOKEN_KEY, USER_KEY } from '../config/constants';

const TenantContext = createContext(null);

export const TenantProvider = ({ children }) => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  
  const fetchTenants = useCallback(async () => {
    if (!user || user.role !== 'super-admin') {
      setTenants([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem(TOKEN_KEY);
      
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TENANTS}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch tenants');
      }
      
      const data = await response.json();
      setTenants(data);
    } catch (err) {
      console.error('Error fetching tenants:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  useEffect(() => {
    if (user && user.role === 'super-admin') {
      fetchTenants();
    } else {
      setTenants([]);
      setLoading(false);
    }
  }, [user, fetchTenants]);
  
  const createTenant = async (tenantData) => {
    try {
      setError(null);
      const token = localStorage.getItem(TOKEN_KEY);
      
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TENANTS}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(tenantData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create tenant');
      }
      
      const data = await response.json();
      setTenants(prevTenants => [...prevTenants, data.tenant]);
      return data;
    } catch (err) {
      console.error('Error creating tenant:', err);
      setError(err.message);
      throw err;
    }
  };
  
  const updateTenant = async (tenantId, tenantData) => {
    try {
      setError(null);
      const token = localStorage.getItem(TOKEN_KEY);
      
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TENANTS}/${tenantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(tenantData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update tenant');
      }
      
      const data = await response.json();
      setTenants(prevTenants => 
        prevTenants.map(tenant => 
          tenant._id === tenantId ? data : tenant
        )
      );
      return data;
    } catch (err) {
      console.error('Error updating tenant:', err);
      setError(err.message);
      throw err;
    }
  };
  
  const deleteTenant = async (tenantId) => {
    try {
      setError(null);
      const token = localStorage.getItem(TOKEN_KEY);
      
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TENANTS}/${tenantId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete tenant');
      }
      
      setTenants(prevTenants => 
        prevTenants.filter(tenant => tenant._id !== tenantId)
      );
      return true;
    } catch (err) {
      console.error('Error deleting tenant:', err);
      setError(err.message);
      throw err;
    }
  };
  
  const value = {
    tenants,
    loading,
    error,
    fetchTenants,
    createTenant,
    updateTenant,
    deleteTenant,
  };
  
  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === null) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
