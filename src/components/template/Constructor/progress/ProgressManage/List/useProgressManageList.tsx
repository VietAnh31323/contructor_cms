import { usePermission } from "@/components/hooks/permission/usePermission";
import { ColumnProps } from "@/components/organism/CoreTable";
import { PERMISSIONS } from "@/helper/permissions";
import { ROUTES } from "@/routes";
import { useProjectListQuery } from "@/service/constructor/Project/getList";
import { ProjectState } from "@/service/constructor/Project/getList/type";
import { scanOverdueNow } from "@/service/constructor/Notification";
import {
  ProjectProgressSummary,
  useProjectProgressSummariesQuery,
} from "@/service/constructor/ProjectProgress";
import { toastError, toastSuccess } from "@/toast";
import { Chip, LinearProgress, Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import router from "next/router";
import { useMemo, useState } from "react";
import {
  normalizeProjectState,
  PROJECT_STATE_META,
} from "../../../constructionProject/constants";
import { SCHEDULE_STATUS_META } from "../../shared/constants";

export type ScheduleFilter = "ALL" | "OVERDUE" | "AT_RISK" | "PENDING_REVIEW" | "ON_TRACK";

const fmt = (d?: string | null) => (d ? moment(d).format("DD/MM/YYYY") : "—");

/**
 * 2.24: Màn Quản lý tiến độ – dữ liệu thật từ API dự án + tổng hợp tiến độ (project-progress/summary).
 */
const useProgressManageList = () => {
  const queryClient = useQueryClient();
  const { hasPermission } = usePermission();
  const canScan = hasPermission([PERMISSIONS.PROGRESS_UPDATE, PERMISSIONS.PROJECT_UPDATE]);

  const [searchInput, setSearchInput] = useState("");
  const [stateInput, setStateInput] = useState<ProjectState | "">("");
  const [scheduleFilter, setScheduleFilter] = useState<ScheduleFilter>("ALL");
  const [query, setQuery] = useState<{ search?: string; state?: ProjectState | ""; page: number; size: number }>({
    page: 0,
    size: 20,
  });
  const [scanning, setScanning] = useState(false);

  const { data, isLoading } = useProjectListQuery(query as any);
  const projects = data?.data?.content ?? [];
  const projectIds = useMemo(() => projects.map((p) => p.id), [projects]);
  const { data: summaries = [], isLoading: loadingSummary } = useProjectProgressSummariesQuery(projectIds);

  const summaryMap = useMemo(() => {
    const m = new Map<number, ProjectProgressSummary>();
    summaries.forEach((s) => m.set(s.projectId, s));
    return m;
  }, [summaries]);

  const kpi = useMemo(() => {
    let overdue = 0;
    let atRisk = 0;
    let pending = 0;
    let onTrack = 0;
    summaries.forEach((s) => {
      if (s.scheduleStatus === "OVERDUE" || s.overdueTasks > 0) overdue++;
      else if (s.scheduleStatus === "AT_RISK") atRisk++;
      else onTrack++;
      if (s.pendingReviewTasks > 0) pending++;
    });
    return { overdue, atRisk, pending, onTrack, total: projects.length };
  }, [summaries, projects.length]);

  const columns = useMemo(
    () =>
      [
        { header: "Mã dự án", fieldName: "code", styleCell: { style: { minWidth: 100, fontWeight: 600 } } },
        { header: "Công trình / Chủ đầu tư", fieldName: "nameDisplay", styleCell: { style: { minWidth: 220 } } },
        { header: "Chủ nhiệm dự án", fieldName: "managerDisplay", styleCell: { style: { minWidth: 140 } } },
        { header: "Tiến độ (tự tính)", fieldName: "progressDisplay", styleCell: { style: { minWidth: 150 } } },
        { header: "Công việc", fieldName: "taskDisplay", styleCell: { style: { minWidth: 190 } } },
        { header: "Hạn kế hoạch", fieldName: "deadlineDisplay", styleCell: { style: { minWidth: 140 } } },
        { header: "Tình trạng tiến độ", fieldName: "scheduleDisplay", styleCell: { style: { minWidth: 150 } } },
        { header: "Vòng đời", fieldName: "stateDisplay", styleCell: { style: { minWidth: 120 } } },
      ] as ColumnProps[],
    []
  );

  const tableData = useMemo(() => {
    return projects
      .filter((p) => {
        if (scheduleFilter === "ALL") return true;
        const s = summaryMap.get(p.id);
        if (!s) return false;
        if (scheduleFilter === "OVERDUE") return s.scheduleStatus === "OVERDUE" || s.overdueTasks > 0;
        if (scheduleFilter === "AT_RISK") return s.scheduleStatus === "AT_RISK";
        if (scheduleFilter === "PENDING_REVIEW") return s.pendingReviewTasks > 0;
        return s.scheduleStatus === "ON_TRACK" || s.scheduleStatus === "COMPLETED_ON_TIME";
      })
      .map((p) => {
        const s = summaryMap.get(p.id);
        const pct = Math.min(100, Math.max(0, Number(s?.progressPercent ?? p.progressPercent ?? 0)));
        const sch = s?.scheduleStatus ? SCHEDULE_STATUS_META[s.scheduleStatus] : null;
        const st = normalizeProjectState(p.state);
        const stMeta = PROJECT_STATE_META[st] || PROJECT_STATE_META.RECEIVED;
        return {
          ...p,
          nameDisplay: (
            <Stack spacing={0.25}>
              <Typography variant="body2" fontWeight={600}>
                {p.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {p.customer?.name || p.owner || "—"}
              </Typography>
            </Stack>
          ),
          managerDisplay: p.manager?.name || "Chưa gán",
          progressDisplay: (
            <Stack spacing={0.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption" fontWeight={700}>
                  {pct.toFixed(0)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {s?.phaseCount ?? 0} giai đoạn
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={pct}
                color={s?.scheduleStatus === "OVERDUE" ? "error" : s?.scheduleStatus === "AT_RISK" ? "warning" : "primary"}
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Stack>
          ),
          taskDisplay: s ? (
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
              <Chip size="small" variant="outlined" label={`${s.completedTasks}/${s.totalTasks} xong`} sx={{ height: 20, fontSize: "0.7rem" }} />
              {s.pendingReviewTasks > 0 && (
                <Chip size="small" color="secondary" label={`${s.pendingReviewTasks} chờ duyệt`} sx={{ height: 20, fontSize: "0.7rem" }} />
              )}
              {s.returnedTasks > 0 && (
                <Chip size="small" color="warning" label={`${s.returnedTasks} trả lại`} sx={{ height: 20, fontSize: "0.7rem" }} />
              )}
              {s.overdueTasks > 0 && (
                <Chip size="small" color="error" label={`${s.overdueTasks} trễ hạn`} sx={{ height: 20, fontSize: "0.7rem" }} />
              )}
            </Stack>
          ) : (
            "—"
          ),
          deadlineDisplay: (
            <Stack spacing={0.25}>
              <Typography variant="body2">{fmt(s?.plannedEndDate ?? p.deliveryDate)}</Typography>
              {s?.nextDeadline && (
                <Typography variant="caption" color="text.secondary">
                  Hạn gần nhất: {fmt(s.nextDeadline)}
                </Typography>
              )}
            </Stack>
          ),
          scheduleDisplay: sch ? (
            <Chip
              size="small"
              color={sch.color}
              label={`${sch.label}${(s?.delayDays ?? 0) > 0 ? ` (${s?.delayDays} ngày)` : ""}`}
              sx={{ fontWeight: 700 }}
            />
          ) : loadingSummary ? (
            "…"
          ) : (
            "—"
          ),
          stateDisplay: <Chip size="small" color={stMeta.color} label={stMeta.shortLabel} />,
        };
      });
  }, [projects, summaryMap, scheduleFilter, loadingSummary]);

  const onSearch = () =>
    setQuery((prev) => ({ ...prev, page: 0, search: searchInput.trim() || undefined, state: stateInput || undefined }));

  const onReset = () => {
    setSearchInput("");
    setStateInput("");
    setScheduleFilter("ALL");
    setQuery({ page: 0, size: 20 });
  };

  const onChangePageSize = (val: { page?: number; size?: number }) =>
    setQuery((prev) => ({ ...prev, page: val.page ?? 0, size: val.size ?? prev.size }));

  const onRowClick = (id: number) => router.push(`${ROUTES.PROGRESS_MANAGE}/${id}`);

  const onScanOverdue = async () => {
    try {
      setScanning(true);
      const n = await scanOverdueNow();
      toastSuccess(n > 0 ? `Đã gửi cảnh báo trễ hạn cho ${n} công việc` : "Không có công việc trễ hạn mới cần cảnh báo");
      await queryClient.invalidateQueries({ queryKey: ["my-notifications-unread"] });
    } catch (err) {
      toastError(err);
    } finally {
      setScanning(false);
    }
  };

  return [
    {
      columns,
      tableData,
      isLoading,
      kpi,
      searchInput,
      stateInput,
      scheduleFilter,
      canScan,
      scanning,
      page: data?.data?.page ?? query.page,
      size: data?.data?.size ?? query.size,
      totalPages: data?.data?.totalPages ?? 0,
      totalElements: data?.data?.totalElements ?? 0,
    },
    {
      setSearchInput,
      setStateInput,
      setScheduleFilter,
      onSearch,
      onReset,
      onChangePageSize,
      onRowClick,
      onScanOverdue,
    },
  ] as const;
};

export default useProgressManageList;
