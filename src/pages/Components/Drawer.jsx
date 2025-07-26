import React, { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Popover,
  Typography,
} from "@mui/material";
import DrawerContents, { menuItems } from "../Metadata/DrawerContents";
import DashboardResume from "./Dashbord/DashboardResume";
import { AccountCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const drawerWidth = 240;
const miniDrawerWidth = 65;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: 1000, //theme.zIndex.drawer + 1,
  backgroundColor: "#01409d",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const DrawerComponent = ({
  title = "Dashboard",
  open: controlledOpen,
  onDrawerToggle,
}) => {
  const theme = useTheme();
  const [localOpen, setLocalOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const navigate = useNavigate();

  // Use controlled open state if provided, otherwise use local state
  const isControlled = typeof controlledOpen !== "undefined";
  const open = isControlled ? controlledOpen : localOpen;

  const handleDrawerToggle = () => {
    if (isControlled) {
      onDrawerToggle && onDrawerToggle(!open);
    } else {
      setLocalOpen(!open);
    }
  };

  const defaultContent = <DashboardResume />;
  const activeContent = (() => {
    const mainItem = menuItems.find((item) => item.id === activeMenu);
    if (mainItem?.content) return mainItem.content;

    // Check if activeMenu matches any submenu item
    for (const item of menuItems) {
      if (item.submenu) {
        const subItem = item.submenu.find((sub) => sub.id === activeMenu);
        if (subItem?.content) return subItem.content;
      }
    }

    return defaultContent;
  })();

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openAccountMenu = Boolean(anchorEl);
  const [openDialog, setOpenDialog] = useState(false);
  const handleAccount = () => {
    setOpenDialog(true);
    handleClose();
  };
  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleLogout = () => {
    handleClose();

    Swal.fire({
      title: "Logout?",
      text: "You will be logged out from this session",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, log out",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.clear();
        navigate("/login");
      }
    });
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} elevation={0}>
        <Toolbar
          sx={{
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {!open && (
              <>
                <IconButton color="inherit" onClick={handleDrawerToggle}>
                  {theme.direction !== "rtl" ? (
                    <ChevronRightIcon />
                  ) : (
                    <ChevronLeftIcon />
                  )}
                </IconButton>
              </>
            )}

            <Typography variant="h6" noWrap component="div">
              {title}
            </Typography>
          </Box>

          <Box>
            <IconButton onClick={handleClick}>
              <Avatar>
                <AccountCircle />
              </Avatar>
            </IconButton>

            <Dialog
              open={openDialog}
              onClose={handleDialogClose}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>Account Information</DialogTitle>
              <DialogContent>
                <p>Here is your account info or user settings.</p>
                {/* Replace with actual account details */}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogClose} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>

            <Popover
              open={openAccountMenu}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={handleAccount}>Account</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Popover>
          </Box>
        </Toolbar>
      </AppBar>
      <MuiDrawer
        variant="permanent"
        slotProps={{
          paper: {
            sx: {
              borderRight: 0,
              boxShadow: "0 0 10px #b5b5b5",
            },
          },
        }}
        sx={{
          zIndex: 900,
          width: open ? drawerWidth : miniDrawerWidth,
          flexShrink: 0,
          borderRight: 0,
          whiteSpace: "nowrap",
          boxSizing: "border-box",
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : miniDrawerWidth,
            overflowX: "hidden",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: open
                ? theme.transitions.duration.enteringScreen
                : theme.transitions.duration.leavingScreen,
            }),
          },
        }}
      >
        <DrawerHeader
          sx={{
            backgroundColor: "#01409d",
            color: "white",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ textAlign: "center", width: "100%" }}>
            <img
              src="/images/MINT-Logo-White-WithText.png"
              alt="MINT by JASAMARGA"
              height={50}
            />
          </Box>

          <IconButton color="inherit" onClick={handleDrawerToggle}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <DrawerContents
          open={open}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />
      </MuiDrawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 0 }}>
        <DrawerHeader />
        {activeContent}
      </Box>
    </Box>
  );
};

export default DrawerComponent;
