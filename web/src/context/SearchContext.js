import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { API_ENDPOINTS } from '../config/constants';

// Create search context
const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState({
    reports: [],
    fieldWorkers: [],
    analytics: [],
    repairs: [],
  });
  const [isSearching, setIsSearching] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const navigate = useNavigate();

  // Function to perform global search
  const performSearch = useCallback(async (term) => {
    if (!term.trim()) return;
    
    setIsSearching(true);
    setSearchTerm(term);
    
    try {
      const response = await api.get(`${API_ENDPOINTS.DAMAGE_REPORTS}/search?q=${encodeURIComponent(term)}`);
      
      // Fix: Extract data directly from the response, which is already parsed by our api utility
      setSearchResults({
        reports: response?.reports || [],
        fieldWorkers: response?.fieldWorkers || [],
        analytics: response?.analytics || [],
        repairs: response?.repairs || [],
      });
      
      setSearchPerformed(true);
      navigate('/search-results');
    } catch (error) {
      console.error('Search error:', error);
      // Set empty results on error to prevent displaying stale data
      setSearchResults({
        reports: [],
        fieldWorkers: [],
        analytics: [],
        repairs: [],
      });
    } finally {
      setIsSearching(false);
    }
  }, [navigate]);

  // Clear search results
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setSearchResults({
      reports: [],
      fieldWorkers: [],
      analytics: [],
      repairs: [],
    });
    setSearchPerformed(false);
  }, []);

  const value = {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    searchPerformed,
    performSearch,
    clearSearch,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};
