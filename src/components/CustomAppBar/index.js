"use client";
import React from "react";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useThemeMode } from "@/context/themeModeContext";

const CustomAppBar = () => {
  const { mode, colorMode } = useThemeMode();
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar variant="dense">
        <Typography
          variant="h6"
          color="inherit"
          component="div"
          sx={{ flexGrow: 1 }}
        >
          UPES ParikshaMitr Controller Portal
        </Typography>
        <IconButton
          color="inherit"
          aria-label="change_theme"
          onClick={() => colorMode.toggleColorMode()}
        >
          {mode === "dark" ? <LightMode /> : <DarkMode />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
