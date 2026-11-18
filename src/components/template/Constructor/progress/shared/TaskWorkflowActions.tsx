import { CoreButton } from "@/components/atoms/CoreButton";
import { putUpdateTaskState } from "@/service/constructor/Project/gantt";
import {
  GanttTaskItem,
  TaskState,
} from "@/service/constructor/Project/gantt/type";
import { toastError, toastSuccess } from "@/toast";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { TASK_STATE_META, getTransitionLabel } from "./constants";

type Props = {
  task: GanttTaskItem;
  onChanged?: () => void | Promise<void>;
  size?: "small" | "medium";
};

const ICONS: Partial<Record<TaskState, JSX.Element>> = {
  IN_PROGRESS: <PlayArrowRoundedIcon fontSize="small" />,
  PENDING_REVIEW: <SendRoundedIcon fontSize="small" />,
  COMPLETED: <CheckCircleOutlineIcon fontSize="small" />,
  RETURNED: <UndoRoundedIcon fontSize="small" />,
  NOT_STARTED: <ReplayRoundedIcon fontSize="small" />,
};

const VARIANT: Partial<Record<TaskState, "contained" | "outlined">> = {
  IN_PROGRESS: "contained",
  PENDING_REVIEW: "contained",
  COMPLETED: "contained",
  RETURNED: "outlined",
  NOT_STARTED: "outlined",
};

const COLOR: Partial<
  Record<TaskState, "primary" | "secondary" | "success" | "warning" | "inherit">
> = {
  IN_PROGRESS: "primary",
  PENDING_REVIEW: "secondary",
  COMPLETED: "success",
  RETURNED: "warning",
  NOT_STARTED: "inherit",
};

/**
 * 2.23: Nút chuyển trạng thái theo workflow – chỉ hiển thị các bước hợp lệ
 * với người dùng hiện tại (do backend tính `allowedNextStates`).
 */
export default function TaskWorkflowActions({ task, onChanged, size = "small" }: Props) {
  const [submitting, setSubmitting] = useState<TaskState | null>(null);
  const [returnOpen, setReturnOpen] = useState(false);
  const [reason, setReason] = useState("");

  const allowed = task.allowedNextStates ?? [];

  const doTransition = async (target: TaskState, why?: string) => {
    try {
      setSubmitting(target);
      await putUpdateTaskState({ id: task.id, state: target, reason: why });
      toastSuccess(
        `"${task.name}": ${TASK_STATE_META[task.state]?.label} → ${TASK_STATE_META[target].label}`
      );
      setReturnOpen(false);
      setReason("");
      await onChanged?.();
    } catch (err) {
      toastError(err);
    } finally {
      setSubmitting(null);
    }
  };

  if (task.hasChildren) {
    return (
      <Alert severity="info" icon={<LockOutlinedIcon fontSize="small" />} sx={{ py: 0.25 }}>
        Công việc có việc con: trạng thái & % tiến độ được tự tổng hợp từ việc con.
      </Alert>
    );
  }

  if (allowed.length === 0) {
    return (
      <Typography variant="caption" color="text.secondary">
        {task.state === "PENDING_REVIEW"
          ? "Đang chờ người duyệt xử lý – bạn không có quyền duyệt công việc này."
          : "Bạn không có thao tác chuyển trạng thái nào với công việc này."}
      </Typography>
    );
  }

  return (
    <>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {allowed.map((target) => (
          <Button
            key={target}
            size={size}
            variant={VARIANT[target] ?? "outlined"}
            color={COLOR[target] ?? "primary"}
            startIcon={ICONS[target]}
            disabled={submitting !== null}
            onClick={() =>
              target === "RETURNED" ? setReturnOpen(true) : doTransition(target)
            }
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            {submitting === target ? "Đang xử lý..." : getTransitionLabel(task.state, target)}
          </Button>
        ))}
      </Stack>

      <Dialog open={returnOpen} onClose={() => !submitting && setReturnOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Trả lại công việc “{task.name}”</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Người thực hiện sẽ nhận thông báo kèm lý do để chỉnh sửa và trình duyệt lại.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            multiline
            minRows={3}
            required
            label="Lý do trả lại"
            placeholder="VD: Mạch ngừng đổ bê tông chưa đạt, cần xử lý lại trước khi nghiệm thu..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <CoreButton theme="cancel" onClick={() => setReturnOpen(false)} disabled={submitting !== null}>
            Hủy
          </CoreButton>
          <CoreButton
            theme="submit"
            loading={submitting === "RETURNED"}
            onClick={() => {
              if (!reason.trim()) {
                toastError("Vui lòng nhập lý do trả lại");
                return;
              }
              doTransition("RETURNED", reason.trim());
            }}
          >
            Xác nhận trả lại
          </CoreButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
