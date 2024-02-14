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
import { useQuery } from "@tanstack/react-query";
import { login } from "@/services/login.service";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = useQuery({
    queryKey: ["login"],
    queryFn: async () => {
      try {
        const result = await login(username, password);
        console.log("Success", result);
        return result;
      } catch (error) {
        console.log("Error", error);
        throw error;
      }
    },
    retry: 2,
    staleTime: 1000,
    gcTime: 1000 * 2,
  });

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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin.refetch();
          }}
        >
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
            Don't have an account?{" "}
            <Link href="/auth/sign-up" color="primary">
              Sign Up
            </Link>
          </Typography>
          .
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
