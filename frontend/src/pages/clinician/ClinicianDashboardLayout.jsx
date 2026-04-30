import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import ClinicianSideBar from "./ClinicianSideBar.jsx";
import ClinicianProfileNav from "./ClinicianProfileNav.jsx";
import { Box, ThemeProvider } from "@mui/material";
import theme from "../../components/Theme.jsx";
import ClinicianProfileSetupReminder from "./ClinicianProfileSetupReminder.jsx";
import { useSelector } from "react-redux"; 
import { isProfileComplete } from "../../utils/utils"; 

function ClinicianDashboardLayout() {
  const { isAuthenticated, psychologist } = useSelector(state => state.psychologistAuth);
  const location = useLocation(); 

  const profileComplete = isProfileComplete(psychologist); 
  const isApproved = psychologist?.verificationStatus === 'approved';
  const isProfilePage = location.pathname.includes("/clinician/dashboard/accountInfo");

  // ✅ Fully hide layout styles & components on this route
  const hideLayoutCompletely = location.pathname === "/clinician/dashboard/consultations";

  if (hideLayoutCompletely) {
    return (
      <ThemeProvider theme={theme}>
        <Outlet />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="relative">
        {/* Dim background */}
        {(!isApproved && !isProfilePage) && (
          <div
            className="fixed top-0 left-0 w-full h-full bg-gray-700 opacity-50 z-10"
            style={{ pointerEvents: "all" }}
          />
        )}

        {/* Sidebar */}
        <div className={`${(!isApproved && !isProfilePage) ? "pointer-events-none" : ""}`}>
          <ClinicianSideBar />
        </div>

        {/* Navbar */}
        <div className={`${(!isApproved && !isProfilePage) ? "pointer-events-none" : ""}`}>
          <ClinicianProfileNav />
        </div>

        {/* Main content */}
        <Box className="ps-[20px] md:ps-[270px] pr-[33px] pt-[20px] pb-[20px] bg-lightGrey">
          {(!isApproved && !isProfilePage) && (
            <div className="fixed top-0 left-0 w-full h-full z-20 flex justify-center items-center">
              <ClinicianProfileSetupReminder />
            </div>
          )}
          <Outlet />
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default ClinicianDashboardLayout;
