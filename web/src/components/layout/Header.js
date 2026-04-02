import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Box,
  useTheme,
  Chip,
  Tooltip,
  useMediaQuery,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReportIcon from "@mui/icons-material/Report";
import AnalyticsIcon from "@mui/icons-material/BarChart";
import RepairIcon from "@mui/icons-material/Build";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import BusinessIcon from "@mui/icons-material/Business";
import CloseIcon from "@mui/icons-material/Close";

/* ===================== MENU ITEMS ===================== */

const superAdminMenuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { text: "Tenants", icon: <BusinessIcon />, path: "/tenants" },
  { text: "Reports", icon: <ReportIcon />, path: "/reports" },
  { text: "AI Analysis", icon: <AutoAwesomeIcon />, path: "/ai-analysis", badge: "AI" },
];

const regularMenuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { text: "Reports", icon: <ReportIcon />, path: "/reports" },
  { text: "Analytics", icon: <AnalyticsIcon />, path: "/analytics" },
  { text: "Repairs", icon: <RepairIcon />, path: "/repairs" },
  { text: "AI Analysis", icon: <AutoAwesomeIcon />, path: "/ai-analysis", badge: "AI" },
];

/* ===================== HEADER ===================== */

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const userRole = "admin"; // demo role
  const menuItems =
    userRole === "super-admin" ? superAdminMenuItems : regularMenuItems;
  const { logout } = useAuth();


  const handleLogout = () => {
    localStorage.clear();
    logout();

  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          color: theme.palette.text.primary,
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Left */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {isMobile && (
              <IconButton onClick={() => setMobileMenuOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}

            <Typography variant="h6" fontWeight={700}>
              SafeStreet
            </Typography>

            {!isMobile && (
              <Box sx={{ display: "flex", gap: 1 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.text}
                    startIcon={item.icon}
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      textTransform: "none",
                      fontWeight:
                        location.pathname === item.path ? 600 : 500,
                      color:
                        location.pathname === item.path
                          ? theme.palette.primary.main
                          : "#6b7280",
                    }}
                  >
                    {item.text}
                    {item.badge && (
                      <Chip
                        label={item.badge}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Button>
                ))}
              </Box>
            )}
          </Box>

          {/* Right */}
          <Box>
            <Tooltip title="Notifications">
              <IconButton>
                <Badge badgeContent={2} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Profile">
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>AD</Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => navigate("/profile")}>
          <ListItemIcon>
            <AccountCircleIcon />
          </ListItemIcon>
          Profile
        </MenuItem>

        <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <LogoutIcon color="error" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box sx={{ width: 260 }}>
          <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
            <Typography fontWeight={600}>Menu</Typography>
            <IconButton onClick={() => setMobileMenuOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider />

          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
