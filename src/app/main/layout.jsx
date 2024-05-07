"use client";
import React, { useEffect } from "react";
import CustomAppBar from "@/components/CustomAppBar";
import { Box, Divider, Toolbar, Typography } from "@mui/material";
import CustomDrawer from "@/components/CustomDrawer";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { invigilationMenu, userMenu } from "@/config/sidenav.config";

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.data.message === "Invalid Token") {
      localStorage.removeItem("token");
      window.location.replace("/auth/login");
    }
    return Promise.reject(error);
  }
);

const protectedRoutes = [
  ...invigilationMenu
    .filter((ele) => ele.proctor === false)
    .map((item) => item.href),
  ...userMenu.filter((ele) => ele.proctor === false).map((item) => item.href),
];

const TeacherLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  let token;
  let role;

  useEffect(() => {
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token");
      role = localStorage.getItem("role");
      if (!token) {
        router.push("/auth/login");
      }

      if (role === "proctor") {
        console.log(pathname);
        if (protectedRoutes.includes(pathname)) {
          router.push("/main/teacher");
        }
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
      <Box
        sx={{ flexGrow: 1, p: 3, position: "relative", paddingBottom: "100px" }}
      >
        <Toolbar variant="dense" />
        {children}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            textAlign: "center",
            height: "40px",
            width: "calc(100% - 50px)",
            // bgcolor: "#160b28",
          }}
        >
          <Divider />
          <Typography variant="body2" sx={{ lineHeight: "40px" }}>
            © {new Date().getFullYear()} Parikshamitr Team
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TeacherLayout;
