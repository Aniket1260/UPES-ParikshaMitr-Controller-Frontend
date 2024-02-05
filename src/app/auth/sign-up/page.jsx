"use client";

import React, { useState } from "react";
import { Box, Paper, TextField, Button, Typography, Link } from "@mui/material";

const Signup = () => {
  const [name, setName] = useState("");
  const [sapid, setSapid] = useState("");
  const [password, setPassword] = useState("");
  const [reenteredPassword, setReenteredPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    console.log("Signup clicked");
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
        <Typography variant="h4">SIGN UP</Typography>
        <form onSubmit={handleSignup}>
          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            label="Name"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            label="Re-enter Password"
            type="password"
            id="reenteredPassword"
            name="reenteredPassword"
            value={reenteredPassword}
            onChange={(e) => setReenteredPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: "10px" }}
          >
            Sign up
          </Button>
        </form>
        <Button
          variant="outlined"
          align="center"
          fullWidth
          sx={{ marginTop: "7px" }}
        >
          <Typography variant="body2" color="white">
            Already have an account?{" "}
            <Link href="/auth/login" color="primary">
              Sign In
            </Link>
          </Typography>
          .
        </Button>
      </Paper>
    </Box>
  );
};

export default Signup;
