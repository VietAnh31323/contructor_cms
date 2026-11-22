import { CoreBreadcrumbs } from "@/components/atoms/CoreBreadcrumbs";
import CoreLoading from "@/components/molecules/CoreLoading";
import PageContainer from "@/components/organism/PageContainer";
import { formatVnd } from "@/components/template/Constructor/customer/constants";
import { ROUTES } from "@/routes";
import {
  downloadExcelFromUrl,
  useDashboardOverviewQuery,
  useProjectReportsQuery,
} from "@/service/constructor/Dashboard";
import { useProjectListQuery } from "@/service/constructor/Project/getList";
import { toastError } from "@/toast";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import ConstructionOutlinedIcon from "@mui/icons-material/ConstructionOutlined";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
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
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

const STATE_COLORS = [
  "#3b82f6",
  "#06b6d4",
  "#8b5cf6",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#14b8a6",
  "#6366f1",
  "#64748b",
  "#f97316",
  "#ef4444",
];

function formatCompactMoney(val: number): string {
  const n = Number(val || 0);
  if (Math.abs(n) >= 1_000_000_000) {
    return `${(n / 1_000_000_000).toFixed(2)} tỷ`;
  }
  if (Math.abs(n) >= 1_000_000) {
    return `${(n / 1_000_000).toFixed(1)} tr`;
  }
  return n.toLocaleString("vi-VN");
}

