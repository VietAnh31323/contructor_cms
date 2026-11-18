import { CoreButton } from "@/components/atoms/CoreButton";
import { GanttTaskItem } from "@/service/constructor/Project/gantt/type";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import {
  Alert,
  Badge,
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { SCHEDULE_STATUS_META, TASK_STATE_META } from "./constants";
import TaskCommentsPanel from "./TaskCommentsPanel";
import TaskSiteReportPanel from "./TaskSiteReportPanel";
import TaskWorkflowActions from "./TaskWorkflowActions";

type Props = {
  open: boolean;
  task: GanttTaskItem | null;
  onClose: () => void;
  onChanged?: () => void | Promise<void>;
  onAddSubTask?: (task: GanttTaskItem) => void;
  initialTab?: number;
};

const fmt = (d?: string | null) => (d ? moment(d).format("DD/MM/YYYY") : "—");

function InfoCell({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight={600}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} component="div">
        {value}
      </Typography>
    </Box>
  );
}

/**
 * Chi tiết công việc: workflow duyệt (2.23), kế hoạch – thực tế (2.26),
 * báo cáo hiện trường (2.25) và bình luận / đính kèm (2.27).
 */
export default function TaskDetailDialog({
  open,
  task,
  onClose,
  onChanged,
  onAddSubTask,
  initialTab = 0,
}: Props) {
  const [tab, setTab] = useState(initialTab);

  useEffect(() => {
    if (open) setTab(initialTab);
  }, [open, task?.id, initialTab]);

  if (!task) {
    return <Dialog open={false} onClose={onClose} />;
  }

  const stMeta = TASK_STATE_META[task.state] ?? TASK_STATE_META.NOT_STARTED;
  const schedule = task.scheduleStatus ? SCHEDULE_STATUS_META[task.scheduleStatus] : null;
  const pct = Math.min(100, Math.max(0, Number(task.progressPercent ?? 0)));
  const assigneeText =
    task.assignees && task.assignees.length > 0
      ? task.assignees.map((a) => a.name).join(", ")
      : "Chưa phân công";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper">
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
          <Typography variant="h6" fontWeight={800} sx={{ mr: 1 }}>
            {task.name}
          </Typography>
          <Chip size="small" color={stMeta.chipColor} label={stMeta.label} sx={{ fontWeight: 700 }} />
          {schedule && (
            <Chip size="small" variant="outlined" color={schedule.color} label={schedule.label} sx={{ fontWeight: 700 }} />
          )}
        </Stack>
        <Typography variant="caption" color="text.secondary">
          {task.code} • Trọng số {Number(task.weight ?? 1)}
        </Typography>
      </DialogTitle>

      <Box sx={{ px: 3, borderBottom: "1px solid #e2e8f0" }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable">
          <Tab icon={<InfoOutlinedIcon fontSize="small" />} iconPosition="start" label="Thông tin & duyệt" sx={{ textTransform: "none", minHeight: 44 }} />
          <Tab
            icon={
              <Badge color="primary" badgeContent={task.siteReportCount || 0} max={99}>
                <PhotoCameraOutlinedIcon fontSize="small" />
              </Badge>
            }
            iconPosition="start"
            label="Báo cáo hiện trường"
            sx={{ textTransform: "none", minHeight: 44 }}
          />
          <Tab
            icon={
              <Badge color="primary" badgeContent={task.commentCount || 0} max={99}>
                <ChatBubbleOutlineIcon fontSize="small" />
              </Badge>
            }
            iconPosition="start"
            label="Bình luận"
            sx={{ textTransform: "none", minHeight: 44 }}
          />
        </Tabs>
      </Box>

      <DialogContent sx={{ minHeight: 360 }}>
        {tab === 0 && (
          <Stack spacing={2}>
            {task.state === "RETURNED" && task.returnReason && (
              <Alert severity="warning" icon={<WarningAmberRoundedIcon />}>
                <strong>Công việc bị trả lại:</strong> {task.returnReason}
              </Alert>
            )}
            {task.state === "PENDING_REVIEW" && (
              <Alert severity="info">
                Đã trình duyệt lúc {task.submittedAt ? moment(task.submittedAt).format("DD/MM/YYYY HH:mm") : "—"}.
                {task.canReview ? " Bạn là người duyệt – hãy kiểm tra báo cáo hiện trường trước khi duyệt." : ""}
              </Alert>
            )}

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                Chuyển trạng thái (workflow duyệt)
              </Typography>
              <TaskWorkflowActions task={task} onChanged={onChanged} />
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="subtitle2" fontWeight={700}>
                  Tiến độ (hệ thống tự tính)
                </Typography>
                <Typography variant="h6" fontWeight={800} color="primary.main">
                  {pct.toFixed(0)}%
                </Typography>
              </Stack>
              <LinearProgress variant="determinate" value={pct} sx={{ height: 8, borderRadius: 4 }} />
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <InfoCell label="Bắt đầu kế hoạch" value={fmt(task.startDate)} />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <InfoCell label="Kết thúc kế hoạch" value={fmt(task.endDate)} />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <InfoCell label="Bắt đầu thực tế" value={fmt(task.actualStartDate)} />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <InfoCell label="Hoàn thành thực tế" value={fmt(task.actualEndDate)} />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <InfoCell label="Thời lượng" value={`${task.durationDays} ngày`} />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <InfoCell
                    label="Chênh lệch"
                    value={
                      (task.delayDays ?? 0) > 0 ? (
                        <Typography variant="body2" fontWeight={700} color="error.main">
                          Trễ {task.delayDays} ngày
                        </Typography>
                      ) : task.state === "COMPLETED" ? (
                        "Đúng / sớm hạn"
                      ) : task.remainDays != null ? (
                        `Còn ${task.remainDays} ngày`
                      ) : (
                        "—"
                      )
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InfoCell label="Người thực hiện" value={assigneeText} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InfoCell label="Người duyệt" value={task.reviewer?.name || "Chủ nhiệm dự án"} />
                </Grid>
                {task.description && (
                  <Grid item xs={12}>
                    <InfoCell label="Mô tả" value={<span style={{ whiteSpace: "pre-wrap" }}>{task.description}</span>} />
                  </Grid>
                )}
              </Grid>
            </Paper>

            {task.subTasks && task.subTasks.length > 0 && (
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  Việc con ({task.subTasks.length})
                </Typography>
                <Stack spacing={0.75}>
                  {task.subTasks.map((s) => (
                    <Stack key={s.id} direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" noWrap sx={{ maxWidth: "60%" }}>
                        {s.code} — {s.name}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="caption" color="text.secondary">
                          {Number(s.progressPercent ?? 0).toFixed(0)}% • w{Number(s.weight ?? 1)}
                        </Typography>
                        <Chip size="small" color={TASK_STATE_META[s.state]?.chipColor} label={TASK_STATE_META[s.state]?.label} />
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              </Paper>
            )}
          </Stack>
        )}

        {tab === 1 && <TaskSiteReportPanel taskId={task.id} onChanged={() => onChanged?.()} />}
        {tab === 2 && <TaskCommentsPanel taskId={task.id} onChanged={() => onChanged?.()} />}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 1.5 }}>
        {onAddSubTask && !task.parentId && (
          <CoreButton theme="draft" onClick={() => onAddSubTask(task)}>
            + Thêm việc con
          </CoreButton>
        )}
        <CoreButton theme="cancel" onClick={onClose}>
          Đóng
        </CoreButton>
      </DialogActions>
    </Dialog>
  );
}
