import { CoreBreadcrumbs } from "@/components/atoms/CoreBreadcrumbs";
import { CoreButton } from "@/components/atoms/CoreButton";
import CoreStep from "@/components/atoms/CoreStep";
import CoreLoading from "@/components/molecules/CoreLoading";
import CoreNavbar from "@/components/organism/CoreNavbar";
import PageContainer from "@/components/organism/PageContainer";
import { ROUTES } from "@/routes";
import {
  exportSteelProjectExcel,
  exportSteelProjectPdf,
} from "@/service/constructor/SteelProject";
import { toastError } from "@/toast";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Button, Grid, Stack } from "@mui/material";
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
  const stepList = ["Thông tin chung", "Chi tiết thống kê"];
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

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="flex-start"
      sx={{
        minHeight: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
      }}
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
        <CoreNavbar
          breadcrumbs={[
            {
              title: pageTitle,
              content: isLoadingDetail ? (
                <div className="py-12 flex justify-center">
                  <CoreLoading />
                </div>
              ) : (
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mt-4 mb-6">
                    <div className="flex-1 min-w-[260px] max-w-xl">
                      <CoreStep
                        step={step}
                        stepList={stepList}
                        onChangeStep={(val) => setStep(val)}
                      />
                    </div>
                    {isEdit && idParam && (
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {!isView && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="secondary"
                            startIcon={<UploadFileIcon />}
                            onClick={() => setImportOpen(true)}
                          >
                            Nhập từ Excel
                          </Button>
                        )}
                        <Button
                          size="small"
                          variant="outlined"
                          color="success"
                          startIcon={<FileDownloadIcon />}
                          disabled={exportingExcel}
                          onClick={handleExportExcel}
                        >
                          {exportingExcel ? "Đang xuất..." : "Xuất Excel"}
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<PictureAsPdfIcon />}
                          disabled={exportingPdf}
                          onClick={handleExportPdf}
                        >
                          {exportingPdf ? "Đang xuất..." : "Xuất PDF"}
                        </Button>
                      </Stack>
                    )}
                  </div>

                  <div className="mt-6">
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
                  </div>

                  <div className="flex gap-3 mt-8 justify-center">
                    {step === 0 && (
                      <>
                        <CoreButton theme="cancel" onClick={onCancel}>
                          Hủy
                        </CoreButton>
                        <CoreButton
                          theme="submit"
                          onClick={() => setStep(1)}
                        >
                          Tiếp tục bước 2
                        </CoreButton>
                      </>
                    )}

                    {step === 1 && (
                      <>
                        <CoreButton
                          theme="cancel"
                          onClick={() => setStep(0)}
                        >
                          Quay lại
                        </CoreButton>
                        {isView ? (
                          <CoreButton theme="submit" onClick={switchToEdit}>
                            Chỉnh sửa
                          </CoreButton>
                        ) : (
                          <CoreButton
                            theme="submit"
                            loading={isSaving}
                            onClick={onSubmit}
                          >
                            {isEdit ? "Cập nhật" : "Lưu bảng thống kê"}
                          </CoreButton>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ),
            },
          ]}
        />
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
