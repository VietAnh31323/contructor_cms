import { ConsApi } from "@/config/axios";
import { useProjectListQuery } from "@/service/constructor/Project/getList";
import { toastError, toastSuccess } from "@/toast";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SendIcon from "@mui/icons-material/Send";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

export default function FieldReportMobilePage() {
  const { data: projectResp } = useProjectListQuery({ page: 0, size: 50 });
  const projects = projectResp?.data?.content ?? [];

  const [projectId, setProjectId] = useState<string>("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [taskId, setTaskId] = useState<string>("");
  const [note, setNote] = useState("");
  const [weatherNote, setWeatherNote] = useState("Nắng ráo, thuận lợi thi công");
  const [workerCount, setWorkerCount] = useState("12");
  const [photos, setPhotos] = useState<{ name: string; url: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSelectProject = async (pid: string) => {
    setProjectId(pid);
    setTaskId("");
    if (!pid) {
      setTasks([]);
      return;
    }
    try {
      const { data } = await ConsApi.get("/api/v1/project-progress/by-project", {
        params: { projectId: Number(pid) },
      });
      const phases = data?.data ?? data ?? [];
      const flatTasks: any[] = [];
      for (const ph of phases) {
        for (const t of ph.tasks ?? []) {
          flatTasks.push({ ...t, phaseName: ph.name });
        }
      }
      setTasks(flatTasks);
    } catch {
      setTasks([]);
    }
  };

  const handleCapturePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await ConsApi.post("/api/v1/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const uploaded = data?.data ?? data;
      setPhotos((prev) => [
        ...prev,
        { name: file.name, url: uploaded?.url || "" },
      ]);
      toastSuccess("Đã tải ảnh hiện trường lên thành công");
    } catch (err) {
      toastError(err, "Tải ảnh thất bại");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!taskId) {
      toastError(null, "Vui lòng chọn công việc cần báo cáo");
      return;
    }
    if (!note.trim()) {
      toastError(null, "Vui lòng nhập nội dung báo cáo hiện trường");
      return;
    }
    try {
      setSubmitting(true);
      await ConsApi.post("/api/v1/task-collab/site-report", {
        taskId: Number(taskId),
        reportDate: new Date().toISOString().slice(0, 10),
        weather: weatherNote,
        workerCount: Number(workerCount || 0),
        content: note.trim(),
        attachments: photos.map((p) => ({ name: p.name, url: p.url })),
      });
      toastSuccess("Đã gửi báo cáo hiện trường!");
      setNote("");
      setPhotos([]);
    } catch (err) {
      toastError(err, "Gửi báo cáo hiện trường thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 640, mx: "auto", pb: 6 }}>
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: 3,
          border: "1px solid #e2e8f0",
          bgcolor: "#ffffff",
        }}
      >
        <Typography variant="h6" fontWeight={800}>
          Báo cáo Hiện trường (Mobile / PWA)
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
          Giao diện tối ưu cho kỹ sư chụp ảnh &amp; cập nhật tiến độ trực tiếp bằng điện thoại.
        </Typography>

        <Stack spacing={2}>
          <TextField
            select
            fullWidth
            label="Chọn công trình / dự án"
            value={projectId}
            onChange={(e) => handleSelectProject(e.target.value)}
          >
            {projects.map((p) => (
              <MenuItem key={p.id} value={String(p.id)}>
                {p.code} - {p.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="Công việc cần cập nhật"
            value={taskId}
            disabled={!tasks.length}
            onChange={(e) => setTaskId(e.target.value)}
          >
            {tasks.map((t) => (
              <MenuItem key={t.id} value={String(t.id)}>
                [{t.phaseName}] {t.code} - {t.name}
              </MenuItem>
            ))}
          </TextField>

          <Stack direction="row" spacing={1.5}>
            <TextField
              fullWidth
              label="Thời tiết"
              value={weatherNote}
              onChange={(e) => setWeatherNote(e.target.value)}
            />
            <TextField
              type="number"
              label="Số nhân công"
              value={workerCount}
              onChange={(e) => setWorkerCount(e.target.value)}
              sx={{ width: 150 }}
            />
          </Stack>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Nội dung thi công / Khối lượng hoàn thành hôm nay"
            placeholder="VD: Đổ bê tông dầm sàn tầng 2, kiểm tra cốt thép đạt..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <Button
            variant="outlined"
            component="label"
            size="large"
            startIcon={uploading ? <CircularProgress size={18} /> : <CameraAltIcon />}
            disabled={uploading}
            sx={{ py: 1.5, borderRadius: 2, fontWeight: 700, textTransform: "none" }}
          >
            {uploading ? "Đang tải ảnh..." : "Chụp ảnh hiện trường (Camera)"}
            <input
              type="file"
              hidden
              accept="image/*"
              capture="environment"
              onChange={handleCapturePhoto}
            />
          </Button>

          {photos.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {photos.map((p, idx) => (
                <Chip
                  key={idx}
                  icon={<CheckCircleOutlineIcon />}
                  color="success"
                  label={p.name}
                />
              ))}
            </Stack>
          )}

          <Alert severity="info" sx={{ fontSize: 12 }}>
            Có thể cài đặt ứng dụng ra màn hình chính điện thoại (Add to Home Screen) nhờ cấu hình PWA.
          </Alert>

          <Button
            variant="contained"
            size="large"
            startIcon={<SendIcon />}
            disabled={submitting}
            onClick={handleSubmit}
            sx={{ py: 1.6, borderRadius: 2, fontWeight: 800, textTransform: "none" }}
          >
            {submitting ? "Đang gửi báo cáo..." : "Gửi báo cáo hiện trường"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
