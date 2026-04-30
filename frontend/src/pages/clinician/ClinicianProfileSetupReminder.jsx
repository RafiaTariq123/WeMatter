import React from 'react'
import { isProfileComplete } from '../../utils/utils'
import { useSelector } from 'react-redux'
import { Card, CardContent } from "@mui/material";
import {
    Button,
    Typography,
  } from "@mui/material";
import { Link } from "react-router-dom";
import { ThemeProvider } from '@emotion/react';
import theme from '../../components/Theme'

const ClinicianProfileSetupReminder = () => {

    const {isAuthenticated, psychologist} = useSelector(state => state.psychologistAuth)
    if(!isAuthenticated) 
    return <></>

    const profileComplete = isProfileComplete(psychologist)
    const isApproved = psychologist?.verificationStatus === 'approved'
    const isPending = psychologist?.verificationStatus === 'pending'
    const isRejected = psychologist?.verificationStatus === 'rejected'
    
    console.log('profileComplete', profileComplete)
    console.log('psychologist data:', psychologist)
    console.log('verificationStatus:', psychologist?.verificationStatus)
    
    if (psychologist) {
        const copy = {...psychologist}
        delete copy.labels
        console.log('profile fields:', copy)
        console.log('null values:', Object.values(copy).filter(val => val === null || val === undefined || val === ''))
    }
    return (
        <ThemeProvider theme={theme}>
            <div className="max-w-[500px] mx-auto gap-5">
        
        {
            (!isApproved && (isPending || isRejected)) ? 
            <Card className="border rounded-lg text-center">
                <Link href="/">
                    <CardContent>
                    <Typography
                        variant="h5"
                        color="primary.main"
                        sx={{ fontWeight: 400 , marginBottom : '10px', fontSize: "1.2rem" }}
                    >
                        {isRejected ? 'Your application has been rejected' : 'Complete your setup profile to get started'}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ marginBottom : '15px' }}
                    >
                        {isRejected ? 'Please contact support for more information' : 'Your profile is under review by admin'}
                    </Typography>
                    <Button
                        component={Link}
                        to="/clinician/dashboard/accountInfo"
                        variant="contained"
                        sx={{
                        bgcolor: "primary.main",
                        "&:hover": {
                            bgcolor: "primary.hover",
                        },
                        color: "white",
                        py: 1,
                        px: 4,
                        textTransform: "uppercase",
                        borderRadius: 1,
                        width: "100%",
                        maxWidth: "200px",
                        }}
                    >
                        Setup Profile
                    </Button>
                    </CardContent>
                </Link>
            </Card>
            :
            <></>
        }

        </div>
        </ThemeProvider>
    )
}

export default ClinicianProfileSetupReminder