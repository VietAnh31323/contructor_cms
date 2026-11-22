import { generateAiHouseDesign } from "@/service/constructor/Customer/publicLead";
import {
  AiHouseDesignRequest,
  AiHouseDesignResponse,
} from "@/service/constructor/Customer/publicLead/type";
import { toastError, toastSuccess } from "@/toast";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DownloadIcon from "@mui/icons-material/Download";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

const STYLES = [
  "Hiện đại (Modern)",
  "Tân cổ điển (Neoclassical)",
  "Đông Dương (Indochine)",
  "Tối giản (Minimalist)",
  "Nhiệt đới (Tropical)",
  "Mái Nhật sang trọng",
];

const FLOORS = [
  "Nhà cấp 4 / 1 tầng",
  "Nhà phố 2 tầng",
  "Nhà phố 3 tầng",
  "Nhà phố 4 tầng + Tum",
  "Biệt thự sân vườn 2 tầng",
];

const PAINT_COLORS = [
  { label: "Trắng sứ & Xám ghi", swatch: ["#f8fafc", "#64748b"] },
  { label: "Kem ấm & Gỗ tự nhiên", swatch: ["#fef3c7", "#92400e"] },
  { label: "Ghi đậm & Đen sang trọng", swatch: ["#334155", "#0f172a"] },
  { label: "Xanh rêu & Đá Slate", swatch: ["#14532d", "#475569"] },
  { label: "Vàng nhạt & Mái ngói đỏ", swatch: ["#fde68a", "#b91c1c"] },
];

const AGE_GROUPS = [
  "Trẻ trung (25 – 35 tuổi)",
  "Trung niên (35 – 50 tuổi)",
  "Đa thế hệ / Cao tuổi (50+ tuổi)",
];

const FUNCTION_OPTIONS = [
  "Phòng khách thông tầng",
  "Gara ô tô",
  "Sân vườn cây xanh",
  "Hồ bơi mini",
  "Phòng thờ riêng",
  "Sân thượng BBQ",
  "Phòng làm việc tại nhà",
  "Ban công kính rộng",
];

const BUDGETS = [
  "Dưới 1 tỷ VNĐ",
  "Từ 1 – 3 tỷ VNĐ",
  "Từ 3 – 5 tỷ VNĐ",
  "Từ 5 – 10 tỷ VNĐ",
  "Trên 10 tỷ VNĐ",
];

interface AiHouseDesignerSectionProps {
  onApplyToLeadForm: (payload: {
    projectScale: string;
    estimatedBudget: string;
    serviceInterest: string;
    message: string;
  }) => void;
}

