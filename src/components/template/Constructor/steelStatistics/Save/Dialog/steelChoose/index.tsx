import CoreAutocomplete from "@/components/atoms/CoreAutocomplete";
import CoreAutoCompleteAPI from "@/components/atoms/CoreAutoCompleteAPI";
import { CoreButton } from "@/components/atoms/CoreButton";
import { CoreDatePicker } from "@/components/atoms/CoreDatePicker";
import CoreInputCustom from "@/components/atoms/CoreInputCustom";
import EditText from "@/components/atoms/EditText";
import { getEnum } from "@/components/atoms/TextColor";
import { useDialog } from "@/components/hooks/dialog/useDialog";
import { CoreDialog } from "@/components/organism/CoreDialog";
import { getEmployeeList } from "@/service/constructor/Employee/getList";
import { Box, Grid, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import SubTaskSave from "./useSteelChoose";
import useSteelChoose from "./useSteelChoose";
import { useState } from "react";
import { getSteelCategoryListLine } from "@/service/constructor/SteelCategory/getListLine";
import { SteelCategoryListLine } from "@/service/constructor/SteelCategory/getListLine/type";
interface SteelChooseProps {
  assemblyId: number;
  onSuccess: (steelRow: any) => void;
}

export default function SteelChooseSteelChoose({
  assemblyId,
  onSuccess,
}: SteelChooseProps) {
  const [value, handle] = useSteelChoose({ assemblyId, onSuccess });
  const { hideDialog } = useDialog();
  const { isView, control, id, data, setValue } = value;
  const { onSubmit } = handle;
  console.log("onSuccess from props:", onSuccess);

  const [selectedSteelId, setSelectedSteelId] = useState<number | null>(null);
  const [params, setParams] = useState<SteelCategoryListLine[]>([]);
  const [selectedSteel, setSelectedSteel] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSelectSteelType = async (steelCategoryId: number) => {
    try {
      setLoading(true);

      const res = await getSteelCategoryListLine({ steelCategoryId });

      // console.log("PARAM RESPONSE:", res);
      // console.log("PARAM ARRAY:", res.data);
      //@ts-ignore
      setParams(res.data);
    } catch (error) {
      console.error("Lỗi lấy thông số thanh thép", error);
    } finally {
      setLoading(false);
    }
  };

  // console.log("params", params);

  return (
    <CoreDialog
      title={"Thêm mới thanh thép trên cùng cấu kiện"}
      onClose={hideDialog}
      width={1200}
    >
      <form className="flex flex-col px-10 mt-5" onSubmit={onSubmit}>
        <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Typography
              style={{
                fontWeight: "bold",
              }}
            >
              Kiểu thanh thép
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Grid item xs={12}>
              <Grid container spacing={2} mt={1}>
                {data?.data?.content?.map((item: any) => {
                  const imageUrl = item.images?.[0]?.url;

                  const isSelected = selectedSteelId === item.id;

                  return (
                    <Grid item key={item.id}>
                      <Box
                        onClick={() => {
                          console.log("👉 Steel được chọn, id =", item.id);
                          setSelectedSteelId(item.id);
                          handleSelectSteelType(item.id);
                          // onSuccess({
                          //   id: item.id,
                          // });
                          setValue("images", item.images || []);
                        }}
                        sx={{
                          border: isSelected
                            ? "2px solid #1976d2"
                            : "1px solid #e0e0e0",
                          borderRadius: 2,
                          p: 1,
                          width: 200,
                          cursor: "pointer",
                          boxShadow: isSelected
                            ? "0 8px 20px rgba(25,118,210,0.35)"
                            : "none",
                          transform: isSelected ? "scale(1.05)" : "scale(1)",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <Box
                          component="img"
                          src={imageUrl}
                          alt={item.name}
                          sx={{
                            width: "100%",
                            height: 70,
                            objectFit: "contain",
                          }}
                        />
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          </Grid>
          {params.length > 0 && (
            <>
              <Grid item xs={12} mt={3}>
                <Typography fontWeight="bold">Thông số thanh thép</Typography>
              </Grid>

              {params.map((param) => (
                <Grid item xs={12} sm={6} md={4} key={param.id}>
                  <CoreInputCustom
                    control={control}
                    name={`steelLines.${param.paramName}`}
                    label={"Thông số " + "(" + param.paramName + ")"}
                    placeholder={`Nhập ${param.paramName}`}
                  />
                </Grid>
              ))}
            </>
          )}
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <Grid item xs={12} sm={12} md={3} lg={3}>
              <CoreInputCustom
                control={control}
                name="barCode"
                label="Số hiệu"
                placeholder="Nhập số hiệu kiểu thanh thép"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={3}>
              <CoreInputCustom
                control={control}
                name="barQuantity"
                label="Số thanh thép"
                placeholder="Nhập số thanh thép"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={3}>
              <CoreAutocomplete
                control={control}
                name="spliceLength"
                label="Chiều dài nối"
                options={[
                  {
                    label: "30",
                    value: " 30",
                  },
                  {
                    label: "40",
                    value: " 40",
                  },
                ]}
                placeholder="30"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={3}>
              <CoreInputCustom
                control={control}
                name="barDiameter"
                label="Đường kính"
                placeholder="Nhập đường kính thanh thép (mm)"
              />
            </Grid>
          </Grid>
        </Grid>
        <br />
        <div className="py-4 flex justify-center gap-4 items-center">
          <CoreButton onClick={() => {}} theme="cancel">
            {"Hủy bỏ"}
          </CoreButton>
          <CoreButton type="submit" theme="submit">
            {"Lưu"}
          </CoreButton>
        </div>
      </form>
    </CoreDialog>
  );
}
