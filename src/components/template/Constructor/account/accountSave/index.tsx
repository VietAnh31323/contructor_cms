import {
  Box,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import PageContainer from "@/components/organism/PageContainer";
import { CoreBreadcrumbs } from "@/components/atoms/CoreBreadcrumbs";
import { CoreButton } from "@/components/atoms/CoreButton";
import CoreNavbar from "@/components/organism/CoreNavbar";
import CoreInputCustom from "@/components/atoms/CoreInputCustom";
import CoreAutocomplete from "@/components/atoms/CoreAutocomplete";
import { ROUTES } from "@/routes";
import useAccountSave from "./useAccountSave";
import CoreLoading from "@/components/molecules/CoreLoading";
import { TopAction } from "@/components/molecules/TopAction";
import router from "next/router";

export default function AccountSave() {
  const [value, handle] = useAccountSave();
  const {
    isView,
    control,
    isLoading,
    id,
    canManageUser,
    accountDetail,
    allRoles,
    selectedRoles,
    mustChangePassword,
    resetResult,
    isSaving,
    isMutatingSecurity,
  } = value;

  const {
    handleToggleRole,
    setMustChangePassword,
    setResetResult,
    getRoleLabel,
    onSave,
    onToggleLock,
    onResetPassword,
  } = handle;

  const isLocked =
    accountDetail?.status === "LOCKED" ||
    accountDetail?.status === "INACTIVE" ||
    Boolean(
      accountDetail?.lockedUntil &&
        new Date(accountDetail.lockedUntil) > new Date()
    );

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
          <CoreBreadcrumbs
            breadcrumbs={[
              { title: "Quản lý tài khoản", pathname: ROUTES.ACCOUNT },
              { title: isView ? "Chi tiết tài khoản" : "Phân quyền & Quản trị" },
            ]}
          />
        }
      >
        <br />
        <CoreNavbar
          breadcrumbs={[
            {
              title: "Thông tin & Phân quyền",
              rightAction: isView && canManageUser && (
                <TopAction
                  actionList={["edit"]}
                  onEditAction={() => {
                    router.push({
                      pathname: `${ROUTES.ACCOUNT}/[id]`,
                      query: { id: Number(id) },
                    });
                  }}
                />
              ),
              content: isLoading ? (
                <CoreLoading />
              ) : (
                <form
                  className="flex flex-col py-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    onSave();
                  }}
                >
                  {/* Trạng thái bảo mật & thao tác nhanh cho Admin */}
                  <Box
                    sx={{
                      mb: 3,
                      p: 2,
                      borderRadius: 2,
                      border: "1px solid #e5e7eb",
                      bgcolor: "#f9fafb",
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                      <Typography variant="body2">
                        Tài khoản:{" "}
                        <strong>{accountDetail?.username || "—"}</strong>
                      </Typography>
                      <Chip
                        size="small"
                        label={isLocked ? "Đang khóa" : "Đang hoạt động"}
                        color={isLocked ? "error" : "success"}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Số lần đăng nhập sai:{" "}
                        <strong>{accountDetail?.failedLoginAttempts ?? 0}</strong>
                      </Typography>
                    </Stack>

                    {canManageUser && (
                      <Stack direction="row" spacing={1.5}>
                        <CoreButton
                          theme={isLocked ? "submit" : "cancel"}
                          onClick={onToggleLock}
                          loading={isMutatingSecurity}
                        >
                          {isLocked ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                        </CoreButton>
                        <CoreButton
                          theme="submit"
                          onClick={onResetPassword}
                          loading={isMutatingSecurity}
                        >
                          Reset mật khẩu
                        </CoreButton>
                      </Stack>
                    )}
                  </Box>

                  <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                      <CoreInputCustom
                        control={control}
                        name="code"
                        label="Mã nhân sự"
                        placeholder="Mã nhân sự"
                        isViewProp={true}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                      <CoreInputCustom
                        control={control}
                        name="email"
                        label="Email"
                        placeholder="Email nhân sự"
                        isViewProp={true}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <CoreAutocomplete
                        options={[
                          { label: "Kiến trúc sư", value: "ARCHITECT" },
                          { label: "Kĩ sư điện nước", value: "MEP_ENGINEER" },
                          {
                            label: "Kĩ sư kết cấu",
                            value: "STRUCTURAL_ENGINEER",
                          },
                          { label: "Kĩ sư giám sát", value: "ESTIMATOR" },
                          { label: "Dự toán viên", value: "SUPERVISOR" },
                        ]}
                        control={control}
                        name="position"
                        label="Chức vụ"
                        placeholder="Chức vụ"
                        valuePath="value"
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <CoreInputCustom
                        control={control}
                        name="firstName"
                        label="Họ đệm"
                        placeholder="Họ đệm"
                        isViewProp={true}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <CoreInputCustom
                        control={control}
                        name="lastName"
                        label="Tên"
                        placeholder="Tên"
                        isViewProp={true}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <CoreInputCustom
                        control={control}
                        name="phone"
                        label="Số điện thoại"
                        placeholder="Số điện thoại"
                        isViewProp={true}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={mustChangePassword}
                            disabled={isView || !canManageUser}
                            onChange={(e) =>
                              setMustChangePassword(e.target.checked)
                            }
                          />
                        }
                        label="Bắt buộc đổi mật khẩu ở lần đăng nhập kế tiếp"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Phân quyền vai trò tài khoản
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Box display="flex" gap={2} flexWrap="wrap">
                        <Box
                          component="fieldset"
                          sx={{
                            flex: 1,
                            minWidth: 280,
                            border: "1px solid #ccc",
                            borderRadius: 2,
                            p: 2,
                          }}
                        >
                          <Box
                            component="legend"
                            sx={{ px: 1, fontSize: 14, color: "gray" }}
                          >
                            Danh sách vai trò hệ thống
                          </Box>

                          {allRoles.map((role) => (
                            <FormControlLabel
                              key={role.id}
                              control={
                                <Checkbox
                                  disabled={isView || !canManageUser}
                                  checked={selectedRoles.some(
                                    (r) => r.id === role.id
                                  )}
                                  onChange={() => handleToggleRole(role)}
                                />
                              }
                              label={getRoleLabel(role)}
                              sx={{ display: "block", ml: 0 }}
                            />
                          ))}
                        </Box>

                        <Box
                          component="fieldset"
                          sx={{
                            flex: 1,
                            minWidth: 280,
                            border: "1px solid #ccc",
                            borderRadius: 2,
                            p: 2,
                          }}
                        >
                          <Box
                            component="legend"
                            sx={{ px: 1, fontSize: 14, color: "gray" }}
                          >
                            Vai trò đã gán ({selectedRoles.length})
                          </Box>

                          {selectedRoles.map((role) => (
                            <Box key={role.id} sx={{ py: 0.5 }}>
                              • {getRoleLabel(role)}
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>

                  {!isView && (
                    <div className="py-4 flex justify-center gap-4 items-center">
                      <CoreButton
                        onClick={() => router.push(ROUTES.ACCOUNT)}
                        theme="cancel"
                      >
                        Hủy bỏ
                      </CoreButton>
                      {canManageUser && (
                        <CoreButton
                          theme="submit"
                          type="submit"
                          loading={isSaving}
                        >
                          Lưu
                        </CoreButton>
                      )}
                    </div>
                  )}
                </form>
              ),
            },
          ]}
        />

        {/* Dialog kết quả Reset mật khẩu */}
        <Dialog
          open={Boolean(resetResult)}
          onClose={() => setResetResult(null)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Đã cấp mật khẩu tạm thời</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Tài khoản: <strong>{resetResult?.username}</strong>
            </Typography>
            <Box
              sx={{
                bgcolor: "#f3f4f6",
                p: 1.5,
                borderRadius: 1,
                fontFamily: "monospace",
                fontWeight: 700,
              }}
            >
              {resetResult?.temporaryPassword}
            </Box>
            <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: "block" }}>
              * Người dùng bắt buộc phải đổi mật khẩu khi đăng nhập lại.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <CoreButton theme="submit" onClick={() => setResetResult(null)}>
              Đóng
            </CoreButton>
          </DialogActions>
        </Dialog>
      </PageContainer>
    </Grid>
  );
}
