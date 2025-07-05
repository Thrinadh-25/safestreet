import { useState, useEffect } from 'react';
import { Box, Button, Typography, Alert, Paper } from '@mui/material';
import { chatService } from '../../services/chatService';
import { useAuth } from '../../hooks/useAuth';

const ChatDebugger = () => {
  const [authStatus, setAuthStatus] = useState('checking...');
  const [tokenInfo, setTokenInfo] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const checkAuth = async () => {
    try {
      setError(null);
      setAuthStatus('checking...');
      
      const token = localStorage.getItem('admin_auth_token');
      console.log('Token found:', !!token);
      console.log('Token length:', token?.length);
      console.log('User data:', user);
      
      setTokenInfo({
        exists: !!token,
        length: token?.length || 0,
        preview: token ? `${token.substring(0, 20)}...` : 'No token'
      });

      const result = await chatService.testAuth();
      console.log('Auth test successful:', result);
      setAuthStatus('✅ Authentication successful');
    } catch (err) {
      console.error('Auth test failed:', err);
      setAuthStatus('❌ Authentication failed');
      setError(`${err.response?.status}: ${err.response?.data?.message || err.message}`);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Chat Authentication Debug
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">
          <strong>Auth Status:</strong> {authStatus}
        </Typography>
        
        {tokenInfo && (
          <Typography variant="body2">
            <strong>Token:</strong> {tokenInfo.exists ? `Present (${tokenInfo.length} chars)` : 'Missing'}
          </Typography>
        )}
        
        <Typography variant="body2">
          <strong>User Role:</strong> {user?.role || 'Not available'}
        </Typography>
        
        <Typography variant="body2">
          <strong>User Name:</strong> {user?.name || 'Not available'}
        </Typography>
        
        <Typography variant="body2">
          <strong>Tenant:</strong> {user?.tenant?.name || 'Not available'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Button onClick={checkAuth} variant="outlined" size="small">
        Recheck Authentication
      </Button>
    </Paper>
  );
};

export default ChatDebugger;