export default function StatisticsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"OVERVIEW" | "REPORT">("OVERVIEW");
  const [alertFilter, setAlertFilter] = useState<"ALL" | "OVERDUE" | "PAYMENT">(
    "ALL"
  );
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );
  const [exporting, setExporting] = useState(false);

  const {
    data: overview,
    isLoading: loadingOverview,
    refetch: refetchOverview,
    isFetching: fetchingOverview,
  } = useDashboardOverviewQuery();
  const {
    data: reportResp,
    isLoading: loadingReport,
    refetch: refetchReport,
  } = useProjectReportsQuery(selectedProjectId);
  const { data: projectListResp } = useProjectListQuery({ page: 0, size: 100 });
  const projects = projectListResp?.data?.content ?? [];
  const selectedProject =
    projects.find((p) => p.id === selectedProjectId) ?? null;

  const states = overview?.projectsByState ?? [];
  const totalStateCount = Math.max(
    1,
    states.reduce((s, item) => s + Number(item.count || 0), 0)
  );

  const donutSegments = useMemo(() => {
    const r = 68;
    const circumference = 2 * Math.PI * r;
    let offset = 0;
    return states.map((st, idx) => {
      const count = Number(st.count || 0);
      const len = (count / totalStateCount) * circumference;
      const seg = {
        ...st,
        color: STATE_COLORS[idx % STATE_COLORS.length],
        dashArray: `${Math.max(0, len - 2)} ${circumference}`,
        dashOffset: -offset,
        pct: Math.round((count / totalStateCount) * 100),
      };
      offset += len;
      return seg;
    });
  }, [states, totalStateCount]);

  const activeHoveredSegment = donutSegments.find(
    (s) => s.state === hoveredState
  );

  const cashflow = overview?.monthlyCashflow ?? [];
  const maxCashflow = Math.max(
    1,
    ...cashflow.map((m) =>
      Math.max(Number(m.collectedAmount || 0), Number(m.plannedAmount || 0))
    )
  );

  const trendPath = useMemo(() => {
    if (!cashflow.length) return "";
    return cashflow
      .map((m, idx) => {
        const x = 76 + idx * 82 + 12;
        const y = 175 - (Number(m.collectedAmount || 0) / maxCashflow) * 140;
        return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  }, [cashflow, maxCashflow]);

  const allAlerts = overview?.alerts ?? [];
  const overdueAlertCount = allAlerts.filter(
    (a) => a.alertType === "OVERDUE_PROJECT" || a.alertType === "OVERDUE_TASK"
  ).length;
  const paymentAlertCount = allAlerts.filter(
    (a) => a.alertType === "PAYMENT_DUE"
  ).length;

  const filteredAlerts = useMemo(() => {
    if (alertFilter === "OVERDUE") {
      return allAlerts.filter(
        (a) =>
          a.alertType === "OVERDUE_PROJECT" || a.alertType === "OVERDUE_TASK"
      );
    }
    if (alertFilter === "PAYMENT") {
      return allAlerts.filter((a) => a.alertType === "PAYMENT_DUE");
    }
    return allAlerts;
  }, [allAlerts, alertFilter]);

  const topProjects = useMemo(() => {
    return (reportResp?.projects ?? []).slice(0, 5);
  }, [reportResp?.projects]);

  const totalSteelTons = useMemo(() => {
    const kg = (reportResp?.projects ?? []).reduce(
      (sum, p) => sum + Number(p.totalSteelWeightKg || 0),
      0
    );
    return kg / 1000;
  }, [reportResp?.projects]);

  const collectionRate =
    Number(overview?.totalContractValue || 0) > 0
      ? Math.min(
          100,
          Math.round(
            (Number(overview?.totalCollectedAmount || 0) /
              Number(overview?.totalContractValue || 1)) *
              100
          )
        )
      : 0;

  const handleExportProjectReport = async () => {
    try {
      setExporting(true);
      await downloadExcelFromUrl(
        "/api/v1/dashboard/project-report/export-excel",
        "bao-cao-du-an.xlsx",
        selectedProjectId ? { projectId: selectedProjectId } : undefined
      );
    } catch (err) {
      toastError(err, "Xuất Excel báo cáo dự án thất bại");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="flex-start"
      sx={{ minHeight: "100vh", overflowY: "auto", bgcolor: "#f1f5f9" }}
    >
      <PageContainer
        title={
          <CoreBreadcrumbs
            breadcrumbs={[{ title: "Trung tâm điều hành & Báo cáo" }]}
          />
        }
      >
        <Box sx={{ pb: 5 }}>
          {/* ================= EXECUTIVE HERO BANNER ================= */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3.5 },
              mb: 3,
              borderRadius: 3,
              color: "#ffffff",
              background:
                "linear-gradient(135deg, #0f172a 0%, #1e3a8a 52%, #0284c7 100%)",
              boxShadow: "0 14px 34px rgba(15, 23, 42, 0.18)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={7}>
                <Chip
                  size="small"
                  label={`Cập nhật: ${moment().format("DD/MM/YYYY HH:mm")}`}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.14)",
                    color: "#e0f2fe",
                    fontWeight: 600,
                    mb: 1.5,
                  }}
                />
                <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: -0.3 }}>
                  Tổng quan Điều hành Thi công &amp; Tài chính
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.78)", mt: 0.75, maxWidth: 560 }}
                >
                  Theo dõi tức thời tiến độ công trường, công nợ phải thu, dòng
                  tiền kế hoạch và cảnh báo rủi ro trên toàn bộ dự án.
                </Typography>

                <Stack direction="row" spacing={1.2} flexWrap="wrap" sx={{ mt: 2.5 }}>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => router.push(`${ROUTES.PROJECT}/addNew`)}
                    sx={{
                      bgcolor: "#ffffff",
                      color: "#0f172a",
                      fontWeight: 700,
                      textTransform: "none",
                      "&:hover": { bgcolor: "#e2e8f0" },
                    }}
                  >
                    Tiếp nhận dự án
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<ConstructionOutlinedIcon />}
                    onClick={() => router.push(ROUTES.STEELSTATISTICS)}
                    sx={{
                      color: "#ffffff",
                      borderColor: "rgba(255,255,255,0.35)",
                      textTransform: "none",
                      "&:hover": {
                        borderColor: "#ffffff",
                        bgcolor: "rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    Thống kê thép
                  </Button>
                  <Tooltip title="Làm mới toàn bộ số liệu">
                    <IconButton
                      size="small"
                      onClick={() => {
                        refetchOverview();
                        refetchReport();
                      }}
                      disabled={fetchingOverview}
                      sx={{
                        color: "#ffffff",
                        border: "1px solid rgba(255,255,255,0.3)",
                      }}
                    >
                      <RefreshIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Grid>

              <Grid item xs={12} md={5}>
                <Grid container spacing={1.5}>
                  <Grid item xs={6}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "rgba(255,255,255,0.1)",
                        backdropFilter: "blur(6px)",
                      }}
                    >
                      <Typography variant="caption" sx={{ color: "#bae6fd" }}>
                        Tổng giá trị hợp đồng
                      </Typography>
                      <Typography variant="h6" fontWeight={800} sx={{ mt: 0.3 }}>
                        {formatCompactMoney(
                          Number(overview?.totalContractValue ?? 0)
                        )}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#e0f2fe" }}>
                        Đã thu: {collectionRate}%
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "rgba(255,255,255,0.1)",
                        backdropFilter: "blur(6px)",
                      }}
                    >
                      <Typography variant="caption" sx={{ color: "#bae6fd" }}>
                        Tổng thép kết cấu
                      </Typography>
                      <Typography variant="h6" fontWeight={800} sx={{ mt: 0.3 }}>
                        {totalSteelTons.toLocaleString("vi-VN", {
                          maximumFractionDigits: 1,
                        })}{" "}
                        tấn
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#e0f2fe" }}>
                        {overview?.totalProjects ?? 0} công trình
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        px: 2,
                        py: 1.3,
                        borderRadius: 2,
                        bgcolor: "rgba(16, 185, 129, 0.18)",
                        border: "1px solid rgba(16, 185, 129, 0.4)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="caption" fontWeight={600}>
                        Lợi nhuận tạm tính toàn hệ thống
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={800} color="#6ee7b7">
                        {formatVnd(reportResp?.totalEstimatedProfit ?? 0)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>

          {/* Tab Switcher */}
          <Paper
            elevation={0}
            sx={{
              px: 2,
              mb: 3,
              borderRadius: 2,
              border: "1px solid #e2e8f0",
              bgcolor: "#ffffff",
            }}
          >
            <Tabs value={tab} onChange={(_, v) => setTab(v)}>
              <Tab
                value="OVERVIEW"
                label="Tổng quan điều hành"
                sx={{ fontWeight: 700, textTransform: "none" }}
              />
              <Tab
                value="REPORT"
                label="Báo cáo theo dự án (Tiến độ • Chi phí • Lợi nhuận)"
                sx={{ fontWeight: 700, textTransform: "none" }}
              />
            </Tabs>
          </Paper>

          {tab === "OVERVIEW" && (
            <>
              {loadingOverview ? (
                <Box className="py-12 flex justify-center">
                  <CoreLoading />
                </Box>
              ) : (
                <Stack spacing={3}>
                  {/* ================= 4 ELEVATED KPI CARDS ================= */}
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          borderRadius: 2.5,
                          border: "1px solid #e2e8f0",
                          bgcolor: "#ffffff",
                          transition: "all 0.2s",
                          "&:hover": {
                            transform: "translateY(-3px)",
                            boxShadow: "0 12px 24px rgba(15,23,42,0.08)",
                          },
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >
                          <Box>
                            <Typography
                              variant="caption"
                              fontWeight={700}
                              color="text.secondary"
                            >
                              DỰ ÁN ĐANG CHẠY
                            </Typography>
                            <Typography variant="h4" fontWeight={800} sx={{ mt: 0.8 }}>
                              {overview?.activeProjects ?? 0}
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.secondary"
                                sx={{ ml: 0.8 }}
                              >
                                / {overview?.totalProjects ?? 0}
                              </Typography>
                            </Typography>
                          </Box>
                          <Avatar
                            sx={{
                              bgcolor: "#dbeafe",
                              color: "#2563eb",
                              width: 44,
                              height: 44,
                            }}
                          >
                            <BusinessCenterOutlinedIcon />
                          </Avatar>
                        </Stack>
                        <Box sx={{ mt: 2 }}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            sx={{ mb: 0.5 }}
                          >
                            <Typography variant="caption" color="text.secondary">
                              Tiến độ trung bình
                            </Typography>
                            <Typography variant="caption" fontWeight={700}>
                              {Number(
                                reportResp?.averageProgressPercent ?? 0
                              ).toFixed(1)}
                              %
                            </Typography>
                          </Stack>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(
                              100,
                              Number(reportResp?.averageProgressPercent ?? 0)
                            )}
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                        </Box>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          borderRadius: 2.5,
                          border: "1px solid #fee2e2",
                          bgcolor: "#ffffff",
                          transition: "all 0.2s",
                          "&:hover": {
                            transform: "translateY(-3px)",
                            boxShadow: "0 12px 24px rgba(220,38,38,0.08)",
                          },
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >
                          <Box>
                            <Typography
                              variant="caption"
                              fontWeight={700}
                              color="error.main"
                            >
                              CẢNH BÁO TRỄ HẠN
                            </Typography>
                            <Typography
                              variant="h4"
                              fontWeight={800}
                              color="error.main"
                              sx={{ mt: 0.8 }}
                            >
                              {overview?.overdueProjects ?? 0}
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.secondary"
                                sx={{ ml: 0.8 }}
                              >
                                DA • {overview?.overdueTasks ?? 0} việc
                              </Typography>
                            </Typography>
                          </Box>
                          <Avatar
                            sx={{
                              bgcolor: "#fee2e2",
                              color: "#dc2626",
                              width: 44,
                              height: 44,
                            }}
                          >
                            <WarningAmberRoundedIcon />
                          </Avatar>
                        </Stack>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                          sx={{ mt: 2 }}
                        >
                          {allAlerts.length} cảnh báo cần kiểm tra ngay
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          borderRadius: 2.5,
                          border: "1px solid #fef3c7",
                          bgcolor: "#ffffff",
                          transition: "all 0.2s",
                          "&:hover": {
                            transform: "translateY(-3px)",
                            boxShadow: "0 12px 24px rgba(217,119,6,0.08)",
                          },
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >
                          <Box>
                            <Typography
                              variant="caption"
                              fontWeight={700}
                              color="warning.dark"
                            >
                              CÔNG NỢ PHẢI THU
                            </Typography>
                            <Typography
                              variant="h4"
                              fontWeight={800}
                              color="warning.dark"
                              sx={{ mt: 0.8 }}
                            >
                              {formatCompactMoney(
                                Number(overview?.receivableTotal ?? 0)
                              )}
                            </Typography>
                          </Box>
                          <Avatar
                            sx={{
                              bgcolor: "#fef3c7",
                              color: "#d97706",
                              width: 44,
                              height: 44,
                            }}
                          >
                            <MonetizationOnOutlinedIcon />
                          </Avatar>
                        </Stack>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                          sx={{ mt: 2 }}
                        >
                          Thu tháng này:{" "}
                          <b style={{ color: "#16a34a" }}>
                            {formatVnd(overview?.collectedThisMonth ?? 0)}
                          </b>
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          borderRadius: 2.5,
                          border: "1px solid #dcfce7",
                          bgcolor: "#ffffff",
                          transition: "all 0.2s",
                          "&:hover": {
                            transform: "translateY(-3px)",
                            boxShadow: "0 12px 24px rgba(22,163,74,0.08)",
                          },
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >
                          <Box>
                            <Typography
                              variant="caption"
                              fontWeight={700}
                              color="success.dark"
                            >
                              CÔNG VIỆC CỦA TÔI
                            </Typography>
                            <Typography
                              variant="h4"
                              fontWeight={800}
                              color="success.dark"
                              sx={{ mt: 0.8 }}
                            >
                              {overview?.myOpenTasksCount ?? 0}
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.secondary"
                                sx={{ ml: 0.8 }}
                              >
                                việc mở
                              </Typography>
                            </Typography>
                          </Box>
                          <Avatar
                            sx={{
                              bgcolor: "#dcfce7",
                              color: "#16a34a",
                              width: 44,
                              height: 44,
                            }}
                          >
                            <AssignmentTurnedInOutlinedIcon />
                          </Avatar>
                        </Stack>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                          sx={{ mt: 2 }}
                        >
                          Đang chờ duyệt toàn hệ thống:{" "}
                          <b>{overview?.pendingApprovalTasks ?? 0}</b>
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  {/* ================= CHARTS ROW ================= */}
                  <Grid container spacing={2.5}>
                    {/* Donut Chart */}
                    <Grid item xs={12} md={5}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          borderRadius: 2.5,
                          border: "1px solid #e2e8f0",
                          bgcolor: "#ffffff",
                          height: "100%",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight={700}
                          sx={{ mb: 2 }}
                        >
                          Phân bổ dự án theo trạng thái
                        </Typography>
                        <Grid container spacing={2} alignItems="center">
                          <Grid
                            item
                            xs={12}
                            sm={5}
                            className="flex justify-center"
                          >
                            <svg width={180} height={180} viewBox="0 0 180 180">
                              <circle
                                cx="90"
                                cy="90"
                                r="68"
                                fill="transparent"
                                stroke="#f1f5f9"
                                strokeWidth="22"
                              />
                              {donutSegments.map((seg) => (
                                <circle
                                  key={seg.state}
                                  cx="90"
                                  cy="90"
                                  r="68"
                                  fill="transparent"
                                  stroke={seg.color}
                                  strokeWidth={
                                    hoveredState === seg.state ? 26 : 21
                                  }
                                  strokeDasharray={seg.dashArray}
                                  strokeDashoffset={seg.dashOffset}
                                  transform="rotate(-90 90 90)"
                                  style={{
                                    cursor: "pointer",
                                    transition: "stroke-width 0.18s ease",
                                  }}
                                  onMouseEnter={() =>
                                    setHoveredState(seg.state)
                                  }
                                  onMouseLeave={() => setHoveredState(null)}
                                />
                              ))}
                              <text
                                x="90"
                                y="84"
                                textAnchor="middle"
                                fontSize="24"
                                fontWeight="800"
                                fill="#0f172a"
                              >
                                {activeHoveredSegment
                                  ? activeHoveredSegment.count
                                  : overview?.totalProjects ?? 0}
                              </text>
                              <text
                                x="90"
                                y="104"
                                textAnchor="middle"
                                fontSize="11"
                                fill="#64748b"
                              >
                                {activeHoveredSegment
                                  ? `${activeHoveredSegment.label} (${activeHoveredSegment.pct}%)`
                                  : "Tổng dự án"}
                              </text>
                            </svg>
                          </Grid>
                          <Grid item xs={12} sm={7}>
                            <Stack spacing={0.8}>
                              {donutSegments.map((seg) => (
                                <Stack
                                  key={seg.state}
                                  direction="row"
                                  justifyContent="space-between"
                                  alignItems="center"
                                  onMouseEnter={() =>
                                    setHoveredState(seg.state)
                                  }
                                  onMouseLeave={() => setHoveredState(null)}
                                  sx={{
                                    px: 1.2,
                                    py: 0.5,
                                    borderRadius: 1.5,
                                    cursor: "pointer",
                                    bgcolor:
                                      hoveredState === seg.state
                                        ? "#f1f5f9"
                                        : "transparent",
                                  }}
                                >
                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                  >
                                    <Box
                                      sx={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: "50%",
                                        bgcolor: seg.color,
                                      }}
                                    />
                                    <Typography variant="body2">
                                      {seg.label}
                                    </Typography>
                                  </Stack>
                                  <Typography variant="body2" fontWeight={700}>
                                    {seg.count}{" "}
                                    <Typography
                                      component="span"
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      ({seg.pct}%)
                                    </Typography>
                                  </Typography>
                                </Stack>
                              ))}
                            </Stack>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>

                    {/* Combo Bar + Trendline Cashflow Chart */}
                    <Grid item xs={12} md={7}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          borderRadius: 2.5,
                          border: "1px solid #e2e8f0",
                          bgcolor: "#ffffff",
                          height: "100%",
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ mb: 1.5 }}
                        >
                          <Stack direction="row" spacing={1} alignItems="center">
                            <TrendingUpIcon color="success" />
                            <Typography variant="subtitle1" fontWeight={700}>
                              Dòng tiền 6 tháng gần nhất
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={2}>
                            <Stack
                              direction="row"
                              spacing={0.5}
                              alignItems="center"
                            >
                              <Box
                                sx={{
                                  width: 10,
                                  height: 10,
                                  bgcolor: "#10b981",
                                  borderRadius: 0.5,
                                }}
                              />
                              <Typography variant="caption">Thực thu</Typography>
                            </Stack>
                            <Stack
                              direction="row"
                              spacing={0.5}
                              alignItems="center"
                            >
                              <Box
                                sx={{
                                  width: 10,
                                  height: 10,
                                  bgcolor: "#f59e0b",
                                  borderRadius: 0.5,
                                }}
                              />
                              <Typography variant="caption">Kế hoạch</Typography>
                            </Stack>
                          </Stack>
                        </Stack>

                        <Box sx={{ width: "100%", overflowX: "auto" }}>
                          <svg width="100%" height={210} viewBox="0 0 580 210">
                            <defs>
                              <linearGradient
                                id="colGrad"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop offset="0%" stopColor="#10b981" />
                                <stop offset="100%" stopColor="#059669" />
                              </linearGradient>
                              <linearGradient
                                id="planGrad"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop offset="0%" stopColor="#fbbf24" />
                                <stop offset="100%" stopColor="#d97706" />
                              </linearGradient>
                            </defs>
                            {[0, 0.25, 0.5, 0.75, 1].map((g) => {
                              const y = 175 - g * 140;
                              return (
                                <g key={g}>
                                  <line
                                    x1="56"
                                    y1={y}
                                    x2="565"
                                    y2={y}
                                    stroke="#e2e8f0"
                                    strokeDasharray={g === 0 ? undefined : "3 3"}
                                  />
                                  <text
                                    x="48"
                                    y={y + 4}
                                    textAnchor="end"
                                    fontSize="10"
                                    fill="#64748b"
                                  >
                                    {formatCompactMoney(maxCashflow * g)}
                                  </text>
                                </g>
                              );
                            })}
                            {cashflow.map((m, idx) => {
                              const xBase = 76 + idx * 82;
                              const colH = Math.max(
                                3,
                                (Number(m.collectedAmount || 0) / maxCashflow) *
                                  140
                              );
                              const planH = Math.max(
                                3,
                                (Number(m.plannedAmount || 0) / maxCashflow) *
                                  140
                              );
                              return (
                                <g
                                  key={m.month}
                                  onMouseEnter={() => setHoveredMonth(idx)}
                                  onMouseLeave={() => setHoveredMonth(null)}
                                  style={{ cursor: "pointer" }}
                                >
                                  <rect
                                    x={xBase}
                                    y={175 - colH}
                                    width={22}
                                    height={colH}
                                    rx={4}
                                    fill="url(#colGrad)"
                                    opacity={
                                      hoveredMonth === null ||
                                      hoveredMonth === idx
                                        ? 1
                                        : 0.45
                                    }
                                  />
                                  <rect
                                    x={xBase + 26}
                                    y={175 - planH}
                                    width={22}
                                    height={planH}
                                    rx={4}
                                    fill="url(#planGrad)"
                                    opacity={
                                      hoveredMonth === null ||
                                      hoveredMonth === idx
                                        ? 1
                                        : 0.45
                                    }
                                  />
                                  <text
                                    x={xBase + 24}
                                    y={196}
                                    textAnchor="middle"
                                    fontSize="11"
                                    fontWeight={
                                      hoveredMonth === idx ? "700" : "500"
                                    }
                                    fill="#334155"
                                  >
                                    {m.month}
                                  </text>
                                </g>
                              );
                            })}
                            {trendPath && (
                              <path
                                d={trendPath}
                                fill="none"
                                stroke="#0284c7"
                                strokeWidth={2.2}
                              />
                            )}
                            {cashflow.map((m, idx) => {
                              const cx = 76 + idx * 82 + 12;
                              const cy =
                                175 -
                                (Number(m.collectedAmount || 0) / maxCashflow) *
                                  140;
                              return (
                                <circle
                                  key={`pt-${m.month}`}
                                  cx={cx}
                                  cy={cy}
                                  r={hoveredMonth === idx ? 5 : 3.5}
                                  fill="#ffffff"
                                  stroke="#0284c7"
                                  strokeWidth={2}
                                />
                              );
                            })}
                          </svg>
                        </Box>

                        <Box
                          sx={{
                            mt: 1,
                            px: 1.5,
                            py: 0.8,
                            borderRadius: 1.5,
                            bgcolor:
                              hoveredMonth !== null ? "#0f172a" : "#f8fafc",
                            color:
                              hoveredMonth !== null ? "#ffffff" : "#64748b",
                          }}
                        >
                          {hoveredMonth !== null && cashflow[hoveredMonth] ? (
                            <Typography variant="caption">
                              <b>Tháng {cashflow[hoveredMonth].month}</b> — Thực
                              thu:{" "}
                              <b style={{ color: "#34d399" }}>
                                {formatVnd(
                                  cashflow[hoveredMonth].collectedAmount
                                )}
                              </b>{" "}
                              • Kế hoạch:{" "}
                              <b style={{ color: "#fbbf24" }}>
                                {formatVnd(
                                  cashflow[hoveredMonth].plannedAmount
                                )}
                              </b>
                            </Typography>
                          ) : (
                            <Typography variant="caption">
                              Di chuột lên từng tháng trên biểu đồ để xem đối
                              chiếu Thực thu và Kế hoạch.
                            </Typography>
                          )}
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>

                  {/* ================= PROJECT HEALTH SNAPSHOT ================= */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: 2.5,
                      border: "1px solid #e2e8f0",
                      bgcolor: "#ffffff",
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 2 }}
                    >
                      <Typography variant="subtitle1" fontWeight={700}>
                        Sức khỏe Dự án &amp; Tài chính tiêu biểu
                      </Typography>
                      <Button
                        size="small"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => setTab("REPORT")}
                        sx={{ textTransform: "none", fontWeight: 600 }}
                      >
                        Xem báo cáo đầy đủ
                      </Button>
                    </Stack>

                    <Stack spacing={1.5}>
                      {topProjects.map((p) => {
                        const payPct =
                          Number(p.contractValue || 0) > 0
                            ? Math.min(
                                100,
                                Math.round(
                                  (Number(p.collectedAmount || 0) /
                                    Number(p.contractValue || 1)) *
                                    100
                                )
                              )
                            : 0;
                        return (
                          <Paper
                            key={p.projectId}
                            variant="outlined"
                            onClick={() =>
                              router.push(`/Constructor/Project/${p.projectId}`)
                            }
                            sx={{
                              p: 1.8,
                              borderRadius: 2,
                              cursor: "pointer",
                              transition: "all 0.15s",
                              "&:hover": {
                                borderColor: "primary.main",
                                bgcolor: "#f8fafc",
                              },
                            }}
                          >
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12} md={4}>
                                <Stack
                                  direction="row"
                                  spacing={1.5}
                                  alignItems="center"
                                >
                                  <Avatar
                                    sx={{
                                      bgcolor: p.overdue
                                        ? "#fee2e2"
                                        : "#dbeafe",
                                      color: p.overdue
                                        ? "#dc2626"
                                        : "#1d4ed8",
                                      fontWeight: 800,
                                      fontSize: 12,
                                    }}
                                  >
                                    {(p.projectCode || "DA").slice(0, 4)}
                                  </Avatar>
                                  <Box>
                                    <Typography variant="body2" fontWeight={700}>
                                      {p.projectName}
                                    </Typography>
                                    <Stack
                                      direction="row"
                                      spacing={1}
                                      alignItems="center"
                                    >
                                      <Chip
                                        size="small"
                                        label={p.stateLabel}
                                        color={p.overdue ? "error" : "primary"}
                                        variant="outlined"
                                        sx={{ height: 20, fontSize: 11 }}
                                      />
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                      >
                                        {p.completedPhases}/{p.totalPhases} giai
                                        đoạn
                                      </Typography>
                                    </Stack>
                                  </Box>
                                </Stack>
                              </Grid>

                              <Grid item xs={6} md={2.5}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Tiến độ:{" "}
                                  <b>
                                    {Number(p.progressPercent || 0).toFixed(0)}%
                                  </b>
                                </Typography>
                                <LinearProgress
                                  variant="determinate"
                                  value={Math.min(
                                    100,
                                    Number(p.progressPercent || 0)
                                  )}
                                  sx={{ height: 6, borderRadius: 3, mt: 0.5 }}
                                />
                              </Grid>

                              <Grid item xs={6} md={2.5}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Thu tiền: <b>{payPct}%</b> (
                                  {formatCompactMoney(p.collectedAmount)})
                                </Typography>
                                <LinearProgress
                                  variant="determinate"
                                  color="success"
                                  value={payPct}
                                  sx={{ height: 6, borderRadius: 3, mt: 0.5 }}
                                />
                              </Grid>

                              <Grid item xs={12} md={3} sx={{ textAlign: "right" }}>
                                <Typography variant="caption" color="text.secondary">
                                  LN tạm tính:{" "}
                                  <b
                                    style={{
                                      color:
                                        p.estimatedProfit >= 0
                                          ? "#16a34a"
                                          : "#dc2626",
                                    }}
                                  >
                                    {formatCompactMoney(p.estimatedProfit)} (
                                    {Number(p.profitMarginPercent || 0).toFixed(
                                      1
                                    )}
                                    %)
                                  </b>
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  display="block"
                                >
                                  Thép:{" "}
                                  <b>
                                    {(
                                      Number(p.totalSteelWeightKg || 0) / 1000
                                    ).toFixed(2)}{" "}
                                    tấn
                                  </b>
                                </Typography>
                              </Grid>
                            </Grid>
                          </Paper>
                        );
                      })}
                    </Stack>
                  </Paper>

                  {/* ================= ALERTS & MY TASKS ================= */}
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} md={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          borderRadius: 2.5,
                          border: "1px solid #e2e8f0",
                          bgcolor: "#ffffff",
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ mb: 1.5 }}
                          flexWrap="wrap"
                          gap={1}
                        >
                          <Stack direction="row" spacing={1} alignItems="center">
                            <NotificationsActiveOutlinedIcon color="error" />
                            <Typography variant="subtitle1" fontWeight={700}>
                              Trung tâm cảnh báo ({filteredAlerts.length})
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={0.5}>
                            <Chip
                              size="small"
                              label={`Tất cả (${allAlerts.length})`}
                              color={
                                alertFilter === "ALL" ? "primary" : "default"
                              }
                              onClick={() => setAlertFilter("ALL")}
                            />
                            <Chip
                              size="small"
                              label={`Trễ hạn (${overdueAlertCount})`}
                              color={
                                alertFilter === "OVERDUE" ? "error" : "default"
                              }
                              onClick={() => setAlertFilter("OVERDUE")}
                            />
                            <Chip
                              size="small"
                              label={`Thanh toán (${paymentAlertCount})`}
                              color={
                                alertFilter === "PAYMENT"
                                  ? "warning"
                                  : "default"
                              }
                              onClick={() => setAlertFilter("PAYMENT")}
                            />
                          </Stack>
                        </Stack>
                        <Divider sx={{ mb: 1.5 }} />
                        {filteredAlerts.length === 0 ? (
                          <Alert severity="success">
                            Không có cảnh báo nào trong nhóm này.
                          </Alert>
                        ) : (
                          <Stack
                            spacing={1}
                            sx={{ maxHeight: 350, overflowY: "auto" }}
                          >
                            {filteredAlerts.map((a, idx) => (
                              <Alert
                                key={idx}
                                severity={
                                  a.severity === "ERROR"
                                    ? "error"
                                    : a.severity === "WARNING"
                                    ? "warning"
                                    : "info"
                                }
                                action={
                                  a.link ? (
                                    <Button
                                      color="inherit"
                                      size="small"
                                      onClick={() => router.push(a.link!)}
                                    >
                                      Xem
                                    </Button>
                                  ) : undefined
                                }
                              >
                                <Typography variant="body2" fontWeight={700}>
                                  {a.title}
                                </Typography>
                                <Typography variant="caption">
                                  {a.subtitle}
                                </Typography>
                              </Alert>
                            ))}
                          </Stack>
                        )}
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          borderRadius: 2.5,
                          border: "1px solid #e2e8f0",
                          bgcolor: "#ffffff",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight={700}
                          sx={{ mb: 1.5 }}
                        >
                          Việc cần làm của tôi ({overview?.myOpenTasksCount ?? 0}
                          )
                        </Typography>
                        <Divider sx={{ mb: 1.5 }} />
                        {(overview?.myTasks?.length ?? 0) === 0 ? (
                          <Typography variant="body2" color="text.secondary">
                            Bạn chưa có công việc đang thực hiện nào.
                          </Typography>
                        ) : (
                          <Stack
                            spacing={1.2}
                            sx={{ maxHeight: 350, overflowY: "auto" }}
                          >
                            {(overview?.myTasks ?? []).map((t) => (
                              <Paper
                                key={t.id}
                                variant="outlined"
                                onClick={() =>
                                  t.projectId &&
                                  router.push(
                                    `/Constructor/Project/${t.projectId}`
                                  )
                                }
                                sx={{
                                  p: 1.4,
                                  borderRadius: 2,
                                  cursor: "pointer",
                                  "&:hover": {
                                    borderColor: "primary.main",
                                    bgcolor: "#f8fafc",
                                  },
                                }}
                              >
                                <Stack
                                  direction="row"
                                  justifyContent="space-between"
                                  alignItems="center"
                                  spacing={1.5}
                                >
                                  <Stack
                                    direction="row"
                                    spacing={1.5}
                                    alignItems="center"
                                  >
                                    <Box
                                      sx={{
                                        position: "relative",
                                        display: "inline-flex",
                                      }}
                                    >
                                      <CircularProgress
                                        variant="determinate"
                                        size={38}
                                        value={Math.min(
                                          100,
                                          Number(t.progressPercent || 0)
                                        )}
                                        color={t.overdue ? "error" : "primary"}
                                      />
                                      <Box
                                        sx={{
                                          inset: 0,
                                          position: "absolute",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        <Typography
                                          variant="caption"
                                          fontWeight={700}
                                          fontSize={10}
                                        >
                                          {Number(
                                            t.progressPercent || 0
                                          ).toFixed(0)}
                                          %
                                        </Typography>
                                      </Box>
                                    </Box>
                                    <Box>
                                      <Typography
                                        variant="body2"
                                        fontWeight={700}
                                      >
                                        {t.code} - {t.name}
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                      >
                                        {t.projectName || "Dự án"} • Hạn:{" "}
                                        {t.endDate
                                          ? moment(t.endDate).format(
                                              "DD/MM/YYYY"
                                            )
                                          : "—"}
                                      </Typography>
                                    </Box>
                                  </Stack>
                                  <Chip
                                    size="small"
                                    label={t.stateLabel}
                                    color={t.overdue ? "error" : "primary"}
                                    variant="outlined"
                                  />
                                </Stack>
                              </Paper>
                            ))}
                          </Stack>
                        )}
                      </Paper>
                    </Grid>
                  </Grid>
                </Stack>
              )}
            </>
          )}

          {tab === "REPORT" && (
            <Stack spacing={2.5}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                spacing={2}
              >
                <Autocomplete
                  size="small"
                  sx={{ minWidth: 320, bgcolor: "#ffffff" }}
                  options={projects}
                  value={selectedProject}
                  getOptionLabel={(opt) =>
                    opt.code ? `${opt.code} - ${opt.name}` : opt.name
                  }
                  isOptionEqualToValue={(o, v) => o.id === v.id}
                  onChange={(_, val) => setSelectedProjectId(val ? val.id : null)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Lọc theo dự án"
                      placeholder="Tất cả dự án"
                    />
                  )}
                />

                <Button
                  variant="contained"
                  color="success"
                  startIcon={<FileDownloadIcon />}
                  disabled={exporting}
                  onClick={handleExportProjectReport}
                >
                  {exporting ? "Đang xuất..." : "Xuất Excel báo cáo dự án"}
                </Button>
              </Stack>

              {loadingReport ? (
                <Box className="py-12 flex justify-center">
                  <CoreLoading />
                </Box>
              ) : (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={2.4}>
                      <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: "1px solid #e2e8f0" }}>
                        <Typography variant="caption" color="text.secondary">
                          Tổng giá trị HĐ
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={800}>
                          {formatVnd(reportResp?.totalContractValue ?? 0)}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                      <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: "1px solid #e2e8f0" }}>
                        <Typography variant="caption" color="text.secondary">
                          Đã thu
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          fontWeight={800}
                          color="success.dark"
                        >
                          {formatVnd(reportResp?.totalCollected ?? 0)}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                      <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: "1px solid #e2e8f0" }}>
                        <Typography variant="caption" color="text.secondary">
                          Còn phải thu
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          fontWeight={800}
                          color="warning.dark"
                        >
                          {formatVnd(reportResp?.totalReceivable ?? 0)}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                      <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: "1px solid #e2e8f0" }}>
                        <Typography variant="caption" color="text.secondary">
                          Chi phí dự toán
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={800}>
                          {formatVnd(reportResp?.totalEstimatedCost ?? 0)}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                      <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: "1px solid #e2e8f0" }}>
                        <Typography variant="caption" color="text.secondary">
                          Lợi nhuận tạm tính
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          fontWeight={800}
                          color="primary.main"
                        >
                          {formatVnd(reportResp?.totalEstimatedProfit ?? 0)}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{ borderRadius: 2.5, border: "1px solid #e2e8f0" }}
                  >
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#f8fafc" }}>
                          <TableCell sx={{ fontWeight: 700 }}>Dự án</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>
                            Trạng thái
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700 }} align="right">
                            Tiến độ (%)
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700 }} align="right">
                            Giá trị HĐ
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700 }} align="right">
                            Đã thu
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700 }} align="right">
                            Còn phải thu
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700 }} align="right">
                            Chi phí dự toán
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700 }} align="right">
                            Lợi nhuận tạm tính
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700 }} align="right">
                            Thép (kg)
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(reportResp?.projects ?? []).map((p) => (
                          <TableRow
                            key={p.projectId}
                            hover
                            sx={{ cursor: "pointer" }}
                            onClick={() =>
                              router.push(`/Constructor/Project/${p.projectId}`)
                            }
                          >
                            <TableCell>
                              <Typography variant="body2" fontWeight={700}>
                                {p.projectCode} - {p.projectName}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {p.customerName || "—"}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                size="small"
                                label={p.stateLabel}
                                color={p.overdue ? "error" : "primary"}
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>
                              {Number(p.progressPercent || 0).toFixed(1)}%
                            </TableCell>
                            <TableCell align="right">
                              {formatVnd(p.contractValue)}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ color: "success.dark" }}
                            >
                              {formatVnd(p.collectedAmount)}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ color: "warning.dark" }}
                            >
                              {formatVnd(p.remainingReceivable)}
                            </TableCell>
                            <TableCell align="right">
                              {formatVnd(p.estimatedCost)}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{
                                fontWeight: 700,
                                color:
                                  p.estimatedProfit >= 0
                                    ? "primary.main"
                                    : "error.main",
                              }}
                            >
                              {formatVnd(p.estimatedProfit)} (
                              {Number(p.profitMarginPercent || 0).toFixed(1)}%)
                            </TableCell>
                            <TableCell align="right">
                              {Number(
                                p.totalSteelWeightKg || 0
                              ).toLocaleString("vi-VN", {
                                maximumFractionDigits: 1,
                              })}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
            </Stack>
          )}
        </Box>
      </PageContainer>
    </Grid>
  );
}
