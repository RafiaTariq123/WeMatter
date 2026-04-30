import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [appointment, setAppointment] = useState(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setError('No payment session found');
        setLoading(false);
        return;
      }

      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${API_BASE_URL}/payment/verify-session/${sessionId}`);
        
        if (response.data.success) {
          setAppointment(response.data.appointment);
        } else {
          setError('Payment verification failed');
        }
      } catch (err) {
        setError('Failed to verify payment');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h6">Verifying your payment...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 3,
              border: '1px solid #ef4444',
              bgcolor: '#fef2f2'
            }}
          >
            <ErrorIcon sx={{ fontSize: 64, color: '#ef4444', mb: 2 }} />
            <Typography variant="h5" gutterBottom sx={{ color: '#000000', fontWeight: 400 }}>
              Payment Verification Failed
            </Typography>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
            <Button
              variant="contained"
              onClick={() => navigate('/dashboard')}
              sx={{ bgcolor: '#0369a1', '&:hover': { bgcolor: '#0284c7' } }}
            >
              Go to Dashboard
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 3,
            border: '1px solid #10b981',
            bgcolor: '#f0fdf4'
          }}
        >
          <CheckIcon sx={{ fontSize: 64, color: '#10b981', mb: 2 }} />
          <Typography variant="h4" gutterBottom sx={{ color: '#000000', fontWeight: 300 }}>
            Payment Successful!
          </Typography>
          
          <Typography variant="body1" color="#64748b" sx={{ mb: 4 }}>
            Your appointment payment has been processed successfully.
          </Typography>

          {appointment && (
            <Box sx={{ textAlign: 'left', mb: 4, p: 3, bgcolor: '#f8fafc', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#000000', fontWeight: 400 }}>
                Appointment Details
              </Typography>
              <Typography variant="body2" color="#64748b">
                Psychologist: {appointment.psychologistData?.name}
              </Typography>
              <Typography variant="body2" color="#64748b">
                Date: {appointment.slotDate}
              </Typography>
              <Typography variant="body2" color="#64748b">
                Time: {appointment.slotTime}
              </Typography>
              <Typography variant="body2" color="#64748b">
                Amount Paid: ₨{appointment.amount}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/dashboard/appointments')}
              sx={{
                borderColor: '#0369a1',
                color: '#0369a1',
                '&:hover': { borderColor: '#0284c7', color: '#0284c7' }
              }}
            >
              View Appointments
            </Button>
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
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default PaymentSuccess;
