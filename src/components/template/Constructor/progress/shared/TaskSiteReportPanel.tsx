import { CoreButton } from "@/components/atoms/CoreButton";
import { usePermission } from "@/components/hooks/permission/usePermission";
import CoreLoading from "@/components/molecules/CoreLoading";
import { PERMISSIONS } from "@/helper/permissions";
import {
  createTaskSiteReport,
  deleteTaskSiteReport,
  SiteReportPhase,
  TaskSiteReport,
  UploadItem,
  uploadFile,
  useTaskSiteReportsQuery,
} from "@/service/constructor/TaskCollab";
import { toastError, toastSuccess } from "@/toast";
import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ScheduleIcon from "@mui/icons-material/Schedule";
import {
  Box,
  Button,
  Chip,
  Dialog,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useMemo, useState } from "react";
import { SITE_REPORT_PHASE_META } from "./constants";

type Props = {
  taskId: number;
  onChanged?: () => void;
};

type GeoState = {
  latitude?: number;
  longitude?: number;
  accuracy?: number;
};

/**
 * 2.25: Báo cáo hiện trường – ảnh trước / trong / sau, ghi chú, GPS, thời gian cho từng công việc.
 */
export default function TaskSiteReportPanel({ taskId, onChanged }: Props) {
  const queryClient = useQueryClient();
  const { hasPermission } = usePermission();
  const canReport = hasPermission([
    PERMISSIONS.TASK_UPDATE,
    PERMISSIONS.PROGRESS_UPDATE,
  ]);

  const { data: reports = [], isLoading } = useTaskSiteReportsQuery(taskId);

  const [phase, setPhase] = useState<SiteReportPhase>("DURING");
  const [note, setNote] = useState("");
  const [images, setImages] = useState<UploadItem[]>([]);
  const [capturedAt, setCapturedAt] = useState(moment().format("YYYY-MM-DDTHH:mm"));
  const [locationAddress, setLocationAddress] = useState("");
  const [geo, setGeo] = useState<GeoState>({});
  const [locating, setLocating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<SiteReportPhase | "ALL">("ALL");
  const [preview, setPreview] = useState<string | null>(null);

  const filtered = useMemo(
    () => (filter === "ALL" ? reports : reports.filter((r) => r.reportPhase === filter)),
    [reports, filter]
  );

  const countByPhase = useMemo(() => {
    const c: Record<string, number> = { BEFORE: 0, DURING: 0, AFTER: 0 };
    reports.forEach((r) => (c[r.reportPhase] = (c[r.reportPhase] || 0) + 1));
    return c;
  }, [reports]);

  const handleLocate = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      toastError("Thiết bị / trình duyệt không hỗ trợ định vị GPS");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeo({
          latitude: Number(pos.coords.latitude.toFixed(7)),
          longitude: Number(pos.coords.longitude.toFixed(7)),
          accuracy: Math.round(pos.coords.accuracy),
        });
        setLocating(false);
        toastSuccess("Đã lấy toạ độ GPS hiện tại");
      },
      (err) => {
        setLocating(false);
        toastError(
          err.code === err.PERMISSION_DENIED
            ? "Bạn đã chặn quyền truy cập vị trí. Hãy cho phép định vị để gắn GPS."
            : "Không lấy được vị trí GPS, vui lòng thử lại"
        );
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    try {
      setUploading(true);
      const uploaded: UploadItem[] = [];
      for (const f of files) {
        if (!f.type.startsWith("image/")) {
          toastError(`"${f.name}" không phải file ảnh`);
          continue;
        }
        const res = await uploadFile(f);
        if (res?.url) uploaded.push(res);
      }
      setImages((prev) => [...prev, ...uploaded]);
    } catch (err) {
      toastError(err);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const resetForm = () => {
    setNote("");
    setImages([]);
    setGeo({});
    setLocationAddress("");
    setCapturedAt(moment().format("YYYY-MM-DDTHH:mm"));
  };

  const handleSubmit = async () => {
    if (!images.length && !note.trim()) {
      toastError("Báo cáo cần ít nhất 1 ảnh hoặc ghi chú");
      return;
    }
    try {
      setSaving(true);
      const body: TaskSiteReport = {
        reportPhase: phase,
        note: note.trim() || undefined,
        images,
        latitude: geo.latitude ?? null,
        longitude: geo.longitude ?? null,
        locationAccuracy: geo.accuracy ?? null,
        locationAddress: locationAddress.trim() || undefined,
        capturedAt: capturedAt ? moment(capturedAt).format("YYYY-MM-DDTHH:mm:ss") : undefined,
      };
      await createTaskSiteReport(taskId, body);
      toastSuccess("Đã gửi báo cáo hiện trường");
      resetForm();
      await queryClient.invalidateQueries({ queryKey: ["task-site-reports", taskId] });
      onChanged?.();
    } catch (err) {
      toastError(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (r: TaskSiteReport) => {
    if (!r.id) return;
    if (!window.confirm("Xóa báo cáo hiện trường này?")) return;
    try {
      await deleteTaskSiteReport(taskId, r.id);
      toastSuccess("Đã xóa báo cáo");
      await queryClient.invalidateQueries({ queryKey: ["task-site-reports", taskId] });
      onChanged?.();
    } catch (err) {
      toastError(err);
    }
  };

  return (
    <Box>
      {canReport && (
        <Paper variant="outlined" sx={{ p: 2, mb: 2.5, borderRadius: 2, bgcolor: "#f8fafc" }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
            Gửi báo cáo hiện trường mới
          </Typography>
          <Grid container spacing={1.5}>
            <Grid item xs={12} md={7}>
              <ToggleButtonGroup
                size="small"
                exclusive
                value={phase}
                onChange={(_, v: SiteReportPhase | null) => v && setPhase(v)}
                fullWidth
              >
                {(Object.keys(SITE_REPORT_PHASE_META) as SiteReportPhase[]).map((p) => (
                  <ToggleButton key={p} value={p} sx={{ textTransform: "none", fontWeight: 600 }}>
                    {SITE_REPORT_PHASE_META[p].label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                size="small"
                type="datetime-local"
                label="Thời điểm chụp / ghi nhận"
                InputLabelProps={{ shrink: true }}
                value={capturedAt}
                onChange={(e) => setCapturedAt(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                multiline
                minRows={2}
                label="Ghi chú hiện trường"
                placeholder="Mô tả tình trạng thi công, khối lượng thực hiện, vấn đề phát sinh..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <TextField
                fullWidth
                size="small"
                label="Vị trí / khu vực (tuỳ chọn)"
                placeholder="VD: Trục A-B, tầng 2"
                value={locationAddress}
                onChange={(e) => setLocationAddress(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ height: "100%" }}>
                <Button
                  size="small"
                  variant={geo.latitude ? "contained" : "outlined"}
                  color={geo.latitude ? "success" : "primary"}
                  startIcon={<MyLocationIcon fontSize="small" />}
                  onClick={handleLocate}
                  disabled={locating}
                  sx={{ textTransform: "none", whiteSpace: "nowrap" }}
                >
                  {locating ? "Đang định vị..." : geo.latitude ? "Đã gắn GPS" : "Gắn toạ độ GPS"}
                </Button>
                {geo.latitude && (
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {geo.latitude}, {geo.longitude} (±{geo.accuracy}m)
                  </Typography>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
                <Button
                  component="label"
                  size="small"
                  variant="outlined"
                  startIcon={<AddAPhotoOutlinedIcon fontSize="small" />}
                  disabled={uploading}
                  sx={{ textTransform: "none" }}
                >
                  {uploading ? "Đang tải ảnh..." : "Thêm ảnh"}
                  <input hidden type="file" accept="image/*" capture="environment" multiple onChange={handleUpload} />
                </Button>
                {images.map((img, idx) => (
                  <Box key={idx} sx={{ position: "relative", width: 64, height: 64 }}>
                    <Box
                      component="img"
                      src={img.url}
                      alt={img.name}
                      sx={{ width: 64, height: 64, objectFit: "cover", borderRadius: 1, border: "1px solid #e2e8f0" }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                      sx={{ position: "absolute", top: -8, right: -8, bgcolor: "#fff", boxShadow: 1, p: 0.25 }}
                    >
                      <CloseIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
              <CoreButton theme="submit" loading={saving} onClick={handleSubmit}>
                Gửi báo cáo
              </CoreButton>
            </Grid>
          </Grid>
        </Paper>
      )}

      <Stack direction="row" spacing={1} sx={{ mb: 1.5 }} flexWrap="wrap" useFlexGap>
        <Chip
          label={`Tất cả (${reports.length})`}
          color={filter === "ALL" ? "primary" : "default"}
          variant={filter === "ALL" ? "filled" : "outlined"}
          onClick={() => setFilter("ALL")}
        />
        {(Object.keys(SITE_REPORT_PHASE_META) as SiteReportPhase[]).map((p) => (
          <Chip
            key={p}
            label={`${SITE_REPORT_PHASE_META[p].label} (${countByPhase[p] || 0})`}
            onClick={() => setFilter(p)}
            variant={filter === p ? "filled" : "outlined"}
            sx={{
              bgcolor: filter === p ? SITE_REPORT_PHASE_META[p].bg : undefined,
              color: SITE_REPORT_PHASE_META[p].color,
              fontWeight: 600,
            }}
          />
        ))}
      </Stack>

      {isLoading ? (
        <CoreLoading />
      ) : filtered.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: "center" }}>
          Chưa có báo cáo hiện trường nào.
        </Typography>
      ) : (
        <Stack spacing={1.5}>
          {filtered.map((r) => {
            const meta = SITE_REPORT_PHASE_META[r.reportPhase] ?? SITE_REPORT_PHASE_META.DURING;
            const hasGps = r.latitude != null && r.longitude != null;
            return (
              <Paper key={r.id} variant="outlined" sx={{ p: 1.75, borderRadius: 2, borderLeft: `4px solid ${meta.color}` }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                      <Chip size="small" label={meta.label} sx={{ bgcolor: meta.bg, color: meta.color, fontWeight: 700 }} />
                      <Typography variant="body2" fontWeight={700}>
                        {r.reporterName || "—"}
                      </Typography>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <ScheduleIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                        <Typography variant="caption" color="text.secondary">
                          {r.capturedAt ? moment(r.capturedAt).format("DD/MM/YYYY HH:mm") : "—"}
                        </Typography>
                      </Stack>
                    </Stack>
                    {(hasGps || r.locationAddress) && (
                      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                        <PlaceOutlinedIcon sx={{ fontSize: 15, color: "error.main" }} />
                        <Typography variant="caption" color="text.secondary">
                          {r.locationAddress}
                          {r.locationAddress && hasGps ? " • " : ""}
                          {hasGps && (
                            <a
                              href={`https://www.google.com/maps?q=${r.latitude},${r.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {Number(r.latitude).toFixed(5)}, {Number(r.longitude).toFixed(5)}
                              {r.locationAccuracy ? ` (±${Number(r.locationAccuracy).toFixed(0)}m)` : ""}
                            </a>
                          )}
                        </Typography>
                      </Stack>
                    )}
                  </Box>
                  {r.canDelete && (
                    <Tooltip title="Xóa báo cáo">
                      <IconButton size="small" color="error" onClick={() => handleDelete(r)}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>
                {r.note && (
                  <Typography variant="body2" sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
                    {r.note}
                  </Typography>
                )}
                {r.images?.length > 0 && (
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
                    {r.images.map((img, idx) => (
                      <Box
                        key={idx}
                        component="img"
                        src={img.url}
                        alt={img.name}
                        onClick={() => setPreview(img.url)}
                        sx={{
                          width: 96,
                          height: 72,
                          objectFit: "cover",
                          borderRadius: 1,
                          border: "1px solid #e2e8f0",
                          cursor: "zoom-in",
                        }}
                      />
                    ))}
                  </Stack>
                )}
              </Paper>
            );
          })}
        </Stack>
      )}

      <Dialog open={Boolean(preview)} onClose={() => setPreview(null)} maxWidth="lg">
        {preview && (
          <Box component="img" src={preview} alt="preview" sx={{ maxWidth: "90vw", maxHeight: "85vh", display: "block" }} />
        )}
      </Dialog>
    </Box>
  );
}
