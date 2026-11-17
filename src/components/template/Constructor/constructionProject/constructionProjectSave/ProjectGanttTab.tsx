import { CoreButton } from "@/components/atoms/CoreButton";
import { usePermission } from "@/components/hooks/permission/usePermission";
import CoreLoading from "@/components/molecules/CoreLoading";
import { PERMISSIONS } from "@/helper/permissions";
import { useEmployeeListQuery } from "@/service/constructor/Employee/getList";
import { useProgressListQuery } from "@/service/constructor/Progress/getList";
import { ProjectDetail } from "@/service/constructor/Project/getDetail/type";
import {
  deleteProjectGanttPhase,
  postProjectGanttPhase,
  postProjectGanttTask,
  putUpdateTaskState,
  useProjectGanttQuery,
} from "@/service/constructor/Project/gantt";
import {
  GanttMilestoneItem,
  GanttPhaseItem,
  GanttTaskItem,
  PriorityLevel,
  TaskState,
} from "@/service/constructor/Project/gantt/type";
import { toastError, toastSuccess } from "@/toast";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import AddIcon from "@mui/icons-material/Add";
import AutoFixHighOutlinedIcon from "@mui/icons-material/AutoFixHighOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import ViewTimelineOutlinedIcon from "@mui/icons-material/ViewTimelineOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import moment, { Moment } from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatVnd } from "../../customer/constants";
import ProcessTemplateDialog from "./ProcessTemplateDialog";

type ZoomScale = "DAY" | "WEEK" | "MONTH";
type DisplayMode = "GANTT" | "MILESTONE_LIST";
type StatusFilter = "ALL" | "IN_PROGRESS" | "NOT_STARTED" | "COMPLETED" | "OVERDUE";

const WBS_COL_WIDTH = 340;
const ROW_HEIGHT = 44;

const SCALE_DAY_PX: Record<ZoomScale, number> = {
  DAY: 34,
  WEEK: 16,
  MONTH: 6,
};

const TASK_STATE_META: Record<
  TaskState,
  {
    label: string;
    barBg: string;
    barFill: string;
    chipColor: "default" | "info" | "success";
  }
> = {
  NOT_STARTED: {
    label: "Chưa bắt đầu",
    barBg: "#cbd5e1",
    barFill: "#64748b",
    chipColor: "default",
  },
  IN_PROGRESS: {
    label: "Đang thực hiện",
    barBg: "#93c5fd",
    barFill: "#2563eb",
    chipColor: "info",
  },
  COMPLETED: {
    label: "Hoàn thành",
    barBg: "#86efac",
    barFill: "#16a34a",
    chipColor: "success",
  },
};

const PRIORITY_META: Record<
  PriorityLevel,
  { label: string; color: "default" | "info" | "error" }
> = {
  LOW: { label: "Thấp", color: "default" },
  MEDIUM: { label: "Trung bình", color: "info" },
  HIGH: { label: "Ưu tiên cao", color: "error" },
};

const MILESTONE_TYPE_META: Record<
  GanttMilestoneItem["type"],
  { label: string; color: string; bg: string }
> = {
  CONTRACT: { label: "Hợp đồng & Bàn giao", color: "#2563eb", bg: "#eff6ff" },
  PAYMENT: { label: "Đợt thanh toán", color: "#d97706", bg: "#fffbeb" },
  LIFECYCLE: { label: "Mốc vòng đời", color: "#7c3aed", bg: "#f5f3ff" },
};

type Props = {
  projectId: number;
  projectDetail?: ProjectDetail | null;
};

