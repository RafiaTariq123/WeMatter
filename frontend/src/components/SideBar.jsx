import { useState } from "react";
import {
  Drawer,
  Typography,
  ThemeProvider,
  Box,
  IconButton,
  Button,
  Menu,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PropTypes from "prop-types";

import LibraryBooksRoundedIcon from "@mui/icons-material/LibraryBooksRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import { Link, useNavigate } from "react-router-dom";
import { useGetMeQuery, useLazyLogoutQuery } from "../redux/api/authApi";
import { disconnectSocket } from "../utils/socket";
import { useSelector } from "react-redux";
import theme from "./Theme";

function SideBar({ menuItemsSidebar }) {
  useGetMeQuery();
  useSelector((state) => state.auth);
  const [logout] = useLazyLogoutQuery();
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const isDropdownOpen = Boolean(anchorEl);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const toggleDrawer = (open) => (event) => {
    if (event?.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleLogout = async () => {
    await logout().unwrap();
    disconnectSocket();
    navigate(0);
  };

  const handleDropdownOpen = (event) => setAnchorEl(event.currentTarget);
  const handleDropdownClose = () => setAnchorEl(null);

  const renderMenuButtons = () =>
    menuItemsSidebar.map((item, index) => (
      <Button
        key={index}
        component={item.to ? Link : "button"}
        to={item.to}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%",
        }}
      >
        {item.icon}
        {item.label}
      </Button>
    ));

  const journalingDropdown = (
    <>
      <Button
        onClick={handleDropdownOpen}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%",
        }}
      >
        <LibraryBooksRoundedIcon sx={{ marginRight: "10px", marginBottom: "3px" }} />
        Journaling
      </Button>
      <Menu anchorEl={anchorEl} open={isDropdownOpen} onClose={handleDropdownClose}>
        <MenuItem
          component={Link}
          to="/dashboard/journal"
          onClick={() => {
            handleDropdownClose();
            setDrawerOpen(false);
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            Create Journal
          </Typography>
        </MenuItem>
        <MenuItem
          component={Link}
          to="/dashboard/journal/all"
          onClick={() => {
            handleDropdownClose();
            setDrawerOpen(false);
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            All Journals
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );

  const accountAndLogoutButtons = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "center",
        justifyContent: "center",
        mt: "auto",
      }}
    >
      <Button
        component={Link}
        to="/dashboard/accountInfo"
        variant="contained"
        sx={{
          backgroundColor: "primary.main",
          color: "white.main",
          "&:hover": { backgroundColor: "primary.hover" },
        }}
      >
        Account
      </Button>
      <Button onClick={handleLogout} component={Link} to="/">
        Log Out
      </Button>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      {isSmallScreen ? (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 16px",
              backgroundColor: "white",
              position: "sticky",
              top: 0,
              zIndex: 1200,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                component="img"
                src="/images/logo.png"
                alt="We Matter Logo"
                sx={{
                  height: "30px",
                  width: "auto",
                }}
              />
              <Typography variant="h5" color="primary.main" fontWeight={600}>
                We Matter
              </Typography>
            </Box>
            <IconButton onClick={toggleDrawer(true)} color="primary">
              <MenuRoundedIcon />
            </IconButton>
          </Box>

          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
            PaperProps={{ sx: { width: 220, backgroundColor: "white.main", height: "100vh", overflow: "hidden" } }}
          >
            <Box sx={{ padding: "20px", position: "relative", display: "flex", flexDirection: "column", height: "100%" }}>
              <IconButton onClick={toggleDrawer(false)} sx={{ position: "absolute", top: 15, right: 8 }}>
                <CloseRoundedIcon />
              </IconButton>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="h5" color="primary.main" fontWeight={600}>
                  We Matter
                </Typography>
                <Box
                  component="img"
                  src="/images/logo.png"
                  alt="We Matter Logo"
                  sx={{
                    height: "30px",
                    width: "auto",
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 2 }}>
                {renderMenuButtons()}
                {journalingDropdown}
                <Button
                  component={Link}
                  to="/dashboard/exercises"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    width: "100%",
                  }}
                >
                  <FitnessCenterRoundedIcon sx={{ marginRight: "10px", marginBottom: "3px" }} />
                  Exercises
                </Button>
              </Box>
              {accountAndLogoutButtons}
            </Box>
          </Drawer>
        </>
      ) : (
        <Drawer
          variant="permanent"
          PaperProps={{
            sx: {
              width: 230,
              backgroundColor: "#ffffffff",
              padding: "20px",
              borderWidth: "0",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100vh",
              overflow: "hidden",
            },
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                component="img"
                src="/images/logo.png"
                alt="We Matter Logo"
                sx={{
                  height: "30px",
                  width: "auto",
                }}
              />
              <Typography variant="h5" color="primary.main" fontWeight={600}>
                We Matter
              </Typography>
            </Box>
            {renderMenuButtons()}
            {journalingDropdown}
            <Button
              component={Link}
              to="/dashboard/exercises"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                width: "100%",
              }}
            >
              <FitnessCenterRoundedIcon sx={{ marginRight: "10px", marginBottom: "3px" }} />
              Exercises
            </Button>
          </Box>
          {accountAndLogoutButtons}
        </Drawer>
      )}
    </ThemeProvider>
  );
}

export default SideBar;

SideBar.propTypes = {
  menuItemsSidebar: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      to: PropTypes.string,
      icon: PropTypes.node,
    })
  ),
};
