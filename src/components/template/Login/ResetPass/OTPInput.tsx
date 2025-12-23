import { Box, TextField } from "@mui/material";
import { useState } from "react";

type OTPInputProps = {
  control: any;
  name: string;
};

export default function OTPInput({ control, name }: OTPInputProps) {
  const length = 6;
  const [otpValues, setOtpValues] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // không cho nhập >1 ký tự

    const newOtp = [...otpValues];
    newOtp[index] = value;
    setOtpValues(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(
        `otp-${index + 1}`
      ) as HTMLInputElement | null;
      nextInput?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      const prev = document.getElementById(
        `otp-${index - 1}`
      ) as HTMLInputElement | null;
      prev?.focus();
    }
  };

  return (
    <Box display="flex" justifyContent="space-between" gap={1}>
      {Array.from({ length }).map((_, i) => (
        <TextField
          key={i}
          id={`otp-${i}`}
          value={otpValues[i]}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
            handleKeyDown(i, e)
          }
          inputProps={{
            maxLength: 1,
            style: { textAlign: "center", fontSize: 24, padding: "10px" },
          }}
          sx={{ width: "3rem" }}
        />
      ))}
    </Box>
  );
}
