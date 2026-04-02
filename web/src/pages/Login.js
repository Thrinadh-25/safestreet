import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Stack,
  Alert,
  Snackbar,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      setShowError(true);
      return;
    }

    try {
      setLoading(true);
      const success = await login(email, password);
      if (!success) {
        throw new Error("Invalid credentials");
      }
    } catch (err) {
      setError(err.message || "Login failed");
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          borderRadius: 2,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <SecurityIcon sx={{ fontSize: 48, color: "#2563eb" }} />
          <Typography variant="h5" fontWeight={600} mt={1}>
            SafeStreet Admin Login
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Stack spacing={2} mt={3}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                fontWeight: 600,
                backgroundColor: "#2563eb",
              }}
            >
              {loading ? "Signing in..." : "Login"}
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate("/")}
              sx={{ fontWeight: 500 }}
            >
              Back
            </Button>
          </Stack>
        </Box>
      </Paper>

      <Snackbar
        open={showError}
        autoHideDuration={4000}
        onClose={() => setShowError(false)}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;
