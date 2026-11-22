import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import ArchitectureOutlinedIcon from "@mui/icons-material/ArchitectureOutlined";
import AutoFixHighOutlinedIcon from "@mui/icons-material/AutoFixHighOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EngineeringOutlinedIcon from "@mui/icons-material/EngineeringOutlined";
import FactoryOutlinedIcon from "@mui/icons-material/FactoryOutlined";
import LaunchIcon from "@mui/icons-material/Launch";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PhoneInTalkOutlinedIcon from "@mui/icons-material/PhoneInTalkOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import { ROUTES } from "@/routes";
import { CustomerType } from "@/service/constructor/Customer/getList/type";
import { submitPublicCustomerLead } from "@/service/constructor/Customer/publicLead";
import { PublicCustomerLeadResult } from "@/service/constructor/Customer/publicLead/type";
import { toastError, toastSuccess } from "@/toast";
import router from "next/router";
import { FormEvent, useState } from "react";
import AiHouseDesignerSection from "./AiHouseDesignerSection";

const SERVICE_OPTIONS = [
  "Thiết kế kiến trúc & kết cấu",
  "Thi công xây dựng trọn gói",
  "Nhà xưởng & Kết cấu thép",
  "Thi công phần thô",
  "Hoàn thiện nội thất & cải tạo",
];

const BUDGET_OPTIONS = [
  "Chưa xác định (cần tư vấn dự toán)",
  "Dưới 1 tỷ VNĐ",
  "Từ 1 – 3 tỷ VNĐ",
  "Từ 3 – 5 tỷ VNĐ",
  "Từ 5 – 10 tỷ VNĐ",
  "Trên 10 tỷ VNĐ",
];

type LeadFormState = {
  customerType: CustomerType;
  name: string;
  phone: string;
  representativeName: string;
  taxCode: string;
  email: string;
  address: string;
  serviceInterest: string;
  projectScale: string;
  estimatedBudget: string;
  message: string;
};

const initialFormState: LeadFormState = {
  customerType: "INDIVIDUAL",
  name: "",
  phone: "",
  representativeName: "",
  taxCode: "",
  email: "",
  address: "",
  serviceInterest: "Thi công xây dựng trọn gói",
  projectScale: "",
  estimatedBudget: "Từ 1 – 3 tỷ VNĐ",
  message: "",
};

