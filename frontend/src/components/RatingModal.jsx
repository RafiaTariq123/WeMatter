import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  Rating,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Star } from '@mui/icons-material';

const RatingModal = ({ open, onClose, psychologistId, onRatingSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [canRate, setCanRate] = useState(false);
  const [unratedAppointments, setUnratedAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState('');

  useEffect(() => {
    if (open && psychologistId) {
      checkRatingEligibility();
    }
  }, [open, psychologistId]);

  const checkRatingEligibility = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/ratings/can-rate/${psychologistId}`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      
      if (data.success) {
        setCanRate(data.data.canRate);
        setUnratedAppointments(data.data.unratedAppointments);
        if (data.data.unratedAppointments.length > 0) {
          setSelectedAppointment(data.data.unratedAppointments[0].appointmentId);
        }
      }
    } catch (error) {
      console.error('Error checking rating eligibility:', error);
      setError('Failed to check rating eligibility');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!selectedAppointment) {
      setError('No appointment selected for rating');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8000/api/ratings/rate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          psychologistId,
          appointmentId: selectedAppointment,
          rating,
          review,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Rating submitted successfully!');
        setTimeout(() => {
          onClose();
          onRatingSubmitted && onRatingSubmitted();
          resetForm();
        }, 1500);
      } else {
        setError(data.message || 'Failed to submit rating');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      setError('Failed to submit rating. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setReview('');
    setError('');
    setSuccess('');
    setSelectedAppointment('');
    setCanRate(false);
    setUnratedAppointments([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Rate Psychologist
        </Typography>

        {!canRate && !error && !success && (
          <Alert severity="info" sx={{ mb: 2 }}>
            You can only rate psychologists after completing an appointment with them.
          </Alert>
        )}

        {canRate && unratedAppointments.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              Select appointment to rate:
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={selectedAppointment}
              onChange={(e) => setSelectedAppointment(e.target.value)}
              SelectProps={{
                native: true,
              }}
            >
              {unratedAppointments.map((apt) => (
                <option key={apt.appointmentId} value={apt.appointmentId}>
                  {apt.slotDate} at {apt.slotTime}
                </option>
              ))}
            </TextField>
          </Box>
        )}

        {canRate && (
          <Box sx={{ mb: 3 }}>
            <Typography component="legend">Rating</Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
                setError('');
              }}
              size="large"
              icon={<Star fontSize="inherit" />}
              emptyIcon={<Star fontSize="inherit" style={{ opacity: 0.3 }} />}
            />
          </Box>
        )}

        {canRate && (
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Review (optional)"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            sx={{ mb: 2 }}
          />
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {canRate && (
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Submitting...' : 'Submit Rating'}
            </Button>
          </Box>
        )}

        {!canRate && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleClose}>
              Close
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default RatingModal;
