"use client";
import React, { useState } from "react";
import { Box, Paper, TextField, Button, Typography, Link } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { signup } from "@/services/signup.service";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";

const Signup = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [reenteredPassword, setReenteredPassword] = useState("");

  const router = useRouter();

  const signupMutation = useMutation({
    mutationFn: () =>
      signup({
        name,
        username,
        password,
      }),
    onSuccess: () => {
      enqueueSnackbar({
        variant: "success",
        message: "Signup Successful",
      });
      router.push("/auth/login");
    },
    onError: (error) => {
      enqueueSnackbar({
        variant: "error",
        message: error.response.status + " : " + error.response.data.message,
      });
    },
  });

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== reenteredPassword) {
      console.error("Passwords do not match");
      return;
    }
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
          onClick={handleSignup}
        >
          Sign up
        </Button>
        <Button
          variant="outlined"
          align="center"
          fullWidth
          sx={{ marginTop: "7px" }}
          onClick={() => router.push("/auth/login")}
        >
          Already have an account? Sign In
        </Button>
      </Paper>
    </Box>
  );
};

export default Signup;
