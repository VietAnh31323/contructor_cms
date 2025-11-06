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
import { useResetPass } from "./useResetPass";
import router from "next/router";
import { ROUTES } from "@/routes";

export default function ResetPass() {
  const [values, handle] = useResetPass();
  const { control } = values;
  const {} = handle;
  const ReturnLogin = () => {
    router.push(ROUTES.LOGIN);
  };

  return (
    <Box
      sx={{
        height: "100vh",
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
            Quên mật khẩu
          </Typography>
          <br />
          <Grid item xs={12}>
            <TextField
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
            <Autocomplete
              options={[
                { id: 1, value: "Quản lý" },
                { id: 2, value: "Nhân viên" },
                { id: 3, value: "CSKH" },
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
            <div className="flex justify-center text-[#002C66]">
              <div className="text-center">
                <Typography>
                  Vui lòng kiểm tra email để nhận lại mật khẩu mới
                </Typography>
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
            >
              Gửi yêu cầu
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="text"
              onClick={ReturnLogin}
              sx={{
                cursor: "point",
                textTransform: "capitalize",
                textAlign: "center",
                width: "100%",
                fontSize: "1rem",
                color: "#002C66",
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
