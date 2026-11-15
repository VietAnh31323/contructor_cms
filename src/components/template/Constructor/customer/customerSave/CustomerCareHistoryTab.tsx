import {
  Alert,
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PhoneInTalkOutlinedIcon from "@mui/icons-material/PhoneInTalkOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CoreLoading from "@/components/molecules/CoreLoading";
import { CoreButton } from "@/components/atoms/CoreButton";
import {
  CareChannel,
  CareOutcome,
  CustomerCareLog,
} from "@/service/constructor/Customer/careLogs/type";
import {
  deleteCustomerCareLog,
  postCustomerCareLog,
  putCustomerCareLog,
} from "@/service/constructor/Customer/careLogs";
import { useEmployeeListQuery } from "@/service/constructor/Employee/getList";
import { CodeNameRef } from "@/service/constructor/Customer/getList/type";
import { toastError, toastSuccess } from "@/toast";
import moment from "moment";
import { useMemo, useState } from "react";
import {
  CARE_CHANNEL_LABELS,
  CARE_CHANNEL_OPTIONS,
  CARE_OUTCOME_META,
  CARE_OUTCOME_OPTIONS,
} from "../constants";

type Props = {
  customerId: number;
  defaultStaff?: CodeNameRef | null;
  careLogs: CustomerCareLog[];
  isLoading: boolean;
  canManage: boolean;
  onRefresh: () => void;
};

type FormState = {
  id?: number;
  careChannel: CareChannel;
  careTime: string;
  staffId: number | "";
  summary: string;
  content: string;
  outcome: CareOutcome | "";
  nextActionDate: string;
  nextActionNote: string;
};

const toDateTimeLocalInput = (iso?: string | null): string => {
  if (!iso) return "";
  const m = moment(iso);
  return m.isValid() ? m.format("YYYY-MM-DDTHH:mm") : "";
};

export default function CustomerCareHistoryTab({
  customerId,
  defaultStaff,
  careLogs,
  isLoading,
  canManage,
  onRefresh,
}: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>({
    careChannel: "CALL",
    careTime: moment().format("YYYY-MM-DDTHH:mm"),
    staffId: defaultStaff?.id ?? "",
    summary: "",
    content: "",
    outcome: "POSITIVE",
    nextActionDate: "",
    nextActionNote: "",
  });

  const { data: employeeData } = useEmployeeListQuery({ page: 0, size: 200 });
  const staffOptions = useMemo(
    () => employeeData?.data?.content ?? [],
    [employeeData]
  );

  const stats = useMemo(() => {
    let callsAndMeetings = 0;
    let upcoming = 0;
    let overdue = 0;
    for (const log of careLogs) {
      if (
        log.careChannel === "CALL" ||
        log.careChannel === "MEETING" ||
        log.careChannel === "SITE_SURVEY"
      ) {
        callsAndMeetings++;
      }
      if (log.overdueFollowUp) overdue++;
      if (log.upcomingFollowUp) upcoming++;
    }
    return {
      total: careLogs.length,
      callsAndMeetings,
      upcoming,
      overdue,
    };
  }, [careLogs]);

  const handleOpenAdd = () => {
    setForm({
      careChannel: "CALL",
      careTime: moment().format("YYYY-MM-DDTHH:mm"),
      staffId: defaultStaff?.id ?? "",
      summary: "",
      content: "",
      outcome: "POSITIVE",
      nextActionDate: "",
      nextActionNote: "",
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (log: CustomerCareLog) => {
    setForm({
      id: log.id,
      careChannel: log.careChannel || "CALL",
      careTime:
        toDateTimeLocalInput(log.careTime) ||
        moment().format("YYYY-MM-DDTHH:mm"),
      staffId: log.staff?.id ?? log.staffId ?? "",
      summary: log.summary || "",
      content: log.content || "",
      outcome: (log.outcome as CareOutcome) || "",
      nextActionDate: toDateTimeLocalInput(log.nextActionDate),
      nextActionNote: log.nextActionNote || "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.content.trim()) {
      toastError("Vui lòng nhập nội dung trao đổi / ghi chú chăm sóc!");
      return;
    }
    setSubmitting(true);
    try {
      const payload: CustomerCareLog = {
        careChannel: form.careChannel,
        careTime: form.careTime
          ? moment(form.careTime).format("YYYY-MM-DDTHH:mm:ss")
          : moment().format("YYYY-MM-DDTHH:mm:ss"),
        staffId: form.staffId === "" ? null : Number(form.staffId),
        summary: form.summary.trim() || undefined,
        content: form.content.trim(),
        outcome: form.outcome || undefined,
        nextActionDate: form.nextActionDate
          ? moment(form.nextActionDate).format("YYYY-MM-DDTHH:mm:ss")
          : null,
        nextActionNote: form.nextActionNote.trim() || undefined,
      };

      if (form.id) {
        await putCustomerCareLog(customerId, form.id, payload);
        toastSuccess("Cập nhật lịch sử chăm sóc thành công!");
      } else {
        await postCustomerCareLog(customerId, payload);
        toastSuccess("Ghi nhận lịch sử chăm sóc thành công!");
      }
      setDialogOpen(false);
      onRefresh();
    } catch (err: any) {
      toastError(
        err?.response?.data?.message ||
          err?.message ||
          "Không thể lưu lịch sử chăm sóc"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (logId?: number) => {
    if (!logId) return;
    if (!window.confirm("Bạn có chắc chắn muốn xóa nhật ký chăm sóc này?")) {
      return;
    }
    try {
      await deleteCustomerCareLog(customerId, logId);
      toastSuccess("Đã xóa nhật ký chăm sóc!");
      onRefresh();
    } catch (err: any) {
      toastError(
        err?.response?.data?.message || err?.message || "Xóa thất bại"
      );
    }
  };

  if (isLoading) {
    return <CoreLoading />;
  }

  return (
    <Box className="py-4">
      {/* KPI tổng quan chăm sóc */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" color="text.secondary">
                TỔNG LẦN CHĂM SÓC
              </Typography>
              <PhoneInTalkOutlinedIcon color="primary" fontSize="small" />
            </Stack>
            <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
              {stats.total}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" color="text.secondary">
                GỌI ĐIỆN / GẶP TRỰC TIẾP
              </Typography>
              <GroupsOutlinedIcon color="info" fontSize="small" />
            </Stack>
            <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
              {stats.callsAndMeetings}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" color="text.secondary">
                LỊCH HẸN SẮP TỚI (≤ 7 NGÀY)
              </Typography>
              <EventAvailableOutlinedIcon color="success" fontSize="small" />
            </Stack>
            <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
              {stats.upcoming}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 2,
              borderColor: stats.overdue > 0 ? "error.light" : "divider",
            }}
          >
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" color="text.secondary">
                LỊCH HẸN QUÁ HẠN
              </Typography>
              <WarningAmberOutlinedIcon
                color={stats.overdue > 0 ? "error" : "disabled"}
                fontSize="small"
              />
            </Stack>
            <Typography
              variant="h5"
              fontWeight={700}
              color={stats.overdue > 0 ? "error.main" : "text.primary"}
              sx={{ mt: 1 }}
            >
              {stats.overdue}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2.5 }}
      >
        <Typography variant="subtitle1" fontWeight={700}>
          Nhật ký tương tác & chăm sóc khách hàng ({careLogs.length})
        </Typography>

        {canManage && (
          <CoreButton
            theme="submit"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleOpenAdd}
          >
            Ghi nhận chăm sóc mới
          </CoreButton>
        )}
      </Stack>

      {careLogs.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            p: 4,
            textAlign: "center",
            color: "text.secondary",
            bgcolor: "#fafafa",
            borderRadius: 2,
          }}
        >
          Chưa có lịch sử cuộc gọi / gặp mặt hay ghi chú chăm sóc nào cho khách
          hàng này.
        </Paper>
      ) : (
        <Stack spacing={2}>
          {careLogs.map((log) => {
            const outcomeMeta = log.outcome
              ? CARE_OUTCOME_META[log.outcome as CareOutcome]
              : null;
            return (
              <Paper
                key={log.id}
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  borderLeft: "4px solid",
                  borderLeftColor: log.overdueFollowUp
                    ? "error.main"
                    : log.upcomingFollowUp
                    ? "warning.main"
                    : "primary.main",
                }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  spacing={1}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    flexWrap="wrap"
                    useFlexGap
                  >
                    <Chip
                      size="small"
                      color="primary"
                      label={
                        CARE_CHANNEL_LABELS[log.careChannel] || log.careChannel
                      }
                    />
                    <Typography variant="body2" fontWeight={700}>
                      {log.careTime
                        ? moment(log.careTime).format("DD/MM/YYYY HH:mm")
                        : "—"}
                    </Typography>
                    {outcomeMeta && (
                      <Chip
                        size="small"
                        variant="outlined"
                        color={outcomeMeta.color}
                        label={outcomeMeta.label}
                      />
                    )}
                    {log.staff?.name && (
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <PersonOutlineIcon
                          fontSize="small"
                          color="action"
                        />
                        <Typography variant="caption" color="text.secondary">
                          Phụ trách: <strong>{log.staff.name}</strong>
                        </Typography>
                      </Stack>
                    )}
                  </Stack>

                  {canManage && (
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenEdit(log)}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(log.id)}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  )}
                </Stack>

                {log.summary && (
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    sx={{ mt: 1.5 }}
                  >
                    {log.summary}
                  </Typography>
                )}

                <Typography
                  variant="body2"
                  sx={{ mt: 1, whiteSpace: "pre-line", color: "text.primary" }}
                >
                  {log.content}
                </Typography>

                {log.nextActionDate && (
                  <>
                    <Divider sx={{ my: 1.5 }} />
                    <Alert
                      severity={
                        log.overdueFollowUp
                          ? "error"
                          : log.upcomingFollowUp
                          ? "warning"
                          : "info"
                      }
                      sx={{ py: 0.5 }}
                    >
                      <Typography variant="body2">
                        <strong>Lịch hẹn tiếp theo:</strong>{" "}
                        {moment(log.nextActionDate).format("DD/MM/YYYY HH:mm")}
                        {log.overdueFollowUp ? " (Quá hạn)" : ""}
                        {log.nextActionNote ? ` — ${log.nextActionNote}` : ""}
                      </Typography>
                    </Alert>
                  </>
                )}
              </Paper>
            );
          })}
        </Stack>
      )}

      {/* Dialog thêm / sửa nhật ký chăm sóc */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {form.id
            ? "Cập nhật nhật ký chăm sóc khách hàng"
            : "Ghi nhận chăm sóc khách hàng"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2.5} sx={{ pt: 0.5 }}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                select
                fullWidth
                size="small"
                label="Hình thức tương tác *"
                value={form.careChannel}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    careChannel: e.target.value as CareChannel,
                  }))
                }
              >
                {CARE_CHANNEL_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                type="datetime-local"
                fullWidth
                size="small"
                label="Thời điểm thực hiện *"
                InputLabelProps={{ shrink: true }}
                value={form.careTime}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, careTime: e.target.value }))
                }
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                select
                fullWidth
                size="small"
                label="Người phụ trách"
                value={form.staffId}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    staffId:
                      e.target.value === "" ? "" : Number(e.target.value),
                  }))
                }
              >
                <MenuItem value="">-- Tự động / Chưa chọn --</MenuItem>
                {staffOptions.map((st: any) => (
                  <MenuItem key={st.id} value={st.id}>
                    {st.code ? `${st.code} - ` : ""}
                    {st.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                size="small"
                label="Tiêu đề / Chủ đề trao đổi"
                placeholder="VD: Tư vấn phương án thiết kế mặt bằng & báo giá sơ bộ"
                value={form.summary}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, summary: e.target.value }))
                }
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                size="small"
                label="Kết quả phản hồi"
                value={form.outcome}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    outcome: e.target.value as CareOutcome | "",
                  }))
                }
              >
                <MenuItem value="">-- Không chọn --</MenuItem>
                {CARE_OUTCOME_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                size="small"
                label="Nội dung trao đổi / Ghi chú chi tiết *"
                placeholder="Ghi nhận chi tiết nhu cầu, quy mô công trình, ngân sách dự kiến, phản hồi của khách hàng..."
                value={form.content}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, content: e.target.value }))
                }
              />
            </Grid>

            <Grid item xs={12} sm={5}>
              <TextField
                type="datetime-local"
                fullWidth
                size="small"
                label="Lịch hẹn chăm sóc tiếp theo"
                InputLabelProps={{ shrink: true }}
                value={form.nextActionDate}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    nextActionDate: e.target.value,
                  }))
                }
              />
            </Grid>

            <Grid item xs={12} sm={7}>
              <TextField
                fullWidth
                size="small"
                label="Nội dung lịch hẹn tiếp theo"
                placeholder="VD: Gửi dự toán chi tiết & hẹn khảo sát hiện trạng đất"
                value={form.nextActionNote}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    nextActionNote: e.target.value,
                  }))
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <CoreButton onClick={() => setDialogOpen(false)} theme="cancel">
            Hủy
          </CoreButton>
          <CoreButton
            theme="submit"
            onClick={handleSave}
            loading={submitting}
          >
            Lưu nhật ký
          </CoreButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
