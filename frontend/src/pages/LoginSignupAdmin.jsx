import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Tab,
  Tabs,
  InputAdornment,
  IconButton,
  Divider
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  AdminPanelSettings,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';

const LoginSignupAdmin = () => {
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    adminCode: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
    setSuccess('');
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      adminCode: ''
    });
  };

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      // TODO: Implement admin login API call
      console.log('Admin login:', { email: formData.email, password: formData.password });
      setSuccess('Login successful! Redirecting to admin dashboard...');
      
      // TODO: Redirect to admin dashboard
      setTimeout(() => {
        // navigate('/admin/dashboard');
      }, 2000);
    } catch (error) {
      setError('Login failed. Please check your credentials.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.fullName || !formData.adminCode) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      // TODO: Implement admin signup API call
      console.log('Admin signup:', {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        adminCode: formData.adminCode
      });
      setSuccess('Account created successfully! Please login.');
      
      // Switch to login tab after successful signup
      setTimeout(() => {
        setTabValue(0);
      }, 2000);
    } catch (error) {
      setError('Signup failed. Please check your admin code and try again.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <AdminPanelSettings
              sx={{
                fontSize: 48,
                color: '#667eea',
                mb: 2
              }}
            />
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
              Admin Portal
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your mental health platform
            </Typography>
          </Box>

          {/* Tabs */}
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ mb: 4 }}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab
              icon={<LoginIcon />}
              label="Login"
              iconPosition="start"
            />
            <Tab
              icon={<PersonAddIcon />}
              label="Sign Up"
              iconPosition="start"
            />
          </Tabs>

          {/* Error/Success Messages */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          {/* Login Form */}
          {tabValue === 0 && (
            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                margin="normal"
                required
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange('password')}
                margin="normal"
                required
                sx={{ mb: 3 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  py: 1.5,
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  color: 'white',
                  fontWeight: 'bold',
                  mb: 2
                }}
              >
                Login to Admin Panel
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Forgot your password?{' '}
                  <Button
                    type="button"
                    color="primary"
                    sx={{ textTransform: 'none' }}
                  >
                    Reset Password
                  </Button>
                </Typography>
              </Box>
            </form>
          )}

          {/* Signup Form */}
          {tabValue === 1 && (
            <form onSubmit={handleSignup}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.fullName}
                onChange={handleInputChange('fullName')}
                margin="normal"
                required
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                margin="normal"
                required
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Admin Code"
                value={formData.adminCode}
                onChange={handleInputChange('adminCode')}
                margin="normal"
                required
                sx={{ mb: 2 }}
                helperText="Enter your admin registration code"
              />
              
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange('password')}
                margin="normal"
                required
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              
              <TextField
                fullWidth
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                margin="normal"
                required
                sx={{ mb: 3 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  py: 1.5,
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  color: 'white',
                  fontWeight: 'bold',
                  mb: 2
                }}
              >
                Create Admin Account
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  By signing up, you agree to the admin terms and conditions
                </Typography>
              </Box>
            </form>
          )}

          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Need help? Contact system administrator
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginSignupAdmin;
