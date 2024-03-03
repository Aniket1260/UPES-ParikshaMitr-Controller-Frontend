"use client";
import { createContext, useContext, useMemo, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { getDesignTokens } from "@/theme";

export const ThemeModeContext = createContext("");

export const ThemeModeContextProvider = ({ children }) => {
  const [mode, setMode] = useState("dark");
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeModeContext.Provider value={{ colorMode, mode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = () => useContext(ThemeModeContext);
