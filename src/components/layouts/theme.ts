import { createTheme } from "@mui/material/styles";

export const APP_FONT_FAMILY =
  '"Be Vietnam Pro", "Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export const APP_MONO_FONT_FAMILY =
  '"JetBrains Mono", "Cascadia Mono", Consolas, "Courier New", monospace';

export const theme = createTheme({
  typography: {
    fontFamily: APP_FONT_FAMILY,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    allVariants: {
      fontFamily: APP_FONT_FAMILY,
      letterSpacing: "normal",
    },
    h1: { fontWeight: 700, lineHeight: 1.3 },
    h2: { fontWeight: 700, lineHeight: 1.32 },
    h3: { fontWeight: 700, lineHeight: 1.35 },
    h4: { fontWeight: 700, lineHeight: 1.38 },
    h5: { fontWeight: 600, lineHeight: 1.42 },
    h6: { fontWeight: 600, lineHeight: 1.45 },
    subtitle1: { lineHeight: 1.5 },
    subtitle2: { lineHeight: 1.5 },
    body1: { lineHeight: 1.55 },
    body2: { lineHeight: 1.55 },
    caption: { lineHeight: 1.45 },
    overline: { lineHeight: 1.5, letterSpacing: "0.04em" },
    button: {
      fontFamily: APP_FONT_FAMILY,
      fontWeight: 500,
      textTransform: "none",
      letterSpacing: "normal",
      lineHeight: 1.5,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          fontFamily: APP_FONT_FAMILY,
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          textRendering: "optimizeLegibility",
        },
        body: {
          fontFamily: APP_FONT_FAMILY,
          lineHeight: 1.55,
        },
        "input, textarea, select, button": {
          fontFamily: "inherit",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: APP_FONT_FAMILY,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: APP_FONT_FAMILY,
          letterSpacing: "normal",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: APP_FONT_FAMILY,
        },
        label: {
          lineHeight: 1.4,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: APP_FONT_FAMILY,
          letterSpacing: "normal",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontFamily: APP_FONT_FAMILY,
          lineHeight: 1.5,
        },
        input: {
          fontFamily: APP_FONT_FAMILY,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: APP_FONT_FAMILY,
          lineHeight: 1.45,
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontFamily: APP_FONT_FAMILY,
          lineHeight: 1.45,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: APP_FONT_FAMILY,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: APP_FONT_FAMILY,
          lineHeight: 1.5,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontFamily: APP_FONT_FAMILY,
          lineHeight: 1.45,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: APP_FONT_FAMILY,
          lineHeight: 1.4,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          fontFamily: APP_FONT_FAMILY,
        },
      },
    },
  },
});
