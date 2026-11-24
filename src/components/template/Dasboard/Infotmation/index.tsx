import { CoreBreadcrumbs } from "@/components/atoms/CoreBreadcrumbs";
import CoreAutocomplete from "@/components/atoms/CoreAutocomplete";
import { CoreButton } from "@/components/atoms/CoreButton";
import { CoreDatePicker } from "@/components/atoms/CoreDatePicker";
import CoreInputCustom from "@/components/atoms/CoreInputCustom";
import { getEnum } from "@/components/atoms/TextColor";
import { AvatarUploadField } from "@/components/molecules/AvatarUploadField";
import CoreLoading from "@/components/molecules/CoreLoading";
import PageContainer from "@/components/organism/PageContainer";
import useInformation from "@/components/template/Dasboard/Infotmation/useInformation";
import { ROUTES } from "@/routes";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";

const POSITION_OPTIONS = [
  { label: "Kiến trúc sư", value: "ARCHITECT" },
  { label: "Kỹ sư điện nước", value: "MEP_ENGINEER" },
  { label: "Kỹ sư kết cấu", value: "STRUCTURAL_ENGINEER" },
  { label: "Kỹ sư giám sát", value: "ESTIMATOR" },
  { label: "Dự toán viên", value: "SUPERVISOR" },
];

const GENDER_OPTIONS = [
  { label: "Nam", value: "MALE" },
  { label: "Nữ", value: "FEMALE" },
];

