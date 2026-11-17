import { CoreButton } from "@/components/atoms/CoreButton";
import { useDialog } from "@/components/hooks/dialog/useDialog";
import { usePermission } from "@/components/hooks/permission/usePermission";
import CoreLoading from "@/components/molecules/CoreLoading";
import { formatVnd } from "@/components/template/Constructor/customer/constants";
import { PERMISSIONS } from "@/helper/permissions";
import { ProjectLineDto } from "@/service/constructor/Project/getDetail/type";
import {
  createProjectPayment,
  deleteProjectPayment,
  savePaymentPlans,
  updateProjectPayment,
  updateProjectPaymentStatus,
  uploadPaymentAttachment,
  useProjectPaymentsQuery,
} from "@/service/constructor/Project/payment";
import {
  PAYMENT_METHOD_OPTIONS,
  PAYMENT_PLAN_STATUS_META,
  PaymentMethod,
  PROJECT_PAYMENT_STATUS_OPTIONS,
  ProjectPaymentItem,
  ProjectPaymentStatus,
  UploadItem,
} from "@/service/constructor/Project/payment/type";
import { toastError, toastSuccess } from "@/toast";
import AddIcon from "@mui/icons-material/Add";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import React, { useMemo, useState } from "react";

interface ProjectPaymentsTabProps {
  projectId: number;
  projectLines?: ProjectLineDto[];
  contractValue?: number | string;
  onRefreshProject: () => void;
}

type PlanDraftRow = {
  id?: number;
  paymentNo: number;
  percentage: string;
  paymentAmount: string;
  conditionMilestone: string;
  paymentDate: string;
  note: string;
};

type PaymentFormState = {
  id?: number;
  projectLineId: number | "";
  receiptCode: string;
  paymentDate: string;
  amount: string;
  paymentMethod: PaymentMethod;
  status: ProjectPaymentStatus;
  payerName: string;
  attachments: UploadItem[];
  note: string;
};

const emptyPaymentForm = (
  lineId?: number | null,
  suggestedAmount?: number | null
): PaymentFormState => ({
  projectLineId: lineId ?? "",
  receiptCode: "",
  paymentDate: moment().format("YYYY-MM-DD"),
  amount:
    suggestedAmount && suggestedAmount > 0 ? String(suggestedAmount) : "",
  paymentMethod: "BANK_TRANSFER",
  status: "CONFIRMED",
  payerName: "",
  attachments: [],
  note: "",
});

