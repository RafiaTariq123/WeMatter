import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Avatar,
  Divider
} from '@mui/material';
import {
  Payment as PaymentIcon,
  Security as SecurityIcon,
  Home as HomeIcon,
  Event as EventIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { useGetAppointmentByIdQuery } from '../../redux/api/appointmentApi';
import axios from 'axios';

const UserPaymentPage = () => {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Get appointment from location state or fetch user's appointments
  const appointmentFromState = location.state?.appointment;
  const { data, isLoading } = useGetAppointmentByIdQuery(user?.user?._id);

  useEffect(() => {
    if (appointmentFromState) {
      setSelectedAppointment(appointmentFromState);
    } else if (data?.appointment && data.appointment.length > 0) {
      // Get first unpaid appointment
      const unpaidAppointment = data.appointment.find(apt => !apt.payment && !apt.cancelled);
      if (unpaidAppointment) {
        setSelectedAppointment(unpaidAppointment);
      }
    }
  }, [appointmentFromState, data]);

  const handlePayment = async () => {
    if (!selectedAppointment) return;

    try {
      setLoading(true);
      setError('');
      
      // Create Stripe Checkout Session
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${API_BASE_URL}/create-checkout-session`, {
        psychologistId: selectedAppointment.psychologistId,
        userId: user?.user?._id,
        slotDate: selectedAppointment.slotDate,
        slotTime: selectedAppointment.slotTime
      });
      
      // Redirect to Stripe Checkout
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        setError('Failed to create payment session');
      }
    } catch (err) {
      console.error('Payment error:', err);
      
      // Handle different types of Stripe errors
      if (err.response?.data) {
        setError(err.response.data.message || 'Payment failed. Please try again.');
      } else if (err.request) {
        setError('Network error. Please check your connection and try again.');
      } else if (err.code === 'CARD_DECLINED') {
        setError('Your card was declined. Please try a different payment method.');
      } else if (err.code === 'INSUFFICIENT_FUNDS') {
        setError('Insufficient funds. Please try a different payment method.');
      } else if (err.code === 'EXPIRED_CARD') {
        setError('Your card has expired. Please use a different card.');
      } else {
        setError('Payment failed. Please try again or contact support.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!selectedAppointment) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', py: 4 }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
          <Breadcrumbs sx={{ mb: 3 }}>
            <RouterLink to="/dashboard" sx={{ display: 'flex', alignItems: 'center', color: '#0369a1' }}>
              <HomeIcon sx={{ mr: 1 }} fontSize="inherit" />
              Dashboard
            </RouterLink>
            <Typography sx={{ display: 'flex', alignItems: 'center', color: '#64748b' }}>
              <PaymentIcon sx={{ mr: 1 }} fontSize="inherit" />
              Payment
            </Typography>
          </Breadcrumbs>

          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
            <PaymentIcon sx={{ fontSize: 64, color: '#64748b', mb: 2 }} />
            <Typography variant="h5" gutterBottom sx={{ color: '#000000', fontWeight: 400 }}>
              No Pending Payments
            </Typography>
            <Typography variant="body1" color="#64748b" sx={{ mb: 3 }}>
              You don't have any appointments waiting for payment.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/dashboard')}
              sx={{
                bgcolor: '#0369a1',
                '&:hover': { bgcolor: '#0284c7' }
              }}
            >
              Go to Dashboard
            </Button>
          </Paper>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', py: 4 }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <RouterLink to="/dashboard" sx={{ display: 'flex', alignItems: 'center', color: '#0369a1' }}>
            <HomeIcon sx={{ mr: 1 }} fontSize="inherit" />
            Dashboard
          </RouterLink>
          <Typography sx={{ display: 'flex', alignItems: 'center', color: '#64748b' }}>
            <PaymentIcon sx={{ mr: 1 }} fontSize="inherit" />
            Payment
          </Typography>
        </Breadcrumbs>

        {/* Payment Card */}
        <Paper 
          elevation={0}
          sx={{ 
            mb: 4,
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ bgcolor: '#0369a1', p: 3, color: 'white' }}>
            <Typography variant="h4" sx={{ fontWeight: 300 }}>
              Complete Your Payment
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Secure payment powered by Stripe
            </Typography>
          </Box>

          <Box sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {/* Appointment Details */}
              <Box sx={{ flex: 1, minWidth: 300 }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#000000', fontWeight: 400 }}>
                  Appointment Details
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PersonIcon sx={{ color: '#0369a1', mr: 2 }} />
                    <Box>
                      <Typography variant="body2" color="#64748b">
                        Psychologist
                      </Typography>
                      <Typography variant="body1" color="#374151">
                        Dr. {selectedAppointment.psychologistData?.firstName} {selectedAppointment.psychologistData?.lastName}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EventIcon sx={{ color: '#0369a1', mr: 2 }} />
                    <Box>
                      <Typography variant="body2" color="#64748b">
                        Date & Time
                      </Typography>
                      <Typography variant="body1" color="#374151">
                        {selectedAppointment.slotDate} at {selectedAppointment.slotTime}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Payment Summary */}
              <Box sx={{ flex: 1, minWidth: 300 }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#000000', fontWeight: 400 }}>
                  Payment Summary
                </Typography>
                
                <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="#64748b">
                      Consultation Fee
                    </Typography>
                    <Typography variant="body1" color="#374151">
                      ₨{selectedAppointment.psychologistData?.fee || 0}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="#64748b">
                      Processing Fee
                    </Typography>
                    <Typography variant="body1" color="#374151">
                      ₨0
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" color="#000000">Total</Typography>
                    <Typography variant="h6" color="#0369a1">
                      ₨{selectedAppointment.psychologistData?.fee || 0}
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Box>

            {/* Payment Security Notice */}
            <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: '#f0f9ff', borderRadius: 2, mb: 3 }}>
              <SecurityIcon sx={{ color: '#0369a1', mr: 2 }} />
              <Typography variant="body2" color="#0369a1">
                Your payment is processed securely by Stripe. We never store your card information.
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/dashboard')}
                sx={{
                  borderColor: '#0369a1',
                  color: '#0369a1',
                  '&:hover': { borderColor: '#0284c7', color: '#0284c7' }
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handlePayment}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PaymentIcon />}
                sx={{
                  bgcolor: '#0369a1',
                  '&:hover': { bgcolor: '#0284c7' },
                  px: 4
                }}
              >
                {loading ? 'Creating Payment...' : `Pay ₨${selectedAppointment.psychologistData?.fee || 0}`}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default UserPaymentPage;
