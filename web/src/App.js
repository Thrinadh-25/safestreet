<<<<<<< HEAD
=======



>>>>>>> back
// import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { ThemeProvider, CssBaseline } from '@mui/material';
// import { LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
<<<<<<< HEAD
// import { AuthProvider } from './hooks/useAuth';
// import { TenantProvider } from './context/TenantContext';
// import { SearchProvider } from './context/SearchContext';
// import { SocketProvider } from './context/SocketContext';
=======
// import { AuthProvider, useAuth } from './hooks/useAuth'; // 👈 import useAuth here
// import { TenantProvider } from './context/TenantContext';
// import { SearchProvider } from './context/SearchContext';
// // import { SocketProvider } from './context/SocketContext'; // 🔧 Temporarily disabled
>>>>>>> back

// // Theme
// import theme from './theme';

// // Layout
// import MainLayout from './components/layout/MainLayout';

// // Pages
// import Dashboard from './pages/Dashboard';
// import Reports from './pages/Reports';
// import Analytics from './pages/Analytics';
// import Repair from './pages/Repairs';
<<<<<<< HEAD
// import Login from './pages/Login';
=======
// //import Repair from './pages/Register';

// import Login from './pages/Login';
// import Register from './pages/Register';
>>>>>>> back
// import Profile from './pages/Profile';
// import AiAnalysis from './pages/AiAnalysis';
// import ManageTenants from './pages/ManageTenants';
// import TenantDetails from './pages/TenantDetails';
// import SearchResults from './pages/SearchResults';

<<<<<<< HEAD
=======
// const AppRoutes = () => {
//   const { isAuthenticated } = useAuth(); // 👈 authentication check

//   return (
//     <Routes>
//       {/* Login Route */}
//       <Route path="/login" element={<Login />} />

//       {/* Default Home: Redirect to dashboard if authenticated */}
//       <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />

//       {/* Main Authenticated Routes */}
//       <Route element={<MainLayout />}>
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/reports" element={<Reports />} />
//         <Route path="/analytics" element={<Analytics />} />
//         <Route path="/repairs" element={<Repair />} />
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/ai-analysis" element={<AiAnalysis />} />
//         <Route path="/search-results" element={<SearchResults />} />
//         <Route path="/tenants" element={<ManageTenants />} />
//         <Route path="/tenants/:tenantId" element={<TenantDetails />} />
//       </Route>

//       {/* Catch All */}
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// };

>>>>>>> back
// function App() {
//   return (
//     <BrowserRouter>
//       <ThemeProvider theme={theme}>
//         <LocalizationProvider dateAdapter={AdapterDateFns}>
//           <CssBaseline />
//           <AuthProvider>
//             <TenantProvider>
//               <SearchProvider>
<<<<<<< HEAD
//                 <SocketProvider>
//                   <Routes>
//                     <Route path="/login" element={<Login />} />
//                     <Route path="/" element={<Navigate to="/login" replace />} />
                    
//                     <Route element={<MainLayout />}>

//                       <Route path="/Dashboard" element={<Dashboard />} />
//                       <Route path="/reports" element={<Reports />} />
//                       <Route path="/analytics" element={<Analytics />} />
//                       <Route path="/repairs" element={<Repair />} />                      
//                       <Route path="/profile" element={<Profile />} />
//                       <Route path="/ai-analysis" element={<AiAnalysis />} />
//                       <Route path="/search-results" element={<SearchResults />} />
//                       {/* Tenant Management */}
//                       <Route path="/tenants" element={<ManageTenants />} />
//                       <Route path="/tenants/:tenantId" element={<TenantDetails />} />
//                     </Route>
      
//                     {/* Catch all route */}
//                     <Route path="*" element={<Navigate to="/" replace />} />
//                   </Routes>
//                 </SocketProvider>
=======
//                 {/* <SocketProvider> */}
//                   <AppRoutes />
//                 {/* </SocketProvider> */}
>>>>>>> back
//               </SearchProvider>
//             </TenantProvider>
//           </AuthProvider>
//         </LocalizationProvider>
//       </ThemeProvider>
//     </BrowserRouter>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
<<<<<<< HEAD
import { AuthProvider, useAuth } from './hooks/useAuth'; // 👈 import useAuth here
import { TenantProvider } from './context/TenantContext';
import { SearchProvider } from './context/SearchContext';
// import { SocketProvider } from './context/SocketContext'; // 🔧 Temporarily disabled

// Theme
=======
import { AuthProvider, useAuth } from './hooks/useAuth';
import { TenantProvider } from './context/TenantContext';
import { SearchProvider } from './context/SearchContext';
// import { SocketProvider } from './context/SocketContext';

>>>>>>> back
import theme from './theme';

// Layout
import MainLayout from './components/layout/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import Repair from './pages/Repairs';
import Login from './pages/Login';
<<<<<<< HEAD
=======
import Register from './pages/Register';
>>>>>>> back
import Profile from './pages/Profile';
import AiAnalysis from './pages/AiAnalysis';
import ManageTenants from './pages/ManageTenants';
import TenantDetails from './pages/TenantDetails';
import SearchResults from './pages/SearchResults';

const AppRoutes = () => {
<<<<<<< HEAD
  const { isAuthenticated } = useAuth(); // 👈 authentication check

  return (
    <Routes>
      {/* Login Route */}
      <Route path="/login" element={<Login />} />

      {/* Default Home: Redirect to dashboard if authenticated */}
      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />

      {/* Main Authenticated Routes */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/repairs" element={<Repair />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/ai-analysis" element={<AiAnalysis />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/tenants" element={<ManageTenants />} />
        <Route path="/tenants/:tenantId" element={<TenantDetails />} />
      </Route>

      {/* Catch All */}
=======
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Default: Redirect based on auth status */}
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
      />

      {/* Protected Routes */}
      {isAuthenticated && (
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/repairs" element={<Repair />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ai-analysis" element={<AiAnalysis />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/tenants" element={<ManageTenants />} />
          <Route path="/tenants/:tenantId" element={<TenantDetails />} />
        </Route>
      )}

      {/* Catch-all route */}
>>>>>>> back
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline />
          <AuthProvider>
            <TenantProvider>
              <SearchProvider>
                {/* <SocketProvider> */}
                  <AppRoutes />
                {/* </SocketProvider> */}
              </SearchProvider>
            </TenantProvider>
          </AuthProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
