import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button
} from '@mui/material';
import {
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PaymentCancelled = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 3,
            border: '1px solid #f59e0b',
            bgcolor: '#fffbeb'
          }}
        >
          <CancelIcon sx={{ fontSize: 64, color: '#f59e0b', mb: 2 }} />
          <Typography variant="h4" gutterBottom sx={{ color: '#000000', fontWeight: 300 }}>
            Payment Cancelled
          </Typography>
          
          <Typography variant="body1" color="#64748b" sx={{ mb: 4 }}>
            Your payment has been cancelled. You can try again anytime.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{
                borderColor: '#0369a1',
                color: '#0369a1',
                '&:hover': { borderColor: '#0284c7', color: '#0284c7' }
              }}
            >
              Try Again
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

export default PaymentCancelled;
