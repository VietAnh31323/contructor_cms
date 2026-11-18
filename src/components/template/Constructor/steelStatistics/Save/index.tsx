import { CoreBreadcrumbs } from "@/components/atoms/CoreBreadcrumbs";
import { CoreButton } from "@/components/atoms/CoreButton";
import CoreStep from "@/components/atoms/CoreStep";
import CoreLoading from "@/components/molecules/CoreLoading";
import CoreNavbar from "@/components/organism/CoreNavbar";
import PageContainer from "@/components/organism/PageContainer";
import { ROUTES } from "@/routes";
import { Grid } from "@mui/material";
import Step1 from "./components/step1";
import Step2 from "./components/step2";
import useSteelStatisticsSave from "./useSteelStatisticsSave";

export default function SteelStatisticsSave() {
  const stepList = ["Thông tin chung", "Chi tiết thống kê"];
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
                  <div className="mt-4 mb-8 mx-auto max-w-xl">
                    <CoreStep
                      step={step}
                      stepList={stepList}
                      onChangeStep={(val) => setStep(val)}
                    />
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
    </Grid>
  );
}