export default function Information() {
  const router = useRouter();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [value, handle] = useInformation();
  const { onSubmit, setValue } = handle;
  const { control, data, isLoading, isPending, watchedAvatar } = value;

  const profile = data?.data;
  const fullName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    profile?.code ||
    profile?.email ||
    "Người dùng";
  const initials = fullName.slice(0, 2).toUpperCase();
  const positionLabel =
    getEnum(profile?.position, POSITION_OPTIONS) ?? "Chưa cập nhật";

  const cardBg = isDark ? "#0f172a" : "#ffffff";
  const subtleBg = isDark ? "#1e293b" : "#f8fafc";
  const borderColor = isDark ? "#1e293b" : "#e2e8f0";

  return (
    <PageContainer
      title={
        <CoreBreadcrumbs breadcrumbs={[{ title: "Thông tin cá nhân" }]} />
      }
    >
      {isLoading ? (
        <CoreLoading />
      ) : (
        <Grid container spacing={3}>
          {/* Left: Profile Overview Card */}
          <Grid item xs={12} md={4}>
            <Paper
              variant="outlined"
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                borderColor,
                bgcolor: cardBg,
              }}
            >
              {/* Subtle top accent band */}
              <Box
                sx={{
                  height: 84,
                  background: isDark
                    ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
                    : "linear-gradient(135deg, #e0f2fe 0%, #f1f5f9 100%)",
                  borderBottom: `1px solid ${borderColor}`,
                }}
              />

              <Box sx={{ px: 3, pb: 3, mt: -6 }}>
                <Stack alignItems="center" spacing={1.25} textAlign="center">
                  <Avatar
                    src={watchedAvatar ?? profile?.avatar}
                    alt={fullName}
                    sx={{
                      width: 96,
                      height: 96,
                      fontSize: 28,
                      fontWeight: 800,
                      bgcolor: "#2563eb",
                      color: "#ffffff",
                      border: `4px solid ${cardBg}`,
                      boxShadow: "0 4px 14px rgba(15, 23, 42, 0.14)",
                    }}
                  >
                    {initials}
                  </Avatar>

                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight={800}
                      sx={{ color: "text.primary" }}
                    >
                      {fullName}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="center"
                      alignItems="center"
                      sx={{ mt: 0.75 }}
                    >
                      {profile?.code && (
                        <Chip
                          size="small"
                          label={profile.code}
                          sx={{
                            fontWeight: 700,
                            fontSize: 11,
                            bgcolor: subtleBg,
                            color: "text.primary",
                          }}
                        />
                      )}
                      <Chip
                        size="small"
                        color="primary"
                        variant="outlined"
                        label={positionLabel}
                        sx={{ fontWeight: 600, fontSize: 11 }}
                      />
                    </Stack>
                  </Box>
                </Stack>

                <Divider sx={{ my: 2.5 }} />

                <Stack spacing={1.6}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <EmailOutlinedIcon
                      fontSize="small"
                      sx={{ color: "text.secondary" }}
                    />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="caption" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {profile?.email || "Chưa cập nhật"}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <PhoneOutlinedIcon
                      fontSize="small"
                      sx={{ color: "text.secondary" }}
                    />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="caption" color="text.secondary">
                        Số điện thoại
                      </Typography>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {profile?.phone || "Chưa cập nhật"}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <CakeOutlinedIcon
                      fontSize="small"
                      sx={{ color: "text.secondary" }}
                    />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="caption" color="text.secondary">
                        Ngày sinh
                      </Typography>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {profile?.birthDate || "Chưa cập nhật"}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <HomeOutlinedIcon
                      fontSize="small"
                      sx={{ color: "text.secondary" }}
                    />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="caption" color="text.secondary">
                        Địa chỉ
                      </Typography>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {profile?.address || "Chưa cập nhật"}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>

                <Divider sx={{ my: 2.5 }} />

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<LockResetOutlinedIcon />}
                  onClick={() => router.push(ROUTES.FORGOTPASS)}
                  sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
                >
                  Đổi mật khẩu tài khoản
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Right: Edit Form Card */}
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
                  Chỉnh sửa thông tin cá nhân
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Cập nhật thông tin liên hệ và chức vụ hiển thị trong hệ thống.
                </Typography>
              </Box>

              <form onSubmit={onSubmit}>
                <Box sx={{ mb: 3 }}>
                  <AvatarUploadField
                    value={watchedAvatar ?? profile?.avatar}
                    onChange={(url) =>
                      setValue("avatar", url, { shouldDirty: true })
                    }
                    fallbackText={initials}
                    label="Hình ảnh cá nhân"
                    helperText="Ảnh đại diện sẽ hiển thị trong hồ sơ nhân sự và tài khoản của bạn (PNG, JPG, tối đa 5MB)."
                  />
                </Box>

                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <CoreInputCustom
                      control={control}
                      name="firstName"
                      label="Họ"
                      placeholder="Nhập họ"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CoreInputCustom
                      control={control}
                      name="lastName"
                      label="Tên"
                      placeholder="Nhập tên"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <CoreInputCustom
                      control={control}
                      name="phone"
                      label="Số điện thoại"
                      placeholder="Nhập số điện thoại"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CoreAutocomplete
                      options={GENDER_OPTIONS}
                      control={control}
                      name="gender"
                      label="Giới tính"
                      placeholder="Chọn giới tính"
                      valuePath="value"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <CoreInputCustom
                      control={control}
                      name="email"
                      label="Email"
                      placeholder="Nhập email"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CoreAutocomplete
                      options={POSITION_OPTIONS}
                      control={control}
                      name="position"
                      label="Chức vụ"
                      placeholder="Chọn chức vụ"
                      valuePath="value"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <CoreDatePicker
                      name="birthDate"
                      control={control!}
                      label="Ngày sinh"
                      placeholder="Chọn ngày sinh"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CoreInputCustom
                      control={control}
                      name="address"
                      label="Địa chỉ"
                      placeholder="Nhập địa chỉ"
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Stack
                  direction="row"
                  spacing={1.5}
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <CoreButton
                    onClick={() => router.push(ROUTES.DASHBOARD)}
                    theme="cancel"
                  >
                    Hủy bỏ
                  </CoreButton>
                  <CoreButton
                    theme="submit"
                    type="submit"
                    disabled={isPending}
                  >
                    {isPending ? "Đang lưu..." : "Lưu thay đổi"}
                  </CoreButton>
                </Stack>
              </form>
            </Paper>
          </Grid>
        </Grid>
      )}
    </PageContainer>
  );
}
