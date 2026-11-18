import { CoreBreadcrumbs } from "@/components/atoms/CoreBreadcrumbs";
import CoreLoading from "@/components/molecules/CoreLoading";
import PageContainer from "@/components/organism/PageContainer";
import { ROUTES } from "@/routes";
import { useProjectGanttQuery } from "@/service/constructor/Project/gantt";
import { GanttTaskItem, TaskState } from "@/service/constructor/Project/gantt/type";
import { useProjectDetailQuery } from "@/service/constructor/Project/getDetail";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import ViewTimelineOutlinedIcon from "@mui/icons-material/ViewTimelineOutlined";
import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import ProjectGanttTab from "../../../constructionProject/constructionProjectSave/ProjectGanttTab";
import { SCHEDULE_STATUS_META, TASK_STATE_META } from "../../shared/constants";
import PhaseManagerPanel from "../../shared/PhaseManagerPanel";
import TaskDetailDialog from "../../shared/TaskDetailDialog";
import TaskWorkflowActions from "../../shared/TaskWorkflowActions";

type BoardFilter = "ACTION" | "ALL" | TaskState | "OVERDUE";

const fmt = (d?: string | null) => (d ? moment(d).format("DD/MM/YYYY") : "—");

/**
 * 2.24: Không gian quản lý tiến độ của 1 dự án:
 *  - Giai đoạn (2.21) – Biểu đồ Gantt kế hoạch / thực tế (2.26) – Bảng công việc & duyệt (2.23)
 */
