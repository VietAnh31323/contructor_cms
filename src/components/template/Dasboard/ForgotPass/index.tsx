import { CoreBreadcrumbs } from "@/components/atoms/CoreBreadcrumbs";
import { CoreButton } from "@/components/atoms/CoreButton";
import CoreInputCustom from "@/components/atoms/CoreInputCustom";
import CoreLoading from "@/components/molecules/CoreLoading";
import PageContainer from "@/components/organism/PageContainer";
import { ROUTES } from "@/routes";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import useForgotPass from "./useForgotPass";

export default function ForgotPassword() {
  const router = useRouter();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [value, handle] = useForgotPass();
  const { data, control, isLoading, isPending, isForcedChange } = value;
  const { onSubmit } = handle;

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const profile = data?.data;
  const fullName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    profile?.code ||
    "Chưa cập nhật";

  const cardBg = isDark ? "#0f172a" : "#ffffff";
  const subtleBg = isDark ? "#1e293b" : "#f8fafc";
  const borderColor = isDark ? "#1e293b" : "#e2e8f0";

  return (
    <PageContainer
      title={
        <CoreBreadcrumbs breadcrumbs={[{ title: "Mật khẩu cá nhân" }]} />
      }
    >
      {isLoading ? (
        <CoreLoading />
      ) : (
        <Box>
          {isForcedChange && (
            <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
              Đây là lần đăng nhập đầu tiên hoặc mật khẩu vừa được quản trị viên
              đặt lại. Vui lòng đổi mật khẩu mới để tiếp tục sử dụng hệ thống.
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Left: Security & Account Info Card */}
            <Grid item xs={12} md={4}>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 3,
                  borderColor,
                  bgcolor: cardBg,
                  height: "100%",
                }}
              >
                <Stack spacing={2.25}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: isDark ? "rgba(56,189,248,0.14)" : "#eff6ff",
                        color: isDark ? "#38bdf8" : "#2563eb",
                      }}
                    >
                      <LockOutlinedIcon />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={800}>
                        Bảo mật tài khoản
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Quản lý thông tin đăng nhập
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider />

                  <Box
                    sx={{
                      p: 1.75,
                      borderRadius: 2,
                      bgcolor: subtleBg,
                      border: `1px solid ${borderColor}`,
                    }}
                  >
                    <Stack spacing={1.25}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Tài khoản đăng nhập
                        </Typography>
                        <Typography variant="body2" fontWeight={700} noWrap>
                          {profile?.email || profile?.code || "N/A"}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Tên người dùng
                        </Typography>
                        <Typography variant="body2" fontWeight={700} noWrap>
                          {fullName}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>

                  <Stack spacing={1}>
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      color="text.secondary"
                      sx={{ textTransform: "uppercase", letterSpacing: "0.04em" }}
                    >
                      Lưu ý khi đặt mật khẩu
                    </Typography>
                    {[
                      "Độ dài tối thiểu 6 ký tự trở lên.",
                      "Nên kết hợp chữ hoa, chữ thường và số.",
                      "Hệ thống sẽ đăng xuất sau khi đổi mật khẩu để bảo mật.",
                    ].map((tip) => (
                      <Stack
                        key={tip}
                        direction="row"
                        spacing={1}
                        alignItems="flex-start"
                      >
                        <CheckCircleOutlineIcon
                          sx={{
                            fontSize: 16,
                            mt: "2px",
                            color: isDark ? "#34d399" : "#10b981",
                            flexShrink: 0,
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {tip}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>

                  {!isForcedChange && (
                    <>
                      <Divider />
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<PersonOutlineIcon />}
                        onClick={() => router.push(ROUTES.INFORMATION)}
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                        }}
                      >
                        Xem thông tin cá nhân
                      </Button>
                    </>
                  )}
                </Stack>
              </Paper>
            </Grid>

            {/* Right: Change Password Form Card */}
            <Grid item xs={12} md={8}>
              <Paper
                variant="outlined"
                sx={{
                  p: { xs: 2.5, sm: 3.5 },
                  borderRadius: 3,
                  borderColor,
                  bgcolor: cardBg,
                }}
              >
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    fontWeight={800}
                    sx={{ color: "text.primary" }}
                  >
                    Đổi mật khẩu
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    Nhập mật khẩu hiện tại và thiết lập mật khẩu mới cho tài
                    khoản của bạn.
                  </Typography>
                </Box>

                <form onSubmit={onSubmit}>
                  <Stack spacing={2.5} sx={{ maxWidth: 520 }}>
                    <CoreInputCustom
                      control={control}
                      name="oldPassword"
                      type={showOld ? "text" : "password"}
                      required
                      rules={{ required: "Vui lòng nhập mật khẩu hiện tại" }}
                      label="Mật khẩu hiện tại"
                      placeholder="Nhập mật khẩu hiện tại"
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            size="small"
                            onClick={() => setShowOld((p) => !p)}
                            edge="end"
                          >
                            {showOld ? (
                              <VisibilityOffOutlinedIcon fontSize="small" />
                            ) : (
                              <VisibilityOutlinedIcon fontSize="small" />
                            )}
                          </IconButton>
                        ),
                      }}
                    />

                    <CoreInputCustom
                      control={control}
                      name="newPassword"
                      type={showNew ? "text" : "password"}
                      required
                      rules={{ required: "Vui lòng nhập mật khẩu mới" }}
                      label="Mật khẩu mới"
                      placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            size="small"
                            onClick={() => setShowNew((p) => !p)}
                            edge="end"
                          >
                            {showNew ? (
                              <VisibilityOffOutlinedIcon fontSize="small" />
                            ) : (
                              <VisibilityOutlinedIcon fontSize="small" />
                            )}
                          </IconButton>
                        ),
                      }}
                    />

                    <CoreInputCustom
                      control={control}
                      name="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      required
                      rules={{ required: "Vui lòng xác nhận mật khẩu mới" }}
                      label="Xác nhận mật khẩu"
                      placeholder="Nhập lại mật khẩu mới"
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            size="small"
                            onClick={() => setShowConfirm((p) => !p)}
                            edge="end"
                          >
                            {showConfirm ? (
                              <VisibilityOffOutlinedIcon fontSize="small" />
                            ) : (
                              <VisibilityOutlinedIcon fontSize="small" />
                            )}
                          </IconButton>
                        ),
                      }}
                    />
                  </Stack>

                  <Divider sx={{ my: 3 }} />

                  <Stack
                    direction="row"
                    spacing={1.5}
                    justifyContent="flex-end"
                    alignItems="center"
                  >
                    {!isForcedChange && (
                      <CoreButton
                        onClick={() => router.push(ROUTES.DASHBOARD)}
                        theme="cancel"
                      >
                        Hủy bỏ
                      </CoreButton>
                    )}
                    <CoreButton
                      theme="submit"
                      type="submit"
                      disabled={isPending}
                    >
                      {isPending ? "Đang cập nhật..." : "Đổi mật khẩu"}
                    </CoreButton>
                  </Stack>
                </form>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}
    </PageContainer>
  );
}
