"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { Box, Button, Typography } from "@mui/material";
import { useThemeMode } from "@/context/themeModeContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/auth/login");
  }, [router]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Typography variant="h1">Welcome.</Typography>
    </Box>
  );
}
