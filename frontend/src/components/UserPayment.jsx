import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserPayment = ({ appointment }) => {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect to Stripe Checkout if appointment exists and payment is not completed
    if (appointment && !appointment.payment && !appointment.cancelled) {
      handlePayment();
    }
  }, [appointment]);

  const handlePayment = async () => {
    try {
      // Create Stripe Checkout Session
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${API_BASE_URL}/create-checkout-session`, {
        psychologistId: appointment.psychologistId,
        userId: user?.user?._id,
        slotDate: appointment.slotDate,
        slotTime: appointment.slotTime
      });
      
      // Redirect to Stripe Checkout
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (err) {
      console.error('Payment error:', err);
    }
  };

  if (!appointment) return null;

  // Auto-redirect to Stripe - no UI needed
  return null;
};

export default UserPayment;
