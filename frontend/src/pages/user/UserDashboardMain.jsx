import React from "react";
import ProfileSetupReminder from "./ProfileSetupReminder";
import PsychologistRecommendations from "./PsychologistRecommendations";
import AppointmentReminder from "../../components/AppointmentReminder";
import AssessmentHistory from "../../components/AssessmentHistory";
import MoodTracker from "../../components/MoodTracker";
import UserPayment from "../../components/UserPayment";
import {useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Box, Typography, Paper } from "@mui/material";
import { Payment as PaymentIcon } from "@mui/icons-material";

export default function UserDashboardMain() {

  const { user} = useSelector(state => state.auth);
  const navigate = useNavigate();
  
  // Get user ID safely - handle different possible structures
  const userId = user?.user?._id || user?._id;
  
  return (
    <section className="user-dashboard-main">
      <ProfileSetupReminder />
      
      {/* Quick Payment Access */}
      <Paper 
        elevation={0}
        sx={{ 
          mb: 3, 
          p: 3, 
          borderRadius: 3, 
          border: '1px solid #e2e8f0',
          bgcolor: '#f0f9ff'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 500, color: '#000000', mb: 1 }}>
              💳 Make a Payment
            </Typography>
            <Typography variant="body2" color="#64748b">
              Complete payment for your upcoming appointments
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<PaymentIcon />}
            onClick={() => navigate('/dashboard/payment')}
            sx={{
              bgcolor: '#0369a1',
              '&:hover': { bgcolor: '#0284c7' }
            }}
          >
            Pay Now
          </Button>
        </Box>
      </Paper>

      <AssessmentHistory userId={userId} />

      <MoodTracker userId={userId} />

      <AppointmentReminder userId={userId}/>

      <PsychologistRecommendations />

    </section>

  );

}

