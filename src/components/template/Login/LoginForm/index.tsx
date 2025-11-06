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
} from "@mui/material";
import { useLoginForm } from "./useLoginForm";
import { useRouter } from "next/router";
import { ROUTES } from "@/routes";
import { useState } from "react";

export default function LoginForm() {
  const [values, handle] = useLoginForm();
  const { control } = values;
  const {} = handle;
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const handleForgotPassword = () => {
    router.push(ROUTES.RESET_PASSWORD);
  };
  const handleSubmit = (e: React.FormEvent) => {
    router.push("/dashboard");
  };
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
        component="form"
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
          <Grid item xs={12}>
            <TextField
              // error
              id="standard"
              label="Email"
              placeholder="Nhập Email"
              variant="standard"
              required
              focused
              sx={{ width: "100%" }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              id="standard-required"
              label="Mật khẩu"
              placeholder="Nhập mật khẩu"
              variant="standard"
              sx={{
                width: "100%",
              }}
              focused
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              options={[
                { id: 1, value: "Quản lý" },
                { id: 2, value: "Nhân viên" },
                {
                  id: 3,
                  value: "CSKH",
                },
              ]}
              getOptionLabel={(option) => option.value}
              disableCloseOnSelect
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chức vụ"
                  variant="standard"
                  placeholder="Chọn chức vụ"
                  fullWidth
                  focused
                />
              )}
            />
          </Grid>
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
              onClick={handleSubmit}
            >
              Đăng nhập
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
