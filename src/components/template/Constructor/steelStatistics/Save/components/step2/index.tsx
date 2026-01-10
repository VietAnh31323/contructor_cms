import CoreInputCustom from "@/components/atoms/CoreInputCustom";
import { Grid, InputAdornment, TextField, Typography } from "@mui/material";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EditText from "@/components/atoms/EditText";
import CoreAutocomplete from "@/components/atoms/CoreAutocomplete";
import { Label } from "@mui/icons-material";
import { values } from "lodash";
import { CoreButton } from "@/components/atoms/CoreButton";
import { TableCollapse } from "@/components/organism/TableCollapse";
import useStep2 from "./useStep2";
import CollapseRow from "./CollapseRow";
export default function Step2() {
  const [date, setDate] = useState<Date | null>(null);
  const [handle, values] = useStep2();
  const { columns, tableData } = values;
  const { control } = useForm();
  const [editorText, setEditorText] = useState("");
  return (
    <form className="flex flex-col py-6 ">
      <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Typography sx={{ fontWeight: 700 }}>
            Thêm bảng thống kê thép
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4}>
          <CoreAutocomplete
            control={control}
            name="ds"
            label="Danh sách bảng thống kê"
            placeholder=" "
            options={[
              {
                Label: "BTKT1",
                values: "BTKT1",
              },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4}></Grid>
        <Grid item xs={12} sm={12} md={6} lg={4} className="items-center">
          <CoreButton>Thêm bảng thống kê thép</CoreButton>
        </Grid>
        <br />
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Typography
            sx={{
              fontWeight: 700,
            }}
          >
            Thêm cấu kiện
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={3} lg={2}>
          <CoreInputCustom
            control={control}
            name="name"
            label="Tên cấu kiện"
            placeholder=" "
            required
            rules={{ required: "Trường này là bắt buộc" }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={3} lg={2}>
          <CoreInputCustom
            control={control}
            name="qty"
            label="Số lượng bộ phận giống nhau"
            placeholder=" "
            required
            rules={{ required: "Trường này là bắt buộc" }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={3} lg={2}>
          <CoreAutocomplete
            control={control}
            name="dsck"
            label="DS. Cấu kiện"
            placeholder=" "
            options={[
              {
                Label: "BTKT1",
                values: "BTKT1",
              },
            ]}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          lg={6}
          className=" flex gap-4 items-center justify-center"
        >
          <CoreButton>Thêm cấu kiện</CoreButton>
          <CoreButton>Xóa cấu kiện</CoreButton>
          <CoreButton>Chỉnh sửa</CoreButton>
        </Grid>
        <br />
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <TableCollapse
            nameCheck="name"
            columns={columns}
            data={tableData}
            isShowColumnStt
            tableName="abc"
            paginationHidden
            renderCollapse={(row) => {
              return <CollapseRow row={row.id} />;
            }}
          />
        </Grid>
      </Grid>
    </form>
  );
}
