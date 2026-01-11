import { Grid } from "@mui/material";
import PageContainer from "@/components/organism/PageContainer";
import { CoreBreadcrumbs } from "@/components/atoms/CoreBreadcrumbs";
import CoreNavbar from "@/components/organism/CoreNavbar";
import { ROUTES } from "@/routes";
import { useState } from "react";
import CoreStep from "@/components/atoms/CoreStep"; // <-- thêm CoreStep
import { divide } from "lodash";
import { CoreButton } from "@/components/atoms/CoreButton";
import Step1 from "./components/step1";
import Step2 from "./components/step2";
import useSteelStatisticsSave from "./useSteelStatisticsSave";
import { FormProvider } from "react-hook-form";
import CoreLoading from "@/components/molecules/CoreLoading";
import { TopAction } from "@/components/molecules/TopAction";

export default function SteelStatisticsSave() {
  const [value, handle] = useSteelStatisticsSave();
  const { methodForm, isView, isUpdate, id, step, router, isLoading } = value;
  const { onSubmit, handleChangeStep, setStepData } = handle;
  const stepList = ["Thông tin chung", "Chi tiết thống kê"];

  // const [step, setStep] = useState(0);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <PageContainer
        title={
          <CoreBreadcrumbs
            breadcrumbs={[
              {
                title: "Danh sách dự án thông kê thép",
                pathname: ROUTES.STEELSTATISTICS,
              },
              { title: "Thêm mới" },
            ]}
          />
        }
      >
        {isView ? (
          <>
            {isLoading ? (
              <div className="min-h-[600px] flex flex-col justify-center">
                <CoreLoading />
              </div>
            ) : (
              <div className="space-y-10 mb-5">
                <CoreNavbar
                  breadcrumbs={[
                    {
                      title: "Thông tin chung",
                      content: (
                        <FormProvider {...methodForm}>
                          <form onSubmit={onSubmit}>
                            <Step1 handleChangeStep={handleChangeStep} />
                          </form>
                        </FormProvider>
                      ),
                      rightAction: (
                        <TopAction
                          actionList={["delete", "edit"]}
                          onEditAction={() => {
                            // router.push({
                            //   pathname: MENU_URL.DOCUMENT_MANAGEMENT + '/[id]',
                            //   query: { id },
                            // })
                            console.log("fff");
                          }}
                          onDeleteAction={() => {}}
                        />
                      ),
                    },
                  ]}
                  isFitContent
                />

                <CoreNavbar
                  isFitContent
                  breadcrumbs={[
                    {
                      title: "Thống kê thép",
                      content: (
                        <FormProvider {...methodForm}>
                          <form onSubmit={onSubmit}>
                            <Step2
                              onSubmit={onSubmit}
                              onChange={(data) =>
                                setStepData((prev) => ({
                                  ...prev,
                                  step2: data,
                                }))
                              }
                            />
                          </form>
                        </FormProvider>
                      ),
                    },
                  ]}
                />
              </div>
            )}
          </>
        ) : (
          <CoreNavbar
            breadcrumbs={[
              {
                title: "Thêm mới",
                content: (
                  <div>
                    <FormProvider {...methodForm}>
                      <div className="mt-4 mb-8 mx-80">
                        <CoreStep
                          step={step}
                          stepList={stepList}
                          onChangeStep={handleChangeStep}
                        />
                      </div>
                      <form>
                        <div className="mt-6 ">
                          {step === 0 && (
                            <Step1
                              handleChangeStep={handleChangeStep}
                              onChange={(data) =>
                                setStepData((prev) => ({
                                  ...prev,
                                  step1: data,
                                }))
                              }
                            />
                          )}

                          {step === 1 && (
                            <Step2
                              onSubmit={onSubmit}
                              onChange={(data) =>
                                setStepData((prev) => ({
                                  ...prev,
                                  step2: data,
                                }))
                              }
                            />
                          )}
                        </div>
                      </form>
                    </FormProvider>
                  </div>
                ),
              },
            ]}
          />
        )}
      </PageContainer>
    </Grid>
  );
}
