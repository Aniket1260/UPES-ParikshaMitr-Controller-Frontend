import { Box, Paper } from "@mui/material";
import React from "react";

const Login = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Paper
        sx={{
          p: 5,
        }}
      >
        Login
      </Paper>
    </Box>
  );
};

export default Login;
