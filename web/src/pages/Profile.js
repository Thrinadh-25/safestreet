import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Button,
  TextField,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  Link,
} from "@mui/material";

import { Edit, Save, Person, Settings } from "@mui/icons-material";

import { useAuth } from "../hooks/useAuth";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [success, setSuccess] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    skills: [],
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.profile?.phone || "",
        location: user.profile?.location || "",
        bio: user.profile?.bio || "",
        skills: user.profile?.skills || [],
      });
    }
  }, [user]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = () => {
    updateUser({
      ...user,
      name: form.name,
      profile: {
        ...user.profile,
        phone: form.phone,
        location: form.location,
        bio: form.bio,
        skills: form.skills,
      },
    });
    setEditMode(false);
    setSuccess("Profile updated");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", py: 4 }}>
      <Container maxWidth="md">
        <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess(null)}>
          <Alert severity="success">{success}</Alert>
        </Snackbar>

        <Paper sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center">
              <Avatar sx={{ mr: 2 }}>{form.name?.charAt(0)}</Avatar>
              <Typography variant="h6">{form.name}</Typography>
            </Box>
            <Button
              startIcon={editMode ? <Save /> : <Edit />}
              variant="contained"
              onClick={editMode ? handleSave : () => setEditMode(true)}
            >
              {editMode ? "Save" : "Edit"}
            </Button>
          </Box>

          <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mt: 2 }}>
            <Tab value="profile" icon={<Person />} label="Profile" />
            <Tab value="settings" icon={<Settings />} label="Settings" />
          </Tabs>

          {tab === "profile" && (
            <Box mt={3}>
              <TextField
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                disabled={!editMode}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                disabled={!editMode}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                fullWidth
                disabled={!editMode}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Location"
                name="location"
                value={form.location}
                onChange={handleChange}
                fullWidth
                disabled={!editMode}
              />
            </Box>
          )}

          {tab === "settings" && (
            <Box mt={3}>
              <Typography>
                Contact{" "}
                <Link href="mailto:support@safestreet.com">
                  SafeStreet Support
                </Link>{" "}
                for account changes.
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Profile;
