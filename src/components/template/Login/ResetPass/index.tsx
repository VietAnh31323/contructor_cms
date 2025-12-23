import CoreInput from "@/components/atoms/CoreInput";
import {
  Grid,
  Box,
  TextField,
  Button,
  Typography,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useResetPass } from "./useResetPass";
import router from "next/router";
import { ROUTES } from "@/routes";
import CoreAutocomplete from "@/components/atoms/CoreAutocomplete";
import CoreInputCustom from "@/components/atoms/CoreInputCustom";
import { useEffect, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

type PasswordStrength = {
  label: string;
  value: number; // 20 - 100
  level: number; // 1 - 5
};

const checkPasswordStrength = (password: string): PasswordStrength => {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: "Rất yếu", color: "error.main" },
    { label: "Yếu", color: "error.main" },
    { label: "Trung bình", color: "warning.main" },
    { label: "Mạnh", color: "success.main" },
    { label: "Rất mạnh", color: "success.main" },
  ];

  return {
    label: levels[score - 1]?.label || "Rất yếu",
    value: (score / 5) * 100,
    level: score || 1,
  };
};

const strengthColorMap: Record<number, string> = {
  1: "error.main",
  2: "error.main",
  3: "warning.main",
  4: "success.main",
  5: "success.main",
};
export default function ResetPass() {
  const [values, handle] = useResetPass();
  const { control } = values;
  const { sendOtp, verifyOtp, resetPass, watch } = handle;
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"SEND" | "VERIFY" | "RESET">("SEND");
  const toggleShow = () => setShowPassword((prev) => !prev);
  const ReturnLogin = () => {
    router.push(ROUTES.LOGIN);
  };
  const [timer, setTimer] = useState(300);
  const newPassword = watch?.("newPassword") ?? "";
  const strength = checkPasswordStrength(newPassword);
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleSubmitClick = () => {
    if (step === "SEND") {
      sendOtp();
      setStep("VERIFY");
      setTimer(300);
    } else if (step === "VERIFY") {
      verifyOtp();
      setStep("RESET");
    } else {
      resetPass();
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: 600,
          p: 8,
          boxShadow: 3,
          borderRadius: 5,
          border: "2px solid #002C66",
          backgroundColor: "#ffffff8e",
        }}
      >
        <Grid container spacing={2}>
          <Typography
            sx={{
              color: "#002C66",
              margin: "10px auto",
              fontSize: 32,
              fontWeight: "bold",
            }}
          >
            Quên mật khẩu
          </Typography>

          {step === "SEND" && (
            <>
              <Grid item xs={12}>
                <CoreInputCustom
                  control={control}
                  label="Email"
                  name="username"
                  placeholder="Nhập Email"
                  required
                  rules={{ required: "Trường này không được để trống" }}
                />
              </Grid>

              <Grid item xs={12}>
                <CoreAutocomplete
                  options={[
                    { label: "Quản trị viên", value: "ADMIN" },
                    { label: "Nhân viên", value: "STAFF" },
                    { label: "Nhân viên CSKH", value: "CUSTOMER_CARE" },
                  ]}
                  control={control}
                  name="eRole"
                  label="Chức vụ"
                  placeholder="Chọn chức vụ"
                  valuePath="value"
                />
              </Grid>
            </>
          )}

          {step === "VERIFY" && timer > 0 && (
            <Grid item xs={12}>
              <Grid item xs={12}>
                <CoreInputCustom
                  control={control}
                  label="Mã OTP"
                  name="otp"
                  placeholder="Nhập mã OTP"
                  required
                  rules={{ required: "Trường này không được để trống" }}
                />
              </Grid>
              <br />
              <Grid item xs={12}>
                <Typography textAlign="center" color="red">
                  Mã OTP sẽ hết hạn sau: {formatTime(timer)}
                </Typography>
              </Grid>
            </Grid>
          )}

          {step === "RESET" && (
            <>
              <Grid item xs={12}>
                <CoreInput
                  control={control}
                  name="newPassword"
                  label="Mật khẩu"
                  placeholder="Nhập mật khẩu"
                  type={showPassword ? "text" : "password"}
                  rules={{
                    required: "Trường này không được để trống",
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={toggleShow} edge="end">
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {newPassword && (
                  <Box mt={1}>
                    <Box display="flex" gap={0.5}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Box
                          key={i}
                          flex={1}
                          height={6}
                          borderRadius={2}
                          bgcolor={
                            strength.level >= i
                              ? strengthColorMap[strength.level]
                              : "grey.300"
                          }
                          sx={{ transition: "background-color 0.3s" }}
                        />
                      ))}
                    </Box>

                    <Typography
                      variant="caption"
                      color={strengthColorMap[strength.level]}
                    >
                      Độ mạnh mật khẩu: {strength.label}
                    </Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12}>
                <CoreInput
                  control={control}
                  name="confirmPassword"
                  label="Xác nhận mật khẩu"
                  placeholder="Xác nhận mật khẩu"
                  type={showPassword ? "text" : "password"}
                  rules={{
                    required: "Trường này không được để trống",
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={toggleShow} edge="end">
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmitClick}
              disabled={step === "VERIFY" && timer === 0}
              sx={{
                backgroundColor: "#002C66",
                color: "#fff",
                borderRadius: 3,
                padding: 1,
                "&:hover": {
                  backgroundColor: "#001A40",
                },
              }}
            >
              {step === "SEND"
                ? "Gửi mã OTP"
                : step === "VERIFY"
                ? "Xác nhận OTP"
                : "Đổi mật khẩu"}
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="text"
              onClick={ReturnLogin}
              sx={{
                color: "#002C66",
                display: "flex",
                margin: "0 auto",
              }}
            >
              Quay lại
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
