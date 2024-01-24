import React from "react";
import CustomAppBar from "@/components/CustomAppBar";
import { Box } from "@mui/material";

const TeacherLayout = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        overflow: "hidden",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <CustomAppBar />
      {children}
    </Box>
  );
};

export default TeacherLayout;
