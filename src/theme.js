import { amber, deepOrange, grey } from "@mui/material/colors";

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          primary: {
            main: amber[500],
          },
          secondary: {
            main: deepOrange[900],
          },
          background: {
            default: grey[100],
          },
        }
      : {
          primary: {
            main: amber[200],
          },
          secondary: {
            main: deepOrange[900],
          },
          background: {
            default: grey[900],
          },
        }),
  },
});
