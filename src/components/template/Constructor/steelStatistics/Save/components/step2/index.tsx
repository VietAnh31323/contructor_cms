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
import useStep2, { AssemblyTableRow } from "./useStep2";
import CollapseRow from "./CollapseRow";
import CoreAutoCompleteAPI from "@/components/atoms/CoreAutoCompleteAPI";
import { getAssemblyList } from "@/service/constructor/Assembly/getList";
export default function Step2() {
  const [date, setDate] = useState<Date | null>(null);
  const [handle, values] = useStep2();
  const { columns, tableData, control, setValue } = values;
  const {
    onSubmitCreate,
    onSubmitUpdate,
    reloadAssemblyKey,
    onSubmitDelete,
    addAssemblyToTable,
    removeAssemblyFromTable,
    addSteelToAssemblyRow,
  } = handle;
  // console.log("addSteelToAssemblyRow", addSteelToAssemblyRow);
  console.log("🔥 Step2 tableData:", tableData);
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
                label: "BTKT1",
                value: "BTKT1",
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

        <Grid item xs={12} sm={12} md={12} lg={12}>
          <form className="flex gap-10">
            <Grid item xs={12} sm={12} md={3} lg={3}>
              <CoreInputCustom
                control={control}
                name="name"
                label="Tên cấu kiện"
                placeholder="Nhập tên cấu kiện"
                // required
                // rules={{ required: "Trường này là bắt buộc" }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={3}>
              <CoreInputCustom
                control={control}
                name="sameQuantity"
                label="Số lượng bộ phận giống nhau"
                placeholder="Nhập số lượng giống nhau"
                // required
                // rules={{ required: "Trường này là bắt buộc" }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={3}>
              <CoreAutoCompleteAPI
                control={control}
                name="assemblylist"
                label="DS. Cấu kiện"
                placeholder="Chọn DS. cấu kiện"
                fetchDataFn={getAssemblyList}
                reloadKey={reloadAssemblyKey}
                onChange={(event, value: any) => {
                  // value là bản ghi được chọn
                  setValue("id", value?.id);
                  setValue("name", value?.name || "");
                }}
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
              <CoreButton onClick={onSubmitCreate}>Thêm cấu kiện</CoreButton>
              <CoreButton onClick={onSubmitDelete}>Xóa cấu kiện</CoreButton>
              <CoreButton onClick={onSubmitUpdate}>Chỉnh sửa</CoreButton>
            </Grid>
          </form>
        </Grid>
        <br />
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <CoreButton onClick={addAssemblyToTable}>
            Thêm cấu kiện vào bảng thống kê thép
          </CoreButton>
        </Grid>

        <br />
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <TableCollapse
            nameCheck="assemblyName"
            columns={columns}
            data={tableData}
            isShowColumnStt
            tableName="abc"
            paginationHidden
            renderCollapse={(row) => {
              return (
                <CollapseRow
                  row={row}
                  onAddSteel={addSteelToAssemblyRow} // ⭐
                />
              );
            }}
          />
        </Grid>
      </Grid>
    </form>
  );
}
