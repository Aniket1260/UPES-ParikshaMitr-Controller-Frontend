import React from "react";
import CustomAppBar from "@/components/CustomAppBar";
import { Box, Toolbar } from "@mui/material";
import CustomDrawer from "@/components/CustomDrawer";

const TeacherLayout = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        width: "100%",
        overflow: "hidden",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <CustomAppBar />
      <CustomDrawer />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar variant="dense" />
        {children}
      </Box>
    </Box>
  );
};

export default TeacherLayout;
