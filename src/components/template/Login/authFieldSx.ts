import { SxProps, Theme } from "@mui/material";

export const authFieldSx: SxProps<Theme> = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "#FAFAFA",
    fontSize: "14px",
    transition: "background-color 150ms ease, box-shadow 150ms ease, border-color 150ms ease",
    "& fieldset": {
      borderColor: "#E4E4E7",
      borderWidth: "1px",
      transition: "border-color 150ms ease",
    },
    "&:hover": {
      backgroundColor: "#FFFFFF",
      "& fieldset": {
        borderColor: "#A1A1AA",
      },
    },
    "&.Mui-focused": {
      backgroundColor: "#FFFFFF",
      boxShadow: "0 0 0 3px rgba(24, 24, 27, 0.06)",
      "& fieldset": {
        borderColor: "#18181B",
        borderWidth: "1.5px",
      },
    },
    "&.Mui-error": {
      "& fieldset": {
        borderColor: "#DC2626",
      },
      "&.Mui-focused": {
        boxShadow: "0 0 0 3px rgba(220, 38, 38, 0.08)",
      },
    },
  },
  "& .MuiOutlinedInput-input": {
    padding: "12px 14px",
    fontSize: "14px",
    color: "#18181B",
    "&::placeholder": {
      color: "#A1A1AA",
      opacity: 1,
    },
    "&:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 100px #FAFAFA inset !important",
      WebkitTextFillColor: "#18181B !important",
      borderRadius: "11px",
      caretColor: "#18181B",
    },
    "&:-webkit-autofill:focus": {
      WebkitBoxShadow: "0 0 0 100px #FFFFFF inset !important",
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: "13px",
    color: "#52525B",
    "&.Mui-focused": {
      color: "#18181B",
    },
    "&.Mui-error": {
      color: "#DC2626",
    },
  },
  "& .MuiAutocomplete-inputRoot": {
    padding: "5px 10px",
    "& .MuiAutocomplete-input": {
      padding: "7px 4px",
    },
  },
  "& .MuiFormHelperText-root": {
    marginLeft: "4px",
    fontSize: "12px",
  },
};
