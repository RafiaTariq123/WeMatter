import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import {
  Payment as PaymentIcon,
  CheckCircle as CheckIcon,
  Pending as PendingIcon,
  Event as EventIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useGetAppointmentByIdQuery } from '../redux/api/appointmentApi';
import axios from 'axios';

const PaymentDetails = ({ psychologistId }) => {
  const { psychologist } = useSelector(state => state.psychologistAuth);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  // Get the psychologist ID from props or auth state
  const currentPsychologistId = psychologistId || psychologist?._id;

  // Use RTK query to fetch appointments for the psychologist
  const { data, error: appointmentError, isLoading: appointmentLoading, refetch } = useGetAppointmentByIdQuery(currentPsychologistId);

  useEffect(() => {
    if (data?.appointment) {
      setAppointments(data.appointment);
      setLoading(false);
      setError('');
    } else if (appointmentError) {
      setError('Error fetching appointment data');
      setLoading(false);
    }
  }, [data, appointmentError]);

  // Update loading state based on RTK query
  useEffect(() => {
    setLoading(appointmentLoading);
  }, [appointmentLoading]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const paidAppointments = appointments.filter(apt => apt.payment && !apt.cancelled);
  const unpaidAppointments = appointments.filter(apt => !apt.payment && !apt.cancelled);
  const totalEarnings = paidAppointments.reduce((sum, apt) => sum + (apt.psychologistData?.fee || 0), 0);
  const pendingEarnings = unpaidAppointments.reduce((sum, apt) => sum + (apt.psychologistData?.fee || 0), 0);

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'card':
        return <PaymentIcon sx={{ fontSize: 16, color: '#4285F4' }} />;
      case 'paypal':
        return <PaymentIcon sx={{ fontSize: 16, color: '#0070ba' }} />;
      case 'easypaisa':
        return (
          <Box 
            component="img"
            src="/assets/easypaisa-logo.svg"
            alt="EasyPaisa"
            sx={{ 
              width: 20, 
              height: 20, 
              objectFit: 'contain'
            }}
          />
        );
      case 'jazzcash':
        return <PaymentIcon sx={{ fontSize: 16, color: '#FF6B35' }} />;
      default:
        return <PaymentIcon sx={{ fontSize: 16, color: '#64748b' }} />;
    }
  };

  const getPaymentMethodName = (method) => {
    switch (method) {
      case 'card':
        return 'Credit/Debit Card';
      case 'paypal':
        return 'PayPal';
      case 'easypaisa':
        return 'EasyPaisa';
      case 'jazzcash':
        return 'JazzCash';
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <PaymentIcon sx={{ fontSize: 28, color: '#0369a1', mr: 2 }} />
        <Typography variant="h5" sx={{ fontWeight: 400, color: '#000000' }}>
          Payment Details
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#10b981', mr: 2 }}>
                  <MoneyIcon sx={{ color: '#ffffff' }} />
                </Avatar>
                <Typography variant="body2" color="#64748b">
                  Total Earnings
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 500 }}>
                ₨{totalEarnings.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#f59e0b', mr: 2 }}>
                  <PendingIcon sx={{ color: '#ffffff' }} />
                </Avatar>
                <Typography variant="body2" color="#64748b">
                  Pending Earnings
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#f59e0b', fontWeight: 500 }}>
                ₨{pendingEarnings.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#0369a1', mr: 2 }}>
                  <CheckIcon sx={{ color: '#ffffff' }} />
                </Avatar>
                <Typography variant="body2" color="#64748b">
                  Paid Appointments
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#0369a1', fontWeight: 500 }}>
                {paidAppointments.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#64748b', mr: 2 }}>
                  <EventIcon sx={{ color: '#ffffff' }} />
                </Avatar>
                <Typography variant="body2" color="#64748b">
                  Unpaid Appointments
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#64748b', fontWeight: 500 }}>
                {unpaidAppointments.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            borderBottom: '1px solid #e2e8f0',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              color: '#64748b'
            },
            '& .Mui-selected': {
              color: '#0369a1'
            }
          }}
        >
          <Tab label={`Paid Appointments (${paidAppointments.length})`} />
          <Tab label={`Pending Payments (${unpaidAppointments.length})`} />
          <Tab label="All Appointments" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Patient</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Date & Time</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Payment Method</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Payment Date</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paidAppointments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4, color: '#64748b' }}>
                        No paid appointments found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paidAppointments.map((appointment) => (
                      <TableRow key={appointment._id} sx={{ '&:hover': { bgcolor: '#f9fafb' } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: '#0369a1' }}>
                              <PersonIcon sx={{ fontSize: 16, color: '#ffffff' }} />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {appointment.userData?.name || (() => {
                                  const email = appointment.userData?.email;
                                  if (!email) return 'Unknown Patient';
                                  const username = email.split('@')[0];
                                  
                                  // Handle common Pakistani name patterns
                                  let formatted = username;
                                  
                                  // If it's all lowercase, try to split common name patterns
                                  if (username === username.toLowerCase()) {
                                    // Common Pakistani name patterns
                                    const patterns = [
                                      /^(saim)(rehman)$/i,
                                      /^(rafia)(tariq)$/i,
                                      /^(muhammad)(.+)$/i,
                                      /^(abdul)(.+)$/i,
                                      /^(syed)(.+)$/i,
                                      /^(ahmed)(.+)$/i,
                                      /^(khan)$/i,
                                      /^(ali)$/i,
                                      /^(hassan)$/i,
                                      /^(hussain)$/i
                                    ];
                                    
                                    for (const pattern of patterns) {
                                      const match = username.match(pattern);
                                      if (match) {
                                        formatted = match.slice(1).map(word => 
                                          word.charAt(0).toUpperCase() + word.slice(1)
                                        ).join(' ');
                                        break;
                                      }
                                    }
                                    
                                    // If no pattern matched, try to split at common boundaries
                                    if (formatted === username) {
                                      // Try to split before common second names
                                      const secondNames = ['rehman', 'tariq', 'ahmed', 'khan', 'ali', 'hassan', 'hussain', 'bashir', 'akbar'];
                                      for (const secondName of secondNames) {
                                        const index = username.toLowerCase().indexOf(secondName);
                                        if (index > 2) { // Ensure there's a first name
                                          const first = username.substring(0, index);
                                          const second = username.substring(index);
                                          formatted = first.charAt(0).toUpperCase() + first.slice(1) + ' ' + 
                                                      second.charAt(0).toUpperCase() + second.slice(1);
                                          break;
                                        }
                                      }
                                    }
                                  } else {
                                    // Handle camelCase: add space before capital letters
                                    formatted = username.replace(/([a-z])([A-Z])/g, '$1 $2');
                                  }
                                  
                                  // Capitalize first letter of each word
                                  return formatted.replace(/\b\w/g, l => l.toUpperCase());
                                })() || 'Unknown Patient'}
                              </Typography>
                              <Typography variant="caption" color="#64748b">
                                {appointment.userData?.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {appointment.slotDate}
                          </Typography>
                          <Typography variant="caption" color="#64748b">
                            {appointment.slotTime}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: '#10b981' }}>
                            ₨{appointment.psychologistData?.fee || 0}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {getPaymentMethodIcon(appointment.payment?.method)}
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              {getPaymentMethodName(appointment.payment?.method)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {appointment.paymentDate ? new Date(appointment.paymentDate).toLocaleDateString() : 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={<CheckIcon sx={{ fontSize: 14 }} />}
                            label="Paid"
                            size="small"
                            sx={{
                              bgcolor: '#10b981',
                              color: '#ffffff',
                              fontSize: '0.7rem',
                              height: 24
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {tabValue === 1 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Patient</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Date & Time</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {unpaidAppointments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4, color: '#64748b' }}>
                        No pending payments found
                      </TableCell>
                    </TableRow>
                  ) : (
                    unpaidAppointments.map((appointment) => (
                      <TableRow key={appointment._id} sx={{ '&:hover': { bgcolor: '#f9fafb' } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: '#f59e0b' }}>
                              <PersonIcon sx={{ fontSize: 16, color: '#ffffff' }} />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {appointment.userData?.name || (() => {
                                  const email = appointment.userData?.email;
                                  if (!email) return 'Unknown Patient';
                                  const username = email.split('@')[0];
                                  
                                  // Handle common Pakistani name patterns
                                  let formatted = username;
                                  
                                  // If it's all lowercase, try to split common name patterns
                                  if (username === username.toLowerCase()) {
                                    // Common Pakistani name patterns
                                    const patterns = [
                                      /^(saim)(rehman)$/i,
                                      /^(rafia)(tariq)$/i,
                                      /^(muhammad)(.+)$/i,
                                      /^(abdul)(.+)$/i,
                                      /^(syed)(.+)$/i,
                                      /^(ahmed)(.+)$/i,
                                      /^(khan)$/i,
                                      /^(ali)$/i,
                                      /^(hassan)$/i,
                                      /^(hussain)$/i
                                    ];
                                    
                                    for (const pattern of patterns) {
                                      const match = username.match(pattern);
                                      if (match) {
                                        formatted = match.slice(1).map(word => 
                                          word.charAt(0).toUpperCase() + word.slice(1)
                                        ).join(' ');
                                        break;
                                      }
                                    }
                                    
                                    // If no pattern matched, try to split at common boundaries
                                    if (formatted === username) {
                                      // Try to split before common second names
                                      const secondNames = ['rehman', 'tariq', 'ahmed', 'khan', 'ali', 'hassan', 'hussain', 'bashir', 'akbar'];
                                      for (const secondName of secondNames) {
                                        const index = username.toLowerCase().indexOf(secondName);
                                        if (index > 2) { // Ensure there's a first name
                                          const first = username.substring(0, index);
                                          const second = username.substring(index);
                                          formatted = first.charAt(0).toUpperCase() + first.slice(1) + ' ' + 
                                                      second.charAt(0).toUpperCase() + second.slice(1);
                                          break;
                                        }
                                      }
                                    }
                                  } else {
                                    // Handle camelCase: add space before capital letters
                                    formatted = username.replace(/([a-z])([A-Z])/g, '$1 $2');
                                  }
                                  
                                  // Capitalize first letter of each word
                                  return formatted.replace(/\b\w/g, l => l.toUpperCase());
                                })() || 'Unknown Patient'}
                              </Typography>
                              <Typography variant="caption" color="#64748b">
                                {appointment.userData?.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {appointment.slotDate}
                          </Typography>
                          <Typography variant="caption" color="#64748b">
                            {appointment.slotTime}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: '#f59e0b' }}>
                            ₨{appointment.psychologistData?.fee || 0}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={<PendingIcon sx={{ fontSize: 14 }} />}
                            label="Payment Pending"
                            size="small"
                            sx={{
                              bgcolor: '#f59e0b',
                              color: '#ffffff',
                              fontSize: '0.7rem',
                              height: 24
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {tabValue === 2 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Patient</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Date & Time</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Payment Method</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appointments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4, color: '#64748b' }}>
                        No appointments found
                      </TableCell>
                    </TableRow>
                  ) : (
                    appointments.filter(apt => !apt.cancelled).map((appointment) => (
                      <TableRow key={appointment._id} sx={{ '&:hover': { bgcolor: '#f9fafb' } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: '#0369a1' }}>
                              <PersonIcon sx={{ fontSize: 16, color: '#ffffff' }} />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {appointment.userData?.name || (() => {
                                  const email = appointment.userData?.email;
                                  if (!email) return 'Unknown Patient';
                                  const username = email.split('@')[0];
                                  
                                  // Handle common Pakistani name patterns
                                  let formatted = username;
                                  
                                  // If it's all lowercase, try to split common name patterns
                                  if (username === username.toLowerCase()) {
                                    // Common Pakistani name patterns
                                    const patterns = [
                                      /^(saim)(rehman)$/i,
                                      /^(rafia)(tariq)$/i,
                                      /^(muhammad)(.+)$/i,
                                      /^(abdul)(.+)$/i,
                                      /^(syed)(.+)$/i,
                                      /^(ahmed)(.+)$/i,
                                      /^(khan)$/i,
                                      /^(ali)$/i,
                                      /^(hassan)$/i,
                                      /^(hussain)$/i
                                    ];
                                    
                                    for (const pattern of patterns) {
                                      const match = username.match(pattern);
                                      if (match) {
                                        formatted = match.slice(1).map(word => 
                                          word.charAt(0).toUpperCase() + word.slice(1)
                                        ).join(' ');
                                        break;
                                      }
                                    }
                                    
                                    // If no pattern matched, try to split at common boundaries
                                    if (formatted === username) {
                                      // Try to split before common second names
                                      const secondNames = ['rehman', 'tariq', 'ahmed', 'khan', 'ali', 'hassan', 'hussain', 'bashir', 'akbar'];
                                      for (const secondName of secondNames) {
                                        const index = username.toLowerCase().indexOf(secondName);
                                        if (index > 2) { // Ensure there's a first name
                                          const first = username.substring(0, index);
                                          const second = username.substring(index);
                                          formatted = first.charAt(0).toUpperCase() + first.slice(1) + ' ' + 
                                                      second.charAt(0).toUpperCase() + second.slice(1);
                                          break;
                                        }
                                      }
                                    }
                                  } else {
                                    // Handle camelCase: add space before capital letters
                                    formatted = username.replace(/([a-z])([A-Z])/g, '$1 $2');
                                  }
                                  
                                  // Capitalize first letter of each word
                                  return formatted.replace(/\b\w/g, l => l.toUpperCase());
                                })() || 'Unknown Patient'}
                              </Typography>
                              <Typography variant="caption" color="#64748b">
                                {appointment.userData?.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {appointment.slotDate}
                          </Typography>
                          <Typography variant="caption" color="#64748b">
                            {appointment.slotTime}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            ₨{appointment.psychologistData?.fee || 0}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {appointment.payment ? (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {getPaymentMethodIcon(appointment.payment?.method)}
                              <Typography variant="body2" sx={{ ml: 1 }}>
                                {getPaymentMethodName(appointment.payment?.method)}
                              </Typography>
                            </Box>
                          ) : (
                            <Typography variant="body2" color="#64748b">
                              Not paid
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {appointment.payment ? (
                            <Chip
                              icon={<CheckIcon sx={{ fontSize: 14 }} />}
                              label="Paid"
                              size="small"
                              sx={{
                                bgcolor: '#10b981',
                                color: '#ffffff',
                                fontSize: '0.7rem',
                                height: 24
                              }}
                            />
                          ) : (
                            <Chip
                              icon={<PendingIcon sx={{ fontSize: 14 }} />}
                              label="Payment Pending"
                              size="small"
                              sx={{
                                bgcolor: '#f59e0b',
                                color: '#ffffff',
                                fontSize: '0.7rem',
                                height: 24
                              }}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default PaymentDetails;
