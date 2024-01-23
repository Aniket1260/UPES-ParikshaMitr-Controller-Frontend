"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { Button } from "@mui/material";
import { useThemeMode } from "@/context/themeModeContext";

export default function Home() {
  return (
    <Button variant="contained" color="primary">
      Hello World
    </Button>
  );
}
