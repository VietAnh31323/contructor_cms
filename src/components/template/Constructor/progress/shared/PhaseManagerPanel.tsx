import { CoreButton } from "@/components/atoms/CoreButton";
import { usePermission } from "@/components/hooks/permission/usePermission";
import CoreLoading from "@/components/molecules/CoreLoading";
import { PERMISSIONS } from "@/helper/permissions";
import { useProgressListQuery } from "@/service/constructor/Progress/getList";
import {
  deleteProjectPhase,
  ProjectPhase,
  recalculateProjectProgress,
  reorderProjectPhases,
  updateProjectPhase,
  useProjectPhasesQuery,
} from "@/service/constructor/ProjectProgress";
import { toastError, toastSuccess } from "@/toast";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  Tooltip,
  Typography,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useEffect, useState } from "react";
import { SCHEDULE_STATUS_META } from "./constants";

type Props = {
  projectId: number;
};

type EditForm = {
  progressId: number | "";
  newProgressName: string;
  plannedStartDate: string;
  plannedEndDate: string;
  weight: string;
  note: string;
};

const fmt = (d?: string | null) => (d ? moment(d).format("DD/MM/YYYY") : "—");

/**
 * 2.21: Quản lý giai đoạn – sắp xếp (kéo thả), sửa ngày kế hoạch / trọng số / tên, xóa.
 * Ngày thực tế & % tiến độ được hệ thống tổng hợp tự động từ công việc (2.22).
 */
