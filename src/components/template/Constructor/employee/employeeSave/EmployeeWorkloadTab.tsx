import {
  Alert,
  AlertTitle,
  Box,
  Chip,
  Divider,
  Grid,
  IconButton,
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
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import TimelineIcon from "@mui/icons-material/Timeline";
import CoreLoading from "@/components/molecules/CoreLoading";
import { ROUTES } from "@/routes";
import { StaffWorkload } from "@/service/constructor/Employee/workload/type";
import moment from "moment";
import router from "next/router";
import { useMemo, useState } from "react";
import {
  PRIORITY_META,
  PROJECT_ROLE_LABELS,
  PROJECT_STATE_META,
  TASK_ROLE_LABELS,
  TASK_STATE_META,
  WORKLOAD_LEVEL_META,
} from "../constants";

type Props = {
  workload?: StaffWorkload;
  isLoading: boolean;
};

type FilterMode = "ALL" | "ACTIVE" | "OVERDUE" | "COMPLETED";

export default function EmployeeWorkloadTab({ workload, isLoading }: Props) {
  const [keyword, setKeyword] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("ACTIVE");

  const levelMeta =
    WORKLOAD_LEVEL_META[workload?.workloadLevel || "NORMAL"] ||
    WORKLOAD_LEVEL_META.NORMAL;

  const filteredProjects = useMemo(() => {
    const list = workload?.projects ?? [];
    const q = keyword.trim().toLowerCase();
    return list.filter((p) => {
      if (filterMode === "ACTIVE" && p.state === "COMPLETED") return false;
      if (filterMode === "OVERDUE" && !p.overdue) return false;
      if (filterMode === "COMPLETED" && p.state !== "COMPLETED") return false;
      if (!q) return true;
      return (
        p.code?.toLowerCase().includes(q) ||
        p.name?.toLowerCase().includes(q) ||
        p.owner?.toLowerCase().includes(q)
      );
    });
  }, [workload?.projects, keyword, filterMode]);

  const filteredTasks = useMemo(() => {
    const list = workload?.tasks ?? [];
    const q = keyword.trim().toLowerCase();
    return list.filter((t) => {
      if (filterMode === "ACTIVE" && t.state === "COMPLETED") return false;
      if (filterMode === "OVERDUE" && !t.overdue) return false;
      if (filterMode === "COMPLETED" && t.state !== "COMPLETED") return false;
      if (!q) return true;
      return (
        t.code?.toLowerCase().includes(q) ||
        t.name?.toLowerCase().includes(q) ||
        t.projectName?.toLowerCase().includes(q) ||
        t.projectCode?.toLowerCase().includes(q) ||
        t.progressName?.toLowerCase().includes(q)
      );
    });
  }, [workload?.tasks, keyword, filterMode]);

  if (isLoading) {
    return <CoreLoading />;
  }

  if (!workload) {
    return (
      <Paper variant="outlined" sx={{ p: 4, textAlign: "center" }}>
        <Typography color="text.secondary">
          Không tải được dữ liệu dự án và công việc của nhân sự.
        </Typography>
      </Paper>
    );
  }

  const completionRate =
    workload.totalTasks > 0
      ? Math.round((workload.completedTasks / workload.totalTasks) * 100)
      : 0;

  return (
    <Box className="py-4">
      {/* Banner đánh giá mức tải công việc để tránh quá tải */}
      <Alert severity={levelMeta.severity} sx={{ mb: 3, borderRadius: 2 }}>
        <AlertTitle sx={{ fontWeight: 700 }}>
          Đánh giá tải công việc: {levelMeta.label}
        </AlertTitle>
        <Typography variant="body2">
          Nhân sự hiện đang tham gia{" "}
          <strong>{workload.activeProjects} dự án chưa hoàn thành</strong> và đảm
          nhận <strong>{workload.activeTasks} công việc đang xử lý</strong>
          {workload.overdueTasks > 0 ? (
            <>
              {" "}
              (trong đó có{" "}
              <strong style={{ color: "#d32f2f" }}>
                {workload.overdueTasks} công việc quá hạn
              </strong>
              )
            </>
          ) : null}
          . {levelMeta.advice}
        </Typography>
      </Alert>

      {/* 4 Thẻ KPI tổng quan */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            variant="outlined"
            sx={{ p: 2, borderRadius: 2, height: "100%" }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" color="text.secondary">
                DỰ ÁN ĐANG THAM GIA
              </Typography>
              <AccountTreeOutlinedIcon color="primary" fontSize="small" />
            </Stack>
            <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
              {workload.activeProjects}{" "}
              <Typography component="span" variant="body2" color="text.secondary">
                / {workload.totalProjects} dự án
              </Typography>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Chủ trì / Quản lý chính: <strong>{workload.managedActiveProjects}</strong> DA
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            variant="outlined"
            sx={{ p: 2, borderRadius: 2, height: "100%" }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" color="text.secondary">
                CÔNG VIỆC ĐANG XỬ LÝ
              </Typography>
              <AssignmentOutlinedIcon color="info" fontSize="small" />
            </Stack>
            <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
              {workload.activeTasks}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Đang làm: <strong>{workload.inProgressTasks}</strong> • Chưa bắt đầu:{" "}
              <strong>{workload.notStartedTasks}</strong>
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 2,
              height: "100%",
              borderColor: workload.overdueTasks > 0 ? "error.light" : "divider",
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" color="text.secondary">
                CẢNH BÁO TIẾN ĐỘ
              </Typography>
              <WarningAmberOutlinedIcon
                color={workload.overdueTasks > 0 ? "error" : "warning"}
                fontSize="small"
              />
            </Stack>
            <Typography
              variant="h5"
              fontWeight={700}
              color={workload.overdueTasks > 0 ? "error.main" : "text.primary"}
              sx={{ mt: 1 }}
            >
              {workload.overdueTasks} quá hạn
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Sắp đến hạn (≤ 7 ngày): <strong>{workload.dueSoonTasks}</strong> • Ưu tiên cao:{" "}
              <strong>{workload.highPriorityActiveTasks}</strong>
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            variant="outlined"
            sx={{ p: 2, borderRadius: 2, height: "100%" }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" color="text.secondary">
                TỶ LỆ HOÀN THÀNH CV
              </Typography>
              <CheckCircleOutlineIcon color="success" fontSize="small" />
            </Stack>
            <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
              {completionRate}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Đã hoàn thành: <strong>{workload.completedTasks}</strong> /{" "}
              {workload.totalTasks} công việc
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Thanh tìm kiếm & lọc nhanh */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        sx={{ mb: 3 }}
      >
        <TextField
          size="small"
          placeholder="Tìm theo mã, tên dự án, hạng mục hoặc tên công việc..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          sx={{ minWidth: { sm: 360 } }}
        />
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Hiển thị:
          </Typography>
          <Select
            size="small"
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value as FilterMode)}
            sx={{ minWidth: 220 }}
          >
            <MenuItem value="ACTIVE">Đang tham gia (chưa hoàn thành)</MenuItem>
            <MenuItem value="ALL">Tất cả dự án & công việc</MenuItem>
            <MenuItem value="OVERDUE">Chỉ mục đang quá hạn</MenuItem>
            <MenuItem value="COMPLETED">Đã hoàn thành</MenuItem>
          </Select>
        </Stack>
      </Stack>

      {/* ================= BẢNG 1: DỰ ÁN THAM GIA ================= */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
        <AccountTreeOutlinedIcon color="primary" fontSize="small" />
        <Typography variant="subtitle1" fontWeight={700}>
          1. Danh sách dự án tham gia ({filteredProjects.length})
        </Typography>
      </Stack>

      {filteredProjects.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            mb: 4,
            textAlign: "center",
            color: "text.secondary",
            bgcolor: "#fafafa",
          }}
        >
          Không có dự án nào phù hợp với bộ lọc hiện tại.
        </Paper>
      ) : (
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{ mb: 4, borderRadius: 2 }}
        >
          <Table size="small">
            <TableHead sx={{ bgcolor: "#f8fafc" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Mã DA</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Tên dự án / Chủ đầu tư</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Vai trò đảm nhận</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>CV của nhân sự</TableCell>
                <TableCell sx={{ fontWeight: 700, minWidth: 140 }}>Tiến độ DA</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Ngày bàn giao</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProjects.map((proj) => {
                const stateMeta = PROJECT_STATE_META[proj.state] || {
                  label: proj.state,
                  color: "default" as const,
                };
                const pct = Math.min(
                  100,
                  Math.max(0, Number(proj.progressPercent ?? 0))
                );
                return (
                  <TableRow key={proj.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{proj.code}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {proj.name}
                      </Typography>
                      {proj.owner && (
                        <Typography variant="caption" color="text.secondary">
                          CĐT: {proj.owner}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                        {(proj.rolesInProject || []).map((r) => (
                          <Chip
                            key={r}
                            size="small"
                            variant="outlined"
                            color={r === "MANAGER" ? "primary" : "default"}
                            label={PROJECT_ROLE_LABELS[r] || r}
                          />
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        <strong>{proj.staffActiveTaskCount}</strong> đang làm /{" "}
                        {proj.staffTaskCount} CV
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography variant="caption" fontWeight={600}>
                          {pct.toFixed(0)}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={pct}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {proj.deliveryDate ? (
                        <Stack spacing={0.5} alignItems="flex-start">
                          <Typography variant="body2">
                            {moment(proj.deliveryDate).format("DD/MM/YYYY")}
                          </Typography>
                          {proj.overdue && (
                            <Chip size="small" color="error" label="Quá hạn bàn giao" />
                          )}
                        </Stack>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        color={stateMeta.color}
                        label={stateMeta.label}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Xem thông tin dự án">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() =>
                            router.push({
                              pathname: `${ROUTES.PROJECT}/${proj.id}`,
                              query: { actionType: "VIEW" },
                            })
                          }
                        >
                          <OpenInNewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xem tiến độ & công việc dự án">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() =>
                            router.push({
                              pathname: `${ROUTES.PROGRESS_PROJECT}/${proj.id}`,
                              query: { actionType: "VIEW" },
                            })
                          }
                        >
                          <TimelineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Divider sx={{ my: 3 }} />

      {/* ================= BẢNG 2: CÔNG VIỆC PHÂN CÔNG / DUYỆT ================= */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
        <AssignmentOutlinedIcon color="primary" fontSize="small" />
        <Typography variant="subtitle1" fontWeight={700}>
          2. Danh sách công việc đảm nhận ({filteredTasks.length})
        </Typography>
      </Stack>

      {filteredTasks.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            textAlign: "center",
            color: "text.secondary",
            bgcolor: "#fafafa",
          }}
        >
          Không có công việc nào phù hợp với bộ lọc hiện tại.
        </Paper>
      ) : (
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          <Table size="small">
            <TableHead sx={{ bgcolor: "#f8fafc" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Mã CV</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Công việc</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Dự án / Hạng mục</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Vai trò</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Độ ưu tiên</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Hạn hoàn thành</TableCell>
                <TableCell sx={{ fontWeight: 700, minWidth: 110 }}>Tiến độ</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.map((task) => {
                const tState = TASK_STATE_META[task.state] || {
                  label: task.state,
                  color: "default" as const,
                };
                const prio = task.priorityLevel
                  ? PRIORITY_META[task.priorityLevel]
                  : null;
                const pct = Math.min(
                  100,
                  Math.max(0, Number(task.progressPercent ?? 0))
                );

                return (
                  <TableRow key={task.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{task.code}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {task.name}
                      </Typography>
                      {task.parentTaskName && (
                        <Typography variant="caption" color="text.secondary">
                          Thuộc CV cha: {task.parentTaskCode} - {task.parentTaskName}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {task.projectName ? (
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "primary.main",
                              cursor: task.projectId ? "pointer" : "default",
                              fontWeight: 500,
                              "&:hover": task.projectId
                                ? { textDecoration: "underline" }
                                : undefined,
                            }}
                            onClick={() => {
                              if (task.projectId) {
                                router.push({
                                  pathname: `${ROUTES.PROGRESS_PROJECT}/${task.projectId}`,
                                  query: { actionType: "VIEW" },
                                });
                              }
                            }}
                          >
                            {task.projectCode ? `${task.projectCode} - ` : ""}
                            {task.projectName}
                          </Typography>
                          {task.progressName && (
                            <Typography variant="caption" color="text.secondary">
                              Hạng mục: {task.progressName}
                            </Typography>
                          )}
                        </Box>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          Chưa gắn dự án
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                        {(task.rolesInTask || []).map((r) => (
                          <Chip
                            key={r}
                            size="small"
                            variant="outlined"
                            color={r === "ASSIGNEE" ? "primary" : "secondary"}
                            label={TASK_ROLE_LABELS[r] || r}
                          />
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {prio ? (
                        <Chip size="small" color={prio.color} label={prio.label} />
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      {task.endDate ? (
                        <Stack spacing={0.5} alignItems="flex-start">
                          <Typography variant="body2">
                            {moment(task.endDate).format("DD/MM/YYYY")}
                          </Typography>
                          {task.overdue && (
                            <Chip size="small" color="error" label="Quá hạn" />
                          )}
                          {!task.overdue && task.dueSoon && (
                            <Chip
                              size="small"
                              color="warning"
                              label="Sắp đến hạn"
                            />
                          )}
                        </Stack>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography variant="caption" fontWeight={600}>
                          {pct.toFixed(0)}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={pct}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        color={tState.color}
                        label={tState.label}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
