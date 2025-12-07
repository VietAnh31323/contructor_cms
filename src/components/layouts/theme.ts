import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  typography: {
    fontFamily: "Arial, sans-serif",
    fontWeightLight: "lighter",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        * {
          font-family: Arial, sans-serif !important;
        }
      `,
    },
  },
});