export default function PhaseManagerPanel({ projectId }: Props) {
  const queryClient = useQueryClient();
  const { hasPermission } = usePermission();
  const canEdit = hasPermission([PERMISSIONS.PROGRESS_UPDATE, PERMISSIONS.PROJECT_UPDATE]);

  const { data: phasesData = [], isLoading } = useProjectPhasesQuery(projectId);
  const { data: catalogResp } = useProgressListQuery();
  const catalog: any[] = (catalogResp as any)?.data?.content ?? [];

  const [phases, setPhases] = useState<ProjectPhase[]>([]);
  const [editing, setEditing] = useState<ProjectPhase | null>(null);
  const [form, setForm] = useState<EditForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [recalculating, setRecalculating] = useState(false);

  useEffect(() => {
    setPhases(phasesData);
  }, [phasesData]);

  const refresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["project-phases", projectId] }),
      queryClient.invalidateQueries({ queryKey: ["project-gantt", projectId] }),
      queryClient.invalidateQueries({ queryKey: ["project-detail", projectId] }),
      queryClient.invalidateQueries({ queryKey: ["project-progress-summary"] }),
    ]);
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination || result.destination.index === result.source.index) return;
    const next = [...phases];
    const [moved] = next.splice(result.source.index, 1);
    next.splice(result.destination.index, 0, moved);
    setPhases(next);
    try {
      await reorderProjectPhases(projectId, next.map((p) => p.projectProgressId));
      toastSuccess("Đã cập nhật thứ tự giai đoạn");
      await refresh();
    } catch (err) {
      setPhases(phasesData);
      toastError(err);
    }
  };

  const openEdit = (p: ProjectPhase) => {
    setEditing(p);
    setForm({
      progressId: p.progressId ?? "",
      newProgressName: "",
      plannedStartDate: p.plannedStartDate || "",
      plannedEndDate: p.plannedEndDate || "",
      weight: String(p.weight ?? 1),
      note: p.note || "",
    });
  };

  const handleSave = async () => {
    if (!editing || !form) return;
    if (form.plannedStartDate && form.plannedEndDate && moment(form.plannedEndDate).isBefore(form.plannedStartDate, "day")) {
      toastError("Ngày kết thúc kế hoạch phải sau ngày bắt đầu");
      return;
    }
    const w = Number(form.weight);
    if (!w || w <= 0) {
      toastError("Trọng số phải lớn hơn 0");
      return;
    }
    try {
      setSaving(true);
      await updateProjectPhase(editing.projectProgressId, {
        progressId: form.progressId === "" ? undefined : Number(form.progressId),
        newProgressName: form.newProgressName.trim() || undefined,
        plannedStartDate: form.plannedStartDate || null,
        plannedEndDate: form.plannedEndDate || null,
        weight: w,
        note: form.note.trim() || null,
      });
      toastSuccess("Đã cập nhật giai đoạn");
      setEditing(null);
      await refresh();
    } catch (err) {
      toastError(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p: ProjectPhase) => {
    const msg =
      (p.taskCount ?? 0) > 0
        ? `Giai đoạn "${p.progressName}" có ${p.taskCount} công việc. Xóa giai đoạn sẽ xóa toàn bộ công việc bên trong. Tiếp tục?`
        : `Xóa giai đoạn "${p.progressName}"?`;
    if (!window.confirm(msg)) return;
    try {
      await deleteProjectPhase(p.projectProgressId);
      toastSuccess("Đã xóa giai đoạn");
      await refresh();
    } catch (err) {
      toastError(err);
    }
  };

  const handleRecalc = async () => {
    try {
      setRecalculating(true);
      const pct = await recalculateProjectProgress(projectId);
      toastSuccess(`Đã tính lại tiến độ dự án: ${Number(pct ?? 0).toFixed(1)}%`);
      await refresh();
    } catch (err) {
      toastError(err);
    } finally {
      setRecalculating(false);
    }
  };

  if (isLoading) return <CoreLoading />;

  const totalWeight = phases.reduce((s, p) => s + Number(p.weight ?? 1), 0);

  return (
    <Box>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={1} sx={{ mb: 2 }}>
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>
            Giai đoạn thi công ({phases.length})
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Kéo thả để sắp xếp • % tiến độ giai đoạn = bình quân gia quyền công việc; % dự án = bình quân gia quyền giai đoạn theo trọng số.
          </Typography>
        </Box>
        {canEdit && (
          <Button
            size="small"
            variant="outlined"
            startIcon={<CalculateOutlinedIcon fontSize="small" />}
            onClick={handleRecalc}
            disabled={recalculating}
            sx={{ textTransform: "none", whiteSpace: "nowrap" }}
          >
            {recalculating ? "Đang tính..." : "Tính lại tiến độ"}
          </Button>
        )}
      </Stack>

      {phases.length === 0 ? (
        <Alert severity="info">
          Dự án chưa có giai đoạn. Hãy thêm giai đoạn hoặc áp dụng Template quy trình ở tab Biểu đồ Gantt.
        </Alert>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="phases">
            {(provided) => (
              <Stack spacing={1.25} ref={provided.innerRef} {...provided.droppableProps}>
                {phases.map((p, index) => {
                  const sch = p.scheduleStatus ? SCHEDULE_STATUS_META[p.scheduleStatus] : null;
                  const pct = Math.min(100, Math.max(0, Number(p.progressPercent ?? 0)));
                  const weightShare = totalWeight > 0 ? (Number(p.weight ?? 1) / totalWeight) * 100 : 0;
                  return (
                    <Draggable
                      key={p.projectProgressId}
                      draggableId={`phase-${p.projectProgressId}`}
                      index={index}
                      isDragDisabled={!canEdit}
                    >
                      {(drag, snapshot) => (
                        <Paper
                          ref={drag.innerRef}
                          {...drag.draggableProps}
                          variant="outlined"
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            borderLeft: `4px solid ${sch?.hex ?? "#94a3b8"}`,
                            boxShadow: snapshot.isDragging ? "0 8px 20px rgba(15,23,42,0.18)" : "none",
                            bgcolor: "#fff",
                          }}
                        >
                          <Grid container spacing={1.5} alignItems="center">
                            <Grid item xs={12} md={4}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                {canEdit && (
                                  <Box {...drag.dragHandleProps} sx={{ display: "flex", cursor: "grab", color: "text.disabled" }}>
                                    <DragIndicatorIcon fontSize="small" />
                                  </Box>
                                )}
                                <Chip size="small" label={index + 1} sx={{ fontWeight: 700, minWidth: 28 }} />
                                <Box sx={{ overflow: "hidden" }}>
                                  <Typography variant="body2" fontWeight={700} noWrap>
                                    {p.progressName}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {p.completedTaskCount ?? 0}/{p.taskCount ?? 0} việc xong
                                    {(p.pendingReviewTaskCount ?? 0) > 0 ? ` • ${p.pendingReviewTaskCount} chờ duyệt` : ""}
                                    {(p.overdueTaskCount ?? 0) > 0 ? ` • ${p.overdueTaskCount} trễ` : ""}
                                  </Typography>
                                </Box>
                              </Stack>
                            </Grid>
                            <Grid item xs={6} md={2.5}>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Kế hoạch
                              </Typography>
                              <Typography variant="body2" fontWeight={600}>
                                {fmt(p.plannedStartDate)} → {fmt(p.plannedEndDate)}
                              </Typography>
                            </Grid>
                            <Grid item xs={6} md={2.5}>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Thực tế
                              </Typography>
                              <Typography variant="body2" fontWeight={600}>
                                {fmt(p.actualStartDate)} → {p.actualEndDate ? fmt(p.actualEndDate) : p.actualStartDate ? "đang làm" : "—"}
                              </Typography>
                            </Grid>
                            <Grid item xs={9} md={2}>
                              <Stack direction="row" justifyContent="space-between">
                                <Typography variant="caption" fontWeight={700}>
                                  {pct.toFixed(0)}%
                                </Typography>
                                <Tooltip title={`Trọng số ${p.weight ?? 1} (~${weightShare.toFixed(0)}% tiến độ dự án)`}>
                                  <Typography variant="caption" color="text.secondary">
                                    w {Number(p.weight ?? 1)}
                                  </Typography>
                                </Tooltip>
                              </Stack>
                              <LinearProgress
                                variant="determinate"
                                value={pct}
                                sx={{ height: 6, borderRadius: 3, mt: 0.5 }}
                                color={p.scheduleStatus === "OVERDUE" ? "error" : p.scheduleStatus === "AT_RISK" ? "warning" : "primary"}
                              />
                              {sch && (
                                <Typography variant="caption" sx={{ color: sch.hex, fontWeight: 700 }}>
                                  {sch.label}
                                  {(p.delayDays ?? 0) > 0 ? ` (${p.delayDays} ngày)` : ""}
                                </Typography>
                              )}
                            </Grid>
                            <Grid item xs={3} md={1} sx={{ textAlign: "right" }}>
                              {canEdit && (
                                <>
                                  <Tooltip title="Sửa giai đoạn">
                                    <IconButton size="small" color="primary" onClick={() => openEdit(p)}>
                                      <EditOutlinedIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Xóa giai đoạn">
                                    <IconButton size="small" color="error" onClick={() => handleDelete(p)}>
                                      <DeleteOutlineIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              )}
                            </Grid>
                          </Grid>
                        </Paper>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </Stack>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <Dialog open={Boolean(editing)} onClose={() => !saving && setEditing(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Sửa giai đoạn “{editing?.progressName}”</DialogTitle>
        <DialogContent dividers>
          {form && (
            <Grid container spacing={2} sx={{ mt: 0 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Giai đoạn (danh mục)</InputLabel>
                  <Select
                    label="Giai đoạn (danh mục)"
                    value={form.progressId}
                    onChange={(e) => setForm({ ...form, progressId: e.target.value as number })}
                    disabled={Boolean(form.newProgressName.trim())}
                  >
                    {catalog.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.code ? `${c.code} - ` : ""}
                        {c.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Hoặc đặt tên mới"
                  value={form.newProgressName}
                  onChange={(e) => setForm({ ...form, newProgressName: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="Bắt đầu kế hoạch"
                  InputLabelProps={{ shrink: true }}
                  value={form.plannedStartDate}
                  onChange={(e) => setForm({ ...form, plannedStartDate: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="Kết thúc kế hoạch"
                  InputLabelProps={{ shrink: true }}
                  value={form.plannedEndDate}
                  onChange={(e) => setForm({ ...form, plannedEndDate: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Trọng số"
                  helperText="Mức độ đóng góp vào % tiến độ dự án"
                  inputProps={{ min: 0.1, step: 0.5 }}
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Thực tế (tự động)
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {fmt(editing?.actualStartDate)} → {fmt(editing?.actualEndDate)}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  multiline
                  minRows={2}
                  label="Ghi chú"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <CoreButton theme="cancel" onClick={() => setEditing(null)} disabled={saving}>
            Hủy
          </CoreButton>
          <CoreButton theme="submit" loading={saving} onClick={handleSave}>
            Lưu thay đổi
          </CoreButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
