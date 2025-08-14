// client/src/components/Navbar.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Chip
} from '@mui/material';
import { 
  AccountCircle, 
  Logout, 
  Dashboard as DashboardIcon,
  Task as TaskIcon 
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  const handleProfile = () => {
    // Future: Navigate to profile page
    handleClose();
  };

  return (
    <AppBar position="static" elevation={0} sx={{ 
      borderBottom: '1px solid',
      borderColor: 'divider',
      backgroundColor: 'background.paper',
      color: 'text.primary'
    }}>
      <Toolbar>
        <TaskIcon sx={{ mr: 2, color: 'primary.main' }} />
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 600,
            color: 'primary.main'
          }}
        >
          MERN Task Manager
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user ? (
            <>
              <Chip
                icon={<DashboardIcon />}
                label="Dashboard"
                variant={location.pathname === '/dashboard' ? 'filled' : 'outlined'}
                color="primary"
                onClick={() => navigate('/dashboard')}
                sx={{ cursor: 'pointer' }}
              />
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Welcome, {user.username}
                </Typography>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                    {user.username?.charAt(0)?.toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleProfile}>
                    <AccountCircle sx={{ mr: 1 }} />
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Logout sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            </>
          ) : (
            <>
              <Button 
                color="inherit" 
                onClick={() => navigate('/login')}
                variant={location.pathname === '/login' ? 'contained' : 'text'}
              >
                Login
              </Button>
              <Button 
                color="primary" 
                onClick={() => navigate('/register')}
                variant={location.pathname === '/register' ? 'contained' : 'outlined'}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;