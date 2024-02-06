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
          {invigilationMenu.map((item) => (
            <Link href={item.href} key={item.id}>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
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
          {userMenu.map((item) => (
            <Link href={item.href} key={item.id}>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default CustomDrawer;
