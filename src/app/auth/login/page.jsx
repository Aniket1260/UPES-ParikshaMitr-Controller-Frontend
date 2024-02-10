"use client";
import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Box,
} from "@mui/material";

function App() {
  const [sapid, setSapid] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const isValidUsername = /^\d{9}$/.test(username);

    if (isValidUsername) {
      console.log("Login clicked");
    } else {
      console.error("Invalid username. Please enter a 9-digit number.");
    }
  };

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
        <Box>
          <Typography variant="h4">SIGN IN</Typography>
        </Box>
        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            label="SAP ID"
            id="sapid"
            name="sapid"
            value={sapid}
            onChange={(e) => setSapid(e.target.value)}
            required
          />
          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            label="Password"
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Typography
            variant="body2"
            align="right"
            style={{ marginTop: "3px", marginBottom: "10px" }}
          >
            <Link href="#" color="primary">
              Forgot password?
            </Link>
          </Typography>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Sign in
          </Button>
        </form>

        <Button
          variant="outlined"
          align="center"
          fullWidth
          sx={{ marginTop: "7px" }}
        >
          <Typography variant="body2" color="white">
            Dont have an account?{" "}
            <Link href="/auth/sign-up" color="primary">
              Sign Up
            </Link>
          </Typography>
          .
        </Button>
      </Paper>
    </Box>
  );
}

export default App;
