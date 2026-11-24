import { createTheme } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";

export const APP_FONT_FAMILY =
  '"Be Vietnam Pro", "Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export const APP_MONO_FONT_FAMILY =
  '"JetBrains Mono", "Cascadia Mono", Consolas, "Courier New", monospace';

export function createAppTheme(mode: PaletteMode = "light") {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      ...(isDark
        ? {
            background: {
              default: "#090d16",
              paper: "#0f172a",
            },
            text: {
              primary: "#f1f5f9",
              secondary: "#94a3b8",
            },
            divider: "#1e293b",
          }
        : {
            background: {
              default: "#f8fafc",
              paper: "#ffffff",
            },
            text: {
              primary: "#0f172a",
              secondary: "#64748b",
            },
            divider: "#e2e8f0",
          }),
    },
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
          ...(isDark && {
            borderBottomColor: "#1e293b",
            color: "#e2e8f0",
          }),
        },
        head: {
          ...(isDark && {
            backgroundColor: "#1e293b",
            color: "#cbd5e1",
          }),
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          ...(isDark && {
            backgroundImage: "none",
            borderColor: "#1e293b",
          }),
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
}

export const theme = createAppTheme("light");
