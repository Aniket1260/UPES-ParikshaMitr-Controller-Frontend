"use client";
import React from "react";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { DarkMode, LightMode, Logout, Power } from "@mui/icons-material";
import { useThemeMode } from "@/context/themeModeContext";
import { useRouter } from "next/navigation";

const CustomAppBar = () => {
  const { mode, colorMode } = useThemeMode();
  const router = useRouter();
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
        <Box>
          <IconButton
            color="inherit"
            aria-label="change_theme"
            onClick={() => colorMode.toggleColorMode()}
          >
            {mode === "dark" ? <LightMode /> : <DarkMode />}
          </IconButton>
          <IconButton
            onClick={() => {
              router.push("/auth/login");
              localStorage.removeItem("token");
            }}
          >
            <Logout />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
