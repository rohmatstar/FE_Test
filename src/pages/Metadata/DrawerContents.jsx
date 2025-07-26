import { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import {
  AirlineStops,
  Dashboard,
  ExpandLess,
  ExpandMore,
  VerticalSplit,
} from "@mui/icons-material";
import DashboardResume from "../Components/Dashbord/DashboardResume";
import { Collapse } from "@mui/material";
import DailyTraffic from "../Components/Dashbord/DailyTraffic";
import GateMaster from "../Components/Dashbord/GateMaster";

export const menuItems = [
  {
    id: "dashboard",
    text: "Dashboard",
    icon: <Dashboard />,
    content: <DashboardResume />,
  },
  {
    id: "traffic",
    text: "Laporan Lalin",
    icon: <AirlineStops />,
    submenu: [
      {
        id: "traffic-daily",
        submenu: true,
        text: "Laporan Per Hari",
        content: <DailyTraffic />,
      },
    ],
  },
  {
    id: "gate",
    text: "Master Gerbang",
    icon: <VerticalSplit />,
    content: <GateMaster />,
  },
];

const DrawerContents = ({ open, activeMenu, setActiveMenu }) => {
  const [openCollapse, setOpenCollapse] = useState(false);
  return (
    <>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              selected={activeMenu === item.id}
              onClick={() => {
                if (item.submenu) {
                  setOpenCollapse(!openCollapse);
                } else {
                  setActiveMenu(item.id);
                }
              }}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{ opacity: open ? 1 : 0 }}
              />
              {item.submenu ? (
                openCollapse ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )
              ) : null}
            </ListItemButton>

            {item.submenu && (
              <Collapse in={openCollapse} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.submenu.map((sub) => (
                    <ListItemButton
                      key={sub.id}
                      sx={{ pl: 6 }}
                      selected={activeMenu === sub.id}
                      onClick={() => setActiveMenu(sub.id)}
                    >
                      <ListItemText primary={sub.text} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default DrawerContents;
