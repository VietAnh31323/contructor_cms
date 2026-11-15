import {
  Alert,
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Step,
  StepButton,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import PageContainer from "@/components/organism/PageContainer";
import { CoreBreadcrumbs } from "@/components/atoms/CoreBreadcrumbs";
import { CoreButton } from "@/components/atoms/CoreButton";
import CoreNavbar from "@/components/organism/CoreNavbar";
import CoreInputCustom from "@/components/atoms/CoreInputCustom";
import CoreAutocomplete from "@/components/atoms/CoreAutocomplete";
import CoreAutoCompleteAPI from "@/components/atoms/CoreAutoCompleteAPI";
import CoreCheckbox from "@/components/atoms/CoreCheckbox";
import CoreLoading from "@/components/molecules/CoreLoading";
import { TopAction } from "@/components/molecules/TopAction";
import { useDialog } from "@/components/hooks/dialog/useDialog";
import { usePermission } from "@/components/hooks/permission/usePermission";
import { PERMISSIONS } from "@/helper/permissions";
import { ROUTES } from "@/routes";
import { deleteCustomer } from "@/service/constructor/Customer/delete";
import { CustomerType } from "@/service/constructor/Customer/getList/type";
import { getEmployeeList } from "@/service/constructor/Employee/getList";
import { toastError, toastSuccess } from "@/toast";
import router from "next/router";
import { FormProvider } from "react-hook-form";
import {
  CONTACT_STATUS_OPTIONS,
  CUSTOMER_TYPE_META,
  PIPELINE_FLOW_STAGES,
  PIPELINE_STAGE_META,
  PIPELINE_STAGE_OPTIONS,
} from "../constants";
import CustomerCareHistoryTab from "./CustomerCareHistoryTab";
import CustomerProjectsTab from "./CustomerProjectsTab";
import useCustomerSave from "./useCustomerSave";

export default function CustomerSave() {
  const [value, handle] = useCustomerSave();
  const {
    id,
    isView,
    isUpdate,
    initialTab,
    control,
    methodForm,
    isLoading,
    isSubmitting,
    watchedCustomerType,
    watchedPipelineStage,
    customerDetail,
    careLogs,
    isLoadingCareLogs,
    stageModalOpen,
    targetStage,
    stageNote,
    isUpdatingStage,
  } = value;

  const {
    onSubmit,
    setValue,
    setStageModalOpen,
    setStageNote,
    handleOpenStageTransition,
    handleConfirmStageTransition,
    handleRefreshCareLogs,
  } = handle;

  const { showDialog, hideDialog } = useDialog();
  const { hasPermission } = usePermission();
  const canManageCustomer = hasPermission(PERMISSIONS.CUSTOMER_MANAGE);
  const canCreateProject = hasPermission(PERMISSIONS.PROJECT_CREATE);

  const pageTitle = !isUpdate
    ? "Thêm mới khách hàng"
    : isView
    ? "Chi tiết khách hàng"
    : "Chỉnh sửa khách hàng";

  const activeStage =
    (isUpdate ? customerDetail?.pipelineStage : watchedPipelineStage) || "LEAD";
  const activeStepIndex = PIPELINE_FLOW_STAGES.indexOf(activeStage);

  const handleDelete = (targetId: number) => {
    showDialog(
      <Dialog open onClose={hideDialog}>
        <DialogTitle>Xác nhận xóa khách hàng</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn xóa khách hàng này khỏi hệ thống?
        </DialogContent>
        <DialogActions>
          <CoreButton onClick={hideDialog}>Hủy</CoreButton>
          <CoreButton
            color="error"
            onClick={async () => {
              try {
                await deleteCustomer({ id: targetId });
                toastSuccess("Xóa khách hàng thành công!");
                hideDialog();
                router.push(ROUTES.CUSTOMER);
              } catch (err: any) {
                toastError(
                  err?.response?.data?.message ||
                    err?.message ||
                    "Xóa khách hàng thất bại"
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

  const renderPipelineStepper = () => {
    const currentMeta =
      PIPELINE_STAGE_META[activeStage] || PIPELINE_STAGE_META.LEAD;
    return (
      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          mb: 2.5,
          borderRadius: 2,
          bgcolor: activeStage === "LOST" ? "#fef2f2" : "#f8fafc",
          borderColor: activeStage === "LOST" ? "error.light" : "divider",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={1.5}
          sx={{ mb: 2 }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
            <Typography variant="subtitle2" fontWeight={700}>
              Pipeline trạng thái khách hàng:
            </Typography>
            <Chip
              size="small"
              color={currentMeta.chipColor}
              label={currentMeta.label}
            />
            {isUpdate && customerDetail?.customerType && (
              <Chip
                size="small"
                variant="outlined"
                color={
                  CUSTOMER_TYPE_META[customerDetail.customerType]?.color ||
                  "info"
                }
                label={
                  CUSTOMER_TYPE_META[customerDetail.customerType]?.label ||
                  customerDetail.customerType
                }
              />
            )}
          </Stack>

          {canManageCustomer && (
            <Stack direction="row" spacing={1} alignItems="center">
              {activeStage !== "LOST" ? (
                <CoreButton
                  theme="cancel"
                  startIcon={<BlockOutlinedIcon fontSize="small" />}
                  onClick={() => handleOpenStageTransition("LOST")}
                >
                  Đánh dấu Ngưng theo dõi
                </CoreButton>
              ) : (
                <CoreButton
                  theme="submit"
                  onClick={() => handleOpenStageTransition("LEAD")}
                >
                  Khôi phục về Tiềm năng
                </CoreButton>
              )}
            </Stack>
          )}
        </Stack>

        <Stepper
          nonLinear={canManageCustomer}
          activeStep={activeStepIndex >= 0 ? activeStepIndex : -1}
          alternativeLabel
        >
          {PIPELINE_FLOW_STAGES.map((stage, idx) => {
            const meta = PIPELINE_STAGE_META[stage];
            const completed =
              activeStage !== "LOST" && activeStepIndex > idx;
            return (
              <Step key={stage} completed={completed}>
                <StepButton
                  disabled={!canManageCustomer}
                  onClick={() => handleOpenStageTransition(stage)}
                >
                  <Typography
                    variant="caption"
                    fontWeight={activeStage === stage ? 700 : 500}
                    color={
                      activeStage === stage ? "primary.main" : "text.secondary"
                    }
                  >
                    {meta.label}
                  </Typography>
                </StepButton>
              </Step>
            );
          })}
        </Stepper>
      </Paper>
    );
  };

  const customerProfileForm = isLoading ? (
    <CoreLoading />
  ) : (
    <FormProvider {...methodForm}>
      <form className="flex flex-col py-4" onSubmit={onSubmit}>
        {/* ================= PHẦN 1: PHÂN LOẠI & THÔNG TIN ĐỊNH DANH (2.05) ================= */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          {watchedCustomerType === "BUSINESS" ? (
            <BusinessOutlinedIcon color="primary" />
          ) : (
            <PersonOutlineIcon color="primary" />
          )}
          <Typography variant="subtitle1" fontWeight={700}>
            1. Phân loại & Thông tin định danh khách hàng
          </Typography>
        </Stack>

        <Paper
          variant="outlined"
          sx={{ p: 2, mb: 3, borderRadius: 2, bgcolor: "#fafafa" }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Typography variant="body2" fontWeight={600}>
              Loại hình khách hàng:
            </Typography>
            <RadioGroup
              row
              value={watchedCustomerType}
              onChange={(e) => {
                if (!isView) {
                  setValue("customerType", e.target.value as CustomerType);
                }
              }}
            >
              <FormControlLabel
                value="INDIVIDUAL"
                disabled={isView}
                control={<Radio size="small" />}
                label="Khách hàng Cá nhân / Hộ gia đình"
              />
              <FormControlLabel
                value="BUSINESS"
                disabled={isView}
                control={<Radio size="small" />}
                label="Khách hàng Doanh nghiệp / Tổ chức"
              />
            </RadioGroup>
          </Stack>
        </Paper>

        {watchedCustomerType === "BUSINESS" && !isView && (
          <Alert severity="info" sx={{ mb: 2.5 }}>
            Đối với <strong>Khách hàng Doanh nghiệp</strong>, vui lòng nhập đầy
            đủ <strong>Mã số thuế (10 hoặc 13 số)</strong> và{" "}
            <strong>Người đại diện pháp luật</strong> để phục vụ ký kết hợp đồng
            & xuất hóa đơn.
          </Alert>
        )}

        <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <CoreInputCustom
              control={control}
              name="code"
              label="Mã khách hàng"
              placeholder="Tự động sinh nếu để trống"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <CoreInputCustom
              control={control}
              name="name"
              label={
                watchedCustomerType === "BUSINESS"
                  ? "Tên doanh nghiệp / Chủ đầu tư"
                  : "Họ tên khách hàng"
              }
              placeholder={
                watchedCustomerType === "BUSINESS"
                  ? "VD: Công ty TNHH Đầu tư Xây dựng ABC"
                  : "VD: Nguyễn Văn A"
              }
              required={!isView}
              rules={{ required: "Vui lòng nhập tên khách hàng" }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <CoreInputCustom
              control={control}
              name="taxCode"
              label={
                watchedCustomerType === "BUSINESS"
                  ? "Mã số thuế doanh nghiệp"
                  : "Mã số thuế cá nhân (nếu có)"
              }
              placeholder="Nhập 10 hoặc 13 chữ số (CSKH bổ sung)"
              required={
                !isView &&
                watchedCustomerType === "BUSINESS" &&
                ["CONTRACT_SIGNED", "IN_CONSTRUCTION", "WARRANTY"].includes(
                  watchedPipelineStage || "LEAD"
                )
              }
            />
          </Grid>

          {watchedCustomerType === "BUSINESS" ? (
            <>
              <Grid item xs={12} sm={6} md={4}>
                <CoreInputCustom
                  control={control}
                  name="representativeName"
                  label="Người đại diện pháp luật / Liên hệ"
                  placeholder="Nhập họ tên người đại diện"
                  required={
                    !isView &&
                    ["CONTRACT_SIGNED", "IN_CONSTRUCTION", "WARRANTY"].includes(
                      watchedPipelineStage || "LEAD"
                    )
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <CoreInputCustom
                  control={control}
                  name="representativePosition"
                  label="Chức vụ người đại diện"
                  placeholder="VD: Giám đốc / Tổng Giám đốc"
                />
              </Grid>
            </>
          ) : (
            <Grid item xs={12} sm={6} md={4}>
              <CoreInputCustom
                control={control}
                name="idCardNumber"
                label="Số CCCD / CMND"
                placeholder="Nhập 9 hoặc 12 chữ số"
              />
            </Grid>
          )}

          <Grid item xs={12} sm={6} md={4}>
            <CoreInputCustom
              control={control}
              name="phone"
              label="Số điện thoại liên hệ"
              placeholder="Nhập số điện thoại"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <CoreInputCustom
              control={control}
              name="email"
              label="Email"
              placeholder="Nhập địa chỉ email"
            />
          </Grid>

          <Grid item xs={12} sm={12} md={watchedCustomerType === "BUSINESS" ? 4 : 8}>
            <CoreInputCustom
              control={control}
              name="address"
              label={
                watchedCustomerType === "BUSINESS"
                  ? "Địa chỉ trụ sở đăng ký kinh doanh"
                  : "Địa chỉ liên hệ / Khu đất xây dựng"
              }
              placeholder="Nhập địa chỉ chi tiết"
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* ================= PHẦN 2: TÀI KHOẢN NGÂN HÀNG (2.05) ================= */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <AccountBalanceOutlinedIcon color="primary" />
          <Typography variant="subtitle1" fontWeight={700}>
            2. Thông tin tài khoản ngân hàng (Thanh toán & Hoàn ứng HĐ)
          </Typography>
        </Stack>

        <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <CoreInputCustom
              control={control}
              name="bankAccountNumber"
              label="Số tài khoản ngân hàng"
              placeholder="Nhập số tài khoản"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CoreInputCustom
              control={control}
              name="bankName"
              label="Tên ngân hàng"
              placeholder="VD: Vietcombank, BIDV, Techcombank..."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CoreInputCustom
              control={control}
              name="bankBranch"
              label="Chi nhánh"
              placeholder="VD: CN Hà Nội / CN TP.HCM"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CoreInputCustom
              control={control}
              name="bankAccountHolder"
              label="Chủ tài khoản"
              placeholder="Tên in hoa trên tài khoản"
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* ================= PHẦN 3: TRẠNG THÁI CRM & PHỤ TRÁCH (2.07 & 2.08) ================= */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <SupportAgentOutlinedIcon color="primary" />
          <Typography variant="subtitle1" fontWeight={700}>
            3. Trạng thái chăm sóc, Pipeline & Nhân sự phụ trách
          </Typography>
        </Stack>

        <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <CoreAutocomplete
              options={PIPELINE_STAGE_OPTIONS}
              control={control}
              name="pipelineStage"
              label="Giai đoạn Pipeline"
              placeholder="Chọn giai đoạn"
              valuePath="value"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <CoreAutocomplete
              options={CONTACT_STATUS_OPTIONS}
              control={control}
              name="contactStatus"
              label="Trạng thái phản hồi"
              placeholder="Chọn trạng thái liên hệ"
              valuePath="value"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <CoreAutoCompleteAPI
              control={control}
              name="assignedStaff"
              label="Nhân viên phụ trách chăm sóc"
              placeholder="Chọn nhân sự phụ trách"
              fetchDataFn={getEmployeeList}
              labelPath="name"
              labelPathDisplay={["code", "name"]}
            />
          </Grid>

          <Grid item xs={12}>
            <CoreCheckbox
              control={control}
              name="isPotential"
              label="Đánh dấu là Khách hàng tiềm năng ưu tiên"
            />
          </Grid>

          <Grid item xs={12}>
            <CoreInputCustom
              control={control}
              name="description"
              label="Nhu cầu xây dựng & Nội dung tư vấn ban đầu"
              placeholder="Quy mô công trình, diện tích, số tầng, phong cách kiến trúc, ngân sách dự kiến..."
              multiline
              rows={3}
              sx={{ width: "100%", padding: "0" }}
            />
          </Grid>

          <Grid item xs={12}>
            <CoreInputCustom
              control={control}
              name="note"
              label="Ghi chú nội bộ"
              placeholder="Nhập ghi chú thêm..."
              variant="standard"
              multiline
              rows={3}
              sx={{ width: "100%", padding: "0" }}
            />
          </Grid>
        </Grid>

        {!isView && (
          <div className="pt-6 flex justify-center gap-4 items-center">
            <CoreButton
              onClick={() => router.push(ROUTES.CUSTOMER)}
              theme="cancel"
            >
              Hủy bỏ
            </CoreButton>
            {canManageCustomer && (
              <CoreButton
                theme="submit"
                type="submit"
                loading={isLoading || isSubmitting}
              >
                Lưu hồ sơ
              </CoreButton>
            )}
          </div>
        )}
      </form>
    </FormProvider>
  );

  const rightActionNode = isView && canManageCustomer && (
    <TopAction
      actionList={["delete", "edit"]}
      onEditAction={() => {
        router.push({
          pathname: `${ROUTES.CUSTOMER}/[id]`,
          query: { id: Number(id) },
        });
      }}
      onDeleteAction={() => handleDelete(id)}
    />
  );

  const tabs = isUpdate
    ? [
        {
          title: "Hồ sơ khách hàng",
          rightAction: rightActionNode,
          content: customerProfileForm,
        },
        {
          title: `Lịch sử chăm sóc (${careLogs.length})`,
          rightAction: rightActionNode,
          content: (
            <CustomerCareHistoryTab
              customerId={id}
              defaultStaff={customerDetail?.assignedStaff}
              careLogs={careLogs}
              isLoading={isLoadingCareLogs}
              canManage={canManageCustomer}
              onRefresh={handleRefreshCareLogs}
            />
          ),
        },
        {
          title: `Dự án liên kết (${customerDetail?.projects?.length ?? 0})`,
          rightAction: rightActionNode,
          content: (
            <CustomerProjectsTab
              customerId={id}
              projects={customerDetail?.projects ?? []}
              canCreateProject={canCreateProject}
            />
          ),
        },
      ]
    : [
        {
          title: pageTitle,
          content: customerProfileForm,
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
              {
                title: "Quản lý khách hàng",
                pathname: ROUTES.CUSTOMER,
              },
              { title: pageTitle },
            ]}
          />
        }
      >
        <Box sx={{ mt: 2 }}>{renderPipelineStepper()}</Box>

        <CoreNavbar
          key={`customer-tabs-${id}-${initialTab}`}
          tabNumber={initialTab}
          breadcrumbs={tabs}
        />

        {/* Dialog xác nhận chuyển giai đoạn Pipeline (2.08) */}
        <Dialog
          open={stageModalOpen}
          onClose={() => setStageModalOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 700 }}>
            Chuyển giai đoạn Pipeline khách hàng
          </DialogTitle>
          <DialogContent dividers>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Chuyển trạng thái khách hàng{" "}
              <strong>{customerDetail?.name}</strong> sang giai đoạn:{" "}
              <Chip
                size="small"
                color={PIPELINE_STAGE_META[targetStage]?.chipColor || "primary"}
                label={PIPELINE_STAGE_META[targetStage]?.label || targetStage}
              />
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              label="Ghi chú chuyển giai đoạn (tự động lưu vào Lịch sử chăm sóc nếu nhập)"
              placeholder="VD: Đã gửi bảng báo giá thi công trọn gói / Đã ký hợp đồng thiết kế..."
              value={stageNote}
              onChange={(e) => setStageNote(e.target.value)}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <CoreButton
              onClick={() => setStageModalOpen(false)}
              theme="cancel"
            >
              Hủy
            </CoreButton>
            <CoreButton
              theme="submit"
              onClick={handleConfirmStageTransition}
              loading={isUpdatingStage}
            >
              Xác nhận chuyển
            </CoreButton>
          </DialogActions>
        </Dialog>
      </PageContainer>
    </Grid>
  );
}
