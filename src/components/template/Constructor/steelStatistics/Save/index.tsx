import { CoreBreadcrumbs } from "@/components/atoms/CoreBreadcrumbs";
import CoreLoading from "@/components/molecules/CoreLoading";
import PageContainer from "@/components/organism/PageContainer";
import { ROUTES } from "@/routes";
import {
  exportSteelProjectExcel,
  exportSteelProjectPdf,
} from "@/service/constructor/SteelProject";
import { toastError } from "@/toast";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ConstructionOutlinedIcon from "@mui/icons-material/ConstructionOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import SteelImportDialog, {
  triggerBlobDownload,
} from "./components/SteelImportDialog";
import Step1 from "./components/step1";
import Step2 from "./components/step2";
import useSteelStatisticsSave from "./useSteelStatisticsSave";

export default function SteelStatisticsSave() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const idParam = router.query.id ? Number(router.query.id) : undefined;
  const [importOpen, setImportOpen] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

  const {
    form,
    step,
    setStep,
    isView,
    isEdit,
    isLoadingDetail,
    isSaving,
    projects,
    steelCategories,
    assemblies,
    setAssemblies,
    summary,
    handleSelectMainProject,
    loadCategoryLinesForBar,
    onSubmit,
    onCancel,
    switchToEdit,
  } = useSteelStatisticsSave();

  const handleExportExcel = async () => {
    if (!idParam) return;
    try {
      setExportingExcel(true);
      const blob = await exportSteelProjectExcel(idParam);
      triggerBlobDownload(blob, `thong-ke-thep-${idParam}.xlsx`);
    } catch (err) {
      toastError(err, "Xuất file Excel thất bại");
    } finally {
      setExportingExcel(false);
    }
  };

  const handleExportPdf = async () => {
    if (!idParam) return;
    try {
      setExportingPdf(true);
      const blob = await exportSteelProjectPdf(idParam);
      triggerBlobDownload(blob, `thong-ke-thep-${idParam}.pdf`);
    } catch (err) {
      toastError(err, "Xuất file PDF thất bại");
    } finally {
      setExportingPdf(false);
    }
  };

  const pageTitle = isView
    ? "Chi tiết thống kê thép"
    : isEdit
    ? "Chỉnh sửa thống kê thép"
    : "Thêm mới thống kê thép";

  const currentName = form.watch("name");
  const currentCode = form.watch("code");

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="flex-start"
      sx={{ minHeight: "100vh", overflowY: "auto" }}
    >
      <PageContainer
        title={
          <CoreBreadcrumbs
            breadcrumbs={[
              {
                title: "Danh sách dự án thống kê thép",
                pathname: ROUTES.STEELSTATISTICS,
              },
              { title: pageTitle },
            ]}
          />
        }
      >
        {isLoadingDetail ? (
          <Box className="py-16 flex justify-center">
            <CoreLoading />
          </Box>
        ) : (
          <Stack spacing={3}>
            {/* ================= MODERN HERO SUMMARY HEADER ================= */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 3 },
                borderRadius: 3,
                color: "#ffffff",
                background:
                  "linear-gradient(135deg, #0f172a 0%, #1e3a8a 58%, #0284c7 100%)",
                boxShadow: "0 12px 28px rgba(15, 23, 42, 0.16)",
              }}
            >
              <Grid container spacing={2.5} alignItems="center">
                <Grid item xs={12} md={7}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <Chip
                      size="small"
                      icon={<ConstructionOutlinedIcon sx={{ color: "#bae6fd !important" }} />}
                      label={pageTitle}
                      sx={{
                        bgcolor: "rgba(255,255,255,0.14)",
                        color: "#e0f2fe",
                        fontWeight: 700,
                      }}
                    />
                    {currentCode && (
                      <Chip
                        size="small"
                        label={currentCode}
                        sx={{
                          bgcolor: "rgba(59,130,246,0.35)",
                          color: "#ffffff",
                          fontWeight: 700,
                        }}
                      />
                    )}
                  </Stack>

                  <Typography variant="h5" fontWeight={800}>
                    {currentName?.trim() || "Bảng thống kê cốt thép mới"}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={3}
                    flexWrap="wrap"
                    sx={{ mt: 1.5 }}
                  >
                    <Box>
                      <Typography variant="caption" sx={{ color: "#bae6fd" }}>
                        Cấu kiện
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={800}>
                        {assemblies.length} CK
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#bae6fd" }}>
                        Tổng chiều dài cắt
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={800}>
                        {summary.totalLength.toLocaleString("vi-VN", {
                          maximumFractionDigits: 2,
                        })}{" "}
                        m
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#bae6fd" }}>
                        Tổng khối lượng
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        fontWeight={800}
                        color="#fde047"
                      >
                        {summary.totalWeight.toLocaleString("vi-VN", {
                          maximumFractionDigits: 2,
                        })}{" "}
                        kg (
                        {(summary.totalWeight / 1000).toLocaleString("vi-VN", {
                          maximumFractionDigits: 3,
                        })}{" "}
                        tấn)
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>

                <Grid item xs={12} md={5}>
                  <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    justifyContent={{ xs: "flex-start", md: "flex-end" }}
                    gap={1}
                  >
                    {isEdit && idParam && (
                      <>
                        {!isView && (
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<UploadFileIcon />}
                            onClick={() => setImportOpen(true)}
                            sx={{
                              color: "#ffffff",
                              borderColor: "rgba(255,255,255,0.35)",
                              textTransform: "none",
                              "&:hover": { bgcolor: "rgba(255,255,255,0.12)" },
                            }}
                          >
                            Nhập Excel
                          </Button>
                        )}
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<FileDownloadIcon />}
                          disabled={exportingExcel}
                          onClick={handleExportExcel}
                          sx={{
                            color: "#ffffff",
                            borderColor: "rgba(255,255,255,0.35)",
                            textTransform: "none",
                            "&:hover": { bgcolor: "rgba(255,255,255,0.12)" },
                          }}
                        >
                          {exportingExcel ? "Đang xuất..." : "Xuất Excel"}
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<PictureAsPdfIcon />}
                          disabled={exportingPdf}
                          onClick={handleExportPdf}
                          sx={{
                            color: "#ffffff",
                            borderColor: "rgba(255,255,255,0.35)",
                            textTransform: "none",
                            "&:hover": { bgcolor: "rgba(255,255,255,0.12)" },
                          }}
                        >
                          {exportingPdf ? "Đang xuất..." : "Xuất PDF"}
                        </Button>
                      </>
                    )}

                    {isView ? (
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<EditOutlinedIcon />}
                        onClick={switchToEdit}
                        sx={{
                          bgcolor: "#ffffff",
                          color: "#0f172a",
                          fontWeight: 700,
                          textTransform: "none",
                          "&:hover": { bgcolor: "#e2e8f0" },
                        }}
                      >
                        Chỉnh sửa
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<SaveOutlinedIcon />}
                        disabled={isSaving}
                        onClick={onSubmit}
                        sx={{
                          bgcolor: "#10b981",
                          color: "#ffffff",
                          fontWeight: 700,
                          textTransform: "none",
                          "&:hover": { bgcolor: "#059669" },
                        }}
                      >
                        {isSaving
                          ? "Đang lưu..."
                          : isEdit
                          ? "Lưu thay đổi"
                          : "Lưu bảng thống kê"}
                      </Button>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </Paper>

            {/* ================= STEP TABS ================= */}
            <Paper
              variant="outlined"
              sx={{
                px: 2,
                borderRadius: 2.5,
                bgcolor: "#f8fafc",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              <Tabs value={step} onChange={(_, val) => setStep(val)}>
                <Tab
                  label="1. Thông tin chung & Dự án liên kết"
                  sx={{ fontWeight: 700, textTransform: "none" }}
                />
                <Tab
                  label={`2. Chi tiết cấu kiện & Thanh thép (${assemblies.length})`}
                  sx={{ fontWeight: 700, textTransform: "none" }}
                />
              </Tabs>

              <Stack direction="row" spacing={1} sx={{ py: 1 }}>
                <Button
                  size="small"
                  startIcon={<ArrowBackIcon />}
                  onClick={step === 0 ? onCancel : () => setStep(0)}
                  sx={{ textTransform: "none" }}
                >
                  {step === 0 ? "Danh sách" : "Về bước 1"}
                </Button>
                {step === 0 && (
                  <Button
                    size="small"
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => setStep(1)}
                    sx={{ textTransform: "none", fontWeight: 700 }}
                  >
                    Sang bảng thống kê thép
                  </Button>
                )}
              </Stack>
            </Paper>

            {/* ================= BODY ================= */}
            <Box>
              {step === 0 && (
                <Step1
                  form={form}
                  projects={projects}
                  isView={isView}
                  onSelectProject={handleSelectMainProject}
                />
              )}
              {step === 1 && (
                <Step2
                  assemblies={assemblies}
                  setAssemblies={setAssemblies}
                  steelCategories={steelCategories}
                  summary={summary}
                  isView={isView}
                  onSelectCategoryForBar={loadCategoryLinesForBar}
                />
              )}
            </Box>
          </Stack>
        )}
      </PageContainer>

      {idParam && (
        <SteelImportDialog
          open={importOpen}
          steelProjectId={idParam}
          onClose={() => setImportOpen(false)}
          onImported={(updated) => {
            queryClient.invalidateQueries({
              queryKey: ["/api/v1/steel-project", idParam],
            });
            queryClient.invalidateQueries({
              queryKey: ["/api/v1/steel-project/list"],
            });
            if (updated?.steelProjectAssemblyMaps) {
              setAssemblies(updated.steelProjectAssemblyMaps);
            }
          }}
        />
      )}
    </Grid>
  );
}
