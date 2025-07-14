import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box,
  useMediaQuery,
  Stack,
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import HomeIcon from '@mui/icons-material/Home';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:768px)');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      setShowError(true);
      return;
    }

    try {
      setLoading(true);
      const success = await login(email, password);
      if (!success) {
        throw new Error('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  return (
    <Container maxWidth="lg" sx={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4
    }}>
      <IconButton 
        onClick={() => navigate('/')}
        sx={{ 
          position: 'absolute',
          top: 20,
          left: 20,
          color: '#2563eb'
        }}
      >
        <HomeIcon sx={{ fontSize: 32 }} />
      </IconButton>
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          borderRadius: '8px',
          overflow: 'hidden',
          minHeight: '600px',
          width: '100%',
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Left Side - Product Info */}
        <Box
          sx={{
            flex: '1 1 50%',
            p: 6,
            background: '#2563eb',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <SecurityIcon sx={{ fontSize: 48, mr: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 600 }}>
              SafeStreets
            </Typography>
          </Box>
          
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
            SafeStreets Admin Portal
          </Typography>
          
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Monitor and manage infrastructure damage reports and repairs
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
              ✓ Real-time damage assessment tracking
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
              ✓ Comprehensive repair status monitoring
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
              ✓ Advanced analytics and reporting
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            flex: '1 1 50%',
            p: 6,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, color: '#111827' }}>
            Sign In
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>

            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                }
              }}
            />

            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              sx={{ 
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                }
              }}
            />

            <Stack spacing={2}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={!email || !password || loading}
                sx={{
                  py: 1.8,
                  borderRadius: 1,
                  fontSize: '1rem',
                  textTransform: 'none',
                  fontWeight: 600,
                  backgroundColor: '#2563eb',
                  '&:hover': {
                    backgroundColor: '#1d4ed8',
                  },
                  '&:disabled': {
                    backgroundColor: '#9ca3af',
                  }
                }}
              >
                {loading ? 'Signing in...' : 'Sign In to Dashboard'}
              </Button>
            </Stack>

          </Box>
        </Box>
      </Paper>

      <Snackbar 
        open={showError} 
        autoHideDuration={6000} 
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

    </Container>
  );
};

export default Login;
