"use client";
import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Box,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { login } from "@/services/login.service";
import { enqueueSnackbar } from "notistack";
import { useRouter } from "next/navigation";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const { mutate: handleLogin } = useMutation({
    mutationFn: () => login(username, password),
    onSuccess: (data) => {
      enqueueSnackbar({
        variant: "success",
        message: "Login Successful",
      });
      localStorage.setItem("token", data.token);
      router.push("/main/teacher");
    },
    onError: (error) => {
      enqueueSnackbar({
        variant: "error",
        message: error.response?.status + " : " + error.response?.data.message,
      });
    },
  });
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
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

        <TextField
          fullWidth
          variant="outlined"
          margin="normal"
          label="username"
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
        <Typography
          variant="body2"
          align="right"
          style={{ marginTop: "3px", marginBottom: "10px" }}
        >
          <Link href="#" color="primary">
            Forgot password?
          </Link>
        </Typography>
        <Button
          onClick={() => handleLogin()}
          variant="contained"
          color="primary"
          fullWidth
        >
          Sign in
        </Button>

        <Button
          variant="outlined"
          align="center"
          fullWidth
          sx={{ marginTop: "7px" }}
          onClick={() => router.push("/auth/sign-up")}
        >
          Don&apos;t have an account? Sign Up
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
