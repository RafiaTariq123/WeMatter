import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideBar from "./SideBar";
import ProfileNav from "./ProfileNav";
import { Box, ThemeProvider } from "@mui/material";
import { menuItemsSidebar } from "./Data";
import theme from "./Theme";
import { useGetMeQuery } from "../redux/api/authApi";

function DashboardLayout() {
  const location = useLocation();
  
  // Check authentication status when dashboard loads
  useGetMeQuery();

  const shouldHideLayout =
    location.pathname === "/dashboard/user/consultations" ||
    location.pathname === "/dashboard/group-therapy";

  return (
    <>
      <ThemeProvider theme={theme}>
        {!shouldHideLayout && <SideBar menuItemsSidebar={menuItemsSidebar} />}
        {!shouldHideLayout && <ProfileNav />}
        <Box
          className={` ${
            !shouldHideLayout ? "pt-[20px] pb-[20px] ps-[20px] md:ps-[270px] pr-[33px] bg-lightGrey" : ""
          }`}
        >
          <Outlet />
        </Box>
      </ThemeProvider>
    </>
  );
}

export default DashboardLayout;
