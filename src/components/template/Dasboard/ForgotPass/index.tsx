import { Alert, Grid } from "@mui/material";
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

export default function ForgotPassword() {
  const [value, handle] = useForgotPass();
  const { data, control, isLoading, isPending, isForcedChange } = value;
  const { onSubmit } = handle;

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <PageContainer
        title={
          <CoreBreadcrumbs breadcrumbs={[{ title: "Mật khẩu cá nhân" }]} />
        }
      >
        <br />
        <CoreNavbar
          breadcrumbs={[
            {
              title: "Đổi mật khẩu",
              content: isLoading ? (
                <CoreLoading />
              ) : (
                <Grid>
                  {isForcedChange && (
                    <Alert severity="warning" sx={{ mb: 3 }}>
                      Đây là lần đăng nhập đầu tiên hoặc mật khẩu vừa được quản
                      trị viên đặt lại. Vui lòng đổi mật khẩu mới để tiếp tục sử
                      dụng hệ thống.
                    </Alert>
                  )}
                  <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <RowBoxCommon
                        title="Tài khoản đăng nhập"
                        data={data?.data?.email ?? "N/A"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <RowBoxCommon
                        title="Tên người dùng"
                        data={
                          [data?.data?.firstName, data?.data?.lastName]
                            .filter(Boolean)
                            .join(" ") || "N/A"
                        }
                      />
                    </Grid>
                  </Grid>
                  <form className="flex flex-col py-6 " onSubmit={onSubmit}>
                    <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        <CoreInputCustom
                          control={control}
                          name="oldPassword"
                          type="password"
                          required
                          rules={{ required: "Vui lòng nhập mật khẩu hiện tại" }}
                          label="Mật khẩu hiện tại"
                          placeholder="Nhập mật khẩu hiện tại"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        <CoreInputCustom
                          control={control}
                          name="newPassword"
                          type="password"
                          required
                          rules={{ required: "Vui lòng nhập mật khẩu mới" }}
                          label="Mật khẩu mới"
                          placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        <CoreInputCustom
                          control={control}
                          name="confirmPassword"
                          type="password"
                          required
                          rules={{ required: "Vui lòng xác nhận mật khẩu mới" }}
                          label="Xác nhận mật khẩu"
                          placeholder="Nhập lại mật khẩu mới"
                        />
                      </Grid>
                    </Grid>
                    <div className="py-5 flex justify-center gap-4 items-center">
                      {!isForcedChange && (
                        <CoreButton
                          onClick={() => {
                            router.push(ROUTES.DASHBOARD);
                          }}
                          theme="cancel"
                        >
                          {"Hủy bỏ"}
                        </CoreButton>
                      )}
                      <CoreButton
                        theme="submit"
                        type="submit"
                        loading={isPending}
                      >
                        {"Đổi mật khẩu"}
                      </CoreButton>
                    </div>
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
