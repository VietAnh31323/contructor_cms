import { Box, Grid, Typography } from "@mui/material";
import PageContainer from "@/components/organism/PageContainer";
import { CoreBreadcrumbs } from "@/components/atoms/CoreBreadcrumbs";
import { CoreButton } from "@/components/atoms/CoreButton";
import CoreNavbar from "@/components/organism/CoreNavbar";
import CoreInputCustom from "@/components/atoms/CoreInputCustom";
import useForgotPass from "./useForgotPass";
import { RowBoxCommon } from "@/components/atoms/RowBoxCommon";
import { ROUTES } from "@/routes";
import router from "next/router";
import CoreLoading from "@/components/molecules/CoreLoading";

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

export default function ForgotPassword() {
  const [value, handle] = useForgotPass();
  const { data, control, isLoading } = value;
  const { onSubmit, watch } = handle;

  const newPassword = watch?.("newPassword") ?? "";
  const strength = checkPasswordStrength(newPassword);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ overflowY: "auto", overflowX: "hidden" }}
    >
      <PageContainer
        title={
          <CoreBreadcrumbs breadcrumbs={[{ title: "Mật khẩu cá nhân" }]} />
        }
      >
        <CoreNavbar
          breadcrumbs={[
            {
              title: "Mật khẩu",
              content: isLoading ? (
                <CoreLoading />
              ) : (
                <Grid>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <RowBoxCommon
                        title="Tài khoản đăng nhập"
                        data={data?.data?.email ?? "N/A"}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <RowBoxCommon
                        title="Tên người dùng"
                        data={`${data?.data?.firstName ?? ""} ${
                          data?.data?.lastName ?? ""
                        }`}
                      />
                    </Grid>
                  </Grid>

                  <form className="flex flex-col py-6" onSubmit={onSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <CoreInputCustom
                          control={control}
                          name="oldPassword"
                          label="Mật khẩu cũ"
                          placeholder="Nhập mật khẩu cũ"
                          type="password"
                          rules={{
                            required: "Trường dữ liệu này không được để trống",
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <CoreInputCustom
                          control={control}
                          name="newPassword"
                          label="Mật khẩu mới"
                          placeholder="Nhập mật khẩu mới"
                          // type="password"
                          rules={{
                            required: "Trường dữ liệu này không được để trống",
                            minLength: {
                              value: 6,
                              message: "Mật khẩu tối thiểu 6 ký tự",
                            },
                            validate: (value: string) =>
                              checkPasswordStrength(value).label !== "Yếu" ||
                              "Mật khẩu quá yếu",
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

                      <Grid item xs={12} md={6}>
                        <CoreInputCustom
                          control={control}
                          name="confirmPassword"
                          label="Xác nhận mật khẩu"
                          placeholder="Nhập lại mật khẩu mới"
                          // type="password"
                          rules={{
                            required: "Trường dữ liệu này không được để trống",
                            validate: (value: string) =>
                              value === newPassword ||
                              "Mật khẩu xác nhận không khớp",
                          }}
                        />
                      </Grid>
                    </Grid>

                    <Box py={5} display="flex" justifyContent="center" gap={4}>
                      <CoreButton
                        theme="cancel"
                        onClick={() => router.push(ROUTES.DASHBOARD)}
                      >
                        Hủy bỏ
                      </CoreButton>
                      <CoreButton theme="submit" type="submit">
                        Lưu
                      </CoreButton>
                    </Box>
                  </form>
                </Grid>
              ),
            },
          ]}
        />
      </PageContainer>
    </Grid>
  );
}