export default function CustomerLeadLanding() {
  const [form, setForm] = useState<LeadFormState>(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] =
    useState<PublicCustomerLeadResult | null>(null);

  const handleChange = (field: keyof LeadFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFillSampleIndividual = () => {
    const rand = Math.floor(100000 + Math.random() * 900000);
    setSubmittedResult(null);
    setForm({
      customerType: "INDIVIDUAL",
      name: "Trần Minh Hoàng",
      phone: `0912${rand}`,
      representativeName: "",
      taxCode: "",
      email: `hoang.tran${rand % 1000}@gmail.com`,
      address: "KĐT Vạn Phúc, TP. Thủ Đức, TP.HCM",
      serviceInterest: "Thi công xây dựng trọn gói",
      projectScale: "Nhà phố 5x20m, 1 trệt 3 lầu + sân thượng",
      estimatedBudget: "Từ 3 – 5 tỷ VNĐ",
      message:
        "Gia đình dự kiến khởi công vào tháng tới, cần tư vấn thiết kế kiến trúc hiện đại và báo giá thi công trọn gói chìa khóa trao tay.",
    });
  };

  const handleFillSampleBusiness = () => {
    const rand = Math.floor(100000 + Math.random() * 900000);
    setSubmittedResult(null);
    setForm({
      customerType: "BUSINESS",
      name: `Công ty TNHH Sản Xuất Logistics Đông Á ${rand % 100}`,
      phone: `0988${rand}`,
      representativeName: "Lê Quốc Bảo",
      taxCode: "",
      email: `baole.donga${rand % 100}@company.vn`,
      address: "KCN VSIP II, Bình Dương",
      serviceInterest: "Nhà xưởng & Kết cấu thép",
      projectScale: "Nhà xưởng kết cấu thép 3.500m² + văn phòng điều hành 2 tầng",
      estimatedBudget: "Trên 10 tỷ VNĐ",
      message:
        "Cần khảo sát mặt bằng và tư vấn phương án kết cấu thép khẩu độ lớn, tiến độ bàn giao trong 5 tháng. Mã số thuế & thông tin hợp đồng kế toán sẽ gửi bổ sung khi làm việc.",
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toastError(
        form.customerType === "BUSINESS"
          ? "Vui lòng nhập tên doanh nghiệp / đơn vị"
          : "Vui lòng nhập họ và tên của bạn"
      );
      return;
    }
    if (!form.phone.trim()) {
      toastError("Vui lòng nhập số điện thoại liên hệ");
      return;
    }

    try {
      setSubmitting(true);
      const res = await submitPublicCustomerLead({
        customerType: form.customerType,
        name: form.name.trim(),
        phone: form.phone.trim(),
        representativeName: form.representativeName.trim() || undefined,
        taxCode: form.taxCode.trim() || undefined,
        email: form.email.trim() || undefined,
        address: form.address.trim() || undefined,
        serviceInterest: form.serviceInterest || undefined,
        projectScale: form.projectScale.trim() || undefined,
        estimatedBudget: form.estimatedBudget || undefined,
        message: form.message.trim() || undefined,
        source: "Website Landing Page",
      });
      setSubmittedResult(res.data);
      toastSuccess("Đã gửi yêu cầu tư vấn thành công!");
    } catch (err: any) {
      toastError(
        err?.response?.data?.message ||
          err?.message ||
          "Không thể gửi thông tin, vui lòng kiểm tra lại!"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", color: "#0f172a" }}>
      {/* ================= TOP HEADER ================= */}
      <Box
        sx={{
          bgcolor: "#0f172a",
          color: "#fff",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ py: 1.75 }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  bgcolor: "#f59e0b",
                  color: "#0f172a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                }}
              >
                <ApartmentOutlinedIcon />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={800} lineHeight={1.2}>
                  CONSTRUCTOR BUILD
                </Typography>
                <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                  Kiến trúc • Thi công Trọn gói • Kết cấu Thép
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <Button
                size="small"
                variant="outlined"
                endIcon={<LaunchIcon fontSize="small" />}
                onClick={() => router.push(ROUTES.CUSTOMER)}
                sx={{
                  color: "#e2e8f0",
                  borderColor: "rgba(255,255,255,0.28)",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#f59e0b",
                    color: "#f59e0b",
                  },
                }}
              >
                Mở trang Quản trị Khách hàng (CMS)
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* ================= HERO & LEAD FORM SECTION ================= */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #334155 100%)",
          color: "#fff",
          pt: { xs: 5, md: 7 },
          pb: { xs: 7, md: 10 },
        }}
      >
        <Container maxWidth="lg">
          <AiHouseDesignerSection
            onApplyToLeadForm={(payload) => {
              setSubmittedResult(null);
              setForm((prev) => ({
                ...prev,
                projectScale: payload.projectScale,
                estimatedBudget: payload.estimatedBudget,
                serviceInterest: payload.serviceInterest,
                message: payload.message,
              }));
            }}
          />

          <Grid container spacing={5} alignItems="flex-start">
            {/* LEFT HERO CONTENT */}
            <Grid item xs={12} md={6}>
              <Chip
                icon={<VerifiedOutlinedIcon sx={{ color: "#f59e0b !important" }} />}
                label="Giải pháp Thiết kế & Thi công Chuẩn Kỹ Thuật"
                sx={{
                  bgcolor: "rgba(245, 158, 11, 0.15)",
                  color: "#fbbf24",
                  fontWeight: 600,
                  mb: 2.5,
                }}
              />

              <Typography
                variant="h3"
                fontWeight={800}
                sx={{
                  fontSize: { xs: "2rem", md: "2.65rem" },
                  lineHeight: 1.2,
                  mb: 2,
                }}
              >
                Kiến tạo công trình bền vững, minh bạch tiến độ & chi phí
              </Typography>

              <Typography
                variant="body1"
                sx={{ color: "#cbd5e1", lineHeight: 1.75, mb: 4 }}
              >
                Để lại thông tin nhu cầu xây dựng cơ bản của bạn. Đội ngũ Kiến
                trúc sư & Kỹ sư CSKH của chúng tôi sẽ liên hệ khảo sát, lên khái
                toán chi phí và hoàn thiện hồ sơ chi tiết cùng bạn.
              </Typography>

              <Grid container spacing={2} sx={{ mb: 4 }}>
                {[
                  {
                    icon: <ArchitectureOutlinedIcon sx={{ color: "#fbbf24" }} />,
                    title: "Thiết kế & Pháp lý",
                    desc: "Hồ sơ kiến trúc, kết cấu, xin phép xây dựng đồng bộ.",
                  },
                  {
                    icon: <EngineeringOutlinedIcon sx={{ color: "#38bdf8" }} />,
                    title: "Thi công Trọn gói",
                    desc: "Giám sát chặt chẽ từng giai đoạn, cam kết vật tư chuẩn.",
                  },
                  {
                    icon: <FactoryOutlinedIcon sx={{ color: "#4ade80" }} />,
                    title: "Nhà xưởng & Thép",
                    desc: "Gia công & lắp dựng kết cấu thép công nghiệp tối ưu.",
                  },
                  {
                    icon: <PhoneInTalkOutlinedIcon sx={{ color: "#f472b6" }} />,
                    title: "Phản hồi trong 2h",
                    desc: "Chuyên viên CSKH tiếp nhận tự động ngay trên hệ thống.",
                  },
                ].map((item, idx) => (
                  <Grid item xs={12} sm={6} key={idx}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2.5,
                        bgcolor: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#fff",
                        height: "100%",
                      }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="flex-start">
                        <Box sx={{ mt: 0.25 }}>{item.icon}</Box>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={700}>
                            {item.title}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "#cbd5e1", display: "block", mt: 0.5 }}
                          >
                            {item.desc}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {/* Luồng đồng bộ CRM minh họa cho người test */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 2.5,
                  bgcolor: "rgba(15, 23, 42, 0.65)",
                  border: "1px dashed rgba(251, 191, 36, 0.45)",
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight={700}
                  sx={{ color: "#fbbf24", letterSpacing: 0.5 }}
                >
                  LUỒNG ĐỒNG BỘ TỰ ĐỘNG VỀ MODULE KHÁCH HÀNG (CRM)
                </Typography>
                <Stack spacing={1} sx={{ mt: 1.25 }}>
                  <Typography variant="body2" sx={{ color: "#e2e8f0" }}>
                    <strong>Bước 1:</strong> Khách điền các trường cốt lõi tại Form
                    Website này (không cần đăng nhập).
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#e2e8f0" }}>
                    <strong>Bước 2:</strong> Hệ thống tự tạo bản ghi{" "}
                    <code>KH...</code> ở giai đoạn <strong>Tiềm năng (LEAD)</strong>{" "}
                    kèm lịch hẹn gọi lại cho CSKH.
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#e2e8f0" }}>
                    <strong>Bước 3:</strong> Nhân viên CSKH mở hồ sơ trong CMS, gọi
                    tư vấn và bổ sung dần CCCD/MST, Tài khoản ngân hàng, Báo giá &
                    Dự án.
                  </Typography>
                </Stack>
              </Paper>
            </Grid>

            {/* RIGHT LEAD CAPTURE FORM */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={12}
                sx={{
                  p: { xs: 3, sm: 4 },
                  borderRadius: 3.5,
                  bgcolor: "#ffffff",
                  color: "#0f172a",
                }}
              >
                {submittedResult ? (
                  <Box sx={{ py: 2, textAlign: "center" }}>
                    <CheckCircleOutlineIcon
                      sx={{ fontSize: 64, color: "#16a34a", mb: 1.5 }}
                    />
                    <Typography variant="h5" fontWeight={800} gutterBottom>
                      Đã tiếp nhận yêu cầu tư vấn!
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 3 }}
                    >
                      {submittedResult.existingCustomer
                        ? "Số điện thoại của quý khách đã có trên hệ thống. Yêu cầu tư vấn mới đã được gắn trực tiếp vào lịch sử chăm sóc của hồ sơ:"
                        : "Thông tin đăng ký từ Website đã được tạo thành bản ghi Khách hàng mới trong hệ thống CRM:"}
                    </Typography>

                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2.5,
                        borderRadius: 2.5,
                        bgcolor: "#f0fdf4",
                        borderColor: "#86efac",
                        mb: 3,
                        textAlign: "left",
                      }}
                    >
                      <Stack spacing={1}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Mã hồ sơ khách hàng:
                          </Typography>
                          <Chip
                            size="small"
                            color="success"
                            label={submittedResult.code}
                            sx={{ fontWeight: 700 }}
                          />
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Tên khách hàng / đơn vị:
                          </Typography>
                          <Typography variant="body2" fontWeight={700}>
                            {submittedResult.name}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Giai đoạn Pipeline khởi tạo:
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight={700}
                            color="primary.main"
                          >
                            Tiềm năng (Chưa liên hệ)
                          </Typography>
                        </Stack>
                      </Stack>
                    </Paper>

                    <Stack spacing={1.5}>
                      <Button
                        fullWidth
                        size="large"
                        variant="contained"
                        endIcon={<LaunchIcon />}
                        onClick={() =>
                          router.push({
                            pathname: `${ROUTES.CUSTOMER}/${submittedResult.id}`,
                            query: { actionType: "VIEW" },
                          })
                        }
                        sx={{
                          py: 1.4,
                          fontWeight: 700,
                          textTransform: "none",
                          bgcolor: "#0f172a",
                          "&:hover": { bgcolor: "#1e293b" },
                        }}
                      >
                        Mở hồ sơ khách hàng này trong CMS (CSKH bổ sung tiếp)
                      </Button>

                      <Button
                        fullWidth
                        size="medium"
                        variant="outlined"
                        onClick={() => {
                          setSubmittedResult(null);
                          setForm(initialFormState);
                        }}
                        sx={{ textTransform: "none" }}
                      >
                        Gửi thử thêm một form khách hàng khác
                      </Button>
                    </Stack>
                  </Box>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      spacing={1}
                      sx={{ mb: 1 }}
                    >
                      <Typography variant="h6" fontWeight={800}>
                        Đăng ký Tư vấn & Báo giá
                      </Typography>

                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          variant="text"
                          startIcon={<AutoFixHighOutlinedIcon fontSize="small" />}
                          onClick={handleFillSampleIndividual}
                          sx={{ textTransform: "none", fontSize: "0.75rem" }}
                        >
                          Mẫu Cá nhân
                        </Button>
                        <Button
                          size="small"
                          variant="text"
                          startIcon={<AutoFixHighOutlinedIcon fontSize="small" />}
                          onClick={handleFillSampleBusiness}
                          sx={{ textTransform: "none", fontSize: "0.75rem" }}
                        >
                          Mẫu Doanh nghiệp
                        </Button>
                      </Stack>
                    </Stack>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mb: 2.5 }}
                    >
                      Chỉ cần điền các thông tin cơ bản bên dưới — chuyên viên tư
                      vấn sẽ liên hệ và hoàn thiện hồ sơ chi tiết cùng quý khách.
                    </Typography>

                    {/* Chọn Cá nhân / Doanh nghiệp */}
                    <ToggleButtonGroup
                      fullWidth
                      exclusive
                      size="small"
                      value={form.customerType}
                      onChange={(_, val: CustomerType | null) => {
                        if (val) handleChange("customerType", val);
                      }}
                      sx={{ mb: 2.5 }}
                    >
                      <ToggleButton
                        value="INDIVIDUAL"
                        sx={{ textTransform: "none", fontWeight: 600, py: 1 }}
                      >
                        <PersonOutlineIcon fontSize="small" sx={{ mr: 0.75 }} />
                        Cá nhân / Hộ gia đình
                      </ToggleButton>
                      <ToggleButton
                        value="BUSINESS"
                        sx={{ textTransform: "none", fontWeight: 600, py: 1 }}
                      >
                        <BusinessOutlinedIcon
                          fontSize="small"
                          sx={{ mr: 0.75 }}
                        />
                        Doanh nghiệp / Chủ đầu tư
                      </ToggleButton>
                    </ToggleButtonGroup>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={7}>
                        <TextField
                          fullWidth
                          size="small"
                          required
                          label={
                            form.customerType === "BUSINESS"
                              ? "Tên doanh nghiệp / chủ đầu tư"
                              : "Họ và tên khách hàng"
                          }
                          placeholder={
                            form.customerType === "BUSINESS"
                              ? "VD: Công ty TNHH Xây Dựng ABC"
                              : "VD: Nguyễn Văn An"
                          }
                          value={form.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                        />
                      </Grid>

                      <Grid item xs={12} sm={5}>
                        <TextField
                          fullWidth
                          size="small"
                          required
                          label="Số điện thoại liên hệ"
                          placeholder="VD: 0912 345 678"
                          value={form.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                        />
                      </Grid>

                      {form.customerType === "BUSINESS" && (
                        <>
                          <Grid item xs={12} sm={7}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Người liên hệ / Đại diện"
                              placeholder="VD: Anh Bảo - Trưởng phòng Dự án"
                              value={form.representativeName}
                              onChange={(e) =>
                                handleChange(
                                  "representativeName",
                                  e.target.value
                                )
                              }
                            />
                          </Grid>
                          <Grid item xs={12} sm={5}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Mã số thuế (không bắt buộc)"
                              placeholder="CSKH có thể bổ sung sau"
                              value={form.taxCode}
                              onChange={(e) =>
                                handleChange("taxCode", e.target.value)
                              }
                            />
                          </Grid>
                        </>
                      )}

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          size="small"
                          type="email"
                          label="Email nhận báo giá"
                          placeholder="example@gmail.com"
                          value={form.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          size="small"
                          select
                          label="Ngân sách dự kiến"
                          value={form.estimatedBudget}
                          onChange={(e) =>
                            handleChange("estimatedBudget", e.target.value)
                          }
                        >
                          {BUDGET_OPTIONS.map((opt) => (
                            <MenuItem key={opt} value={opt}>
                              {opt}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Khu vực / Địa điểm dự kiến xây dựng"
                          placeholder="VD: Quận 7, TP.HCM hoặc KCN Tân Bình..."
                          value={form.address}
                          onChange={(e) =>
                            handleChange("address", e.target.value)
                          }
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Typography
                          variant="caption"
                          fontWeight={600}
                          color="text.secondary"
                          sx={{ display: "block", mb: 0.75 }}
                        >
                          Hạng mục quan tâm
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                          {SERVICE_OPTIONS.map((srv) => {
                            const selected = form.serviceInterest === srv;
                            return (
                              <Chip
                                key={srv}
                                label={srv}
                                size="small"
                                clickable
                                color={selected ? "primary" : "default"}
                                variant={selected ? "filled" : "outlined"}
                                onClick={() =>
                                  handleChange("serviceInterest", srv)
                                }
                              />
                            );
                          })}
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Quy mô / Diện tích khu đất dự kiến"
                          placeholder="VD: Đất 5x20m xây 4 tầng, hoặc nhà xưởng 2.000m²..."
                          value={form.projectScale}
                          onChange={(e) =>
                            handleChange("projectScale", e.target.value)
                          }
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          size="small"
                          multiline
                          rows={3}
                          label="Ghi chú nhu cầu tư vấn"
                          placeholder="Mô tả sơ bộ mong muốn về công năng, thời gian dự kiến khởi công..."
                          value={form.message}
                          onChange={(e) =>
                            handleChange("message", e.target.value)
                          }
                        />
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 2.5 }} />

                    <Button
                      fullWidth
                      type="submit"
                      size="large"
                      variant="contained"
                      disabled={submitting}
                      startIcon={
                        submitting ? (
                          <CircularProgress size={18} color="inherit" />
                        ) : (
                          <SendOutlinedIcon />
                        )
                      }
                      sx={{
                        py: 1.4,
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        textTransform: "none",
                        bgcolor: "#f59e0b",
                        color: "#0f172a",
                        "&:hover": {
                          bgcolor: "#d97706",
                          color: "#fff",
                        },
                      }}
                    >
                      {submitting
                        ? "Đang gửi thông tin..."
                        : "Gửi yêu cầu tư vấn miễn phí"}
                    </Button>

                    <Alert
                      severity="info"
                      sx={{ mt: 2, py: 0.5, fontSize: "0.78rem" }}
                    >
                      Mẹo test nhanh: Bấm <strong>Mẫu Cá nhân</strong> hoặc{" "}
                      <strong>Mẫu Doanh nghiệp</strong> ở góc trên form rồi nhấn{" "}
                      <strong>Gửi yêu cầu</strong> để kiểm tra bản ghi tự đổ về
                      module Khách hàng.
                    </Alert>
                  </form>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
