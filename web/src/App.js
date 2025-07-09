import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AuthProvider } from './hooks/useAuth';
import { TenantProvider } from './context/TenantContext';
import { SearchProvider } from './context/SearchContext';
import { SocketProvider } from './context/SocketContext';

// Theme
import theme from './theme';

// Layout
import MainLayout from './components/layout/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import MapView from './pages/MapView';
import Analytics from './pages/Analytics';
import Repair from './pages/Repair';
import Historical from './pages/Historical';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AiAnalysis from './pages/AiAnalysis';
import ManageTenants from './pages/ManageTenants';
import TenantDetails from './pages/TenantDetails';
import SearchResults from './pages/SearchResults';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline />
          <AuthProvider>
            <TenantProvider>
              <SearchProvider>
                <SocketProvider>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    
                    <Route element={<MainLayout />}>
                      <Route index element={<Dashboard />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/map" element={<MapView />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/repairs" element={<Repair />} />
                      <Route path="/historical" element={<Historical />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/ai-analysis" element={<AiAnalysis />} />
                      <Route path="/search-results" element={<SearchResults />} />
                      {/* Tenant Management */}
                      <Route path="/tenants" element={<ManageTenants />} />
                      <Route path="/tenants/:tenantId" element={<TenantDetails />} />
                    </Route>
      
                    {/* Catch all route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </SocketProvider>
              </SearchProvider>
            </TenantProvider>
          </AuthProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

