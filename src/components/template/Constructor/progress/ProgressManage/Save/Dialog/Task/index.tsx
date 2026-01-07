import CoreAutocomplete from "@/components/atoms/CoreAutocomplete";
import CoreAutoCompleteAPI from "@/components/atoms/CoreAutoCompleteAPI";
import { CoreButton } from "@/components/atoms/CoreButton";
import { CoreDatePicker } from "@/components/atoms/CoreDatePicker";
import CoreInputCustom from "@/components/atoms/CoreInputCustom";
import EditText from "@/components/atoms/EditText";
import { useDialog } from "@/components/hooks/dialog/useDialog";
import { CoreDialog } from "@/components/organism/CoreDialog";
import { getEmployeeList } from "@/service/constructor/Employee/getList";
import { Grid, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import useTask from "./useTask";
import TaskSave from "./useTask";
import { WorkProgressRow } from "../../components/progressTimeline/MainTaskSection";
type TaskProps = {
  onSubmitSuccess: (data: WorkProgressRow) => void;
};
export default function Task({ onSubmitSuccess }: TaskProps) {
  const [value, handle] = TaskSave({ onSubmitSuccess });
  const { hideDialog } = useDialog();
  const { isView, control, id } = value;
  const { onSubmit } = handle;
  return (
    <CoreDialog title={"Thêm mới công việc"} onClose={hideDialog} width={1200}>
      <form className="flex flex-col px-10 mt-5  " onSubmit={onSubmit}>
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
                required: "Bạn phải nchọn ngày kết thúc",
              }}
            />
          </Grid>
          <br />
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Typography>Công việc được giao cho</Typography>

            <CoreAutoCompleteAPI
              name="taskStaffMaps"
              control={control}
              fetchDataFn={getEmployeeList}
              label={" "}
              labelPath="name"
              valuePath="id"
              placeholder={"Chọn nhân viên giao việc"}
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
            <Typography>Mức độ ưu tiên</Typography>

            <CoreAutocomplete
              name="priorityLevel"
              control={control!}
              options={[
                {
                  label: "Cao",
                  value: "HIGH",
                },
                {
                  label: "Trung Bình",
                  value: "MEDIUM",
                },
                {
                  label: "Thấp",
                  value: "LOW",
                },
              ]}
              label={" "}
              placeholder={"Chọn mức độ ưu tiên của công việc"}
              required
              rules={{
                required: "Bạn cần chọn mức độ ưu tiên công việc",
              }}
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
