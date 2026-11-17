import Can from "@/components/atoms/Can";
import CoreAutocomplete from "@/components/atoms/CoreAutocomplete";
import CoreAutoCompleteAPI from "@/components/atoms/CoreAutoCompleteAPI";
import { CoreBreadcrumbs } from "@/components/atoms/CoreBreadcrumbs";
import { CoreButton } from "@/components/atoms/CoreButton";
import { CoreDatePicker } from "@/components/atoms/CoreDatePicker";
import CoreInputCustom from "@/components/atoms/CoreInputCustom";
import EditText from "@/components/atoms/EditText";
import { useDialog } from "@/components/hooks/dialog/useDialog";
import { usePermission } from "@/components/hooks/permission/usePermission";
import NineDot from "@/components/icons/NineDot";
import { Action } from "@/components/molecules/Action";
import CoreLoading from "@/components/molecules/CoreLoading";
import { TopAction } from "@/components/molecules/TopAction";
import CoreNavbar from "@/components/organism/CoreNavbar";
import PageContainer from "@/components/organism/PageContainer";
import { PERMISSIONS } from "@/helper/permissions";
import { ROUTES } from "@/routes";
import { getCategoryList } from "@/service/constructor/Category/getList";
import { getCustomerList } from "@/service/constructor/Customer/getList";
import { getEmployeeList } from "@/service/constructor/Employee/getList";
import { BUILDING_TYPE_OPTIONS } from "@/service/constructor/Project/getDetail/type";
import { deleteProject } from "@/service/constructor/Project/save";
import { toastError, toastSuccess } from "@/toast";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import UndoIcon from "@mui/icons-material/Undo";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Stack,
  Step,
  StepButton,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import moment from "moment";
import router, { useRouter } from "next/router";
import { FormProvider } from "react-hook-form";
import {
  CUSTOMER_TYPE_META,
  formatVnd,
  PIPELINE_STAGE_META,
} from "../../customer/constants";
import {
  normalizeProjectState,
  PROJECT_CREATE_INITIAL_STATE_OPTIONS,
  PROJECT_FILTER_STATE_OPTIONS,
  PROJECT_MAIN_FLOW_STATES,
  PROJECT_STATE_META,
} from "../constants";
import ProjectTransitionDialog from "../ProjectTransitionDialog";
import ProjectGanttTab from "./ProjectGanttTab";
import ProjectStateHistoryTab from "./ProjectStateHistoryTab";
import ProjectMembersTab from "./ProjectMembersTab";
import ProjectContractsTab from "./ProjectContractsTab";
import ProjectPaymentsTab from "./ProjectPaymentsTab";
import ProjectDocumentsTab from "./ProjectDocumentsTab";
import ProjectMaterialsTab from "./ProjectMaterialsTab";
import useConstructionProjectSave from "./useConstructionProjectSave";

