"use client";
import React, { useState } from "react";
import { Box, Paper, TextField, Button, Typography, Link } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { signup } from "@/services/signup.service";

const Signup = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [reenteredPassword, setReenteredPassword] = useState("");

  const signupMutation = useMutation({
    mutationFn: (formData) => signup(formData),
    onSuccess: (response) => {
      console.log("Success");
      console.log("Data from backend:", response);
    },
    onError: (error) => {
      console.log("Failed", error);
    },
    onSettled: () => {
      console.log("Signup Mutation Settled");
    },
  });

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== reenteredPassword) {
      console.error("Passwords do not match");
      return;
    }
    // try {
    //   const response = await signupMutation.mutateAsync({
    //     name,
    //     username,
    //     password,
    //   });
    //   console.log("Success");
    //   console.log("Data from backend:", response);
    // } catch (error) {
    //   console.log("Failed", error);
    // }
    signupMutation.mutate({
      name,
      username,
      password,
    });
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
            label="Username"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
