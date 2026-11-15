import { CoreButton } from "@/components/atoms/CoreButton";
import { CustomerDetail } from "@/service/constructor/Customer/getDetail/type";
import { CustomerType } from "@/service/constructor/Customer/getList/type";
import { ProjectState } from "@/service/constructor/Project/getList/type";
import { ProjectStateTransitionRequest } from "@/service/constructor/Project/lifecycle/type";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Alert,
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import {
  evaluateTransitionChecklist,
  normalizeProjectState,
  PROJECT_STATE_META,
  requiresTransitionReason,
} from "./constants";

export type TransitionProjectSnapshot = {
  id: number;
  code?: string;
  name: string;
  fromState?: ProjectState | null;
  hasCustomer: boolean;
  customerType?: CustomerType | null;
  customerInfo?: CustomerDetail | null;
  address?: string | null;
  categoryCount?: number;
  contractValue?: number | string | null;
  signDate?: string | null;
  hasManager: boolean;
  actualHandoverDate?: string | null;
  warrantyEndDate?: string | null;
};

type Props = {
  open: boolean;
  targetState: ProjectState | null;
  snapshot: TransitionProjectSnapshot | null;
  submitting?: boolean;
  onClose: () => void;
  onConfirm: (payload: ProjectStateTransitionRequest) => Promise<void> | void;
  onOpenEditProject?: (projectId: number) => void;
};