export default function ProjectPaymentsTab({
  projectId,
  projectLines = [],
  contractValue = 0,
  onRefreshProject,
}: ProjectPaymentsTabProps) {
  const queryClient = useQueryClient();
  const { showDialog, hideDialog } = useDialog();
  const { hasPermission } = usePermission();

  const canManagePayments =
    hasPermission(PERMISSIONS.PROJECT_UPDATE) ||
    hasPermission(PERMISSIONS.PAYMENT_CREATE) ||
    hasPermission(PERMISSIONS.PAYMENT_APPROVE) ||
    hasPermission(PERMISSIONS.FINANCE_MANAGE);

  const canApprovePayments =
    hasPermission(PERMISSIONS.PROJECT_UPDATE) ||
    hasPermission(PERMISSIONS.PAYMENT_APPROVE) ||
    hasPermission(PERMISSIONS.FINANCE_MANAGE);

  const { data: summaryResp, isLoading } = useProjectPaymentsQuery(projectId, {
    enabled: Boolean(projectId),
  });
  const summary = summaryResp?.data;

  // --- Dialogs state ---
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [planRows, setPlanRows] = useState<PlanDraftRow[]>([]);
  const [savingPlans, setSavingPlans] = useState(false);

  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState<PaymentFormState>(
    emptyPaymentForm()
  );
  const [savingPayment, setSavingPayment] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  const numericContractValue = useMemo(() => {
    const val = Number(summary?.contractValue ?? contractValue ?? 0);
    return Number.isFinite(val) ? val : 0;
  }, [summary?.contractValue, contractValue]);

  const invalidateAll = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["project-payments", projectId] }),
      queryClient.invalidateQueries({ queryKey: ["project-detail", projectId] }),
      queryClient.invalidateQueries({ queryKey: ["project-list"] }),
    ]);
    onRefreshProject();
  };

  // ==================== 2.13: KẾ HOẠCH ĐỢT THANH TOÁN ====================

  const openPlanEditor = () => {
    const initial: PlanDraftRow[] =
      projectLines.length > 0
        ? projectLines.map((l, idx) => ({
            id: l.id,
            paymentNo: l.paymentNo ?? idx + 1,
            percentage:
              l.percentage !== null && l.percentage !== undefined
                ? String(l.percentage)
                : "",
            paymentAmount:
              l.paymentAmount !== null && l.paymentAmount !== undefined
                ? String(l.paymentAmount)
                : "",
            conditionMilestone: l.conditionMilestone || "",
            paymentDate: l.paymentDate || "",
            note: l.note || "",
          }))
        : [
            {
              paymentNo: 1,
              percentage: "30",
              paymentAmount:
                numericContractValue > 0
                  ? String(Math.round(numericContractValue * 0.3))
                  : "",
              conditionMilestone: "Sau khi ký hợp đồng",
              paymentDate: moment().format("YYYY-MM-DD"),
              note: "",
            },
          ];
    setPlanRows(initial);
    setPlanDialogOpen(true);
  };

  const handlePlanFieldChange = (
    idx: number,
    field: keyof PlanDraftRow,
    val: string
  ) => {
    setPlanRows((prev) =>
      prev.map((row, i) => {
        if (i !== idx) return row;
        const next = { ...row, [field]: val };
        if (field === "percentage" && numericContractValue > 0) {
          const pct = Number(val);
          if (!Number.isNaN(pct) && val !== "") {
            next.paymentAmount = String(
              Math.round((numericContractValue * pct) / 100)
            );
          }
        } else if (field === "paymentAmount" && numericContractValue > 0) {
          const amt = Number(val);
          if (!Number.isNaN(amt) && val !== "") {
            next.percentage = ((amt * 100) / numericContractValue).toFixed(2);
          }
        }
        return next;
      })
    );
  };

  const totalPlannedPercent = useMemo(
    () =>
      planRows.reduce((acc, r) => acc + (Number(r.percentage || 0) || 0), 0),
    [planRows]
  );

  const totalPlannedAmount = useMemo(
    () =>
      planRows.reduce((acc, r) => acc + (Number(r.paymentAmount || 0) || 0), 0),
    [planRows]
  );

  const handleSavePlans = async () => {
    for (let i = 0; i < planRows.length; i++) {
      const r = planRows[i];
      if (!r.paymentDate) {
        toastError(`Đợt ${i + 1}: Vui lòng chọn ngày dự kiến`);
        return;
      }
      if (!r.paymentAmount && !r.percentage) {
        toastError(`Đợt ${i + 1}: Vui lòng nhập % hoặc số tiền dự kiến`);
        return;
      }
    }

    try {
      setSavingPlans(true);
      const payload: ProjectLineDto[] = planRows.map((r, i) => ({
        id: r.id,
        paymentNo: i + 1,
        paymentDate: r.paymentDate,
        percentage: r.percentage !== "" ? Number(r.percentage) : undefined,
        paymentAmount:
          r.paymentAmount !== "" ? Number(r.paymentAmount) : undefined,
        conditionMilestone: r.conditionMilestone?.trim() || undefined,
        note: r.note?.trim() || undefined,
      }));
      await savePaymentPlans(projectId, payload);
      toastSuccess("Cập nhật kế hoạch các đợt thanh toán thành công");
      setPlanDialogOpen(false);
      await invalidateAll();
    } catch (err) {
      toastError(err);
    } finally {
      setSavingPlans(false);
    }
  };

  // ==================== 2.14: GHI NHẬN THU TIỀN THỰC TẾ ====================

  const openCreatePaymentDialog = (
    lineId?: number | null,
    suggestedAmount?: number | null
  ) => {
    setPaymentForm(emptyPaymentForm(lineId, suggestedAmount));
    setPaymentDialogOpen(true);
  };

  const openEditPaymentDialog = (item: ProjectPaymentItem) => {
    setPaymentForm({
      id: item.id,
      projectLineId: item.projectLineId ?? "",
      receiptCode: item.receiptCode || "",
      paymentDate: item.paymentDate || moment().format("YYYY-MM-DD"),
      amount: String(item.amount ?? ""),
      paymentMethod: item.paymentMethod || "BANK_TRANSFER",
      status: item.status || "CONFIRMED",
      payerName: item.payerName || "",
      attachments: item.attachments || [],
      note: item.note || "",
    });
    setPaymentDialogOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      setUploadingFile(true);
      const uploaded: UploadItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const res = await uploadPaymentAttachment(files[i]);
        if (res?.url) {
          uploaded.push({
            name: res.name || files[i].name,
            url: res.url,
            type: res.type || files[i].type,
          });
        }
      }
      setPaymentForm((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...uploaded],
      }));
      toastSuccess(`Đã tải lên ${uploaded.length} chứng từ đính kèm`);
    } catch (err) {
      toastError(err);
    } finally {
      setUploadingFile(false);
      e.target.value = "";
    }
  };

  const handleSavePayment = async () => {
    const amt = Number(paymentForm.amount);
    if (!paymentForm.paymentDate) {
      toastError("Vui lòng chọn ngày thu thực tế");
      return;
    }
    if (Number.isNaN(amt) || amt <= 0) {
      toastError("Vui lòng nhập số tiền thực thu lớn hơn 0");
      return;
    }

    const payload: ProjectPaymentItem = {
      projectLineId:
        paymentForm.projectLineId !== ""
          ? Number(paymentForm.projectLineId)
          : null,
      receiptCode: paymentForm.receiptCode?.trim() || undefined,
      paymentDate: paymentForm.paymentDate,
      amount: amt,
      paymentMethod: paymentForm.paymentMethod,
      status: paymentForm.status,
      payerName: paymentForm.payerName?.trim() || undefined,
      attachments: paymentForm.attachments,
      note: paymentForm.note?.trim() || undefined,
    };

    try {
      setSavingPayment(true);
      if (paymentForm.id) {
        await updateProjectPayment(projectId, paymentForm.id, payload);
        toastSuccess("Cập nhật phiếu thu tiền thực tế thành công");
      } else {
        await createProjectPayment(projectId, payload);
        toastSuccess(
          "Đã ghi nhận phiếu thu & tự động cập nhật công nợ còn phải thu"
        );
      }
      setPaymentDialogOpen(false);
      await invalidateAll();
    } catch (err) {
      toastError(err);
    } finally {
      setSavingPayment(false);
    }
  };

  const handleQuickChangeStatus = async (
    item: ProjectPaymentItem,
    nextStatus: ProjectPaymentStatus
  ) => {
    if (!item.id) return;
    try {
      await updateProjectPaymentStatus(projectId, item.id, nextStatus);
      toastSuccess(
        nextStatus === "CONFIRMED"
          ? `Đã xác nhận thu ${item.receiptCode} & cập nhật còn phải thu`
          : `Đã hủy phiếu thu ${item.receiptCode} & cập nhật còn phải thu`
      );
      await invalidateAll();
    } catch (err) {
      toastError(err);
    }
  };

  const handleDeletePayment = (item: ProjectPaymentItem) => {
    if (!item.id) return;
    showDialog(
      <Dialog open onClose={hideDialog}>
        <DialogTitle>Xác nhận xóa phiếu thu</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn xóa phiếu thu{" "}
          <strong>{item.receiptCode || `#${item.id}`}</strong> (
          {formatVnd(item.amount)})? Số tiền còn phải thu của dự án sẽ được tự
          động tính toán lại.
        </DialogContent>
        <DialogActions>
          <CoreButton theme="cancel" onClick={hideDialog}>
            Hủy
          </CoreButton>
          <CoreButton
            theme="submit"
            onClick={async () => {
              try {
                await deleteProjectPayment(projectId, item.id as number);
                toastSuccess("Đã xóa phiếu thu & cập nhật lại công nợ");
                hideDialog();
                await invalidateAll();
              } catch (err) {
                toastError(err);
              }
            }}
          >
            Xóa phiếu thu
          </CoreButton>
        </DialogActions>
      </Dialog>
    );
  };

  if (isLoading) {
    return <CoreLoading />;
  }

  const payments = summary?.payments ?? [];
  const collectionRate = Math.min(
    100,
    Math.max(0, Number(summary?.collectionRate ?? 0))
  );

  return (
    <Box className="py-4">
      {/* ================= TỔNG HỢP CÔNG NỢ TỰ ĐỘNG (2.14) ================= */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                GIÁ TRỊ HỢP ĐỒNG
              </Typography>
              <Typography variant="h6" fontWeight={800} sx={{ mt: 0.5 }}>
                {formatVnd(summary?.contractValue ?? contractValue)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Tạm ứng ban đầu: {formatVnd(summary?.contractAdvance ?? 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 2,
              height: "100%",
              borderColor: "success.light",
              bgcolor: "#f0fdf4",
            }}
          >
            <CardContent>
              <Typography variant="caption" color="success.dark" fontWeight={700}>
                ĐÃ THU THỰC TẾ (ĐÃ XÁC NHẬN)
              </Typography>
              <Typography
                variant="h6"
                fontWeight={800}
                color="success.main"
                sx={{ mt: 0.5 }}
              >
                {formatVnd(summary?.totalCollected ?? 0)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Phiếu thu: {formatVnd(summary?.confirmedPaymentTotal ?? 0)}
                {(summary?.pendingPaymentTotal ?? 0) > 0
                  ? ` • Chờ XN: ${formatVnd(summary?.pendingPaymentTotal)}`
                  : ""}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 2,
              height: "100%",
              borderColor:
                (summary?.remainingAmount ?? 0) > 0
                  ? "warning.light"
                  : "success.light",
              bgcolor:
                (summary?.remainingAmount ?? 0) > 0 ? "#fffbeb" : "#f0fdf4",
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Typography variant="caption" color="warning.dark" fontWeight={700}>
                  CÒN PHẢI THU (TỰ TÍNH)
                </Typography>
                <Tooltip title="Hệ thống tự động tính = Giá trị HĐ - (Tạm ứng + Tổng các phiếu thu đã xác nhận), không nhập tay.">
                  <LockOutlinedIcon sx={{ fontSize: 14, color: "warning.dark" }} />
                </Tooltip>
              </Stack>
              <Typography
                variant="h6"
                fontWeight={800}
                color={
                  (summary?.remainingAmount ?? 0) > 0
                    ? "warning.dark"
                    : "success.main"
                }
                sx={{ mt: 0.5 }}
              >
                {formatVnd(summary?.remainingAmount ?? 0)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Tự động cập nhật khi thu tiền / sửa HĐ
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                TIẾN ĐỘ THU TIỀN
              </Typography>
              <Typography variant="h6" fontWeight={800} color="primary.main" sx={{ mt: 0.5 }}>
                {collectionRate.toFixed(1)}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={collectionRate}
                color={collectionRate >= 100 ? "success" : "primary"}
                sx={{ height: 8, borderRadius: 4, mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ================= PHẦN 1: KẾ HOẠCH ĐỢT THANH TOÁN (2.13) ================= */}
      <Paper variant="outlined" sx={{ p: 2.5, mb: 3, borderRadius: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1.5}
          sx={{ mb: 2 }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <ReceiptLongOutlinedIcon color="primary" />
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                Kế hoạch các đợt thanh toán (2.13)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Theo dõi % giá trị hợp đồng, mốc điều kiện nghiệm thu/thanh toán và ngày dự kiến thu
              </Typography>
            </Box>
          </Stack>

          {canManagePayments && (
            <CoreButton
              theme="draft"
              startIcon={<EditOutlinedIcon />}
              onClick={openPlanEditor}
            >
              Chỉnh sửa kế hoạch đợt
            </CoreButton>
          )}
        </Stack>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8fafc" }}>
                <TableCell sx={{ fontWeight: 700 }}>Đợt</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  % Giá trị HĐ
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Số tiền dự kiến
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Mốc điều kiện</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Ngày dự kiến</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Đã thu thực tế
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                {canManagePayments && (
                  <TableCell sx={{ fontWeight: 700 }} align="center">
                    Thao tác
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {projectLines.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={canManagePayments ? 8 : 7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Chưa thiết lập kế hoạch các đợt thanh toán cho dự án này.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                projectLines.map((line, idx) => {
                  const statusMeta =
                    PAYMENT_PLAN_STATUS_META[line.status || "PLANNED"] ||
                    PAYMENT_PLAN_STATUS_META.PLANNED;
                  const pct =
                    line.percentage !== null && line.percentage !== undefined
                      ? Number(line.percentage)
                      : numericContractValue > 0 && line.paymentAmount
                      ? (Number(line.paymentAmount) * 100) / numericContractValue
                      : 0;

                  return (
                    <TableRow key={line.id || idx} hover>
                      <TableCell sx={{ fontWeight: 600 }}>
                        Đợt {line.paymentNo ?? idx + 1}
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          size="small"
                          variant="outlined"
                          color="primary"
                          label={`${pct.toFixed(1)}%`}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        {formatVnd(line.paymentAmount)}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {line.conditionMilestone || "—"}
                        </Typography>
                        {line.note && (
                          <Typography variant="caption" color="text.secondary">
                            {line.note}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {line.paymentDate
                          ? moment(line.paymentDate).format("DD/MM/YYYY")
                          : "—"}
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="success.main"
                        >
                          {formatVnd(line.collectedAmount ?? 0)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          color={statusMeta.color}
                          label={line.statusLabel || statusMeta.label}
                        />
                      </TableCell>
                      {canManagePayments && (
                        <TableCell align="center">
                          {line.status !== "PAID" && (
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<PaymentsOutlinedIcon fontSize="small" />}
                              onClick={() =>
                                openCreatePaymentDialog(
                                  line.id,
                                  line.remainingLineAmount ??
                                    Number(line.paymentAmount || 0)
                                )
                              }
                            >
                              Thu tiền
                            </Button>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* ================= PHẦN 2: GHI NHẬN THU TIỀN THỰC TẾ (2.14) ================= */}
      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1.5}
          sx={{ mb: 2 }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <PaymentsOutlinedIcon color="success" />
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                Lịch sử ghi nhận thu tiền thực tế (2.14)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Lưu chứng từ đính kèm, trạng thái xác nhận thu và tự động khấu trừ số tiền còn phải thu
              </Typography>
            </Box>
          </Stack>

          {canManagePayments && (
            <CoreButton
              theme="submit"
              startIcon={<AddIcon />}
              onClick={() => openCreatePaymentDialog()}
            >
              Ghi nhận thu tiền thực tế
            </CoreButton>
          )}
        </Stack>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8fafc" }}>
                <TableCell sx={{ fontWeight: 700 }}>Mã phiếu thu</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Ngày thu</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Đợt kế hoạch</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Số tiền thu
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Hình thức</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Người nộp</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Chứng từ đính kèm</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                {canManagePayments && (
                  <TableCell sx={{ fontWeight: 700 }} align="center">
                    Hành động
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={canManagePayments ? 9 : 8}
                    align="center"
                    sx={{ py: 3 }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Chưa có giao dịch thu tiền thực tế nào được ghi nhận.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((p) => {
                  const statusOpt =
                    PROJECT_PAYMENT_STATUS_OPTIONS.find(
                      (o) => o.value === p.status
                    ) || PROJECT_PAYMENT_STATUS_OPTIONS[0];

                  return (
                    <TableRow key={p.id} hover>
                      <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>
                        {p.receiptCode}
                      </TableCell>
                      <TableCell>
                        {p.paymentDate
                          ? moment(p.paymentDate).format("DD/MM/YYYY")
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {p.paymentPlanNo ? (
                          <Stack>
                            <Typography variant="body2" fontWeight={600}>
                              Đợt {p.paymentPlanNo}
                            </Typography>
                            {p.paymentPlanMilestone && (
                              <Typography variant="caption" color="text.secondary">
                                {p.paymentPlanMilestone}
                              </Typography>
                            )}
                          </Stack>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        {formatVnd(p.amount)}
                      </TableCell>
                      <TableCell>
                        {p.paymentMethodLabel || p.paymentMethod || "—"}
                      </TableCell>
                      <TableCell>{p.payerName || "—"}</TableCell>
                      <TableCell>
                        {p.attachments && p.attachments.length > 0 ? (
                          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                            {p.attachments.map((att, idx) => (
                              <Chip
                                key={idx}
                                size="small"
                                icon={<AttachFileIcon fontSize="small" />}
                                label={att.name || `Chứng từ ${idx + 1}`}
                                component="a"
                                href={att.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                clickable
                                variant="outlined"
                                color="primary"
                              />
                            ))}
                          </Stack>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          color={statusOpt.color}
                          label={p.statusLabel || statusOpt.label}
                        />
                      </TableCell>
                      {canManagePayments && (
                        <TableCell align="center">
                          <Stack
                            direction="row"
                            spacing={0.5}
                            justifyContent="center"
                          >
                            {canApprovePayments && p.status !== "CONFIRMED" && (
                              <Tooltip title="Xác nhận đã thu tiền">
                                <IconButton
                                  size="small"
                                  color="success"
                                  onClick={() =>
                                    handleQuickChangeStatus(p, "CONFIRMED")
                                  }
                                >
                                  <CheckCircleOutlineIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            {canApprovePayments && p.status !== "CANCELLED" && (
                              <Tooltip title="Hủy phiếu thu">
                                <IconButton
                                  size="small"
                                  color="warning"
                                  onClick={() =>
                                    handleQuickChangeStatus(p, "CANCELLED")
                                  }
                                >
                                  <CancelOutlinedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="Chỉnh sửa phiếu thu">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => openEditPaymentDialog(p)}
                              >
                                <EditOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Xóa phiếu thu">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeletePayment(p)}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* ================= DIALOG CHỈNH SỬA KẾ HOẠCH ĐỢT THANH TOÁN (2.13) ================= */}
      <Dialog
        open={planDialogOpen}
        onClose={() => !savingPlans && setPlanDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Kế hoạch các đợt thanh toán (2.13)</DialogTitle>
        <DialogContent dividers>
          <Alert
            severity={Math.abs(totalPlannedPercent - 100) < 0.01 ? "success" : "info"}
            sx={{ mb: 2 }}
          >
            Giá trị hợp đồng hiện tại:{" "}
            <strong>{formatVnd(numericContractValue)}</strong> • Tổng % kế hoạch:{" "}
            <strong>{totalPlannedPercent.toFixed(1)}%</strong> (
            {formatVnd(totalPlannedAmount)})
          </Alert>

          <Stack spacing={2}>
            {planRows.map((row, idx) => (
              <Paper
                key={idx}
                variant="outlined"
                sx={{ p: 2, borderRadius: 2, bgcolor: "#f8fafc" }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={1}>
                    <Typography variant="subtitle2" fontWeight={700}>
                      Đợt {idx + 1}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="% giá trị HĐ"
                      value={row.percentage}
                      onChange={(e) =>
                        handlePlanFieldChange(idx, "percentage", e.target.value)
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2.5}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="Số tiền dự kiến (VNĐ)"
                      value={row.paymentAmount}
                      onChange={(e) =>
                        handlePlanFieldChange(
                          idx,
                          "paymentAmount",
                          e.target.value
                        )
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={2.5}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Mốc điều kiện (VD: Đổ mái)"
                      value={row.conditionMilestone}
                      onChange={(e) =>
                        handlePlanFieldChange(
                          idx,
                          "conditionMilestone",
                          e.target.value
                        )
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      size="small"
                      type="date"
                      label="Ngày dự kiến"
                      InputLabelProps={{ shrink: true }}
                      value={row.paymentDate}
                      onChange={(e) =>
                        handlePlanFieldChange(idx, "paymentDate", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={1.5}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Ghi chú"
                      value={row.note}
                      onChange={(e) =>
                        handlePlanFieldChange(idx, "note", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={0.5} sx={{ textAlign: "right" }}>
                    <IconButton
                      color="error"
                      onClick={() =>
                        setPlanRows((prev) => prev.filter((_, i) => i !== idx))
                      }
                      disabled={planRows.length <= 1}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Stack>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() =>
                setPlanRows((prev) => [
                  ...prev,
                  {
                    paymentNo: prev.length + 1,
                    percentage: "",
                    paymentAmount: "",
                    conditionMilestone: "",
                    paymentDate: moment().format("YYYY-MM-DD"),
                    note: "",
                  },
                ])
              }
            >
              Thêm đợt thanh toán
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <CoreButton
            theme="cancel"
            onClick={() => setPlanDialogOpen(false)}
            disabled={savingPlans}
          >
            Hủy
          </CoreButton>
          <CoreButton
            theme="submit"
            onClick={handleSavePlans}
            loading={savingPlans}
          >
            Lưu kế hoạch đợt thanh toán
          </CoreButton>
        </DialogActions>
      </Dialog>

      {/* ================= DIALOG GHI NHẬN THU TIỀN THỰC TẾ (2.14) ================= */}
      <Dialog
        open={paymentDialogOpen}
        onClose={() => !savingPayment && setPaymentDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {paymentForm.id
            ? "Cập nhật phiếu thu tiền thực tế"
            : "Ghi nhận thu tiền thực tế (2.14)"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Mã phiếu thu (tự sinh nếu trống)"
                placeholder="VD: PT-DA001-001"
                value={paymentForm.receiptCode}
                onChange={(e) =>
                  setPaymentForm((prev) => ({
                    ...prev,
                    receiptCode: e.target.value,
                  }))
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                type="date"
                required
                label="Ngày thu thực tế"
                InputLabelProps={{ shrink: true }}
                value={paymentForm.paymentDate}
                onChange={(e) =>
                  setPaymentForm((prev) => ({
                    ...prev,
                    paymentDate: e.target.value,
                  }))
                }
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Gắn với đợt thanh toán kế hoạch (tùy chọn)</InputLabel>
                <Select
                  value={paymentForm.projectLineId}
                  label="Gắn với đợt thanh toán kế hoạch (tùy chọn)"
                  onChange={(e) => {
                    const selectedId = e.target.value as number | "";
                    setPaymentForm((prev) => ({
                      ...prev,
                      projectLineId: selectedId,
                    }));
                  }}
                >
                  <MenuItem value="">Không gắn đợt cụ thể</MenuItem>
                  {projectLines.map((l, idx) => (
                    <MenuItem key={l.id || idx} value={l.id}>
                      Đợt {l.paymentNo ?? idx + 1} —{" "}
                      {l.conditionMilestone || "Thanh toán"} (
                      {formatVnd(l.paymentAmount)})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                required
                type="number"
                label="Số tiền thực thu (VNĐ)"
                value={paymentForm.amount}
                onChange={(e) =>
                  setPaymentForm((prev) => ({
                    ...prev,
                    amount: e.target.value,
                  }))
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Hình thức thanh toán</InputLabel>
                <Select
                  value={paymentForm.paymentMethod}
                  label="Hình thức thanh toán"
                  onChange={(e) =>
                    setPaymentForm((prev) => ({
                      ...prev,
                      paymentMethod: e.target.value as PaymentMethod,
                    }))
                  }
                >
                  {PAYMENT_METHOD_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Trạng thái thu tiền</InputLabel>
                <Select
                  value={paymentForm.status}
                  label="Trạng thái thu tiền"
                  onChange={(e) =>
                    setPaymentForm((prev) => ({
                      ...prev,
                      status: e.target.value as ProjectPaymentStatus,
                    }))
                  }
                >
                  {PROJECT_PAYMENT_STATUS_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Người nộp / Bên thanh toán"
                value={paymentForm.payerName}
                onChange={(e) =>
                  setPaymentForm((prev) => ({
                    ...prev,
                    payerName: e.target.value,
                  }))
                }
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 0.5 }} />
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                Chứng từ đính kèm (Ủy nhiệm chi, Phiếu thu, Ảnh chụp CK...)
              </Typography>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadOutlinedIcon />}
                disabled={uploadingFile}
                size="small"
              >
                {uploadingFile ? "Đang tải lên..." : "Tải lên chứng từ"}
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={handleFileUpload}
                />
              </Button>

              {paymentForm.attachments.length > 0 && (
                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  useFlexGap
                  sx={{ mt: 1.5 }}
                >
                  {paymentForm.attachments.map((att, idx) => (
                    <Chip
                      key={idx}
                      size="small"
                      icon={<AttachFileIcon />}
                      label={att.name}
                      onDelete={() =>
                        setPaymentForm((prev) => ({
                          ...prev,
                          attachments: prev.attachments.filter(
                            (_, i) => i !== idx
                          ),
                        }))
                      }
                      onClick={() => window.open(att.url, "_blank")}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                multiline
                minRows={2}
                label="Ghi chú / Diễn giải"
                value={paymentForm.note}
                onChange={(e) =>
                  setPaymentForm((prev) => ({
                    ...prev,
                    note: e.target.value,
                  }))
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <CoreButton
            theme="cancel"
            onClick={() => setPaymentDialogOpen(false)}
            disabled={savingPayment}
          >
            Hủy
          </CoreButton>
          <CoreButton
            theme="submit"
            onClick={handleSavePayment}
            loading={savingPayment}
          >
            {paymentForm.id ? "Lưu thay đổi" : "Xác nhận ghi nhận thu tiền"}
          </CoreButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
