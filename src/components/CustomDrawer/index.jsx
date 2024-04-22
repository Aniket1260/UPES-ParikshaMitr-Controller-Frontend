import { invigilationMenu, userMenu } from "@/config/sidenav.config";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import Link from "next/link";
import React from "react";

const CustomDrawer = () => {
  if (global?.window !== undefined) {
    var role = localStorage.getItem("role");
  }
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box" },
      }}
    >
      <Toolbar
        variant="dense"
        sx={{
          mb: 2,
        }}
      />
      <Box sx={{ overflow: "auto" }}>
        <Typography
          variant="body2"
          component="div"
          sx={{ px: 2, pt: 1 }}
          color="text.secondary"
        >
          Exam Management
        </Typography>
        <List>
          {invigilationMenu.map((item, idx) => {
            console.log(role, item.proctor);
            if (role === "proctor" && item.proctor === false) {
              return null;
            }
            return (
              <Link href={item.href} key={idx}>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.title} />
                  </ListItemButton>
                </ListItem>
              </Link>
            );
          })}
        </List>
        <Divider />
        <Typography
          variant="body2"
          component="div"
          sx={{ px: 2, pt: 1 }}
          color="text.secondary"
        >
          Teacher Management
        </Typography>
        <List>
          {userMenu.map((item, idx) => {
            console.log(role, item.proctor);
            if (role === "proctor" && item.proctor === false) {
              return null;
            }
            return (
              <Link href={item.href} key={idx}>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.title} />
                  </ListItemButton>
                </ListItem>
              </Link>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default CustomDrawer;