export default function ProgressManageDetail() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const projectId = router.query?.id ? Number(router.query.id) : undefined;
  const [tab, setTab] = useState(router.query?.tab === "gantt" ? 1 : router.query?.tab === "tasks" ? 2 : 0);
  const [boardFilter, setBoardFilter] = useState<BoardFilter>("ACTION");
  const [selectedTask, setSelectedTask] = useState<GanttTaskItem | null>(null);
  const [detailTab, setDetailTab] = useState(0);

  const { data: detailResp } = useProjectDetailQuery(projectId, { enabled: Boolean(projectId) });
  const { data: ganttResp, isLoading } = useProjectGanttQuery(projectId, { enabled: Boolean(projectId) });
  const project = detailResp?.data ?? null;
  const gantt = ganttResp?.data ?? null;

  // Danh sách công việc lá (kèm tên giai đoạn) cho bảng duyệt
  const leafTasks = useMemo(() => {
    const rows: (GanttTaskItem & { phaseName: string })[] = [];
    (gantt?.phases ?? []).forEach((ph) =>
      ph.tasks.forEach((t) => {
        if (t.subTasks && t.subTasks.length > 0) {
          t.subTasks.forEach((s) => rows.push({ ...s, phaseName: ph.progressName }));
        } else {
          rows.push({ ...t, phaseName: ph.progressName });
        }
      })
    );
    return rows;
  }, [gantt]);

  const counts = useMemo(() => {
    const c = { ACTION: 0, ALL: leafTasks.length, OVERDUE: 0 } as Record<string, number>;
    leafTasks.forEach((t) => {
      c[t.state] = (c[t.state] || 0) + 1;
      if (t.overdue) c.OVERDUE++;
      if ((t.allowedNextStates ?? []).length > 0 && t.state !== "COMPLETED") c.ACTION++;
    });
    return c;
  }, [leafTasks]);

  const boardRows = useMemo(() => {
    return leafTasks
      .filter((t) => {
        if (boardFilter === "ALL") return true;
        if (boardFilter === "OVERDUE") return t.overdue;
        if (boardFilter === "ACTION") return (t.allowedNextStates ?? []).length > 0 && t.state !== "COMPLETED";
        return t.state === boardFilter;
      })
      .sort((a, b) => {
        // Ưu tiên: chờ duyệt → trễ hạn → hạn gần nhất
        const pa = a.state === "PENDING_REVIEW" ? 0 : a.overdue ? 1 : 2;
        const pb = b.state === "PENDING_REVIEW" ? 0 : b.overdue ? 1 : 2;
        if (pa !== pb) return pa - pb;
        return (a.endDate || "9999").localeCompare(b.endDate || "9999");
      });
  }, [leafTasks, boardFilter]);

  const refresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["project-gantt", projectId] }),
      queryClient.invalidateQueries({ queryKey: ["project-phases", projectId] }),
      queryClient.invalidateQueries({ queryKey: ["project-detail", projectId] }),
      queryClient.invalidateQueries({ queryKey: ["project-progress-summary"] }),
    ]);
  };

  // Đồng bộ task trong dialog sau khi dữ liệu thay đổi
  const freshSelected = selectedTask
    ? leafTasks.find((t) => t.id === selectedTask.id) ?? selectedTask
    : null;

  if (!projectId || (isLoading && !gantt)) return <CoreLoading />;

  const pct = Math.min(100, Math.max(0, Number(gantt?.progressPercent ?? 0)));
  const sch = gantt?.scheduleStatus ? SCHEDULE_STATUS_META[gantt.scheduleStatus] : null;

  const filters: { key: BoardFilter; label: string }[] = [
    { key: "ACTION", label: "Cần tôi xử lý" },
    { key: "PENDING_REVIEW", label: "Chờ duyệt" },
    { key: "OVERDUE", label: "Trễ hạn" },
    { key: "RETURNED", label: "Bị trả lại" },
    { key: "IN_PROGRESS", label: "Đang làm" },
    { key: "NOT_STARTED", label: "Chưa làm" },
    { key: "COMPLETED", label: "Hoàn thành" },
    { key: "ALL", label: "Tất cả" },
  ];

  return (
    <PageContainer
      title={
        <CoreBreadcrumbs
          breadcrumbs={[
            { title: "Quản lý tiến độ dự án", pathname: ROUTES.PROGRESS_MANAGE },
            { title: gantt ? `${gantt.projectCode} – ${gantt.projectName}` : "Chi tiết tiến độ" },
          ]}
        />
      }
    >
      {/* Tổng quan */}
      <Paper variant="outlined" sx={{ p: 2, my: 2, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <Typography variant="h6" fontWeight={800}>
              {gantt?.projectName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {gantt?.projectCode} • CĐT: {gantt?.customerName || "—"} • CNDA: {gantt?.managerName || "—"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Bàn giao HĐ: {fmt(gantt?.deliveryDate)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" fontWeight={700} color="text.secondary">
                TIẾN ĐỘ DỰ ÁN (TỰ TÍNH)
              </Typography>
              <Typography variant="body2" fontWeight={800} color="primary.main">
                {pct.toFixed(1)}%
              </Typography>
            </Stack>
            <LinearProgress variant="determinate" value={pct} sx={{ height: 8, borderRadius: 4, mt: 0.5 }} />
            {sch && (
              <Chip
                size="small"
                color={sch.color}
                sx={{ mt: 1, fontWeight: 700 }}
                label={`${sch.label}${(gantt?.delayDays ?? 0) > 0 ? ` (${gantt?.delayDays} ngày)` : ""}`}
              />
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap justifyContent={{ md: "flex-end" }}>
              <Chip size="small" color="success" label={`Xong ${gantt?.completedTasks ?? 0}/${gantt?.totalTasks ?? 0}`} />
              <Chip size="small" color="secondary" label={`Chờ duyệt ${gantt?.pendingReviewTasks ?? 0}`} />
              <Chip size="small" color="error" variant={gantt?.overdueTasks ? "filled" : "outlined"} label={`Trễ ${gantt?.overdueTasks ?? 0}`} />
              <Button
                size="small"
                endIcon={<OpenInNewIcon fontSize="small" />}
                onClick={() => router.push({ pathname: `${ROUTES.PROJECT}/${projectId}`, query: { actionType: "VIEW" } })}
                sx={{ textTransform: "none" }}
              >
                Hồ sơ dự án
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ borderBottom: "1px solid #e2e8f0", mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable">
          <Tab icon={<AccountTreeOutlinedIcon fontSize="small" />} iconPosition="start" label="Giai đoạn" sx={{ textTransform: "none", minHeight: 46 }} />
          <Tab icon={<ViewTimelineOutlinedIcon fontSize="small" />} iconPosition="start" label="Biểu đồ Gantt" sx={{ textTransform: "none", minHeight: 46 }} />
          <Tab
            icon={<FactCheckOutlinedIcon fontSize="small" />}
            iconPosition="start"
            label={`Công việc & Duyệt${counts.ACTION ? ` (${counts.ACTION})` : ""}`}
            sx={{ textTransform: "none", minHeight: 46 }}
          />
        </Tabs>
      </Box>

      {tab === 0 && <PhaseManagerPanel projectId={projectId} />}

      {tab === 1 && <ProjectGanttTab projectId={projectId} projectDetail={project} />}

      {tab === 2 && (
        <Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
            {filters.map((f) => (
              <Chip
                key={f.key}
                label={`${f.label} (${counts[f.key] ?? 0})`}
                color={boardFilter === f.key ? (f.key === "OVERDUE" ? "error" : "primary") : "default"}
                variant={boardFilter === f.key ? "filled" : "outlined"}
                onClick={() => setBoardFilter(f.key)}
                sx={{ fontWeight: 600 }}
              />
            ))}
          </Stack>

          {boardRows.length === 0 ? (
            <Alert severity="success">Không có công việc nào trong bộ lọc này.</Alert>
          ) : (
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f8fafc" }}>
                    <TableCell sx={{ fontWeight: 700 }}>Công việc</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Giai đoạn</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Người làm / duyệt</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Kế hoạch</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="center">
                      Hiện trường / Bình luận
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, minWidth: 220 }}>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {boardRows.map((t) => {
                    const stMeta = TASK_STATE_META[t.state] ?? TASK_STATE_META.NOT_STARTED;
                    return (
                      <TableRow key={t.id} hover>
                        <TableCell
                          sx={{ cursor: "pointer" }}
                          onClick={() => {
                            setDetailTab(0);
                            setSelectedTask(t);
                          }}
                        >
                          <Typography variant="body2" fontWeight={700} color="primary.main">
                            {t.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {t.code} • {Number(t.progressPercent ?? 0).toFixed(0)}%
                          </Typography>
                          {t.state === "RETURNED" && t.returnReason && (
                            <Typography variant="caption" color="warning.dark" display="block" noWrap sx={{ maxWidth: 260 }}>
                              Lý do: {t.returnReason}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{t.phaseName}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 180 }}>
                            {t.assignees?.length ? t.assignees.map((a) => a.name).join(", ") : "Chưa giao"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Duyệt: {t.reviewer?.name || "CNDA"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {fmt(t.startDate)} → {fmt(t.endDate)}
                          </Typography>
                          {t.overdue ? (
                            <Typography variant="caption" color="error.main" fontWeight={700}>
                              Trễ {t.delayDays} ngày
                            </Typography>
                          ) : t.scheduleStatus === "AT_RISK" ? (
                            <Typography variant="caption" color="warning.main" fontWeight={700}>
                              Nguy cơ trễ
                            </Typography>
                          ) : null}
                        </TableCell>
                        <TableCell>
                          <Chip size="small" color={stMeta.chipColor} label={stMeta.label} sx={{ fontWeight: 700 }} />
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={0.5} justifyContent="center">
                            <Chip
                              size="small"
                              variant="outlined"
                              icon={<PhotoCameraOutlinedIcon sx={{ fontSize: 14 }} />}
                              label={t.siteReportCount ?? 0}
                              onClick={() => {
                                setDetailTab(1);
                                setSelectedTask(t);
                              }}
                            />
                            <Chip
                              size="small"
                              variant="outlined"
                              icon={<ChatBubbleOutlineIcon sx={{ fontSize: 14 }} />}
                              label={t.commentCount ?? 0}
                              onClick={() => {
                                setDetailTab(2);
                                setSelectedTask(t);
                              }}
                            />
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <TaskWorkflowActions task={t} onChanged={refresh} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      <TaskDetailDialog
        open={Boolean(freshSelected)}
        task={freshSelected}
        initialTab={detailTab}
        onClose={() => setSelectedTask(null)}
        onChanged={refresh}
      />
    </PageContainer>
  );
}
