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
import { useLoginForm } from "./useLoginForm";
import { useRouter } from "next/router";
import { MENU_URL, ROUTES } from "@/routes";
import { useState } from "react";
import CoreAutocomplete from "@/components/atoms/CoreAutocomplete";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function LoginForm() {
  const [values, handle] = useLoginForm();
  const { control } = values;
  const { onSubmit } = handle;
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const toggleShow = () => setShowPassword((prev) => !prev);

  const handleForgotPassword = () => {
    router.push(ROUTES.RESET_PASSWORD);
  };
  // const handleSubmit = (e: React.FormEvent) => {
  //   router.push(ROUTES.DASHBOARD);
  // };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundSize: "cover",
        backgroundPosition: "center",
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
            Đăng nhập
          </Typography>
          <br />
          <form className="w-full">
            <Grid item xs={12}>
              <CoreInput
                control={control}
                label="Email"
                name="username"
                placeholder="Nhập Email"
                required
                rules={{
                  required: "Trường này không được để trống",
                }}
                sx={{ width: "100%" }}
              />
            </Grid>
            <br />
            <CoreInput
              control={control}
              name="password"
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
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <br />
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
                required
                rules={{
                  required: "Bạn bắt buộc phải chọn chức vụ",
                }}
              />
            </Grid>
            <br />
            <Grid item xs={12}>
              <div className="flex justify-between">
                <div>
                  <FormControlLabel
                    required
                    control={<Checkbox />}
                    label="I agree to the terms & policy"
                    className="text-#002C66"
                  />
                </div>
                <div className="my-auto mx-0">
                  <Button
                    variant="text"
                    onClick={handleForgotPassword}
                    sx={{
                      cursor: "point",
                      textTransform: "capitalize",
                      color: "#002C66",
                    }}
                  >
                    Quên mật khẩu
                  </Button>
                </div>
              </div>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#002C66",
                  color: "#fff",
                  borderRadius: 3,
                  padding: 1,
                  "&:hover": {
                    backgroundColor: "#001A40",
                  },
                }}
                onClick={onSubmit}
              >
                Đăng nhập
              </Button>
            </Grid>
          </form>
        </Grid>
      </Box>
    </Box>
  );
}
