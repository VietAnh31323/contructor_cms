import {
  Alert,
  Box,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PageContainer from "@/components/organism/PageContainer";
import { CoreBreadcrumbs } from "@/components/atoms/CoreBreadcrumbs";
import { CoreButton } from "@/components/atoms/CoreButton";
import CoreNavbar from "@/components/organism/CoreNavbar";
import CoreInputCustom from "@/components/atoms/CoreInputCustom";
import CoreAutocomplete from "@/components/atoms/CoreAutocomplete";
import { useDialog } from "@/components/hooks/dialog/useDialog";
import useEmployeeSave, { AccountSetupMode } from "./useEmployeeLSave";
import EmployeeWorkloadTab from "./EmployeeWorkloadTab";
import { deleteEmployee } from "@/service/constructor/Employee/delete";
import { toastError, toastSuccess } from "@/toast";
import router from "next/router";
import { ROUTES } from "@/routes";
import { TopAction } from "@/components/molecules/TopAction";
import { AvatarUploadField } from "@/components/molecules/AvatarUploadField";
import CoreLoading from "@/components/molecules/CoreLoading";
import { Controller } from "react-hook-form";
import CoreInput from "@/components/atoms/CoreInput";
import { CoreDatePicker } from "@/components/atoms/CoreDatePicker";
import { usePermission } from "@/components/hooks/permission/usePermission";
import { PERMISSIONS } from "@/helper/permissions";
import {
  CERTIFICATE_RANK_OPTIONS,
  CERTIFICATE_TYPE_OPTIONS,
  DEPARTMENT_OPTIONS,
  GENDER_OPTIONS,
  getCertificateValidityMeta,
  POSITION_OPTIONS,
  STAFF_STATUS_OPTIONS,
} from "../constants";

export default function EmployeeSave() {
  const [value, handle] = useEmployeeSave();
  const {
    isView,
    isUpdate,
    initialTab,
    control,
    isLoading,
    isSubmitting,
    id,
    fields,
    watchedEmail,
    watchedCertificates,
    isCertificateRequired,
    employeeDetail,
    hasLinkedAccount,
    accountMode,
    allRoles,
    selectedRoles,
    mustChangePassword,
    unassignedAccountOptions,
    workload,
    isLoadingWorkload,
  } = value;

  const {
    onSubmit,
    handleAddCertificate,
    handleRemoveCertificate,
    handleChangeAccountMode,
    handleToggleRole,
    setMustChangePassword,
    getRoleLabel,
  } = handle;

  const { showDialog, hideDialog } = useDialog();
  const { hasPermission } = usePermission();
  const canManageUser = hasPermission(PERMISSIONS.USER_MANAGE);

  const pageTitle = !isUpdate
    ? "Thêm mới nhân sự"
    : isView
    ? "Chi tiết nhân sự"
    : "Chỉnh sửa nhân sự";

  const handleDelete = (targetId: number) => {
    showDialog(
      <Dialog open onClose={hideDialog}>
        <DialogTitle>Xác nhận xóa nhân sự</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn xóa nhân sự này khỏi hệ thống?
        </DialogContent>
        <DialogActions>
          <CoreButton onClick={hideDialog}>Hủy</CoreButton>
          <CoreButton
            color="error"
            onClick={async () => {
              try {
                await deleteEmployee({ id: targetId });
                toastSuccess("Xóa nhân sự thành công!");
                hideDialog();
                router.push(ROUTES.EMPLOYEE);
              } catch (err: any) {
                toastError(
                  err?.response?.data?.message ||
                    err?.message ||
                    "Xóa nhân sự thất bại"
                );
              }
            }}
          >
            Đồng ý
          </CoreButton>
        </DialogActions>
      </Dialog>
    );
  };

  const renderRoleSelector = () => (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
        Phân quyền vai trò truy cập hệ thống ({selectedRoles.length} vai trò đã chọn)
      </Typography>
      <Paper
        variant="outlined"
        sx={{ p: 2, borderRadius: 2, bgcolor: "#fafafa" }}
      >
        <Grid container spacing={1}>
          {allRoles.map((role) => {
            const checked = selectedRoles.some((r) => r.id === role.id);
            return (
              <Grid item xs={12} sm={6} md={4} key={role.id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      disabled={isView || !canManageUser}
                      checked={checked}
                      onChange={() => handleToggleRole(role)}
                    />
                  }
                  label={
                    <Typography variant="body2">{getRoleLabel(role)}</Typography>
                  }
                />
              </Grid>
            );
          })}
        </Grid>
      </Paper>
    </Box>
  );

  const profileAndAccountForm = isLoading ? (
    <CoreLoading />
  ) : (
    <form className="flex flex-col py-6" onSubmit={onSubmit}>
      {/* ================= PHẦN 1: THÔNG TIN NHÂN SỰ ================= */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
        <BadgeOutlinedIcon color="primary" />
        <Typography variant="subtitle1" fontWeight={700}>
          1. Thông tin hồ sơ nhân sự
        </Typography>
      </Stack>

      <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12}>
          <Controller
            control={control}
            name="avatar"
            render={({ field }) => (
              <AvatarUploadField
                value={field.value}
                onChange={(url) => field.onChange(url)}
                disabled={isView}
                fallbackText={
                  [employeeDetail?.firstName, employeeDetail?.lastName]
                    .filter(Boolean)
                    .join(" ") || "NV"
                }
                label="Hình ảnh nhân sự"
                helperText="Tải lên ảnh đại diện của nhân viên (PNG, JPG, JPEG, tối đa 5MB)."
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CoreInputCustom
            control={control}
            name="code"
            label="Mã nhân sự"
            placeholder="Tự động sinh nếu để trống"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CoreInputCustom
            control={control}
            name="firstName"
            label="Họ và tên đệm"
            placeholder="Nhập họ và tên đệm"
            required={!isView}
            rules={{
              required: "Vui lòng nhập họ và tên đệm",
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CoreInputCustom
            control={control}
            name="lastName"
            label="Tên"
            placeholder="Nhập tên"
            required={!isView}
            rules={{
              required: "Vui lòng nhập tên",
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <CoreInputCustom
            control={control}
            name="email"
            label="Email (tài khoản đăng nhập)"
            placeholder="Nhập địa chỉ email"
            required={!isView}
            rules={{
              required: "Vui lòng nhập email",
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CoreInputCustom
            control={control}
            name="phone"
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CoreAutocomplete
            options={GENDER_OPTIONS}
            control={control}
            name="gender"
            label="Giới tính"
            placeholder="Chọn giới tính"
            valuePath="value"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <CoreDatePicker
            name="birthDate"
            control={control!}
            label="Ngày sinh"
            placeholder="Chọn ngày sinh"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CoreInputCustom
            control={control}
            name="idCardNumber"
            label="Số CCCD / CMND"
            placeholder="Nhập 9 hoặc 12 chữ số"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CoreDatePicker
            name="idCardIssueDate"
            control={control!}
            label="Ngày cấp CCCD"
            placeholder="Chọn ngày cấp"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <CoreInputCustom
            control={control}
            name="idCardIssuePlace"
            label="Nơi cấp CCCD"
            placeholder="VD: Cục Cảnh sát QLHC về TTXH"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CoreAutocomplete
            options={POSITION_OPTIONS}
            control={control}
            name="position"
            label="Chức vụ"
            placeholder="Chọn chức vụ"
            valuePath="value"
            required={!isView}
            rules={{
              required: "Vui lòng chọn chức vụ",
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CoreAutocomplete
            options={DEPARTMENT_OPTIONS}
            control={control}
            name="department"
            label="Phòng ban"
            placeholder="Chọn phòng ban"
            valuePath="value"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <CoreDatePicker
            name="joinDate"
            control={control!}
            label="Ngày vào làm"
            placeholder="Chọn ngày vào làm"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CoreAutocomplete
            options={STAFF_STATUS_OPTIONS}
            control={control}
            name="status"
            label="Trạng thái làm việc"
            placeholder="Chọn trạng thái"
            valuePath="value"
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <CoreInputCustom
            control={control}
            name="address"
            label="Địa chỉ liên hệ"
            placeholder="Nhập địa chỉ"
          />
        </Grid>

        <Grid item xs={12}>
          <CoreInputCustom
            control={control}
            name="description"
            label="Ghi chú hồ sơ"
            placeholder="Nhập ghi chú thêm (kinh nghiệm, chuyên môn...)"
            variant="standard"
            multiline
            rows={3}
            sx={{ width: "100%", padding: "0" }}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* ================= PHẦN 2: CHỨNG CHỈ HÀNH NGHỀ ================= */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <VerifiedOutlinedIcon color="primary" />
          <Typography variant="subtitle1" fontWeight={700}>
            2. Chứng chỉ hành nghề xây dựng
          </Typography>
          {isCertificateRequired && (
            <Chip
              size="small"
              color="warning"
              label="Bắt buộc theo chức vụ"
            />
          )}
        </Stack>

        {!isView && (
          <CoreButton
            theme="submit"
            onClick={handleAddCertificate}
            startIcon={<AddCircleOutlineIcon />}
          >
            Thêm chứng chỉ
          </CoreButton>
        )}
      </Stack>

      {isCertificateRequired && !isView && (
        <Alert severity="warning" sx={{ mb: 2.5 }}>
          Nhân sự giữ chức vụ <strong>Kỹ sư giám sát</strong> hoặc{" "}
          <strong>Chỉ huy trưởng công trình</strong> bắt buộc phải có ít nhất{" "}
          <strong>01 chứng chỉ hành nghề còn hiệu lực</strong>.
        </Alert>
      )}

      {fields.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            textAlign: "center",
            color: "text.secondary",
            bgcolor: "#fafafa",
          }}
        >
          Chưa khai báo chứng chỉ hành nghề nào cho nhân sự này.
        </Paper>
      ) : (
        <Stack spacing={2.5}>
          {fields.map((field, index) => {
            const currentExpiry = watchedCertificates?.[index]?.expiryDate;
            const validity = getCertificateValidityMeta(currentExpiry);

            return (
              <Paper
                key={field.id}
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  borderColor:
                    validity?.status === "EXPIRED"
                      ? "error.light"
                      : validity?.status === "EXPIRING_SOON"
                      ? "warning.light"
                      : "divider",
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography variant="subtitle2" fontWeight={700}>
                      Chứng chỉ #{index + 1}
                    </Typography>
                    {validity && (
                      <Chip
                        size="small"
                        color={validity.color}
                        label={validity.label}
                      />
                    )}
                  </Stack>

                  {!isView && (
                    <Tooltip title="Xóa chứng chỉ này">
                      <span>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveCertificate(index)}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  )}
                </Stack>

                <Grid container spacing={{ xs: 1, sm: 2, md: 2.5 }}>
                  <Grid item xs={12} sm={6} md={4}>
                    <CoreAutocomplete
                      options={CERTIFICATE_TYPE_OPTIONS}
                      control={control}
                      name={`certificates.${index}.certificateType`}
                      label="Loại chứng chỉ hành nghề"
                      placeholder="Chọn loại chứng chỉ"
                      valuePath="value"
                      required={!isView}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <CoreInputCustom
                      control={control}
                      name={`certificates.${index}.certificateNumber`}
                      label="Số chứng chỉ"
                      placeholder="VD: BXD-00123456"
                      required={!isView}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <CoreAutocomplete
                      options={CERTIFICATE_RANK_OPTIONS}
                      control={control}
                      name={`certificates.${index}.certificateRank`}
                      label="Hạng chứng chỉ"
                      placeholder="Chọn hạng (I / II / III)"
                      valuePath="value"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <CoreDatePicker
                      name={`certificates.${index}.issueDate`}
                      control={control!}
                      label="Ngày cấp"
                      placeholder="Chọn ngày cấp"
                      required={!isView}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <CoreDatePicker
                      name={`certificates.${index}.expiryDate`}
                      control={control!}
                      label="Ngày hết hạn"
                      placeholder="Chọn ngày hết hạn"
                      required={!isView}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <CoreInputCustom
                      control={control}
                      name={`certificates.${index}.issuedBy`}
                      label="Cơ quan cấp"
                      placeholder="VD: Bộ Xây dựng / Sở Xây dựng"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <CoreInputCustom
                      control={control}
                      name={`certificates.${index}.note`}
                      label="Ghi chú chứng chỉ"
                      placeholder="Phạm vi hoạt động xây dựng, ghi chú bổ sung..."
                    />
                  </Grid>
                </Grid>
              </Paper>
            );
          })}
        </Stack>
      )}

      <Divider sx={{ my: 4 }} />

      {/* ================= PHẦN 3: TÀI KHOẢN ĐĂNG NHẬP & PHÂN QUYỀN (2.03) ================= */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <ManageAccountsOutlinedIcon color="primary" />
        <Typography variant="subtitle1" fontWeight={700}>
          3. Tài khoản đăng nhập & Phân quyền hệ thống
        </Typography>
      </Stack>

      {hasLinkedAccount ? (
        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
            sx={{ mb: 2 }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
              <Typography variant="body2">
                Tài khoản liên kết:{" "}
                <strong>{employeeDetail?.accountUsername || "—"}</strong>
              </Typography>
              <Chip
                size="small"
                color={
                  employeeDetail?.accountStatus === "ACTIVE"
                    ? "success"
                    : "error"
                }
                label={
                  employeeDetail?.accountStatus === "ACTIVE"
                    ? "Đang hoạt động"
                    : "Đang khóa / Tạm ngưng"
                }
              />
            </Stack>

            {employeeDetail?.accountId && canManageUser && (
              <CoreButton
                theme="submit"
                startIcon={<OpenInNewIcon />}
                onClick={() =>
                  router.push({
                    pathname: `${ROUTES.ACCOUNT}/${employeeDetail.accountId}`,
                    query: isView ? { actionType: "VIEW" } : undefined,
                  })
                }
              >
                Quản trị bảo mật / Reset mật khẩu
              </CoreButton>
            )}
          </Stack>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <CoreInput
                control={control}
                name="genPassword"
                label="Mật khẩu khởi tạo / tạm thời gần nhất"
                placeholder="—"
                disabled={true}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={8}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={mustChangePassword}
                    disabled={isView || !canManageUser}
                    onChange={(e) => setMustChangePassword(e.target.checked)}
                  />
                }
                label="Bắt buộc đổi mật khẩu ở lần đăng nhập kế tiếp"
              />
            </Grid>
          </Grid>

          {renderRoleSelector()}
        </Paper>
      ) : isView ? (
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            textAlign: "center",
            color: "text.secondary",
            bgcolor: "#fafafa",
          }}
        >
          Nhân sự này hiện chưa được cấp hoặc gán tài khoản đăng nhập hệ thống.
        </Paper>
      ) : (
        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
          <RadioGroup
            row
            value={accountMode}
            onChange={(e) =>
              handleChangeAccountMode(e.target.value as AccountSetupMode)
            }
          >
            <FormControlLabel
              value="CREATE"
              control={<Radio size="small" />}
              label="Tạo mới tài khoản đăng nhập (theo Email)"
            />
            <FormControlLabel
              value="ASSIGN"
              control={<Radio size="small" />}
              label={`Gán tài khoản có sẵn chưa liên kết (${unassignedAccountOptions.length})`}
            />
            <FormControlLabel
              value="NONE"
              control={<Radio size="small" />}
              label="Chưa cấp tài khoản lúc này"
            />
          </RadioGroup>

          {accountMode === "CREATE" && (
            <Box sx={{ mt: 2 }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                Tài khoản đăng nhập sẽ dùng tên đăng nhập là{" "}
                <strong>{watchedEmail?.trim() || "(Email nhân sự)"}</strong>. Nếu
                để trống mật khẩu khởi tạo, hệ thống sẽ tự sinh mật khẩu ngẫu
                nhiên 8 ký tự và gửi tới email nhân sự.
              </Alert>

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={4}>
                  <CoreInputCustom
                    control={control}
                    name="initialPassword"
                    label="Mật khẩu khởi tạo (tùy chọn)"
                    placeholder="Để trống để tự động sinh"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={8}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={mustChangePassword}
                        onChange={(e) => setMustChangePassword(e.target.checked)}
                      />
                    }
                    label="Bắt buộc đổi mật khẩu ngay lần đăng nhập đầu tiên"
                  />
                </Grid>
              </Grid>

              {renderRoleSelector()}
            </Box>
          )}

          {accountMode === "ASSIGN" && (
            <Box sx={{ mt: 2 }}>
              {unassignedAccountOptions.length === 0 ? (
                <Alert severity="warning">
                  Hiện không có tài khoản nào chưa liên kết nhân sự trong hệ
                  thống. Vui lòng chọn &ldquo;Tạo mới tài khoản đăng nhập&rdquo;.
                </Alert>
              ) : (
                <>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6} md={5}>
                      <CoreAutocomplete
                        options={unassignedAccountOptions}
                        control={control}
                        name="assignAccountId"
                        label="Chọn tài khoản có sẵn"
                        placeholder="Tìm theo email / tên tài khoản..."
                        valuePath="value"
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={7}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={mustChangePassword}
                            onChange={(e) =>
                              setMustChangePassword(e.target.checked)
                            }
                          />
                        }
                        label="Bắt buộc đổi mật khẩu ở lần đăng nhập kế tiếp"
                      />
                    </Grid>
                  </Grid>

                  {renderRoleSelector()}
                </>
              )}
            </Box>
          )}
        </Paper>
      )}

      {!isView && (
        <Box className="pt-6 flex justify-center gap-4 items-center">
          <CoreButton
            onClick={() => router.push(ROUTES.EMPLOYEE)}
            theme="cancel"
          >
            Hủy bỏ
          </CoreButton>
          {canManageUser && (
            <CoreButton
              theme="submit"
              type="submit"
              loading={isLoading || isSubmitting}
            >
              Lưu
            </CoreButton>
          )}
        </Box>
      )}
    </form>
  );

  const rightActionNode = isView && canManageUser && (
    <TopAction
      actionList={["delete", "edit"]}
      onEditAction={() => {
        router.push({
          pathname: `${ROUTES.EMPLOYEE}/[id]`,
          query: { id: Number(id) },
        });
      }}
      onDeleteAction={() => handleDelete(id)}
    />
  );

  const tabs = isUpdate
    ? [
        {
          title: "Hồ sơ & Tài khoản",
          rightAction: rightActionNode,
          content: profileAndAccountForm,
        },
        {
          title: `Dự án & Công việc (${workload?.activeProjects ?? 0} DA • ${
            workload?.activeTasks ?? 0
          } CV)`,
          rightAction: rightActionNode,
          content: (
            <EmployeeWorkloadTab
              workload={workload}
              isLoading={isLoadingWorkload}
            />
          ),
        },
      ]
    : [
        {
          title: pageTitle,
          content: profileAndAccountForm,
        },
      ];

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
              { title: "Quản lý nhân sự", pathname: ROUTES.EMPLOYEE },
              { title: pageTitle },
            ]}
          />
        }
      >
        <br />
        <CoreNavbar
          breadcrumbs={tabs}
          tabNumber={initialTab}
          maxWidthTab={320}
        />
      </PageContainer>
    </Grid>
  );
}
