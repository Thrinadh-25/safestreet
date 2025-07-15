import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Paper, Typography, TextField, Button, Box, Snackbar, Alert
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !password) {
      setError("Please fill in all fields");
      setShowError(true);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/auth/admin-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      // Optionally auto-login:
      await login(email, password);
    } catch (err) {
      setError(err.message);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" mb={2}>Admin Register</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField fullWidth label="Full Name" margin="normal" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <TextField fullWidth label="Email" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField fullWidth type="password" label="Password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button variant="contained" fullWidth type="submit" sx={{ mt: 2 }} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </Box>
        <Snackbar open={showError} autoHideDuration={6000} onClose={() => setShowError(false)}>
          <Alert severity="error" onClose={() => setShowError(false)}>{error}</Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default Register;
