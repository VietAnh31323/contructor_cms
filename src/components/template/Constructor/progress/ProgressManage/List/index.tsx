import { CoreBreadcrumbs } from "@/components/atoms/CoreBreadcrumbs";
import { CoreButton } from "@/components/atoms/CoreButton";
import { CoreTable } from "@/components/organism/CoreTable";
import PageContainer from "@/components/organism/PageContainer";
import { ProjectState } from "@/service/constructor/Project/getList/type";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { PROJECT_FILTER_STATE_OPTIONS } from "../../../constructionProject/constants";
import useProgressManageList, { ScheduleFilter } from "./useProgressManageList";

const KPI_CARDS: { key: ScheduleFilter; label: string; color: string; bg: string }[] = [
  { key: "ALL", label: "Dự án đang theo dõi", color: "#1d4ed8", bg: "#eff6ff" },
  { key: "OVERDUE", label: "Có việc trễ hạn", color: "#dc2626", bg: "#fef2f2" },
  { key: "AT_RISK", label: "Nguy cơ trễ", color: "#d97706", bg: "#fffbeb" },
  { key: "PENDING_REVIEW", label: "Có việc chờ duyệt", color: "#7c3aed", bg: "#f5f3ff" },
  { key: "ON_TRACK", label: "Đúng tiến độ", color: "#16a34a", bg: "#f0fdf4" },
];

export default function ProgressManageList() {
  const [value, handle] = useProgressManageList();
  const {
    columns,
    tableData,
    isLoading,
    kpi,
    searchInput,
    stateInput,
    scheduleFilter,
    canScan,
    scanning,
    page,
    size,
    totalPages,
    totalElements,
  } = value;
  const {
    setSearchInput,
    setStateInput,
    setScheduleFilter,
    onSearch,
    onReset,
    onChangePageSize,
    onRowClick,
    onScanOverdue,
  } = handle;

  const kpiValue = (k: ScheduleFilter) =>
    k === "ALL" ? kpi.total : k === "OVERDUE" ? kpi.overdue : k === "AT_RISK" ? kpi.atRisk : k === "PENDING_REVIEW" ? kpi.pending : kpi.onTrack;

  return (
    <PageContainer title={<CoreBreadcrumbs breadcrumbs={[{ title: "Quản lý tiến độ dự án" }]} />}>
      <Grid container spacing={1.5} sx={{ pt: 1, pb: 2 }}>
        {KPI_CARDS.map((c) => {
          const active = scheduleFilter === c.key;
          return (
            <Grid item xs={6} sm={4} md={2.4} key={c.key}>
              <Paper
                variant="outlined"
                onClick={() => setScheduleFilter(active && c.key !== "ALL" ? "ALL" : c.key)}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  cursor: "pointer",
                  borderTop: `3px solid ${c.color}`,
                  bgcolor: active ? c.bg : "#fff",
                  borderColor: active ? c.color : undefined,
                }}
              >
                <Typography variant="caption" fontWeight={700} sx={{ color: c.color }}>
                  {c.label}
                </Typography>
                <Typography variant="h6" fontWeight={800}>
                  {kpiValue(c.key)}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearch();
        }}
      >
        <Grid container spacing={2} alignItems="center" sx={{ pb: 2 }}>
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              size="small"
              label="Tìm kiếm"
              placeholder="Mã dự án, tên công trình, khách hàng..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Giai đoạn vòng đời</InputLabel>
              <Select
                label="Giai đoạn vòng đời"
                value={stateInput}
                onChange={(e) => setStateInput(e.target.value as ProjectState | "")}
              >
                <MenuItem value="">Tất cả</MenuItem>
                {PROJECT_FILTER_STATE_OPTIONS.filter((o: any) => o.value).map((o: any) => (
                  <MenuItem key={o.value} value={o.value}>
                    {o.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={1.5} justifyContent={{ xs: "flex-start", md: "flex-end" }}>
              <CoreButton theme="cancel" onClick={onReset}>
                Đặt lại
              </CoreButton>
              <CoreButton theme="submit" type="submit">
                Tìm kiếm
              </CoreButton>
            </Stack>
          </Grid>
        </Grid>
      </form>

      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={1} sx={{ pb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Tổng số: <strong>{totalElements}</strong> dự án • Nhấn vào dòng để quản lý giai đoạn, Gantt & duyệt công việc
        </Typography>
        {canScan && (
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<NotificationsActiveOutlinedIcon fontSize="small" />}
            onClick={onScanOverdue}
            disabled={scanning}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            {scanning ? "Đang quét..." : "Quét & gửi cảnh báo trễ hạn"}
          </Button>
        )}
      </Stack>

      <CoreTable
        tableName="progress-manage-list"
        columns={columns}
        data={tableData}
        page={page}
        size={size}
        totalPages={totalPages}
        isLoading={isLoading}
        onChangePageSize={onChangePageSize}
        onRowClick={onRowClick}
        isShowColumnStt
      />
    </PageContainer>
  );
}
