import React from 'react'
import { useSelector } from "react-redux";
import { Card, CardContent, Box, Typography, Button } from "@mui/material";
import {
    Settings as SettingsIcon,
    Person as PersonIcon
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import ClinicianProfileSetupReminder from './ClinicianProfileSetupReminder';
import AppointmentReminder from '../../components/AppointmentReminder';
import PaymentDetails from '../../components/PaymentDetails';

export default function ClinicianDashboardMain() {

  const {psychologist} = useSelector(state => state.psychologistAuth);
  const isApproved = psychologist?.verificationStatus === 'approved';
 
  return (
    <section className='user-dashboard-main '>
      <ClinicianProfileSetupReminder />
      
      {/* Profile Setup Quick Access - Only show if not approved */}
      {!isApproved && (
        <Card sx={{ mb: 3, bgcolor: '#f0f9ff', border: '1px solid #e2e8f0' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 500, color: '#000000', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon sx={{ color: '#0369a1' }} />
                  Profile Setup
                </Typography>
                <Typography variant="body2" color="#64748b">
                  Manage your account information, documents, and professional details
                </Typography>
              </Box>
              <Button
                variant="contained"
                component={Link}
                to="/clinician/dashboard/accountInfo"
                startIcon={<SettingsIcon />}
                sx={{
                  bgcolor: '#0369a1',
                  '&:hover': { bgcolor: '#0284c7' }
                }}
              >
                Setup Profile
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Only show dashboard features if approved */}
      {isApproved && (
        <>
          <AppointmentReminder userId={psychologist?._id} />
          <PaymentDetails psychologistId={psychologist?._id} />
        </>
      )}
    </section>
  )
}