export default function AiHouseDesignerSection({
  onApplyToLeadForm,
}: AiHouseDesignerSectionProps) {
  const [config, setConfig] = useState<AiHouseDesignRequest>({
    style: STYLES[0],
    floors: FLOORS[2],
    paintColor: PAINT_COLORS[0].label,
    ownerAgeGroup: AGE_GROUPS[1],
    functions: ["Phòng khách thông tầng", "Gara ô tô", "Sân vườn cây xanh"],
    landSize: "5x20m",
    budget: BUDGETS[1],
    extraNotes: "",
  });

  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<AiHouseDesignResponse | null>(null);

  const toggleFunction = (fn: string) => {
    setConfig((prev) => {
      const exists = prev.functions.includes(fn);
      return {
        ...prev,
        functions: exists
          ? prev.functions.filter((x) => x !== fn)
          : [...prev.functions, fn],
      };
    });
  };

  const applyConfigToForm = (summaryOverride?: string) => {
    const summary =
      summaryOverride ||
      `[Yêu cầu thiết kế 3D AI]\n- Phong cách: ${config.style}\n- Quy mô: ${config.floors} (Đất: ${config.landSize})\n- Màu sơn: ${config.paintColor}\n- Độ tuổi gia chủ: ${config.ownerAgeGroup}\n- Công năng: ${config.functions.join(", ")}\n- Ngân sách: ${config.budget}${
        config.extraNotes ? `\n- Ghi chú: ${config.extraNotes}` : ""
      }`;

    onApplyToLeadForm({
      projectScale: `${config.floors} • ${config.style} • Đất ${config.landSize}`,
      estimatedBudget: config.budget,
      serviceInterest: "Thiết kế kiến trúc & kết cấu",
      message: summary,
    });
  };

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      const res = await generateAiHouseDesign(config);
      setResult(res);
      applyConfigToForm(res.summaryText);
      if (res.generatedByAi && res.imageDataUrl) {
        toastSuccess("Đã tạo phối cảnh 3D bằng Gemini AI và đồng bộ vào form tư vấn!");
      } else {
        toastSuccess("Đã tổng hợp cấu hình thiết kế vào form tư vấn!");
      }
    } catch (err) {
      toastError(err, "Không thể tạo phối cảnh 3D");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadImage = () => {
    if (!result?.imageDataUrl) return;
    const a = document.createElement("a");
    a.href = result.imageDataUrl;
    a.download = "phoi-canh-3d-ai.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, md: 3.5 },
        mb: 4,
        borderRadius: 3,
        border: "1px solid rgba(59,130,246,0.3)",
        background:
          "linear-gradient(135deg, rgba(15,23,42,0.96) 0%, rgba(30,58,138,0.92) 100%)",
        color: "#ffffff",
        boxShadow: "0 16px 40px rgba(15, 23, 42, 0.25)",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        spacing={1.5}
        sx={{ mb: 3 }}
      >
        <Box>
          <Chip
            size="small"
            icon={<AutoAwesomeIcon sx={{ color: "#fde047 !important" }} />}
            label="GEMINI AI 3D ARCHITECT"
            sx={{
              bgcolor: "rgba(255,255,255,0.14)",
              color: "#fef08a",
              fontWeight: 800,
              mb: 1,
            }}
          />
          <Typography variant="h5" fontWeight={800}>
            Thiết kế phối cảnh nhà 3D trực tiếp bằng AI
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.78)", mt: 0.5 }}>
            Chọn phong cách, số tầng, màu sơn, độ tuổi &amp; công năng — AI sẽ
            dựng ảnh 3D cho bạn xem ngay và gửi thông số về đội ngũ kiến trúc sư tư vấn.
          </Typography>
        </Box>
      </Stack>

      <Grid container spacing={3}>
        {/* Left: Design Preferences */}
        <Grid item xs={12} lg={7}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 2.5,
              bgcolor: "#ffffff",
              color: "#0f172a",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Phong cách thiết kế"
                  value={config.style}
                  onChange={(e) =>
                    setConfig((p) => ({ ...p, style: e.target.value }))
                  }
                >
                  {STYLES.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Quy mô / Số tầng"
                  value={config.floors}
                  onChange={(e) =>
                    setConfig((p) => ({ ...p, floors: e.target.value }))
                  }
                >
                  {FLOORS.map((f) => (
                    <MenuItem key={f} value={f}>
                      {f}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Màu sơn & Tông chủ đạo"
                  value={config.paintColor}
                  onChange={(e) =>
                    setConfig((p) => ({ ...p, paintColor: e.target.value }))
                  }
                >
                  {PAINT_COLORS.map((c) => (
                    <MenuItem key={c.label} value={c.label}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box className="flex">
                          {c.swatch.map((hex, i) => (
                            <Box
                              key={i}
                              sx={{
                                width: 14,
                                height: 14,
                                borderRadius: "50%",
                                bgcolor: hex,
                                border: "1px solid #cbd5e1",
                                ml: i > 0 ? -0.5 : 0,
                              }}
                            />
                          ))}
                        </Box>
                        <span>{c.label}</span>
                      </Stack>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Độ tuổi gia chủ"
                  value={config.ownerAgeGroup}
                  onChange={(e) =>
                    setConfig((p) => ({ ...p, ownerAgeGroup: e.target.value }))
                  }
                >
                  {AGE_GROUPS.map((a) => (
                    <MenuItem key={a} value={a}>
                      {a}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Kích thước lô đất (VD: 5x20m)"
                  value={config.landSize}
                  onChange={(e) =>
                    setConfig((p) => ({ ...p, landSize: e.target.value }))
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Ngân sách dự kiến"
                  value={config.budget}
                  onChange={(e) =>
                    setConfig((p) => ({ ...p, budget: e.target.value }))
                  }
                >
                  {BUDGETS.map((b) => (
                    <MenuItem key={b} value={b}>
                      {b}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color="text.secondary"
                  display="block"
                  sx={{ mb: 0.8 }}
                >
                  Công năng mong muốn (chọn nhiều):
                </Typography>
                <Stack direction="row" spacing={0.8} flexWrap="wrap" gap={0.8}>
                  {FUNCTION_OPTIONS.map((fn) => {
                    const selected = config.functions.includes(fn);
                    return (
                      <Chip
                        key={fn}
                        size="small"
                        label={fn}
                        icon={selected ? <CheckCircleIcon /> : undefined}
                        color={selected ? "primary" : "default"}
                        variant={selected ? "filled" : "outlined"}
                        onClick={() => toggleFunction(fn)}
                      />
                    );
                  })}
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Yêu cầu thêm (hướng nhà, phong thủy, vật liệu...)"
                  value={config.extraNotes}
                  onChange={(e) =>
                    setConfig((p) => ({ ...p, extraNotes: e.target.value }))
                  }
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Stack direction="row" spacing={1.5} flexWrap="wrap" gap={1}>
              <Button
                variant="contained"
                size="large"
                startIcon={
                  generating ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <AutoAwesomeIcon />
                  )
                }
                disabled={generating}
                onClick={handleGenerate}
                sx={{
                  fontWeight: 700,
                  textTransform: "none",
                  borderRadius: 2,
                  background: "linear-gradient(90deg, #2563eb 0%, #0ea5e9 100%)",
                }}
              >
                {generating
                  ? "Gemini AI đang dựng phối cảnh 3D..."
                  : "Tạo ảnh 3D ngay bằng Gemini AI"}
              </Button>

              <Button
                variant="outlined"
                startIcon={<SendOutlinedIcon />}
                onClick={() => {
                  applyConfigToForm();
                  toastSuccess("Đã đưa nhu cầu thiết kế vào form đăng ký bên dưới!");
                }}
                sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
              >
                Đưa cấu hình vào Form tư vấn
              </Button>
            </Stack>
          </Paper>
        </Grid>

        {/* Right: 3D Preview Stage */}
        <Grid item xs={12} lg={5}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2.5,
              height: "100%",
              minHeight: 360,
              bgcolor: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.18)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1.5 }}
            >
              <Typography variant="subtitle2" fontWeight={700} color="#e2e8f0">
                Xem trước phối cảnh 3D
              </Typography>
              {result?.imageDataUrl && (
                <Button
                  size="small"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadImage}
                  sx={{ color: "#bae6fd", textTransform: "none" }}
                >
                  Tải ảnh
                </Button>
              )}
            </Stack>

            <Box
              sx={{
                flex: 1,
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "rgba(15,23,42,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 250,
                p: result?.imageDataUrl ? 0 : 2,
              }}
            >
              {generating ? (
                <Stack spacing={1.5} alignItems="center">
                  <CircularProgress color="warning" />
                  <Typography variant="body2" color="#e2e8f0">
                    Đang render phối cảnh 3D từ Gemini AI...
                  </Typography>
                </Stack>
              ) : result?.imageDataUrl ? (
                <img
                  src={result.imageDataUrl}
                  alt="Phối cảnh nhà 3D AI"
                  style={{
                    width: "100%",
                    height: "100%",
                    maxHeight: 340,
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Stack spacing={1} alignItems="center" textAlign="center">
                  <AutoAwesomeIcon sx={{ fontSize: 44, color: "#fde047" }} />
                  <Typography variant="body2" fontWeight={700} color="#ffffff">
                    Chưa có ảnh 3D
                  </Typography>
                  <Typography variant="caption" color="#cbd5e1">
                    Chọn thông số bên trái và bấm{" "}
                    <b>&quot;Tạo ảnh 3D ngay bằng Gemini AI&quot;</b> để xem mẫu
                    nhà tương lai của bạn.
                  </Typography>
                </Stack>
              )}
            </Box>

            {result?.warningMessage && (
              <Alert severity="warning" sx={{ mt: 1.5, fontSize: 12 }}>
                {result.warningMessage}
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
}
