import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { Link } from "react-router-dom";

const NavButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    marginLeft: theme.spacing(1),
    padding: theme.spacing(0.5),
    fontSize: "0.8rem",
  },
}));

const Navbar = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: "transparent",
          boxShadow: "none",
          color: "white",
        }}
      >
        <Toolbar>
          {/* Logo icon and brand name */}
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
            <IconButton
              size="large"
              edge="start"
              color="text.white"
              aria-label="logo"
              sx={{ mr: 1 }}
            >
              <RocketLaunchIcon
                className="animate__animated animate__headShake animate__delay-2s animate__slow animate__infinite"
                sx={{ color: "white" }}
                fontSize="large"
              />
            </IconButton>
            {!isSmallScreen && (
              <Typography
                variant="h6"
                component="div"
                sx={{
                  color: "text.white",
                  fontWeight: "bold",
                }}
              >
                Orchetera
              </Typography>
            )}
          </Box>

          {/* Navigation buttons */}
          <Box>
            <NavButton
              component={Link}
              to="/login"
              variant="outlined"
              color="white"
              sx={{
                border: "none",
                textTransform: "capitalize",
              }}
            >
              Login
            </NavButton>
            <NavButton
              component={Link}
              to="/register"
              variant="outlined"
              elevation={0}
              color="white"
              sx={{
                ml: 2,
                backgroundColor: "transparent",
                borderColor: "white",
                textTransform: "capitalize",
              }}
            >
              Register
            </NavButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