export default function ProjectTransitionDialog({
  open,
  targetState,
  snapshot,
  submitting = false,
  onClose,
  onConfirm,
  onOpenEditProject,
}: Props) {
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [handoverDate, setHandoverDate] = useState("");
  const [warrantyDate, setWarrantyDate] = useState("");

  const fromState = normalizeProjectState(snapshot?.fromState);
  const toState = targetState ? normalizeProjectState(targetState) : null;

  const needReason = useMemo(
    () => requiresTransitionReason(fromState, toState),
    [fromState, toState]
  );

  useEffect(() => {
    if (!open || !toState) return;
    setReason("");
    setReasonError("");
    const defaultHandover =
      snapshot?.actualHandoverDate || moment().format("YYYY-MM-DD");
    setHandoverDate(defaultHandover);
    const defaultWarranty =
      snapshot?.warrantyEndDate ||
      moment(defaultHandover).add(12, "months").format("YYYY-MM-DD");
    setWarrantyDate(defaultWarranty);
  }, [open, toState, snapshot]);

  const checklist = useMemo(() => {
    if (!toState || !snapshot) return [];
    return evaluateTransitionChecklist(toState, {
      hasCustomer: snapshot.hasCustomer,
      customerType: snapshot.customerType,
      customerInfo: snapshot.customerInfo,
      address: snapshot.address,
      categoryCount: snapshot.categoryCount,
      contractValue: snapshot.contractValue,
      signDate: snapshot.signDate,
      hasManager: snapshot.hasManager,
    });
  }, [toState, snapshot]);

  const failedChecks = useMemo(
    () => checklist.filter((item) => !item.passed),
    [checklist]
  );

  if (!open || !toState || !snapshot) {
    return null;
  }

  const fromMeta = PROJECT_STATE_META[fromState] || PROJECT_STATE_META.RECEIVED;
  const toMeta = PROJECT_STATE_META[toState] || PROJECT_STATE_META.RECEIVED;

  const handleConfirm = async () => {
    if (needReason && !reason.trim()) {
      setReasonError(
        "Vui lòng nhập lý do khi Tạm dừng, Hủy hoặc lùi bước vòng đời dự án"
      );
      return;
    }
    setReasonError("");
    await onConfirm({
      toState,
      reason: reason.trim() || undefined,
      actualHandoverDate:
        toState === "HANDOVER" && handoverDate ? handoverDate : undefined,
      warrantyEndDate:
        toState === "WARRANTY" && warrantyDate ? warrantyDate : undefined,
    });
  };

  return (
    <Dialog open={open} onClose={submitting ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
        Chuyển trạng thái vòng đời dự án
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2.25}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Dự án áp dụng
            </Typography>
            <Typography variant="subtitle1" fontWeight={700}>
              {snapshot.code ? `${snapshot.code} — ` : ""}
              {snapshot.name}
            </Typography>
          </Box>

          <Box
            sx={{
              p: 1.75,
              borderRadius: 2,
              bgcolor: toMeta.bg,
              border: `1px solid ${toMeta.accent}40`,
            }}
          >
            <Stack
              direction="row"
              spacing={1.25}
              alignItems="center"
              flexWrap="wrap"
            >
              <Chip
                size="small"
                color={fromMeta.color}
                label={fromMeta.shortLabel}
              />
              <ArrowForwardIcon fontSize="small" color="action" />
              <Chip
                size="small"
                color={toMeta.color}
                label={toMeta.shortLabel}
                sx={{ fontWeight: 700 }}
              />
            </Stack>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 1 }}
            >
              {toMeta.description}
            </Typography>
          </Box>

          {checklist.length > 0 && (
            <Box>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                Kiểm tra điều kiện chuyển bước
              </Typography>
              <Stack spacing={1}>
                {checklist.map((item, idx) => (
                  <Stack
                    key={idx}
                    direction="row"
                    spacing={1}
                    alignItems="flex-start"
                    sx={{
                      p: 1,
                      borderRadius: 1.5,
                      bgcolor: item.passed ? "#f0fdf4" : "#fff7ed",
                      border: `1px solid ${
                        item.passed ? "#bbf7d0" : "#fed7aa"
                      }`,
                    }}
                  >
                    {item.passed ? (
                      <CheckCircleOutlineIcon
                        fontSize="small"
                        color="success"
                        sx={{ mt: 0.15 }}
                      />
                    ) : (
                      <ErrorOutlineIcon
                        fontSize="small"
                        color="warning"
                        sx={{ mt: 0.15 }}
                      />
                    )}
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {item.label}
                      </Typography>
                      {item.hint && !item.passed && (
                        <Typography variant="caption" color="text.secondary">
                          {item.hint}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Box>
          )}

          {failedChecks.length > 0 && (
            <Alert
              severity="warning"
              action={
                onOpenEditProject ? (
                  <CoreButton
                    theme="cancel"
                    onClick={() => {
                      onClose();
                      onOpenEditProject(snapshot.id);
                    }}
                  >
                    Bổ sung hồ sơ
                  </CoreButton>
                ) : undefined
              }
            >
              Dự án hiện chưa đáp ứng đủ điều kiện bắt buộc để chuyển sang bước{" "}
              <strong>{toMeta.label}</strong>. Vui lòng bổ sung các thông tin còn
              thiếu trước khi chuyển.
            </Alert>
          )}

          {toState === "CANCELLED" && (
            <Alert severity="error">
              Lưu ý: Sau khi chuyển sang trạng thái <strong>Hủy</strong>, dự án
              sẽ kết thúc vòng đời và không thể mở lại.
            </Alert>
          )}

          {toState === "HANDOVER" && (
            <TextField
              type="date"
              size="small"
              fullWidth
              label="Ngày bàn giao thực tế"
              InputLabelProps={{ shrink: true }}
              value={handoverDate}
              onChange={(e) => setHandoverDate(e.target.value)}
              helperText="Hệ thống tự động cập nhật tiến độ dự án đạt 100% khi bàn giao"
            />
          )}

          {toState === "WARRANTY" && (
            <TextField
              type="date"
              size="small"
              fullWidth
              label="Ngày kết thúc bảo hành dự kiến"
              InputLabelProps={{ shrink: true }}
              value={warrantyDate}
              onChange={(e) => setWarrantyDate(e.target.value)}
              helperText="Mặc định 12 tháng kể từ ngày bàn giao công trình"
            />
          )}

          <Divider />

          <TextField
            size="small"
            fullWidth
            multiline
            rows={3}
            required={needReason}
            label={
              needReason
                ? "Lý do chuyển trạng thái (Bắt buộc)"
                : "Ghi chú / Biên bản chuyển bước (Tùy chọn)"
            }
            placeholder={
              needReason
                ? "Nhập lý do tạm dừng, hủy dự án hoặc điều chỉnh lùi bước..."
                : "Nhập ghi chú kết quả khảo sát, số báo giá, biên bản nghiệm thu..."
            }
            value={reason}
            error={Boolean(reasonError)}
            helperText={
              reasonError ||
              "Thông tin này sẽ được lưu cố định vào Lịch sử vòng đời dự án & Nhật ký hệ thống."
            }
            onChange={(e) => {
              setReason(e.target.value);
              if (reasonError) setReasonError("");
            }}
          />

          <Stack direction="row" spacing={1} alignItems="center">
            <InfoOutlinedIcon fontSize="small" color="info" />
            <Typography variant="caption" color="text.secondary">
              Pipeline của khách hàng liên kết sẽ tự động đồng bộ tương ứng theo
              tiến trình mới của dự án.
            </Typography>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <CoreButton theme="cancel" onClick={onClose} disabled={submitting}>
          Đóng
        </CoreButton>
        <CoreButton
          theme="submit"
          onClick={handleConfirm}
          loading={submitting}
          disabled={failedChecks.length > 0}
        >
          Xác nhận chuyển sang &ldquo;{toMeta.label}&rdquo;
        </CoreButton>
      </DialogActions>
    </Dialog>
  );
}
