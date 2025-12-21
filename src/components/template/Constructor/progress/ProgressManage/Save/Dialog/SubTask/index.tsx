import CoreAutoCompleteAPI from "@/components/atoms/CoreAutoCompleteAPI";
import { CoreDatePicker } from "@/components/atoms/CoreDatePicker";
import CoreInputCustom from "@/components/atoms/CoreInputCustom";
import EditText from "@/components/atoms/EditText";
import { useDialog } from "@/components/hooks/dialog/useDialog";
import { CoreDialog } from "@/components/organism/CoreDialog";
import { getEmployeeList } from "@/service/constructor/Employee/getList";
import { Grid, Typography } from "@mui/material";
import { useForm } from "react-hook-form";

export default function SubTask() {
  const { hideDialog } = useDialog();
  const { control } = useForm();
  return (
    <CoreDialog
      title={"Thêm mới công việc con"}
      onClose={hideDialog}
      width={1200}
    >
      <form className="flex flex-col px-10  ">
        <Grid spacing={{ xs: 1, sm: 2, md: 3 }}>
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
              name="date"
              control={control!}
              label={"Ngày sinh"}
              required
              rules={{
                required: "Bạn phải nhập ngày sinh",
              }}
            />
          </Grid>
          <br />
          <Typography>Công việc được giao cho</Typography>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <CoreAutoCompleteAPI
              name="date"
              control={control!}
              fetchDataFn={getEmployeeList}
              label={" "}
              placeholder={"Chọn nhân viên giao việc"}
              required
              rules={{
                required: "Bạn phải chọn người được giao task",
              }}
            />
          </Grid>
          <br />
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <CoreInputCustom
              control={control}
              name="note"
              label="Ghi chú"
              placeholder="Nhập chi chú"
              rows={5}
              multiline
            />
          </Grid>
        </Grid>
      </form>
    </CoreDialog>
  );
}
