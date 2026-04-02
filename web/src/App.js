import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { AuthProvider } from "./hooks/useAuth";
import { TenantProvider } from "./context/TenantContext";
import { SearchProvider } from "./context/SearchContext";

import ProtectedRoute from "./routes/ProtectedRoute";
import theme from "./theme";

// Layout
import MainLayout from "./components/layout/MainLayout";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import Repairs from "./pages/Repairs";
import Profile from "./pages/Profile";
import AiAnalysis from "./pages/AiAnalysis";
import ManageTenants from "./pages/ManageTenants";
import TenantDetails from "./pages/TenantDetails";
import SearchResults from "./pages/SearchResults";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline />
          <AuthProvider>
            <TenantProvider>
              <SearchProvider>
                <Routes>
                  {/* Public */}
                  <Route path="/login" element={<Login />} />

                  {/* Protected */}
                  <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/repairs" element={<Repairs />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/ai-analysis" element={<AiAnalysis />} />
                      <Route path="/search-results" element={<SearchResults />} />
                      <Route path="/tenants" element={<ManageTenants />} />
                      <Route path="/tenants/:tenantId" element={<TenantDetails />} />
                    </Route>
                  </Route>

                  {/* Default */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </SearchProvider>
            </TenantProvider>
          </AuthProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