export default function ProjectGanttTab({ projectId, projectDetail }: Props) {
  const queryClient = useQueryClient();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const { hasPermission } = usePermission();

  const canManageSchedule = hasPermission([
    PERMISSIONS.PROJECT_UPDATE,
    PERMISSIONS.PROGRESS_UPDATE,
    PERMISSIONS.TASK_CREATE,
    PERMISSIONS.TASK_UPDATE,
  ]);

  const { data: ganttResp, isLoading } = useProjectGanttQuery(projectId, {
    enabled: Boolean(projectId),
  });
  const { data: progressCatalogResp } = useProgressListQuery();
  const { data: staffListResp } = useEmployeeListQuery({ page: 0, size: 200 });

  const gantt = ganttResp?.data ?? null;
  const progressCatalog = progressCatalogResp?.data?.content ?? [];
  const staffOptions = staffListResp?.data?.content ?? [];

  const [displayMode, setDisplayMode] = useState<DisplayMode>("GANTT");
  const [zoomScale, setZoomScale] = useState<ZoomScale>("DAY");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const [showContractMilestones, setShowContractMilestones] = useState(true);
  const [showPaymentMilestones, setShowPaymentMilestones] = useState(true);
  const [showPhasesTasks, setShowPhasesTasks] = useState(true);

  const [milestonesCollapsed, setMilestonesCollapsed] = useState(false);
  const [collapsedPhases, setCollapsedPhases] = useState<Record<number, boolean>>(
    {}
  );

  // Add Phase Dialog state
  const [openAddPhase, setOpenAddPhase] = useState(false);
  const [phaseMode, setPhaseMode] = useState<"NEW" | "CATALOG">("NEW");
  const [selectedCatalogProgressId, setSelectedCatalogProgressId] = useState<
    number | ""
  >("");
  const [newPhaseName, setNewPhaseName] = useState("");
  const [newPhaseDesc, setNewPhaseDesc] = useState("");
  const [savingPhase, setSavingPhase] = useState(false);

  // Add Task Dialog state
  const [openAddTask, setOpenAddTask] = useState(false);
  const [taskPhaseId, setTaskPhaseId] = useState<number | "">("");
  const [parentTaskTarget, setParentTaskTarget] =
    useState<GanttTaskItem | null>(null);
  const [taskName, setTaskName] = useState("");
  const [taskStartDate, setTaskStartDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [taskEndDate, setTaskEndDate] = useState(
    moment().add(7, "days").format("YYYY-MM-DD")
  );
  const [taskPriority, setTaskPriority] = useState<PriorityLevel>("MEDIUM");
  const [taskInitialState, setTaskInitialState] =
    useState<TaskState>("NOT_STARTED");
  const [taskSelectedStaffs, setTaskSelectedStaffs] = useState<any[]>([]);
  const [taskDesc, setTaskDesc] = useState("");
  const [savingTask, setSavingTask] = useState(false);

  // Task Detail & Quick Update Dialog
  const [selectedTask, setSelectedTask] = useState<GanttTaskItem | null>(null);
  const [updatingTaskState, setUpdatingTaskState] = useState(false);
  const [openTemplateDialog, setOpenTemplateDialog] = useState(false);

  const dayPx = SCALE_DAY_PX[zoomScale];

  // Compute timeline bounds & ticks
  const timelineMeta = useMemo(() => {
    const startM = moment(
      gantt?.timelineStartDate || moment().subtract(5, "days")
    ).startOf("day");
    const rawEndM = moment(
      gantt?.timelineEndDate || moment().add(25, "days")
    ).startOf("day");
    const minSpanDays = zoomScale === "MONTH" ? 120 : zoomScale === "WEEK" ? 45 : 24;
    const endM =
      rawEndM.diff(startM, "days") < minSpanDays
        ? startM.clone().add(minSpanDays, "days")
        : rawEndM;

    const totalDays = Math.max(1, endM.diff(startM, "days") + 1);
    const totalWidth = totalDays * dayPx;

    // Top header: Months
    const months: { key: string; label: string; left: number; width: number }[] =
      [];
    let cursor = startM.clone();
    while (cursor.isSameOrBefore(endM, "day")) {
      const monthEnd = moment.min(cursor.clone().endOf("month").startOf("day"), endM);
      const span = monthEnd.diff(cursor, "days") + 1;
      const offset = cursor.diff(startM, "days");
      months.push({
        key: cursor.format("YYYY-MM"),
        label: `Tháng ${cursor.format("MM/YYYY")}`,
        left: offset * dayPx,
        width: span * dayPx,
      });
      cursor = monthEnd.clone().add(1, "day");
    }

    // Second header: Ticks based on zoomScale
    const ticks: {
      key: string;
      label: string;
      subLabel?: string;
      left: number;
      width: number;
      isWeekend?: boolean;
      isToday?: boolean;
    }[] = [];

    const todayStr = moment().format("YYYY-MM-DD");

    if (zoomScale === "DAY") {
      for (let i = 0; i < totalDays; i++) {
        const d = startM.clone().add(i, "days");
        const dow = d.day();
        ticks.push({
          key: d.format("YYYY-MM-DD"),
          label: d.format("DD"),
          subLabel: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][dow],
          left: i * dayPx,
          width: dayPx,
          isWeekend: dow === 0 || dow === 6,
          isToday: d.format("YYYY-MM-DD") === todayStr,
        });
      }
    } else if (zoomScale === "WEEK") {
      let wCursor = startM.clone();
      while (wCursor.isSameOrBefore(endM, "day")) {
        const wEnd = moment.min(wCursor.clone().add(6, "days"), endM);
        const span = wEnd.diff(wCursor, "days") + 1;
        const offset = wCursor.diff(startM, "days");
        ticks.push({
          key: wCursor.format("YYYY-MM-DD"),
          label: `${wCursor.format("DD/MM")} - ${wEnd.format("DD/MM")}`,
          left: offset * dayPx,
          width: span * dayPx,
        });
        wCursor = wEnd.clone().add(1, "day");
      }
    } else {
      months.forEach((m) => {
        ticks.push({
          key: `m-${m.key}`,
          label: m.label.replace("Tháng ", "T"),
          left: m.left,
          width: m.width,
        });
      });
    }

    const todayM = moment().startOf("day");
    const todayOffsetDays = todayM.diff(startM, "days");
    const todayLeft =
      todayOffsetDays >= 0 && todayOffsetDays <= totalDays
        ? todayOffsetDays * dayPx + dayPx / 2
        : null;

    return {
      startM,
      endM,
      totalDays,
      totalWidth,
      months,
      ticks,
      todayLeft,
    };
  }, [gantt?.timelineStartDate, gantt?.timelineEndDate, zoomScale, dayPx]);

  const scrollToToday = () => {
    if (!scrollContainerRef.current || timelineMeta.todayLeft === null) return;
    const targetScroll = Math.max(0, timelineMeta.todayLeft - 240);
    scrollContainerRef.current.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (displayMode === "GANTT" && timelineMeta.todayLeft !== null) {
      const timer = setTimeout(() => {
        scrollToToday();
      }, 120);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gantt?.projectId, displayMode]);

  const getBarGeometry = (
    startStr?: string | null,
    endStr?: string | null,
    startM?: Moment
  ) => {
    if (!startStr && !endStr) return null;
    const base = startM || timelineMeta.startM;
    const s = moment(startStr || endStr).startOf("day");
    const e = moment(endStr || startStr).startOf("day");
    const leftDays = s.diff(base, "days");
    const spanDays = Math.max(1, e.diff(s, "days") + 1);
    return {
      left: leftDays * dayPx,
      width: Math.max(dayPx * 0.75, spanDays * dayPx),
      startFormatted: s.format("DD/MM/YYYY"),
      endFormatted: e.format("DD/MM/YYYY"),
      spanDays,
    };
  };

  const getPointLeft = (dateStr?: string | null) => {
    if (!dateStr) return null;
    const d = moment(dateStr).startOf("day");
    const offset = d.diff(timelineMeta.startM, "days");
    return offset * dayPx + dayPx / 2;
  };

  const filteredMilestones = useMemo(() => {
    if (!gantt?.milestones) return [];
    return gantt.milestones.filter((m) => {
      if (m.type === "PAYMENT") return showPaymentMilestones;
      return showContractMilestones;
    });
  }, [gantt?.milestones, showContractMilestones, showPaymentMilestones]);

  const matchesTaskFilter = (task: GanttTaskItem): boolean => {
    if (statusFilter === "ALL") return true;
    if (statusFilter === "OVERDUE") return task.overdue;
    return task.state === statusFilter;
  };

  const filteredPhases: GanttPhaseItem[] = useMemo(() => {
    if (!showPhasesTasks || !gantt?.phases) return [];
    if (statusFilter === "ALL") return gantt.phases;

    return gantt.phases
      .map((phase) => {
        const nextTasks = phase.tasks
          .map((t) => {
            const matchedSubs = (t.subTasks || []).filter(matchesTaskFilter);
            if (matchesTaskFilter(t) || matchedSubs.length > 0) {
              return {
                ...t,
                subTasks: matchedSubs,
              };
            }
            return null;
          })
          .filter(Boolean) as GanttTaskItem[];
        return {
          ...phase,
          tasks: nextTasks,
        };
      })
      .filter((p) => p.tasks.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gantt?.phases, showPhasesTasks, statusFilter]);

  const refreshAllProjectData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["project-gantt", projectId] }),
      queryClient.invalidateQueries({
        queryKey: ["project-detail", projectId],
      }),
      queryClient.invalidateQueries({ queryKey: ["project-list"] }),
      queryClient.invalidateQueries({ queryKey: ["progress-list"] }),
    ]);
  };

  const handleOpenAddPhase = () => {
    setPhaseMode("NEW");
    setSelectedCatalogProgressId("");
    setNewPhaseName("");
    setNewPhaseDesc("");
    setOpenAddPhase(true);
  };

  const handleConfirmAddPhase = async () => {
    if (phaseMode === "CATALOG" && !selectedCatalogProgressId) {
      toastError("Vui lòng chọn giai đoạn từ danh mục");
      return;
    }
    if (phaseMode === "NEW" && !newPhaseName.trim()) {
      toastError("Vui lòng nhập tên giai đoạn thi công");
      return;
    }

    try {
      setSavingPhase(true);
      await postProjectGanttPhase(projectId, {
        progressId:
          phaseMode === "CATALOG" ? Number(selectedCatalogProgressId) : null,
        newProgressName: phaseMode === "NEW" ? newPhaseName.trim() : undefined,
        description: newPhaseDesc.trim() || undefined,
      });
      toastSuccess("Đã thêm giai đoạn vào tiến độ dự án");
      setOpenAddPhase(false);
      await refreshAllProjectData();
    } catch (err) {
      toastError(err);
    } finally {
      setSavingPhase(false);
    }
  };

  const handleDeletePhase = async (phase: GanttPhaseItem) => {
    if (phase.tasks && phase.tasks.length > 0) {
      toastError(
        "Chỉ có thể gỡ giai đoạn khi chưa có công việc nào bên trong"
      );
      return;
    }
    try {
      await deleteProjectGanttPhase(projectId, phase.projectProgressId);
      toastSuccess(`Đã gỡ giai đoạn "${phase.progressName}"`);
      await refreshAllProjectData();
    } catch (err) {
      toastError(err);
    }
  };

  const handleOpenAddTask = (
    defaultPhaseId?: number,
    parentTask?: GanttTaskItem | null
  ) => {
    const firstPhaseId = gantt?.phases?.[0]?.projectProgressId ?? "";
    setParentTaskTarget(parentTask ?? null);
    setTaskPhaseId(defaultPhaseId ?? parentTask?.projectProgressId ?? firstPhaseId);
    setTaskName("");
    setTaskStartDate(
      parentTask?.startDate || moment().format("YYYY-MM-DD")
    );
    setTaskEndDate(
      parentTask?.endDate || moment().add(7, "days").format("YYYY-MM-DD")
    );
    setTaskPriority("MEDIUM");
    setTaskInitialState("NOT_STARTED");
    setTaskSelectedStaffs([]);
    setTaskDesc("");
    setOpenAddTask(true);
  };

  const handleConfirmAddTask = async () => {
    if (!parentTaskTarget && !taskPhaseId) {
      toastError(
        "Vui lòng chọn giai đoạn (hoặc tạo giai đoạn trước khi thêm công việc)"
      );
      return;
    }
    if (!taskName.trim()) {
      toastError("Vui lòng nhập tên công việc / hạng mục");
      return;
    }
    if (!taskStartDate || !taskEndDate) {
      toastError("Vui lòng chọn ngày bắt đầu và ngày kết thúc");
      return;
    }
    if (moment(taskEndDate).isBefore(moment(taskStartDate), "day")) {
      toastError("Ngày kết thúc không được nhỏ hơn ngày bắt đầu");
      return;
    }

    try {
      setSavingTask(true);
      await postProjectGanttTask(projectId, {
        projectProgressId: parentTaskTarget ? null : Number(taskPhaseId),
        parentTaskId: parentTaskTarget ? parentTaskTarget.id : null,
        name: taskName.trim(),
        startDate: taskStartDate,
        endDate: taskEndDate,
        priorityLevel: taskPriority,
        state: taskInitialState,
        staffIds: taskSelectedStaffs.map((s) => s.id).filter(Boolean),
        description: taskDesc.trim() || undefined,
      });
      toastSuccess(
        parentTaskTarget
          ? "Đã thêm công việc con lên biểu đồ Gantt"
          : "Đã thêm công việc mới lên biểu đồ Gantt"
      );
      setOpenAddTask(false);
      await refreshAllProjectData();
    } catch (err) {
      toastError(err);
    } finally {
      setSavingTask(false);
    }
  };

  const handleQuickChangeTaskState = async (
    taskId: number,
    newState: TaskState
  ) => {
    try {
      setUpdatingTaskState(true);
      await putUpdateTaskState({ id: taskId, state: newState });
      toastSuccess(
        `Đã cập nhật trạng thái công việc: "${TASK_STATE_META[newState].label}"`
      );
      setSelectedTask((prev) =>
        prev && prev.id === taskId
          ? {
              ...prev,
              state: newState,
              progressPercent:
                newState === "COMPLETED"
                  ? 100
                  : newState === "IN_PROGRESS"
                  ? Math.max(50, Number(prev.progressPercent || 0))
                  : 0,
            }
          : prev
      );
      await refreshAllProjectData();
    } catch (err) {
      toastError(err);
    } finally {
      setUpdatingTaskState(false);
    }
  };

  if (isLoading) {
    return <CoreLoading />;
  }

  if (!gantt) {
    return (
      <Alert severity="info">
        Không tải được dữ liệu biểu đồ Gantt cho dự án này.
      </Alert>
    );
  }

  const overallPct = Math.min(
    100,
    Math.max(0, Number(gantt.progressPercent ?? 0))
  );
  const masterSpanGeo = getBarGeometry(
    gantt.signDate || gantt.timelineStartDate,
    gantt.actualHandoverDate || gantt.deliveryDate || gantt.timelineEndDate
  );

  return (
    <Box className="py-4">
      {/* ================= 1. KPI TỔNG QUAN TIẾN ĐỘ DỰ ÁN ================= */}
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            variant="outlined"
            sx={{ p: 2, borderRadius: 2, height: "100%", bgcolor: "#f8fafc" }}
          >
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              TIẾN ĐỘ TỔNG THỂ DỰ ÁN
            </Typography>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="baseline"
              sx={{ mt: 0.5 }}
            >
              <Typography variant="h5" fontWeight={800} color="primary.main">
                {overallPct.toFixed(0)}%
              </Typography>
              <Chip
                size="small"
                color="primary"
                variant="outlined"
                label={gantt.stateLabel}
              />
            </Stack>
            <LinearProgress
              variant="determinate"
              value={overallPct}
              sx={{ height: 7, borderRadius: 4, mt: 1 }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            variant="outlined"
            sx={{ p: 2, borderRadius: 2, height: "100%" }}
          >
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              CẤU TRÚC PHÂN RÃ (WBS)
            </Typography>
            <Typography variant="h5" fontWeight={800} sx={{ mt: 0.5 }}>
              {gantt.totalPhases} giai đoạn • {gantt.totalTasks} việc
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Cột mốc HĐ & Thanh toán: {gantt.milestones?.length ?? 0} mốc
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            variant="outlined"
            sx={{ p: 2, borderRadius: 2, height: "100%" }}
          >
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              TRẠNG THÁI CÔNG VIỆC
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
              <Chip
                size="small"
                color="success"
                label={`Xong: ${gantt.completedTasks}`}
              />
              <Chip
                size="small"
                color="info"
                label={`Đang làm: ${gantt.inProgressTasks}`}
              />
              <Chip
                size="small"
                variant="outlined"
                label={`Chờ: ${gantt.notStartedTasks}`}
              />
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 2,
              height: "100%",
              bgcolor: gantt.overdueTasks > 0 ? "#fef2f2" : "#f0fdf4",
              borderColor: gantt.overdueTasks > 0 ? "#fecaca" : "#bbf7d0",
            }}
          >
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              KIỂM SOÁT TIẾN ĐỘ / HẠN CHÓT
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
              {gantt.overdueTasks > 0 ? (
                <WarningAmberRoundedIcon color="error" />
              ) : (
                <CheckCircleOutlineIcon color="success" />
              )}
              <Typography
                variant="h6"
                fontWeight={800}
                color={gantt.overdueTasks > 0 ? "error.main" : "success.main"}
              >
                {gantt.overdueTasks > 0
                  ? `${gantt.overdueTasks} việc trễ hạn`
                  : "Đúng tiến độ"}
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {gantt.deliveryDate
                ? `Mốc bàn giao HĐ: ${moment(gantt.deliveryDate).format(
                    "DD/MM/YYYY"
                  )}`
                : "Chưa đặt ngày bàn giao dự kiến"}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* ================= 2. THANH CÔNG CỤ ĐIỀU KHIỂN BIỂU ĐỒ GANTT ================= */}
      <Paper variant="outlined" sx={{ p: 2, mb: 2.5, borderRadius: 2 }}>
        <Stack
          direction={{ xs: "column", lg: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", lg: "center" }}
          spacing={2}
        >
          <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
            <ToggleButtonGroup
              size="small"
              exclusive
              value={displayMode}
              onChange={(_, val: DisplayMode | null) => {
                if (val) setDisplayMode(val);
              }}
            >
              <ToggleButton value="GANTT">
                <ViewTimelineOutlinedIcon fontSize="small" sx={{ mr: 0.75 }} />
                Biểu đồ Gantt
              </ToggleButton>
              <ToggleButton value="MILESTONE_LIST">
                <TimelineOutlinedIcon fontSize="small" sx={{ mr: 0.75 }} />
                Sơ đồ Lộ trình & Cột mốc
              </ToggleButton>
            </ToggleButtonGroup>

            {displayMode === "GANTT" && (
              <ToggleButtonGroup
                size="small"
                exclusive
                value={zoomScale}
                onChange={(_, val: ZoomScale | null) => {
                  if (val) setZoomScale(val);
                }}
              >
                <ToggleButton value="DAY">Ngày</ToggleButton>
                <ToggleButton value="WEEK">Tuần</ToggleButton>
                <ToggleButton value="MONTH">Tháng</ToggleButton>
              </ToggleButtonGroup>
            )}

            <FormControl size="small" sx={{ minWidth: 165 }}>
              <InputLabel>Lọc công việc</InputLabel>
              <Select
                label="Lọc công việc"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as StatusFilter)
                }
              >
                <MenuItem value="ALL">Tất cả công việc</MenuItem>
                <MenuItem value="IN_PROGRESS">Đang thực hiện</MenuItem>
                <MenuItem value="NOT_STARTED">Chưa bắt đầu</MenuItem>
                <MenuItem value="COMPLETED">Đã hoàn thành</MenuItem>
                <MenuItem value="OVERDUE">Đang trễ hạn</MenuItem>
              </Select>
            </FormControl>

            {displayMode === "GANTT" && timelineMeta.todayLeft !== null && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<CalendarTodayOutlinedIcon fontSize="small" />}
                onClick={scrollToToday}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Hôm nay
              </Button>
            )}
          </Stack>

          {canManageSchedule && (
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                startIcon={<AutoFixHighOutlinedIcon fontSize="small" />}
                onClick={() => setOpenTemplateDialog(true)}
                sx={{ textTransform: "none", fontWeight: 700 }}
              >
                Áp dụng Template quy trình
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<AccountTreeOutlinedIcon fontSize="small" />}
                onClick={handleOpenAddPhase}
                sx={{ textTransform: "none", fontWeight: 700 }}
              >
                + Thêm giai đoạn
              </Button>
              <Button
                size="small"
                variant="contained"
                startIcon={<AddIcon fontSize="small" />}
                onClick={() => handleOpenAddTask()}
                disabled={!gantt.phases || gantt.phases.length === 0}
                sx={{ textTransform: "none", fontWeight: 700 }}
              >
                + Thêm công việc
              </Button>
            </Stack>
          )}
        </Stack>

        {/* Bộ bật/tắt lớp hiển thị + Chú giải màu sắc */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={1.5}
          sx={{ mt: 2, pt: 1.5, borderTop: "1px dashed #e2e8f0" }}
        >
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              Lớp hiển thị:
            </Typography>
            <Chip
              size="small"
              clickable
              color={showContractMilestones ? "primary" : "default"}
              variant={showContractMilestones ? "filled" : "outlined"}
              label="Mốc HĐ & Vòng đời"
              onClick={() => setShowContractMilestones((v) => !v)}
            />
            <Chip
              size="small"
              clickable
              color={showPaymentMilestones ? "warning" : "default"}
              variant={showPaymentMilestones ? "filled" : "outlined"}
              label="Đợt thanh toán"
              onClick={() => setShowPaymentMilestones((v) => !v)}
            />
            <Chip
              size="small"
              clickable
              color={showPhasesTasks ? "info" : "default"}
              variant={showPhasesTasks ? "filled" : "outlined"}
              label="Giai đoạn & Công việc"
              onClick={() => setShowPhasesTasks((v) => !v)}
            />
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: 0.5,
                  bgcolor: "#16a34a",
                }}
              />
              <Typography variant="caption">Hoàn thành</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: 0.5,
                  bgcolor: "#2563eb",
                }}
              />
              <Typography variant="caption">Đang thực hiện</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: 0.5,
                  bgcolor: "#64748b",
                }}
              />
              <Typography variant="caption">Chưa bắt đầu</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: 0.5,
                  bgcolor: "#dc2626",
                }}
              />
              <Typography variant="caption">Quá hạn</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  bgcolor: "#d97706",
                  transform: "rotate(45deg)",
                }}
              />
              <Typography variant="caption">Cột mốc (Milestone)</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Paper>

      {/* Gợi ý nhanh nếu dự án chưa tạo giai đoạn thi công */}
      {(!gantt.phases || gantt.phases.length === 0) && (
        <Alert
          severity="info"
          sx={{ mb: 2.5 }}
          action={
            canManageSchedule ? (
              <CoreButton theme="submit" onClick={handleOpenAddPhase}>
                Khởi tạo giai đoạn đầu tiên
              </CoreButton>
            ) : undefined
          }
        >
          Dự án hiện đang hiển thị <strong>Khung thời gian Hợp đồng, Đợt thanh toán & Mốc vòng đời</strong>. Hãy nhấn{" "}
          <strong>&ldquo;+ Thêm giai đoạn&rdquo;</strong> (VD: Thiết kế, Phần móng, Phần thô, Hoàn thiện...) và thêm các đầu việc để theo dõi chi tiết tiến độ thi công trên biểu đồ Gantt.
        </Alert>
      )}

      {/* ================= 3A. CHẾ ĐỘ BIỂU ĐỒ GANTT TRỤC THỜI GIAN ================= */}
      {displayMode === "GANTT" ? (
        <Paper
          variant="outlined"
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            borderColor: "#cbd5e1",
          }}
        >
          <Box
            ref={scrollContainerRef}
            sx={{
              overflowX: "auto",
              overflowY: "auto",
              maxHeight: "72vh",
              position: "relative",
            }}
          >
            <Box
              sx={{
                minWidth: WBS_COL_WIDTH + timelineMeta.totalWidth,
                position: "relative",
              }}
            >
              {/* -------- HEADER DÒNG THỜI GIAN 2 TẦNG -------- */}
              <Box
                sx={{
                  display: "flex",
                  position: "sticky",
                  top: 0,
                  zIndex: 8,
                  bgcolor: "#f8fafc",
                  borderBottom: "2px solid #cbd5e1",
                }}
              >
                {/* Sticky Top-Left Header */}
                <Box
                  sx={{
                    width: WBS_COL_WIDTH,
                    minWidth: WBS_COL_WIDTH,
                    position: "sticky",
                    left: 0,
                    zIndex: 10,
                    bgcolor: "#f1f5f9",
                    borderRight: "2px solid #cbd5e1",
                    px: 2,
                    py: 1.25,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={800}>
                    Hạng mục / Giai đoạn / Công việc
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Nhấn vào công việc để xem chi tiết & cập nhật tiến độ
                  </Typography>
                </Box>

                {/* Timeline 2-Tier Header */}
                <Box sx={{ width: timelineMeta.totalWidth }}>
                  {/* Tier 1: Months */}
                  <Box
                    sx={{
                      position: "relative",
                      height: 28,
                      borderBottom: "1px solid #e2e8f0",
                      bgcolor: "#f1f5f9",
                    }}
                  >
                    {timelineMeta.months.map((m) => (
                      <Box
                        key={m.key}
                        sx={{
                          position: "absolute",
                          left: m.left,
                          width: m.width,
                          height: "100%",
                          borderRight: "1px solid #cbd5e1",
                          display: "flex",
                          alignItems: "center",
                          px: 1,
                          overflow: "hidden",
                        }}
                      >
                        <Typography
                          variant="caption"
                          fontWeight={700}
                          color="text.primary"
                          noWrap
                        >
                          {m.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Tier 2: Days / Weeks / Months */}
                  <Box sx={{ position: "relative", height: 32 }}>
                    {timelineMeta.ticks.map((t) => (
                      <Box
                        key={t.key}
                        sx={{
                          position: "absolute",
                          left: t.left,
                          width: t.width,
                          height: "100%",
                          borderRight: "1px solid #e2e8f0",
                          bgcolor: t.isToday
                            ? "#fee2e2"
                            : t.isWeekend
                            ? "#f8fafc"
                            : "#ffffff",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          variant="caption"
                          fontWeight={t.isToday ? 800 : 600}
                          sx={{
                            fontSize: "0.7rem",
                            lineHeight: 1.1,
                            color: t.isToday ? "#dc2626" : "text.primary",
                          }}
                          noWrap
                        >
                          {t.label}
                        </Typography>
                        {t.subLabel && (
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: "0.62rem",
                              lineHeight: 1,
                              color: t.isToday ? "#dc2626" : "text.secondary",
                            }}
                          >
                            {t.subLabel}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>

              {/* -------- THÂN BIỂU ĐỒ GANTT -------- */}
              <Box sx={{ position: "relative" }}>
                {/* Đường kẻ dọc HÔM NAY xuyên suốt */}
                {timelineMeta.todayLeft !== null && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: WBS_COL_WIDTH + timelineMeta.todayLeft,
                      width: "2px",
                      bgcolor: "#ef4444",
                      zIndex: 5,
                      pointerEvents: "none",
                    }}
                  >
                    <Box
                      sx={{
                        position: "sticky",
                        top: 62,
                        transform: "translateX(-50%)",
                        bgcolor: "#ef4444",
                        color: "#ffffff",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        px: 0.75,
                        py: 0.15,
                        borderRadius: 1,
                        whiteSpace: "nowrap",
                        width: "fit-content",
                      }}
                    >
                      Hôm nay {moment().format("DD/MM")}
                    </Box>
                  </Box>
                )}

                {/* DÒNG 1: THANH TỔNG HỢP ĐỒNG DỰ ÁN */}
                <Box
                  sx={{
                    display: "flex",
                    height: ROW_HEIGHT + 4,
                    borderBottom: "1px solid #cbd5e1",
                    bgcolor: "#eff6ff",
                  }}
                >
                  <Box
                    sx={{
                      width: WBS_COL_WIDTH,
                      minWidth: WBS_COL_WIDTH,
                      position: "sticky",
                      left: 0,
                      zIndex: 6,
                      bgcolor: "#eff6ff",
                      borderRight: "2px solid #cbd5e1",
                      px: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ overflow: "hidden" }}>
                      <Typography variant="body2" fontWeight={800} noWrap>
                        {gantt.projectCode} — {gantt.projectName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        Tổng tiến độ dự án: {overallPct.toFixed(0)}%
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      width: timelineMeta.totalWidth,
                      position: "relative",
                    }}
                  >
                    {masterSpanGeo && (
                      <Tooltip
                        arrow
                        title={`Khung thời gian dự án: ${masterSpanGeo.startFormatted} → ${masterSpanGeo.endFormatted} (${masterSpanGeo.spanDays} ngày) • Tiến độ: ${overallPct.toFixed(0)}%`}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            left: masterSpanGeo.left,
                            width: masterSpanGeo.width,
                            top: 12,
                            height: 22,
                            borderRadius: 1.5,
                            bgcolor: "#bfdbfe",
                            border: "1px solid #2563eb",
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            sx={{
                              width: `${overallPct}%`,
                              height: "100%",
                              bgcolor: "#1d4ed8",
                              transition: "width 0.25s ease",
                            }}
                          />
                          <Typography
                            variant="caption"
                            fontWeight={700}
                            sx={{
                              position: "absolute",
                              left: 8,
                              color: overallPct > 35 ? "#ffffff" : "#1e3a8a",
                              fontSize: "0.7rem",
                            }}
                            noWrap
                          >
                            Tổng thể ({overallPct.toFixed(0)}%)
                          </Typography>
                        </Box>
                      </Tooltip>
                    )}
                  </Box>
                </Box>

                {/* NHÓM 2: CÁC CỘT MỐC HỢP ĐỒNG, THANH TOÁN & VÒNG ĐỜI */}
                {filteredMilestones.length > 0 && (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        height: 38,
                        borderBottom: "1px solid #e2e8f0",
                        bgcolor: "#f8fafc",
                      }}
                    >
                      <Box
                        onClick={() => setMilestonesCollapsed((v) => !v)}
                        sx={{
                          width: WBS_COL_WIDTH,
                          minWidth: WBS_COL_WIDTH,
                          position: "sticky",
                          left: 0,
                          zIndex: 6,
                          bgcolor: "#f8fafc",
                          borderRight: "2px solid #cbd5e1",
                          px: 1.5,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.75,
                          cursor: "pointer",
                        }}
                      >
                        {milestonesCollapsed ? (
                          <ExpandMoreIcon fontSize="small" />
                        ) : (
                          <ExpandLessIcon fontSize="small" />
                        )}
                        <FlagOutlinedIcon fontSize="small" color="warning" />
                        <Typography variant="caption" fontWeight={800}>
                          CỘT MỐC HỢP ĐỒNG, THANH TOÁN & VÒNG ĐỜI (
                          {filteredMilestones.length})
                        </Typography>
                      </Box>
                      <Box sx={{ width: timelineMeta.totalWidth }} />
                    </Box>

                    {!milestonesCollapsed &&
                      filteredMilestones.map((ms) => {
                        const typeMeta = MILESTONE_TYPE_META[ms.type];
                        const pointLeft = getPointLeft(ms.date);

                        return (
                          <Box
                            key={ms.key}
                            sx={{
                              display: "flex",
                              height: 38,
                              borderBottom: "1px solid #f1f5f9",
                              "&:hover": { bgcolor: "#f8fafc" },
                            }}
                          >
                            <Box
                              sx={{
                                width: WBS_COL_WIDTH,
                                minWidth: WBS_COL_WIDTH,
                                position: "sticky",
                                left: 0,
                                zIndex: 6,
                                bgcolor: "#ffffff",
                                borderRight: "2px solid #cbd5e1",
                                pl: 3.5,
                                pr: 1.5,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                sx={{ overflow: "hidden" }}
                              >
                                <Box
                                  sx={{
                                    width: 9,
                                    height: 9,
                                    bgcolor: typeMeta.color,
                                    transform: "rotate(45deg)",
                                    flexShrink: 0,
                                  }}
                                />
                                <Typography variant="caption" fontWeight={600} noWrap>
                                  {ms.title}
                                </Typography>
                              </Stack>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ flexShrink: 0, ml: 1 }}
                              >
                                {moment(ms.date).format("DD/MM/YY")}
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                width: timelineMeta.totalWidth,
                                position: "relative",
                              }}
                            >
                              {pointLeft !== null && (
                                <Tooltip
                                  arrow
                                  title={`${ms.title} (${moment(ms.date).format(
                                    "DD/MM/YYYY"
                                  )})${
                                    ms.amount
                                      ? ` • Số tiền: ${formatVnd(ms.amount)}`
                                      : ""
                                  }${ms.subtitle ? ` • ${ms.subtitle}` : ""}`}
                                >
                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    sx={{
                                      position: "absolute",
                                      left: pointLeft - 7,
                                      top: 9,
                                      cursor: "pointer",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        width: 14,
                                        height: 14,
                                        bgcolor:
                                          ms.status === "OVERDUE"
                                            ? "#dc2626"
                                            : typeMeta.color,
                                        border: "2px solid #ffffff",
                                        boxShadow:
                                          "0 1px 4px rgba(15,23,42,0.28)",
                                        transform: "rotate(45deg)",
                                      }}
                                    />
                                    <Typography
                                      variant="caption"
                                      fontWeight={700}
                                      sx={{
                                        fontSize: "0.7rem",
                                        color:
                                          ms.status === "OVERDUE"
                                            ? "#dc2626"
                                            : typeMeta.color,
                                      }}
                                    >
                                      {ms.title}
                                      {ms.amount
                                        ? ` (${formatVnd(ms.amount)})`
                                        : ""}
                                    </Typography>
                                  </Stack>
                                </Tooltip>
                              )}
                            </Box>
                          </Box>
                        );
                      })}
                  </>
                )}

                {/* NHÓM 3: CÁC GIAI ĐOẠN & CÔNG VIỆC THI CÔNG */}
                {filteredPhases.map((phase, phaseIdx) => {
                  const isCollapsed = Boolean(
                    collapsedPhases[phase.projectProgressId]
                  );
                  const phaseGeo = getBarGeometry(
                    phase.startDate,
                    phase.endDate
                  );
                  const phasePct = Math.min(
                    100,
                    Math.max(0, Number(phase.progressPercent ?? 0))
                  );

                  return (
                    <Box key={phase.projectProgressId}>
                      {/* Dòng Header Giai đoạn */}
                      <Box
                        sx={{
                          display: "flex",
                          height: ROW_HEIGHT,
                          borderBottom: "1px solid #cbd5e1",
                          bgcolor: "#f1f5f9",
                        }}
                      >
                        <Box
                          sx={{
                            width: WBS_COL_WIDTH,
                            minWidth: WBS_COL_WIDTH,
                            position: "sticky",
                            left: 0,
                            zIndex: 6,
                            bgcolor: "#f1f5f9",
                            borderRight: "2px solid #cbd5e1",
                            px: 1.25,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={0.5}
                            alignItems="center"
                            sx={{ overflow: "hidden", cursor: "pointer" }}
                            onClick={() =>
                              setCollapsedPhases((prev) => ({
                                ...prev,
                                [phase.projectProgressId]:
                                  !prev[phase.projectProgressId],
                              }))
                            }
                          >
                            {isCollapsed ? (
                              <ExpandMoreIcon fontSize="small" />
                            ) : (
                              <ExpandLessIcon fontSize="small" />
                            )}
                            <Typography variant="body2" fontWeight={800} noWrap>
                              {phaseIdx + 1}. {phase.progressName}
                            </Typography>
                          </Stack>

                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Chip
                              size="small"
                              label={`${phasePct.toFixed(0)}%`}
                              sx={{ height: 20, fontSize: "0.68rem", fontWeight: 700 }}
                            />
                            {canManageSchedule && (
                              <Tooltip title="Thêm công việc vào giai đoạn này">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() =>
                                    handleOpenAddTask(phase.projectProgressId)
                                  }
                                >
                                  <AddIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            {canManageSchedule &&
                              (!phase.tasks || phase.tasks.length === 0) && (
                                <Tooltip title="Gỡ giai đoạn trống">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleDeletePhase(phase)}
                                  >
                                    <DeleteOutlineIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                          </Stack>
                        </Box>

                        {/* Thanh tổng hợp Giai đoạn (Summary Bar) */}
                        <Box
                          sx={{
                            width: timelineMeta.totalWidth,
                            position: "relative",
                          }}
                        >
                          {phaseGeo && (
                            <Tooltip
                              arrow
                              title={`Giai đoạn: ${phase.progressName} (${phaseGeo.startFormatted} → ${phaseGeo.endFormatted}) • Hoàn thành: ${phasePct.toFixed(0)}%`}
                            >
                              <Box
                                sx={{
                                  position: "absolute",
                                  left: phaseGeo.left,
                                  width: phaseGeo.width,
                                  top: 15,
                                  height: 14,
                                  borderRadius: 1,
                                  bgcolor: "#94a3b8",
                                  overflow: "hidden",
                                }}
                              >
                                <Box
                                  sx={{
                                    width: `${phasePct}%`,
                                    height: "100%",
                                    bgcolor: "#334155",
                                  }}
                                />
                              </Box>
                            </Tooltip>
                          )}
                        </Box>
                      </Box>

                      {/* Danh sách Công việc chính & Công việc con trong Giai đoạn */}
                      {!isCollapsed &&
                        phase.tasks.map((task) => {
                          const renderTaskRow = (
                            t: GanttTaskItem,
                            isSubTask: boolean
                          ) => {
                            const geo = getBarGeometry(t.startDate, t.endDate);
                            const stMeta =
                              TASK_STATE_META[t.state] ||
                              TASK_STATE_META.NOT_STARTED;
                            const pct = Math.min(
                              100,
                              Math.max(0, Number(t.progressPercent ?? 0))
                            );
                            const barBgColor = t.overdue
                              ? "#fecaca"
                              : stMeta.barBg;
                            const barFillColor = t.overdue
                              ? "#dc2626"
                              : stMeta.barFill;
                            const assigneeText =
                              t.assignees && t.assignees.length > 0
                                ? t.assignees.map((a) => a.name).join(", ")
                                : "Chưa giao";

                            return (
                              <Box
                                key={t.id}
                                sx={{
                                  display: "flex",
                                  height: ROW_HEIGHT,
                                  borderBottom: "1px solid #f1f5f9",
                                  bgcolor: "#ffffff",
                                  "&:hover": { bgcolor: "#f8fafc" },
                                }}
                              >
                                {/* WBS Task Cell */}
                                <Box
                                  onClick={() => setSelectedTask(t)}
                                  sx={{
                                    width: WBS_COL_WIDTH,
                                    minWidth: WBS_COL_WIDTH,
                                    position: "sticky",
                                    left: 0,
                                    zIndex: 6,
                                    bgcolor: "inherit",
                                    borderRight: "2px solid #cbd5e1",
                                    pl: isSubTask ? 4.5 : 2.5,
                                    pr: 1.25,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    cursor: "pointer",
                                  }}
                                >
                                  <Stack
                                    direction="row"
                                    spacing={0.75}
                                    alignItems="center"
                                    sx={{ overflow: "hidden" }}
                                  >
                                    {isSubTask && (
                                      <SubdirectoryArrowRightIcon
                                        sx={{
                                          fontSize: 15,
                                          color: "text.disabled",
                                        }}
                                      />
                                    )}
                                    <Box sx={{ overflow: "hidden" }}>
                                      <Typography
                                        variant="body2"
                                        fontWeight={isSubTask ? 500 : 600}
                                        noWrap
                                      >
                                        {t.name}
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        noWrap
                                      >
                                        {t.code} • {assigneeText}
                                      </Typography>
                                    </Box>
                                  </Stack>

                                  <Chip
                                    size="small"
                                    color={t.overdue ? "error" : stMeta.chipColor}
                                    variant={
                                      t.state === "COMPLETED"
                                        ? "filled"
                                        : "outlined"
                                    }
                                    label={`${pct.toFixed(0)}%`}
                                    sx={{
                                      height: 20,
                                      fontSize: "0.68rem",
                                      fontWeight: 700,
                                      ml: 0.75,
                                      flexShrink: 0,
                                    }}
                                  />
                                </Box>

                                {/* Timeline Task Gantt Bar */}
                                <Box
                                  sx={{
                                    width: timelineMeta.totalWidth,
                                    position: "relative",
                                  }}
                                >
                                  {/* Subtle vertical grid lines for ticks */}
                                  {geo && (
                                    <Tooltip
                                      arrow
                                      title={
                                        <Box sx={{ p: 0.5 }}>
                                          <Typography
                                            variant="caption"
                                            fontWeight={700}
                                            sx={{ display: "block" }}
                                          >
                                            {t.code} — {t.name}
                                          </Typography>
                                          <Typography
                                            variant="caption"
                                            sx={{ display: "block" }}
                                          >
                                            Thời gian: {geo.startFormatted} →{" "}
                                            {geo.endFormatted} ({geo.spanDays}{" "}
                                            ngày)
                                          </Typography>
                                          <Typography
                                            variant="caption"
                                            sx={{ display: "block" }}
                                          >
                                            Trạng thái:{" "}
                                            {t.overdue
                                              ? `Quá hạn (${Math.abs(
                                                  Number(t.remainDays ?? 0)
                                                )} ngày)`
                                              : stMeta.label}{" "}
                                            • Tiến độ: {pct.toFixed(0)}%
                                          </Typography>
                                          <Typography
                                            variant="caption"
                                            sx={{ display: "block" }}
                                          >
                                            Thực hiện: {assigneeText}
                                          </Typography>
                                        </Box>
                                      }
                                    >
                                      <Box
                                        onClick={() => setSelectedTask(t)}
                                        sx={{
                                          position: "absolute",
                                          left: geo.left,
                                          width: geo.width,
                                          top: isSubTask ? 12 : 10,
                                          height: isSubTask ? 20 : 24,
                                          borderRadius: 1.25,
                                          bgcolor: barBgColor,
                                          border: `1px solid ${barFillColor}`,
                                          overflow: "hidden",
                                          cursor: "pointer",
                                          boxShadow:
                                            "0 1px 2px rgba(15,23,42,0.12)",
                                          "&:hover": {
                                            filter: "brightness(0.96)",
                                          },
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            width: `${Math.max(
                                              t.state === "IN_PROGRESS" &&
                                                pct === 0
                                                ? 15
                                                : pct,
                                              0
                                            )}%`,
                                            height: "100%",
                                            bgcolor: barFillColor,
                                            transition: "width 0.2s ease",
                                          }}
                                        />
                                        <Typography
                                          variant="caption"
                                          fontWeight={700}
                                          sx={{
                                            position: "absolute",
                                            left: 6,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            fontSize: "0.68rem",
                                            color:
                                              pct >= 45 ? "#ffffff" : "#0f172a",
                                            whiteSpace: "nowrap",
                                          }}
                                        >
                                          {t.name} ({pct.toFixed(0)}%)
                                        </Typography>
                                      </Box>
                                    </Tooltip>
                                  )}
                                </Box>
                              </Box>
                            );
                          };

                          return (
                            <Box key={task.id}>
                              {renderTaskRow(task, false)}
                              {(task.subTasks || []).map((sub) =>
                                renderTaskRow(sub, true)
                              )}
                            </Box>
                          );
                        })}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        </Paper>
      ) : (
        /* ================= 3B. CHẾ ĐỘ SƠ ĐỒ LỘ TRÌNH & CỘT MỐC (MILESTONE TIMELINE) ================= */
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 2 }}>
                Cột mốc Hợp đồng, Thanh toán & Vòng đời ({filteredMilestones.length})
              </Typography>
              <Stack spacing={1.5}>
                {filteredMilestones.map((ms) => {
                  const meta = MILESTONE_TYPE_META[ms.type];
                  return (
                    <Paper
                      key={ms.key}
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        borderLeft: `4px solid ${meta.color}`,
                        bgcolor: meta.bg,
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="body2" fontWeight={700}>
                          {ms.title}
                        </Typography>
                        <Chip
                          size="small"
                          label={moment(ms.date).format("DD/MM/YYYY")}
                          sx={{ fontWeight: 700, bgcolor: "#ffffff" }}
                        />
                      </Stack>
                      {ms.amount ? (
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          color="warning.dark"
                          sx={{ mt: 0.5 }}
                        >
                          Số tiền: {formatVnd(ms.amount)}
                        </Typography>
                      ) : null}
                      {ms.subtitle && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", mt: 0.25 }}
                        >
                          {ms.subtitle}
                        </Typography>
                      )}
                    </Paper>
                  );
                })}
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 2 }}>
                Chi tiết các Giai đoạn & Hạng mục thi công ({filteredPhases.length})
              </Typography>

              {filteredPhases.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Chưa có giai đoạn hoặc công việc nào phù hợp với bộ lọc hiện tại.
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {filteredPhases.map((phase, idx) => (
                    <Paper
                      key={phase.projectProgressId}
                      variant="outlined"
                      sx={{ p: 2, borderRadius: 2, bgcolor: "#f8fafc" }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 1 }}
                      >
                        <Typography variant="subtitle2" fontWeight={800}>
                          Giai đoạn {idx + 1}: {phase.progressName}
                        </Typography>
                        <Chip
                          size="small"
                          color="primary"
                          label={`Hoàn thành ${Number(
                            phase.progressPercent ?? 0
                          ).toFixed(0)}%`}
                        />
                      </Stack>

                      <Stack spacing={1}>
                        {phase.tasks.map((t) => {
                          const stMeta = TASK_STATE_META[t.state];
                          return (
                            <Paper
                              key={t.id}
                              variant="outlined"
                              onClick={() => setSelectedTask(t)}
                              sx={{
                                p: 1.25,
                                borderRadius: 1.5,
                                bgcolor: "#ffffff",
                                cursor: "pointer",
                                "&:hover": { borderColor: "primary.main" },
                              }}
                            >
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                              >
                                <Typography variant="body2" fontWeight={700}>
                                  {t.code} — {t.name}
                                </Typography>
                                <Chip
                                  size="small"
                                  color={t.overdue ? "error" : stMeta.chipColor}
                                  label={
                                    t.overdue ? "Quá hạn" : stMeta.label
                                  }
                                />
                              </Stack>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {t.startDate
                                  ? moment(t.startDate).format("DD/MM/YYYY")
                                  : "—"}{" "}
                                →{" "}
                                {t.endDate
                                  ? moment(t.endDate).format("DD/MM/YYYY")
                                  : "—"}{" "}
                                ({t.durationDays} ngày)
                              </Typography>
                            </Paper>
                          );
                        })}
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* ================= DIALOG 1: THÊM GIAI ĐOẠN THI CÔNG ================= */}
      <Dialog
        open={openAddPhase}
        onClose={savingPhase ? undefined : () => setOpenAddPhase(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Thêm giai đoạn vào Biểu đồ Gantt dự án
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.25}>
            <ToggleButtonGroup
              size="small"
              exclusive
              fullWidth
              value={phaseMode}
              onChange={(_, v) => {
                if (v) setPhaseMode(v);
              }}
            >
              <ToggleButton value="NEW">Tạo tên giai đoạn mới</ToggleButton>
              <ToggleButton value="CATALOG">
                Chọn từ Danh mục Tiến trình ({progressCatalog.length})
              </ToggleButton>
            </ToggleButtonGroup>

            {phaseMode === "NEW" ? (
              <>
                <TextField
                  size="small"
                  fullWidth
                  required
                  label="Tên giai đoạn thi công"
                  placeholder="VD: Khảo sát & Thiết kế bản vẽ / Thi công phần móng / Phần thô..."
                  value={newPhaseName}
                  onChange={(e) => setNewPhaseName(e.target.value)}
                />
                <TextField
                  size="small"
                  fullWidth
                  multiline
                  rows={2}
                  label="Mô tả giai đoạn (Tùy chọn)"
                  value={newPhaseDesc}
                  onChange={(e) => setNewPhaseDesc(e.target.value)}
                />
              </>
            ) : (
              <FormControl size="small" fullWidth>
                <InputLabel>Chọn giai đoạn mẫu</InputLabel>
                <Select
                  label="Chọn giai đoạn mẫu"
                  value={selectedCatalogProgressId}
                  onChange={(e) =>
                    setSelectedCatalogProgressId(e.target.value as number)
                  }
                >
                  {progressCatalog.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.code} — {p.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <CoreButton
            theme="cancel"
            onClick={() => setOpenAddPhase(false)}
            disabled={savingPhase}
          >
            Hủy
          </CoreButton>
          <CoreButton
            theme="submit"
            onClick={handleConfirmAddPhase}
            loading={savingPhase}
          >
            Thêm giai đoạn
          </CoreButton>
        </DialogActions>
      </Dialog>

      {/* ================= DIALOG 2: THÊM CÔNG VIỆC / CÔNG VIỆC CON ================= */}
      <Dialog
        open={openAddTask}
        onClose={savingTask ? undefined : () => setOpenAddTask(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {parentTaskTarget
            ? `Thêm công việc con thuộc "${parentTaskTarget.name}"`
            : "Thêm công việc mới lên Biểu đồ Gantt"}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            {!parentTaskTarget && (
              <FormControl size="small" fullWidth required>
                <InputLabel>Thuộc giai đoạn</InputLabel>
                <Select
                  label="Thuộc giai đoạn"
                  value={taskPhaseId}
                  onChange={(e) => setTaskPhaseId(e.target.value as number)}
                >
                  {(gantt.phases || []).map((p) => (
                    <MenuItem
                      key={p.projectProgressId}
                      value={p.projectProgressId}
                    >
                      {p.progressName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <TextField
              size="small"
              fullWidth
              required
              label="Tên công việc / Hạng mục thi công"
              placeholder="VD: Đào móng & đổ bê tông lót, Lắp đặt cốt thép dầm sàn..."
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="date"
                  size="small"
                  fullWidth
                  required
                  label="Ngày bắt đầu"
                  InputLabelProps={{ shrink: true }}
                  value={taskStartDate}
                  onChange={(e) => setTaskStartDate(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="date"
                  size="small"
                  fullWidth
                  required
                  label="Ngày kết thúc"
                  InputLabelProps={{ shrink: true }}
                  value={taskEndDate}
                  onChange={(e) => setTaskEndDate(e.target.value)}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Mức độ ưu tiên</InputLabel>
                  <Select
                    label="Mức độ ưu tiên"
                    value={taskPriority}
                    onChange={(e) =>
                      setTaskPriority(e.target.value as PriorityLevel)
                    }
                  >
                    <MenuItem value="LOW">Thấp</MenuItem>
                    <MenuItem value="MEDIUM">Trung bình</MenuItem>
                    <MenuItem value="HIGH">Ưu tiên cao</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Trạng thái ban đầu</InputLabel>
                  <Select
                    label="Trạng thái ban đầu"
                    value={taskInitialState}
                    onChange={(e) =>
                      setTaskInitialState(e.target.value as TaskState)
                    }
                  >
                    <MenuItem value="NOT_STARTED">Chưa bắt đầu (0%)</MenuItem>
                    <MenuItem value="IN_PROGRESS">
                      Đang thực hiện (50%)
                    </MenuItem>
                    <MenuItem value="COMPLETED">Hoàn thành (100%)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Autocomplete
              multiple
              size="small"
              options={staffOptions}
              value={taskSelectedStaffs}
              onChange={(_, val) => setTaskSelectedStaffs(val)}
              getOptionLabel={(opt: any) =>
                `${opt.code ? `${opt.code} - ` : ""}${opt.name || ""}`
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Nhân sự thực hiện"
                  placeholder="Chọn kỹ sư / nhân viên phụ trách"
                />
              )}
            />

            <TextField
              size="small"
              fullWidth
              multiline
              rows={2}
              label="Ghi chú / Yêu cầu kỹ thuật"
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <CoreButton
            theme="cancel"
            onClick={() => setOpenAddTask(false)}
            disabled={savingTask}
          >
            Hủy
          </CoreButton>
          <CoreButton
            theme="submit"
            onClick={handleConfirmAddTask}
            loading={savingTask}
          >
            Lưu công việc
          </CoreButton>
        </DialogActions>
      </Dialog>

      {/* ================= DIALOG 3: CHI TIẾT & CẬP NHẬT NHANH CÔNG VIỆC TRÊN GANTT ================= */}
      <Dialog
        open={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        maxWidth="sm"
        fullWidth
      >
        {selectedTask && (
          <>
            <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
              {selectedTask.code} — {selectedTask.name}
            </DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip
                    size="small"
                    color={
                      selectedTask.overdue
                        ? "error"
                        : TASK_STATE_META[selectedTask.state]?.chipColor ||
                          "default"
                    }
                    label={
                      selectedTask.overdue
                        ? "Đang quá hạn"
                        : TASK_STATE_META[selectedTask.state]?.label
                    }
                  />
                  {selectedTask.priorityLevel && (
                    <Chip
                      size="small"
                      variant="outlined"
                      color={
                        PRIORITY_META[selectedTask.priorityLevel]?.color ||
                        "default"
                      }
                      label={`Mức độ: ${
                        PRIORITY_META[selectedTask.priorityLevel]?.label ||
                        selectedTask.priorityLevel
                      }`}
                    />
                  )}
                  <Chip
                    size="small"
                    variant="outlined"
                    label={`Tiến độ: ${Number(
                      selectedTask.progressPercent ?? 0
                    ).toFixed(0)}%`}
                  />
                </Stack>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Ngày bắt đầu
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {selectedTask.startDate
                        ? moment(selectedTask.startDate).format("DD/MM/YYYY")
                        : "—"}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Ngày kết thúc ({selectedTask.durationDays} ngày)
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {selectedTask.endDate
                        ? moment(selectedTask.endDate).format("DD/MM/YYYY")
                        : "—"}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Người duyệt / Giám sát
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {selectedTask.reviewer?.name || "—"}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Nhân sự thực hiện
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {selectedTask.assignees &&
                      selectedTask.assignees.length > 0
                        ? selectedTask.assignees.map((a) => a.name).join(", ")
                        : "Chưa phân công"}
                    </Typography>
                  </Grid>
                </Grid>

                {selectedTask.description && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Mô tả / Yêu cầu kỹ thuật
                    </Typography>
                    <Typography variant="body2">
                      {selectedTask.description}
                    </Typography>
                  </Box>
                )}

                {canManageSchedule && (
                  <>
                    <Divider />
                    <Box>
                      <Typography
                        variant="subtitle2"
                        fontWeight={700}
                        sx={{ mb: 1 }}
                      >
                        Cập nhật nhanh trạng thái công việc
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {(
                          [
                            "NOT_STARTED",
                            "IN_PROGRESS",
                            "COMPLETED",
                          ] as TaskState[]
                        ).map((st) => (
                          <Button
                            key={st}
                            size="small"
                            disabled={
                              updatingTaskState || selectedTask.state === st
                            }
                            variant={
                              selectedTask.state === st
                                ? "contained"
                                : "outlined"
                            }
                            color={
                              st === "COMPLETED"
                                ? "success"
                                : st === "IN_PROGRESS"
                                ? "primary"
                                : "inherit"
                            }
                            onClick={() =>
                              handleQuickChangeTaskState(selectedTask.id, st)
                            }
                            sx={{ textTransform: "none", fontWeight: 600 }}
                          >
                            {TASK_STATE_META[st].label}
                          </Button>
                        ))}
                      </Stack>
                    </Box>

                    {!selectedTask.parentId && (
                      <Box>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<AddIcon fontSize="small" />}
                          onClick={() => {
                            const parentRef = selectedTask;
                            setSelectedTask(null);
                            handleOpenAddTask(
                              parentRef.projectProgressId ?? undefined,
                              parentRef
                            );
                          }}
                          sx={{ textTransform: "none", fontWeight: 600 }}
                        >
                          Thêm công việc con (Sub-task) cho hạng mục này
                        </Button>
                      </Box>
                    )}
                  </>
                )}
              </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 1.5 }}>
              <CoreButton
                theme="cancel"
                onClick={() => setSelectedTask(null)}
              >
                Đóng
              </CoreButton>
            </DialogActions>
          </>
        )}
      </Dialog>

      <ProcessTemplateDialog
        open={openTemplateDialog}
        projectId={projectId}
        defaultBuildingType={projectDetail?.buildingType}
        onClose={() => setOpenTemplateDialog(false)}
        onApplied={() => {
          queryClient.invalidateQueries({
            queryKey: ["project-gantt", projectId],
          });
          queryClient.invalidateQueries({
            queryKey: ["project-detail", projectId],
          });
        }}
      />
    </Box>
  );
}