export default function ConstructionProjectSave() {
  const {
    id,
    isUpdate,
    isView,
    isLoading,
    isSubmitting,
    fields,
    append,
    remove,
    handleDragEnd,
    control,
    methodForm,
    editorText,
    setEditorText,
    selectedCustomerInfo,
    financialSummary,
    projectDetail,
    currentState,
    allowedNextStates,
    transitionTarget,
    transitionSnapshot,
    isTransitioning,
    openTransitionDialog,
    closeTransitionDialog,
    confirmTransition,
    onSubmit,
    refetchDetail,
  } = useConstructionProjectSave();

  const nextRouter = useRouter();
  const { showDialog, hideDialog } = useDialog();
  const { hasPermission } = usePermission();
  const canUpdateProject = hasPermission(PERMISSIONS.PROJECT_UPDATE);
  const canDeleteProject = hasPermission(PERMISSIONS.PROJECT_DELETE);
  const canCreateCustomer = hasPermission(PERMISSIONS.CUSTOMER_MANAGE);

  const pageTitle = isUpdate
    ? isView
      ? "Chi tiết dự án & Vòng đời"
      : "Chỉnh sửa dự án"
    : "Tiếp nhận / Thêm mới dự án";

  const handleConfirmDelete = () => {
    if (!id) return;
    showDialog(
      <Dialog open onClose={hideDialog}>
        <DialogTitle>Xác nhận xóa dự án</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn xóa dự án này không? Thao tác này không thể hoàn
          tác.
        </DialogContent>
        <DialogActions>
          <CoreButton theme="cancel" onClick={hideDialog}>
            Hủy
          </CoreButton>
          <CoreButton
            theme="submit"
            onClick={async () => {
              try {
                await deleteProject({ id });
                toastSuccess("Xóa dự án thành công");
                hideDialog();
                router.push(ROUTES.PROJECT);
              } catch (err) {
                toastError(err);
              }
            }}
          >
            Xóa dự án
          </CoreButton>
        </DialogActions>
      </Dialog>
    );
  };

  if (isLoading) {
    return <CoreLoading />;
  }

  const currentMeta =
    PROJECT_STATE_META[currentState] || PROJECT_STATE_META.RECEIVED;
  const previousBeforePause = projectDetail?.previousState
    ? normalizeProjectState(projectDetail.previousState)
    : null;

  const activeMainFlowIndex = (() => {
    if (currentState === "PAUSED" && previousBeforePause) {
      const idx = PROJECT_MAIN_FLOW_STATES.indexOf(previousBeforePause);
      return idx >= 0 ? idx : 0;
    }
    const idx = PROJECT_MAIN_FLOW_STATES.indexOf(currentState);
    return idx >= 0 ? idx : -1;
  })();

  const forwardMainActions = allowedNextStates.filter((st) => {
    const meta = PROJECT_STATE_META[st];
    if (!meta?.isMainFlow) return false;
    if (currentState === "PAUSED") return true;
    return meta.step > currentMeta.step;
  });

  const rollbackMainActions = allowedNextStates.filter((st) => {
    const meta = PROJECT_STATE_META[st];
    if (!meta?.isMainFlow || currentState === "PAUSED") return false;
    return meta.step < currentMeta.step;
  });

  const canPauseNow = allowedNextStates.includes("PAUSED");
  const canCancelNow = allowedNextStates.includes("CANCELLED");

  const tabs = [
    {
      title: isUpdate ? "Tổng quan" : "Thông tin dự án",
      rightAction:
        isUpdate && isView ? (
          <TopAction
            actionList={[
              ...(canUpdateProject ? (["edit"] as const) : []),
              ...(canDeleteProject ? (["delete"] as const) : []),
            ]}
            onEditAction={() =>
              router.push({
                pathname: `${ROUTES.PROJECT}/${id}`,
                query: { actionType: "EDIT" },
              })
            }
            onDeleteAction={handleConfirmDelete}
          />
        ) : undefined,
      content: (
        <FormProvider {...methodForm}>
          <form onSubmit={onSubmit} className="flex flex-col py-4">
            {/* ================= VÒNG ĐỜI DỰ ÁN 9 BƯỚC + TẠM DỪNG / HỦY (2.09) ================= */}
            {isUpdate && (
              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  mb: 3.5,
                  borderRadius: 2.5,
                  bgcolor: "#ffffff",
                  borderColor: `${currentMeta.accent}55`,
                  borderTop: `4px solid ${currentMeta.accent}`,
                }}
              >
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", md: "center" }}
                  spacing={1.5}
                  sx={{ mb: 2.5 }}
                >
                  <Box>
                    <Stack
                      direction="row"
                      spacing={1.25}
                      alignItems="center"
                      flexWrap="wrap"
                    >
                      <Typography variant="subtitle1" fontWeight={800}>
                        Vòng đời dự án:
                      </Typography>
                      <Chip
                        color={currentMeta.color}
                        label={currentMeta.shortLabel}
                        sx={{ fontWeight: 700 }}
                      />
                      {projectDetail?.stateChangedAt && (
                        <Typography variant="caption" color="text.secondary">
                          Cập nhật:{" "}
                          {moment(projectDetail.stateChangedAt).format(
                            "DD/MM/YYYY HH:mm"
                          )}
                        </Typography>
                      )}
                    </Stack>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 0.5 }}
                    >
                      {currentMeta.description}
                    </Typography>
                  </Box>

                  {canUpdateProject && allowedNextStates.length > 0 && (
                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      useFlexGap
                    >
                      {forwardMainActions.map((nextSt) => {
                        const nextMeta = PROJECT_STATE_META[nextSt];
                        const isResume = currentState === "PAUSED";
                        return (
                          <Button
                            key={nextSt}
                            size="small"
                            variant="contained"
                            color={isResume ? "success" : "primary"}
                            startIcon={
                              isResume ? (
                                <PlayCircleOutlineIcon fontSize="small" />
                              ) : (
                                <ArrowForwardIcon fontSize="small" />
                              )
                            }
                            onClick={() => openTransitionDialog(nextSt)}
                            sx={{ textTransform: "none", fontWeight: 700 }}
                          >
                            {isResume
                              ? `Khôi phục: ${nextMeta.shortLabel}`
                              : `Chuyển sang: ${nextMeta.shortLabel}`}
                          </Button>
                        );
                      })}

                      {rollbackMainActions.map((prevSt) => {
                        const prevMeta = PROJECT_STATE_META[prevSt];
                        return (
                          <Button
                            key={prevSt}
                            size="small"
                            variant="outlined"
                            color="inherit"
                            startIcon={<UndoIcon fontSize="small" />}
                            onClick={() => openTransitionDialog(prevSt)}
                            sx={{ textTransform: "none", fontWeight: 600 }}
                          >
                            Lùi về: {prevMeta.label}
                          </Button>
                        );
                      })}

                      {canPauseNow && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="warning"
                          startIcon={<PauseCircleOutlineIcon fontSize="small" />}
                          onClick={() => openTransitionDialog("PAUSED")}
                          sx={{ textTransform: "none", fontWeight: 600 }}
                        >
                          Tạm dừng
                        </Button>
                      )}

                      {canCancelNow && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<CancelOutlinedIcon fontSize="small" />}
                          onClick={() => openTransitionDialog("CANCELLED")}
                          sx={{ textTransform: "none", fontWeight: 600 }}
                        >
                          Hủy dự án
                        </Button>
                      )}
                    </Stack>
                  )}
                </Stack>

                {currentState === "PAUSED" && (
                  <Alert severity="warning" sx={{ mb: 2.5 }}>
                    <strong>Dự án đang Tạm dừng</strong>
                    {previousBeforePause
                      ? ` (tạm dừng tại bước "${
                          PROJECT_STATE_META[previousBeforePause]?.label ||
                          previousBeforePause
                        }")`
                      : ""}
                    {projectDetail?.stateReason
                      ? ` — Lý do: ${projectDetail.stateReason}`
                      : ""}
                  </Alert>
                )}

                {currentState === "CANCELLED" && (
                  <Alert severity="error" sx={{ mb: 2.5 }}>
                    <strong>Dự án đã Hủy</strong>
                    {projectDetail?.stateReason
                      ? ` — Lý do: ${projectDetail.stateReason}`
                      : ""}
                  </Alert>
                )}

                {currentState === "CLOSED" && (
                  <Alert severity="success" sx={{ mb: 2.5 }}>
                    <strong>Dự án đã Đóng hoàn tất vòng đời</strong>
                    {projectDetail?.stateReason
                      ? ` — Ghi chú: ${projectDetail.stateReason}`
                      : ""}
                  </Alert>
                )}

                <Box sx={{ overflowX: "auto", pb: 1 }}>
                  <Stepper
                    nonLinear={canUpdateProject}
                    activeStep={activeMainFlowIndex}
                    alternativeLabel
                    sx={{ minWidth: 760 }}
                  >
                    {PROJECT_MAIN_FLOW_STATES.map((stepState, idx) => {
                      const stepMeta = PROJECT_STATE_META[stepState];
                      const isCompleted =
                        currentState === "CLOSED"
                          ? true
                          : activeMainFlowIndex > idx;
                      const isClickable =
                        canUpdateProject &&
                        allowedNextStates.includes(stepState);

                      return (
                        <Step key={stepState} completed={isCompleted}>
                          {isClickable ? (
                            <StepButton
                              onClick={() => openTransitionDialog(stepState)}
                            >
                              <Typography
                                variant="caption"
                                fontWeight={700}
                                color="primary.main"
                              >
                                {stepMeta.label}
                              </Typography>
                            </StepButton>
                          ) : (
                            <StepLabel>
                              <Typography
                                variant="caption"
                                fontWeight={
                                  activeMainFlowIndex === idx ? 800 : 500
                                }
                              >
                                {stepMeta.label}
                              </Typography>
                            </StepLabel>
                          )}
                        </Step>
                      );
                    })}
                  </Stepper>
                </Box>
              </Paper>
            )}

            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              1. Thông tin chung & Chủ đầu tư (Khách hàng liên kết)
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <CoreInputCustom
                  control={control}
                  name="code"
                  label="Mã hồ sơ / dự án"
                  placeholder="Để trống tự động sinh mã"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <CoreInputCustom
                  control={control}
                  name="name"
                  label="Tên công trình / dự án"
                  placeholder="Nhập tên công trình dự án"
                  required={!isView}
                  rules={{ required: "Vui lòng nhập tên công trình dự án" }}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={4}>
                <Stack spacing={1}>
                  <CoreAutoCompleteAPI
                    control={control}
                    name="customer"
                    label="Khách hàng / Chủ đầu tư"
                    placeholder="Chọn khách hàng trong hệ thống"
                    fetchDataFn={getCustomerList}
                    labelPath="name"
                    labelPathDisplay={["code", "name"]}
                    required={!isView}
                    rules={{
                      required: "Vui lòng chọn khách hàng / chủ đầu tư",
                    }}
                  />
                  {!isView && canCreateCustomer && (
                    <Box className="flex justify-end">
                      <Typography
                        variant="caption"
                        color="primary"
                        sx={{
                          cursor: "pointer",
                          fontWeight: 600,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                        onClick={() => router.push(`${ROUTES.CUSTOMER}/addNew`)}
                      >
                        <AddIcon sx={{ fontSize: 14 }} />
                        Thêm khách hàng mới
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Grid>

              {selectedCustomerInfo && (
                <Grid item xs={12}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "#f8fafc",
                      borderColor: "#cbd5e1",
                    }}
                  >
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", md: "center" }}
                      spacing={1.5}
                    >
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        flexWrap="wrap"
                      >
                        <Chip
                          size="small"
                          color={
                            CUSTOMER_TYPE_META[
                              selectedCustomerInfo.customerType || "INDIVIDUAL"
                            ]?.color || "default"
                          }
                          icon={
                            selectedCustomerInfo.customerType === "BUSINESS" ? (
                              <BusinessOutlinedIcon fontSize="small" />
                            ) : (
                              <PersonOutlineIcon fontSize="small" />
                            )
                          }
                          label={
                            CUSTOMER_TYPE_META[
                              selectedCustomerInfo.customerType || "INDIVIDUAL"
                            ]?.label || "Cá nhân"
                          }
                        />
                        <Typography variant="subtitle2" fontWeight={700}>
                          {selectedCustomerInfo.code} —{" "}
                          {selectedCustomerInfo.name}
                        </Typography>
                        {selectedCustomerInfo.pipelineStage && (
                          <Chip
                            size="small"
                            variant="outlined"
                            color={
                              PIPELINE_STAGE_META[
                                selectedCustomerInfo.pipelineStage
                              ]?.chipColor || "default"
                            }
                            label={`Pipeline: ${
                              PIPELINE_STAGE_META[
                                selectedCustomerInfo.pipelineStage
                              ]?.label || selectedCustomerInfo.pipelineStage
                            }`}
                          />
                        )}
                      </Stack>

                      <CoreButton
                        theme="cancel"
                        startIcon={<OpenInNewIcon fontSize="small" />}
                        onClick={() =>
                          router.push({
                            pathname: `${ROUTES.CUSTOMER}/${selectedCustomerInfo.id}`,
                            query: { actionType: "VIEW" },
                          })
                        }
                      >
                        Xem hồ sơ khách hàng
                      </CoreButton>
                    </Stack>

                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="caption" color="text.secondary">
                          Điện thoại liên hệ
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {selectedCustomerInfo.phone || "—"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="caption" color="text.secondary">
                          {selectedCustomerInfo.customerType === "BUSINESS"
                            ? "Mã số thuế DN"
                            : "CCCD / MST"}
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {selectedCustomerInfo.taxCode ||
                            selectedCustomerInfo.idCardNumber ||
                            "—"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="caption" color="text.secondary">
                          Người đại diện
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {selectedCustomerInfo.representativeName
                            ? `${selectedCustomerInfo.representativeName}${
                                selectedCustomerInfo.representativePosition
                                  ? ` (${selectedCustomerInfo.representativePosition})`
                                  : ""
                              }`
                            : "—"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="caption" color="text.secondary">
                          Tài khoản ngân hàng
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {selectedCustomerInfo.bankAccountNumber
                            ? `${selectedCustomerInfo.bankAccountNumber} (${
                                selectedCustomerInfo.bankName || ""
                              })`
                            : "—"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              )}

              <Grid item xs={12} sm={8} md={8}>
                <CoreInputCustom
                  control={control}
                  name="address"
                  label="Địa điểm xây dựng / khảo sát"
                  placeholder="Nhập địa chỉ công trình"
                />
              </Grid>

              <Grid item xs={12} sm={4} md={4}>
                <CoreAutocomplete
                  control={control}
                  name="state"
                  label={
                    isUpdate
                      ? "Giai đoạn vòng đời hiện tại"
                      : "Bước khởi tạo vòng đời"
                  }
                  placeholder="Chọn bước vòng đời"
                  options={
                    isUpdate
                      ? PROJECT_FILTER_STATE_OPTIONS.filter(
                          (o) => o.value !== ""
                        )
                      : PROJECT_CREATE_INITIAL_STATE_OPTIONS
                  }
                  valuePath="value"
                  labelPath="label"
                  disabled={isUpdate || isView}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <CoreInputCustom
                  control={control}
                  name="contractValue"
                  type="number"
                  label="Giá trị hợp đồng / báo giá (VNĐ)"
                  placeholder="Có thể để 0 khi mới Tiếp nhận / Khảo sát"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <CoreInputCustom
                  control={control}
                  name="contractAdvance"
                  type="number"
                  label="Tạm ứng hợp đồng (VNĐ)"
                  placeholder="Nhập số tiền tạm ứng"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <CoreDatePicker
                  control={control}
                  name="signDate"
                  label="Ngày ký hợp đồng"
                  placeholder="Chọn ngày ký HĐ"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <CoreDatePicker
                  control={control}
                  name="deliveryDate"
                  label="Ngày bàn giao dự kiến"
                  placeholder="Chọn ngày bàn giao dự kiến"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <CoreDatePicker
                  control={control}
                  name="actualHandoverDate"
                  label="Ngày bàn giao thực tế"
                  placeholder="Tự động cập nhật khi chuyển bước Bàn giao"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <CoreDatePicker
                  control={control}
                  name="warrantyEndDate"
                  label="Hạn bảo hành đến ngày"
                  placeholder="Tự động tính khi sang bước Bảo hành"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              2. Hạng mục & Nhân sự phụ trách dự án
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <CoreAutoCompleteAPI
                  control={control}
                  name="categories"
                  label="Hạng mục công việc / hồ sơ"
                  placeholder="Chọn một hoặc nhiều hạng mục"
                  fetchDataFn={getCategoryList}
                  labelPath="name"
                  labelPathDisplay={["code", "name"]}
                  multiple
                  required={!isView}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <CoreAutoCompleteAPI
                  control={control}
                  name="manager"
                  label="Chủ nhiệm dự án (PM / Chỉ huy trưởng)"
                  placeholder="Chọn chủ nhiệm dự án (bắt buộc trước khi Thi công)"
                  fetchDataFn={getEmployeeList}
                  labelPath="name"
                  labelPathDisplay={["code", "name"]}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <CoreAutoCompleteAPI
                  control={control}
                  name="creator"
                  label="Người lập dự án"
                  placeholder="Chọn người lập dự án"
                  fetchDataFn={getEmployeeList}
                  labelPath="name"
                  labelPathDisplay={["code", "name"]}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <CoreAutoCompleteAPI
                  control={control}
                  name="supporter"
                  label="Nhân viên chăm sóc khách hàng"
                  placeholder="Chọn nhân sự CSKH"
                  fetchDataFn={getEmployeeList}
                  labelPath="name"
                  labelPathDisplay={["code", "name"]}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
              spacing={1}
              sx={{ mb: 2 }}
            >
              <Typography variant="subtitle1" fontWeight={700}>
                3. Lộ trình & Đợt thanh toán hợp đồng
              </Typography>

              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Chip
                  size="small"
                  color="info"
                  variant="outlined"
                  label={`Tổng HĐ: ${formatVnd(financialSummary.contractVal)}`}
                />
                <Chip
                  size="small"
                  color="success"
                  variant="outlined"
                  label={`Đã thu (Tạm ứng + Đợt TT): ${formatVnd(
                    financialSummary.totalPaid
                  )}`}
                />
                <Chip
                  size="small"
                  color={
                    (isUpdate && projectDetail?.remainingAmount !== undefined && projectDetail?.remainingAmount !== null
                      ? Number(projectDetail.remainingAmount)
                      : financialSummary.remaining) > 0
                      ? "warning"
                      : "success"
                  }
                  label={`Còn phải thu (tự tính): ${formatVnd(
                    isUpdate && projectDetail?.remainingAmount !== undefined && projectDetail?.remainingAmount !== null
                      ? projectDetail.remainingAmount
                      : financialSummary.remaining
                  )}`}
                />
              </Stack>
            </Stack>

            <Box className="mt-1">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="projectLines">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex flex-col gap-3"
                    >
                      {fields.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={`projectLine-${item.id}`}
                          index={index}
                          isDragDisabled={isView}
                        >
                          {(dragProvided) => (
                            <Paper
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              variant="outlined"
                              sx={{ p: 2, borderRadius: 2 }}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  {...dragProvided.dragHandleProps}
                                  className="cursor-grab flex items-center"
                                >
                                  <NineDot />
                                </div>

                                <Grid
                                  container
                                  spacing={2}
                                  className="flex-1"
                                >
                                  <Grid item xs={12} sm={6} md={2}>
                                    <CoreInputCustom
                                      control={control}
                                      name={`projectLines.${index}.percentage`}
                                      type="number"
                                      label={`% HĐ đợt ${index + 1}`}
                                      placeholder="VD: 30"
                                    />
                                  </Grid>

                                  <Grid item xs={12} sm={6} md={3}>
                                    <CoreInputCustom
                                      control={control}
                                      name={`projectLines.${index}.paymentAmount`}
                                      type="number"
                                      label={`Số tiền đợt ${index + 1} (VNĐ)`}
                                      placeholder="Tự tính nếu nhập %"
                                    />
                                  </Grid>

                                  <Grid item xs={12} sm={6} md={4}>
                                    <CoreInputCustom
                                      control={control}
                                      name={`projectLines.${index}.conditionMilestone`}
                                      label="Mốc điều kiện thanh toán"
                                      placeholder="VD: Sau khi đổ mái tầng 2"
                                    />
                                  </Grid>

                                  <Grid item xs={12} sm={6} md={3}>
                                    <CoreDatePicker
                                      control={control}
                                      name={`projectLines.${index}.paymentDate`}
                                      label={`Ngày dự kiến đợt ${index + 1}`}
                                      placeholder="Chọn ngày dự kiến"
                                    />
                                  </Grid>
                                </Grid>

                                <Action
                                  actionList={
                                    isView
                                      ? []
                                      : fields.length > 1
                                      ? ["append", "remove"]
                                      : ["append"]
                                  }
                                  onAppendAction={() =>
                                    append({
                                      paymentDate: null,
                                      paymentAmount: "",
                                      percentage: "",
                                      conditionMilestone: "",
                                      note: "",
                                    })
                                  }
                                  onRemoveAction={() => remove(index)}
                                />
                              </div>
                            </Paper>
                          )}
                        </Draggable>
                      ))}

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              4. Thông tin kỹ thuật công trình (2.16)
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <CoreAutocomplete
                  options={BUILDING_TYPE_OPTIONS}
                  control={control}
                  name="buildingType"
                  label="Loại công trình"
                  placeholder="Chọn loại công trình"
                  valuePath="value"
                  labelPath="label"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <CoreInputCustom
                  control={control}
                  name="landArea"
                  type="number"
                  label="Diện tích đất (m²)"
                  placeholder="VD: 150"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <CoreInputCustom
                  control={control}
                  name="constructionArea"
                  type="number"
                  label="Diện tích xây dựng (m²)"
                  placeholder="VD: 110"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <CoreInputCustom
                  control={control}
                  name="totalFloorArea"
                  type="number"
                  label="Tổng diện tích sàn (m²)"
                  placeholder="VD: 420"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <CoreInputCustom
                  control={control}
                  name="numberOfFloors"
                  type="number"
                  label="Số tầng"
                  placeholder="VD: 4"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <CoreInputCustom
                  control={control}
                  name="designUnit"
                  label="Đơn vị thiết kế"
                  placeholder="Nhập tên đơn vị tư vấn thiết kế"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <CoreInputCustom
                  control={control}
                  name="constructionPermitNo"
                  label="Số giấy phép xây dựng"
                  placeholder="VD: 123/GPXD-UBND"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <CoreDatePicker
                  control={control}
                  name="constructionPermitDate"
                  label="Ngày cấp giấy phép xây dựng"
                  placeholder="Chọn ngày cấp GPXD"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              5. Mô tả chi tiết & Ghi chú dự án
            </Typography>

            <Box sx={{ mb: 5 }}>
              <EditText
                editorText={editorText}
                setEditorText={setEditorText}
                disabled={isView}
                error={undefined}
                height={240}
              />
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <CoreInputCustom
                  control={control}
                  name="note"
                  label="Ghi chú nội bộ"
                  placeholder="Nhập ghi chú dự án..."
                  rows={3}
                  multiline
                  sx={{ width: "100%", padding: 0 }}
                />
              </Grid>
            </Grid>

            {!isView && (
              <div className="py-6 flex justify-center gap-4 items-center">
                <CoreButton
                  onClick={() => router.push(ROUTES.PROJECT)}
                  theme="cancel"
                >
                  Hủy bỏ
                </CoreButton>
                <Can
                  permission={[
                    PERMISSIONS.PROJECT_CREATE,
                    PERMISSIONS.PROJECT_UPDATE,
                  ]}
                >
                  <CoreButton
                    type="submit"
                    theme="submit"
                    loading={isSubmitting}
                  >
                    {isUpdate ? "Lưu thay đổi" : "Tạo mới dự án"}
                  </CoreButton>
                </Can>
              </div>
            )}
          </form>
        </FormProvider>
      ),
    },
    ...(isUpdate && id
      ? [
          {
            title: `Hợp đồng (${projectDetail?.contracts?.length ?? 0})`,
            content: (
              <ProjectContractsTab
                projectId={id}
                contracts={projectDetail?.contracts || []}
                isView={isView}
                onRefresh={() => refetchDetail && refetchDetail()}
              />
            ),
          },
          {
            title: "Tiến độ (Gantt)",
            content: (
              <ProjectGanttTab
                projectId={id}
                projectDetail={projectDetail}
              />
            ),
          },
          {
            title: "Thanh toán",
            content: (
              <ProjectPaymentsTab
                projectId={id}
                projectLines={projectDetail?.projectLines || []}
                contractValue={projectDetail?.contractValue}
                onRefreshProject={() => refetchDetail && refetchDetail()}
              />
            ),
          },
          {
            title: "Vật tư",
            content: (
              <ProjectMaterialsTab
                projectId={id}
                projectDetail={projectDetail}
                onRefreshProject={() => refetchDetail && refetchDetail()}
              />
            ),
          },
          {
            title: `Thành viên (${projectDetail?.members?.length ?? 0})`,
            content: (
              <ProjectMembersTab
                projectId={id}
                members={projectDetail?.members || []}
                isView={isView}
                onRefresh={() => refetchDetail && refetchDetail()}
              />
            ),
          },
          {
            title: `Nhật ký (${projectDetail?.stateLogCount ?? 0})`,
            content: (
              <ProjectStateHistoryTab
                projectId={id}
                projectDetail={projectDetail}
              />
            ),
          },
          {
            title: `Tài liệu (${projectDetail?.documentCount ?? 0})`,
            content: (
              <ProjectDocumentsTab
                projectId={id}
                onRefreshProject={() => refetchDetail && refetchDetail()}
              />
            ),
          },
        ]
      : []),
  ];

  const initialTab =
    isUpdate && nextRouter.query?.tab === "contracts"
      ? 1
      : isUpdate && nextRouter.query?.tab === "gantt"
      ? 2
      : isUpdate && nextRouter.query?.tab === "payments"
      ? 3
      : isUpdate && nextRouter.query?.tab === "materials"
      ? 4
      : isUpdate && nextRouter.query?.tab === "members"
      ? 5
      : isUpdate && nextRouter.query?.tab === "history"
      ? 6
      : isUpdate && nextRouter.query?.tab === "documents"
      ? 7
      : undefined;

  return (
    <PageContainer
      title={
        <CoreBreadcrumbs
          breadcrumbs={[
            { title: "Quản lý dự án", pathname: ROUTES.PROJECT },
            { title: pageTitle },
          ]}
        />
      }
    >
      <CoreNavbar
        breadcrumbs={tabs}
        tabNumber={initialTab}
        maxWidthTab={260}
      />

      <ProjectTransitionDialog
        open={Boolean(transitionTarget)}
        targetState={transitionTarget}
        snapshot={transitionSnapshot}
        submitting={isTransitioning}
        onClose={closeTransitionDialog}
        onConfirm={confirmTransition}
        onOpenEditProject={
          isView && id
            ? (projectId) =>
                router.push({
                  pathname: `${ROUTES.PROJECT}/${projectId}`,
                  query: { actionType: "EDIT" },
                })
            : undefined
        }
      />
    </PageContainer>
  );
}
