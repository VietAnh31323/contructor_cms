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
import { Grid, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import SubTaskSave from "./useSubTask";
type TaskProps = {
  taskId: number;
  onSubmitSuccess?: (row: any) => void;
};
export default function SubTask({ taskId, onSubmitSuccess }: TaskProps) {
  const [value, handle] = SubTaskSave({ taskId, onSubmitSuccess });
  const { hideDialog } = useDialog();
  const { isView, control, id } = value;
  const { onSubmit } = handle;

  const getEmployeeLabel = (option: any) => {
    const positionLabel = getEnum(option.position, [
      { label: "Kiến trúc sư", value: "ARCHITECT" },
      { label: "Kĩ sư điện nước", value: "MEP_ENGINEER" },
      {
        label: "Kĩ sư kết cấu",
        value: "STRUCTURAL_ENGINEER",
      },
      { label: "Kĩ sư giám sát", value: "ESTIMATOR" },
      { label: "Dự toán viên", value: "SUPERVISOR" },
    ]);
    return `${option.name} - ${positionLabel}`;
  };

  return (
    <CoreDialog
      title={"Thêm mới công việc con"}
      onClose={hideDialog}
      width={1200}
    >
      <form className="flex flex-col px-10 mt-5" onSubmit={onSubmit}>
        <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <CoreInputCustom
              control={control}
              name="code"
              label="Mã công việc"
              placeholder="Nhập mã công việc"
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <CoreInputCustom
              control={control}
              name="name"
              label="Tên công việc"
              placeholder="Nhập tên công việc"
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <CoreDatePicker
              name="startDate"
              control={control!}
              label={"Thời gian bắt đầu"}
              required
              rules={{
                required: "Bạn phải chọn ngày bắt đầu",
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <CoreDatePicker
              name="endDate"
              control={control!}
              label={"Thời gian kết thúc"}
              required
              rules={{
                required: "Bạn phải chọn ngày kết thúc",
              }}
            />
          </Grid>
          <br />
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Typography>Người tạo công việc con</Typography>

            <CoreAutoCompleteAPI
              name="taskStaffMaps"
              control={control}
              fetchDataFn={getEmployeeList}
              label={" "}
              labelPath="name"
              valuePath="id"
              // labelPath="name"
              placeholder={"Chọn nhân viên "}
              required
              multiple
              rules={{
                required: "Bạn phải chọn người được giao task",
              }}
            />
          </Grid>
          <br />
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <CoreInputCustom
              control={control}
              name="description"
              label="Ghi chú"
              placeholder="Nhập chi chú"
              rows={5}
              multiline
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <Typography>Trạng thái công việc con</Typography>

            <CoreAutocomplete
              name="state"
              control={control!}
              options={[
                {
                  label: "Chưa bắt đầu",
                  value: "NOT_STARTED",
                },
                {
                  label: "Đang thực hiện",
                  value: "IN_PROGRESS",
                },
                {
                  label: "Hoàn thành",
                  value: "COMPLETED",
                },
              ]}
              label={" "}
              placeholder={"Chọn trạng thái của công việc con"}
            />
          </Grid>
        </Grid>
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
