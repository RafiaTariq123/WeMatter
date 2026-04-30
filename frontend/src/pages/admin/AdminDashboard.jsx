import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  Avatar,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Container,
  FormControl,
  InputLabel,
  Select,
  Fade,
  Slide,
  Grow
} from '@mui/material';
import {
  People as PeopleIcon,
  Psychology as PsychologistIcon,
  TrendingUp as TrendingUpIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Dashboard as DashboardIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DocumentViewer from '../../components/admin/DocumentViewer';

const AdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [psychologists, setPsychologists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPsychologist, setSelectedPsychologist] = useState(null);
  const [selectedPsychologistForVerification, setSelectedPsychologistForVerification] = useState(null);
  const [verificationDialog, setVerificationDialog] = useState(false);
  const [verificationForm, setVerificationForm] = useState({
    verificationStatus: '',
    adminRemarks: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      console.log('🔄 Starting dashboard data refresh...');
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };

      console.log('Fetching dashboard stats...');
      
      // Fetch stats
      const statsResponse = await axios.get('http://localhost:8000/admin/dashboard/stats', { headers });
      console.log('✅ Stats API Response:', statsResponse.data);
      setStats(statsResponse.data.stats);

      // Fetch users
      const usersResponse = await axios.get('http://localhost:8000/admin/users', { headers });
      console.log('✅ Users API Response:', usersResponse.data.users.length, 'users loaded');
      setUsers(usersResponse.data.users);

      // Fetch psychologists
      const psychologistsResponse = await axios.get('http://localhost:8000/admin/psychologists', { headers });
      console.log('✅ Psychologists API Response:', psychologistsResponse.data.psychologists.length, 'psychologists loaded');
      setPsychologists(psychologistsResponse.data.psychologists);
      console.log('Pending count from psychologists list:', psychologistsResponse.data.psychologists.filter(p => p.verificationStatus === 'pending').length);
      
      console.log('🎉 Dashboard data refresh completed successfully!');
    } catch (err) {
      console.error('❌ Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleUserStatusToggle = async (userId, isActive) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`http://localhost:8000/admin/users/${userId}/toggle-status`, 
        { isActive }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refresh users list
      const usersResponse = await axios.get('http://localhost:8000/admin/users', 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(usersResponse.data.users);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.delete(`http://localhost:8000/admin/users/${userId}`, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Refresh users list
        const usersResponse = await axios.get('http://localhost:8000/admin/users', 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers(usersResponse.data.users);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleVerificationSubmit = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`http://localhost:8000/admin/psychologists/${selectedPsychologistForVerification._id}/verification`, 
        verificationForm, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refresh psychologists list
      const psychologistsResponse = await axios.get('http://localhost:8000/admin/psychologists', 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPsychologists(psychologistsResponse.data.psychologists);
      
      setVerificationDialog(false);
      setSelectedPsychologistForVerification(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update verification status');
    }
  };

  const getPsychologistName = (psychologist) => {
    if (psychologist?.name) return psychologist.name;
    if (psychologist?.firstName && psychologist?.lastName) {
      return `${psychologist.firstName} ${psychologist.lastName}`;
    }
    return 'Unknown';
  };

  const getVerificationStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getVerificationStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckIcon />;
      case 'rejected': return <CancelIcon />;
      case 'pending': return <PendingIcon />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Elegant Header */}
      <Box 
        sx={{ 
          bgcolor: '#1a9aaa',
          boxShadow: '0 2px 8px rgba(26, 154, 170, 0.15)',
          mb: 4,
          position: 'relative'
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ px: 3, py: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.15)', width: 48, height: 48 }}>
                <DashboardIcon sx={{ fontSize: 28, color: 'white' }} />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 600, color: '#ffffff', mb: 0.5, fontFamily: 'Signika, sans-serif' }}>
                  Admin Dashboard
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'Khula, sans-serif' }}>
                  Manage users, psychologists, and platform settings
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={fetchDashboardData}
                startIcon={<RefreshIcon />}
                sx={{ 
                  color: 'white', 
                  borderColor: 'rgba(255,255,255,0.3)',
                  fontFamily: 'Khula, sans-serif',
                  '&:hover': { 
                    borderColor: 'rgba(255,255,255,0.6)',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  localStorage.removeItem('adminToken');
                  localStorage.removeItem('adminInfo');
                  navigate('/admin/login');
                }}
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  fontFamily: 'Khula, sans-serif',
                  '&:hover': { 
                    bgcolor: 'rgba(255,255,255,0.25)'
                  }
                }}
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl">
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Elegant Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                bgcolor: 'white',
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                transition: 'all 0.2s ease',
                border: '1px solid #e0f7fa',
                '&:hover': { 
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  borderColor: '#1a9aaa'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#e0f7fa', mr: 2, width: 48, height: 48 }}>
                    <PeopleIcon sx={{ color: '#1a9aaa', fontSize: 24 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 600, color: '#333', mb: 0.5, fontFamily: 'Signika, sans-serif' }}>
                      {stats?.users?.total || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', fontFamily: 'Khula, sans-serif' }}>
                      Total Users
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#1a9aaa' }} />
                  <Typography variant="body2" sx={{ color: '#64748b', fontFamily: 'Khula, sans-serif' }}>
                    {stats?.users?.active || 0} active
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                bgcolor: 'white',
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                transition: 'all 0.2s ease',
                border: '1px solid #e0f7fa',
                '&:hover': { 
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  borderColor: '#1a9aaa'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#e0f7fa', mr: 2, width: 48, height: 48 }}>
                    <PsychologistIcon sx={{ color: '#1a9aaa', fontSize: 24 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 600, color: '#333', mb: 0.5, fontFamily: 'Signika, sans-serif' }}>
                      {stats?.psychologists?.total || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', fontFamily: 'Khula, sans-serif' }}>
                      Total Psychologists
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#1a9aaa' }} />
                  <Typography variant="body2" sx={{ color: '#64748b', fontFamily: 'Khula, sans-serif' }}>
                    {stats?.psychologists?.verified || 0} verified
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                bgcolor: 'white',
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                transition: 'all 0.2s ease',
                border: '1px solid #fff3cd',
                '&:hover': { 
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  borderColor: '#ffc107'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#fff3cd', mr: 2, width: 48, height: 48 }}>
                    <PendingIcon sx={{ color: '#ffc107', fontSize: 24 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 600, color: '#333', mb: 0.5, fontFamily: 'Signika, sans-serif' }}>
                      {stats?.psychologists?.pending || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', fontFamily: 'Khula, sans-serif' }}>
                      Pending Verification
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#ffc107' }} />
                  <Typography variant="body2" sx={{ color: '#64748b', fontFamily: 'Khula, sans-serif' }}>
                    Need review
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                bgcolor: 'white',
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                transition: 'all 0.2s ease',
                border: '1px solid #f8d7da',
                '&:hover': { 
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  borderColor: '#dc3545'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#f8d7da', mr: 2, width: 48, height: 48 }}>
                    <CancelIcon sx={{ color: '#dc3545', fontSize: 24 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 600, color: '#333', mb: 0.5, fontFamily: 'Signika, sans-serif' }}>
                      {stats?.psychologists?.rejected || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', fontFamily: 'Khula, sans-serif' }}>
                      Rejected
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#dc3545' }} />
                  <Typography variant="body2" sx={{ color: '#64748b', fontFamily: 'Khula, sans-serif' }}>
                    Not approved
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Clean Tabs */}
        <Paper 
          sx={{ 
            mb: 4,
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            overflow: 'hidden',
            bgcolor: 'white'
          }}
        >
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            sx={{
              '& .MuiTabs-indicator': {
                bgcolor: '#1a9aaa',
                height: 2,
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.95rem',
                color: '#64748b',
                minHeight: 56,
                fontFamily: 'Khula, sans-serif',
                '&.Mui-selected': {
                  color: '#1a9aaa',
                  fontWeight: 600
                }
              }
            }}
          >
            <Tab 
              icon={<PeopleIcon sx={{ mr: 1, fontSize: 20 }} />}
              label="Users Management" 
              iconPosition="start"
            />
            <Tab 
              icon={<PsychologistIcon sx={{ mr: 1, fontSize: 20 }} />}
              label="Psychologists Management" 
              iconPosition="start"
            />
          </Tabs>
        </Paper>

        {/* Users Management Tab */}
        {tabValue === 0 && (
          <TableContainer 
            component={Paper}
            sx={{ 
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              overflow: 'hidden',
              bgcolor: 'white'
            }}
          >
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: '#333', borderBottom: '1px solid #e2e8f0', fontFamily: 'Khula, sans-serif' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon sx={{ fontSize: 18, color: '#1a9aaa' }} />
                      Name
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#333', borderBottom: '1px solid #e2e8f0', fontFamily: 'Khula, sans-serif' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon sx={{ fontSize: 18, color: '#1a9aaa' }} />
                      Email
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#333', borderBottom: '1px solid #e2e8f0', fontFamily: 'Khula, sans-serif' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarIcon sx={{ fontSize: 18, color: '#1a9aaa' }} />
                      Registration Date
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#333', borderBottom: '1px solid #e2e8f0', fontFamily: 'Khula, sans-serif' }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#333', borderBottom: '1px solid #e2e8f0', fontFamily: 'Khula, sans-serif' }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow 
                    key={user._id}
                    sx={{
                      '&:hover': { bgcolor: '#f8fafc' },
                      transition: 'bgcolor 0.2s ease'
                    }}
                  >
                    <TableCell sx={{ borderBottom: '1px solid #e2e8f0' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#e0f7fa', color: '#1a9aaa', fontSize: 14, fontWeight: 600 }}>
                          {user.name?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#333', fontFamily: 'Khula, sans-serif' }}>
                          {user.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e2e8f0' }}>
                      <Typography variant="body2" sx={{ color: '#64748b', fontFamily: 'Khula, sans-serif' }}>
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e2e8f0' }}>
                      <Typography variant="body2" sx={{ color: '#64748b', fontFamily: 'Khula, sans-serif' }}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e2e8f0' }}>
                      <Chip
                        label={user.isActive ? 'Active' : 'Inactive'}
                        sx={{
                          bgcolor: user.isActive ? '#e0f7fa' : '#f8d7da',
                          color: user.isActive ? '#1a9aaa' : '#dc3545',
                          fontWeight: 500,
                          fontFamily: 'Khula, sans-serif',
                          fontSize: '0.75rem'
                        }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e2e8f0' }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleUserStatusToggle(user._id, !user.isActive)}
                          sx={{
                            textTransform: 'none',
                            fontWeight: 500,
                            fontFamily: 'Khula, sans-serif',
                            borderColor: user.isActive ? '#dc3545' : '#1a9aaa',
                            color: user.isActive ? '#dc3545' : '#1a9aaa',
                            fontSize: '0.75rem',
                            '&:hover': {
                              borderColor: user.isActive ? '#c82333' : '#158794',
                              bgcolor: user.isActive ? 'rgba(220, 53, 69, 0.04)' : 'rgba(26, 154, 170, 0.04)'
                            }
                          }}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handleDeleteUser(user._id)}
                          sx={{
                            textTransform: 'none',
                            fontWeight: 500,
                            fontFamily: 'Khula, sans-serif',
                            fontSize: '0.75rem',
                            '&:hover': {
                              bgcolor: 'rgba(220, 53, 69, 0.04)'
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Psychologists Management Tab */}
        {tabValue === 1 && (
          <TableContainer 
            component={Paper}
            sx={{ 
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              overflow: 'hidden',
              bgcolor: 'white'
            }}
          >
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: '#333', borderBottom: '1px solid #e2e8f0', fontFamily: 'Khula, sans-serif' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon sx={{ fontSize: 18, color: '#1a9aaa' }} />
                      Name
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#333', borderBottom: '1px solid #e2e8f0', fontFamily: 'Khula, sans-serif' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon sx={{ fontSize: 18, color: '#1a9aaa' }} />
                      Email
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#333', borderBottom: '1px solid #e2e8f0', fontFamily: 'Khula, sans-serif' }}>
                    Specialization
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#333', borderBottom: '1px solid #e2e8f0', fontFamily: 'Khula, sans-serif' }}>
                    Verification Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#333', borderBottom: '1px solid #e2e8f0', fontFamily: 'Khula, sans-serif' }}>
                    Documents
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#333', borderBottom: '1px solid #e2e8f0', fontFamily: 'Khula, sans-serif' }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {psychologists.map((psychologist, index) => (
                  <TableRow 
                    key={psychologist._id}
                    sx={{
                      '&:hover': { bgcolor: '#f8fafc' },
                      transition: 'bgcolor 0.2s ease'
                    }}
                  >
                    <TableCell sx={{ borderBottom: '1px solid #e2e8f0' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#e0f7fa', color: '#1a9aaa', fontSize: 14, fontWeight: 600 }}>
                          {getPsychologistName(psychologist)?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#333', fontFamily: 'Khula, sans-serif' }}>
                          {getPsychologistName(psychologist)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e2e8f0' }}>
                      <Typography variant="body2" sx={{ color: '#64748b', fontFamily: 'Khula, sans-serif' }}>
                        {psychologist.email}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e2e8f0' }}>
                      <Typography variant="body2" sx={{ color: '#64748b', fontFamily: 'Khula, sans-serif' }}>
                        Depression
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e2e8f0' }}>
                      <Chip
                        icon={getVerificationStatusIcon(psychologist.verificationStatus)}
                        label={psychologist.verificationStatus || 'pending'}
                        sx={{
                          bgcolor: psychologist.verificationStatus === 'approved' ? '#d4edda' : 
                                   psychologist.verificationStatus === 'rejected' ? '#f8d7da' : '#cce5ff',
                          color: psychologist.verificationStatus === 'approved' ? '#155724' : 
                                 psychologist.verificationStatus === 'rejected' ? '#721c24' : '#004085',
                          fontWeight: 500,
                          fontFamily: 'Khula, sans-serif',
                          fontSize: '0.75rem'
                        }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e2e8f0' }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setSelectedPsychologist(psychologist)}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 500,
                          fontFamily: 'Khula, sans-serif',
                          borderColor: '#1a9aaa',
                          color: '#1a9aaa',
                          fontSize: '0.75rem',
                          '&:hover': {
                            borderColor: '#158794',
                            bgcolor: 'rgba(26, 154, 170, 0.04)'
                          }
                        }}
                      >
                        View Documents
                      </Button>
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e2e8f0' }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setSelectedPsychologistForVerification(psychologist);
                          setVerificationForm({
                            verificationStatus: psychologist.verificationStatus || 'pending',
                            adminRemarks: psychologist.adminRemarks || ''
                          });
                          setVerificationDialog(true);
                        }}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 500,
                          fontFamily: 'Khula, sans-serif',
                          borderColor: '#158794',
                          color: '#158794',
                          fontSize: '0.75rem',
                          '&:hover': {
                            borderColor: '#117480',
                            bgcolor: 'rgba(21, 135, 148, 0.04)'
                          }
                        }}
                      >
                        Verify
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Document Viewer Dialog */}
        <DocumentViewer
          open={!!selectedPsychologist}
          onClose={() => setSelectedPsychologist(null)}
          psychologist={selectedPsychologist}
        />

        {/* Verification Dialog */}
        <Dialog open={verificationDialog} onClose={() => {
          setVerificationDialog(false);
          setSelectedPsychologistForVerification(null);
        }} maxWidth="sm" fullWidth>
          <DialogTitle>Update Verification Status</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 3, mb: 3 }}>
              <TextField
                select
                label="Verification Status"
                value={verificationForm.verificationStatus}
                onChange={(e) => setVerificationForm({
                  ...verificationForm,
                  verificationStatus: e.target.value
                })}
                fullWidth
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </TextField>
            </FormControl>
            <TextField
              label="Admin Remarks"
              multiline
              rows={4}
              value={verificationForm.adminRemarks}
              onChange={(e) => setVerificationForm({
                ...verificationForm,
                adminRemarks: e.target.value
              })}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setVerificationDialog(false)}>Cancel</Button>
            <Button onClick={handleVerificationSubmit} variant="contained">
              Update Status
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
