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

export default function SteelStatisticsSave() {
  const stepList = ["Thông tin chung", "Chi tiết thống kê"];
  const [step, setStep] = useState(0);

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
        <CoreNavbar
          breadcrumbs={[
            {
              title: "Thêm mới",
              content: (
                <div>
                  <div className="mt-4 mb-8 mx-80">
                    <CoreStep
                      step={step}
                      stepList={stepList}
                      onChangeStep={(val) => setStep(val)}
                    />
                  </div>

                  <div className="mt-6 ">
                    {step === 0 && <Step1 />}
                    {step === 1 && <Step2 />}
                  </div>

                  <div className="flex gap-3 mt-8 justify-center">
                    {step > 0 && (
                      <Grid className="flex gap-5 ">
                        <CoreButton
                          className="px-4 py-2 bg-gray-400 text-white rounded"
                          onClick={() => setStep(step - 1)}
                        >
                          Quay lại
                        </CoreButton>
                        <CoreButton
                          className="px-4 py-2 bg-blue-600 text-white rounded"
                          onClick={() => setStep(step + 1)}
                        >
                          Lưu
                        </CoreButton>
                      </Grid>
                    )}

                    {step < stepList.length - 1 && (
                      <Grid className="flex gap-5 ">
                        <CoreButton
                          className="px-4 py-2 bg-blue-600 text-white rounded"
                          onClick={() => {}}
                        >
                          Hủy
                        </CoreButton>
                        <CoreButton
                          className="px-4 py-2 bg-blue-600 text-white rounded"
                          onClick={() => setStep(step + 1)}
                        >
                          Chuyển tiếp bước 2
                        </CoreButton>
                      </Grid>
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
