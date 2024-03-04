"use client";
import React, { useEffect } from "react";
import CustomAppBar from "@/components/CustomAppBar";
import { Box, Toolbar } from "@mui/material";
import CustomDrawer from "@/components/CustomDrawer";
import { useRouter } from "next/navigation";
import axios from "axios";

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(error.response?.data.message);
    if (error.response?.data.message === "Invalid Token") {
      localStorage.removeItem("token");
      window.location.replace("/auth/login");
    }
    return Promise.reject(error);
  }
);

const TeacherLayout = ({ children }) => {
  const router = useRouter();
  let token;

  useEffect(() => {
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
      }
    }
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100%",
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
