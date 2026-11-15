import {
  Alert,
  Box,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import PageContainer from "@/components/organism/PageContainer";
import { CoreBreadcrumbs } from "@/components/atoms/CoreBreadcrumbs";
import { CoreButton } from "@/components/atoms/CoreButton";
import router from "next/router";
import CoreInputCustom from "@/components/atoms/CoreInputCustom";
import CoreAutocomplete from "@/components/atoms/CoreAutocomplete";
import { CoreTable } from "@/components/organism/CoreTable";
import { ROUTES } from "@/routes";
import useAccountList from "./useAccountList";

export default function Account() {
  const [value, handle] = useAccountList();

  const {
    columns,
    tableData,
    page,
    size,
    totalPages,
    isLoading,
    control,
    confirmTarget,
    resetTarget,
    customPassword,
    forceChangeOnNextLogin,
    resetResult,
    isMutating,
    CopyIcon,
  } = value;

  const {
    onSubmit,
    onReset,
    onChangePageSize,
    setConfirmTarget,
    setResetTarget,
    setCustomPassword,
    setForceChangeOnNextLogin,
    setResetResult,
    confirmLockOrUnlock,
    submitResetPassword,
    handleCopyTempPassword,
  } = handle;

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
          <CoreBreadcrumbs breadcrumbs={[{ title: "Quản lý tài khoản" }]} />
        }
      >
        <form className="flex flex-col py-6" onSubmit={onSubmit}>
          <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12} sm={12} md={6} lg={4}>
              <CoreInputCustom
                control={control}
                name="search"
                label="Tìm kiếm"
                placeholder="Tìm theo tài khoản hoặc tên"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4}>
              <CoreAutocomplete
                options={[
                  { label: "Đang hoạt động", value: "ACTIVE" },
                  { label: "Đã khóa", value: "LOCKED" },
                  { label: "Ngưng hoạt động", value: "INACTIVE" },
                ]}
                control={control}
                name="accountStatus"
                label="Trạng thái tài khoản"
                placeholder="Tất cả trạng thái"
                valuePath="value"
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={4}>
              <div className="py-4 flex justify-center gap-4 items-center">
                <CoreButton onClick={onReset} theme="cancel">
                  Làm mới
                </CoreButton>
                <CoreButton theme="submit" type="submit">
                  Tìm kiếm
                </CoreButton>
              </div>
            </Grid>
          </Grid>
        </form>

        <CoreTable
          tableName="account-table"
          columns={columns || []}
          data={tableData || []}
          page={page}
          size={size}
          totalPages={totalPages}
          isLoading={isLoading}
          onChangePageSize={onChangePageSize}
          isShowColumnStt
          onRowClick={(id: number) => {
            router.push({
              pathname: `${ROUTES.ACCOUNT}/${id}`,
              query: { actionType: "VIEW" },
            });
          }}
        />

        {/* Dialog xác nhận Khóa / Mở khóa */}
        <Dialog
          open={Boolean(confirmTarget)}
          onClose={() => !isMutating && setConfirmTarget(null)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>
            {confirmTarget?.type === "LOCK"
              ? "Xác nhận khóa tài khoản"
              : "Xác nhận mở khóa tài khoản"}
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2">
              {confirmTarget?.type === "LOCK"
                ? `Bạn có chắc chắn muốn khóa tài khoản "${confirmTarget?.account?.username}"? Mọi phiên đăng nhập hiện tại của tài khoản này sẽ bị thu hồi ngay lập tức.`
                : `Bạn có chắc chắn muốn mở khóa cho tài khoản "${confirmTarget?.account?.username}"?`}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <CoreButton
              theme="cancel"
              onClick={() => setConfirmTarget(null)}
              disabled={isMutating}
            >
              Hủy
            </CoreButton>
            <CoreButton
              theme="submit"
              onClick={confirmLockOrUnlock}
              loading={isMutating}
            >
              Đồng ý
            </CoreButton>
          </DialogActions>
        </Dialog>

        {/* Dialog Reset mật khẩu */}
        <Dialog
          open={Boolean(resetTarget)}
          onClose={() => !isMutating && setResetTarget(null)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Đặt lại mật khẩu — {resetTarget?.username}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
              <Alert severity="info">
                Để trống ô mật khẩu nếu muốn hệ thống tự sinh mật khẩu tạm thời
                ngẫu nhiên. Toàn bộ refresh/access token cũ của tài khoản sẽ bị
                thu hồi.
              </Alert>
              <TextField
                fullWidth
                type="password"
                label="Mật khẩu mới (tùy chọn — tối thiểu 6 ký tự)"
                value={customPassword}
                onChange={(e) => setCustomPassword(e.target.value)}
                variant="outlined"
                size="small"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={forceChangeOnNextLogin}
                    onChange={(e) =>
                      setForceChangeOnNextLogin(e.target.checked)
                    }
                  />
                }
                label="Bắt buộc người dùng đổi mật khẩu ở lần đăng nhập kế tiếp"
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <CoreButton
              theme="cancel"
              onClick={() => setResetTarget(null)}
              disabled={isMutating}
            >
              Hủy
            </CoreButton>
            <CoreButton
              theme="submit"
              onClick={submitResetPassword}
              loading={isMutating}
            >
              Đặt lại mật khẩu
            </CoreButton>
          </DialogActions>
        </Dialog>

        {/* Dialog hiển thị mật khẩu tạm thời vừa cấp */}
        <Dialog
          open={Boolean(resetResult)}
          onClose={() => setResetResult(null)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Đã cấp mật khẩu mới</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 1.5 }}>
              Tài khoản: <strong>{resetResult?.username}</strong>
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: "#f3f4f6",
                px: 2,
                py: 1,
                borderRadius: 1,
                border: "1px solid #d1d5db",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "var(--font-mono), monospace",
                  fontWeight: 700,
                }}
              >
                {resetResult?.temporaryPassword}
              </Typography>
              <Tooltip title="Sao chép">
                <IconButton
                  size="small"
                  onClick={() =>
                    resetResult?.temporaryPassword &&
                    handleCopyTempPassword(resetResult.temporaryPassword)
                  }
                >
                  <CopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            {resetResult?.mustChangePassword && (
              <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: "block" }}>
                * Người dùng sẽ phải đổi mật khẩu ngay sau khi đăng nhập.
              </Typography>
            )}
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
