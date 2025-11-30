import { Button, Grid, TextField } from "@mui/material";
import Image from "next/image";
import statistics from "@/assets/svg/statistics.svg";
import { CoreTableCustom } from "@/components/organism/CoreTableCustom";
import PageContainer from "@/components/organism/PageContainer";
import { CoreBreadcrumbs } from "@/components/atoms/CoreBreadcrumbs";
import { CoreButton } from "@/components/atoms/CoreButton";
import useEmployeeList from "@/components/template/Constructor/employee/employeeList/useEmployeeList";
import router from "next/router";
import CoreInputCustom from "@/components/atoms/CoreInputCustom";
import { useForm } from "react-hook-form";
import CoreAutocomplete from "@/components/atoms/CoreAutocomplete";
import { CoreTable } from "@/components/organism/CoreTable";

export default function Employee() {
  const [value, handle] = useEmployeeList();

  const { columns, tableData, page, rowsPerPage } = value;
  const { setPage, setRowsPerPage } = handle;
  const { control } = useForm();
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        height: "100vh",
        overflowY: "hidden",
        overflowX: "hidden",
      }}
    >
      <PageContainer
        title={<CoreBreadcrumbs breadcrumbs={[{ title: "Quản lý nhân sư" }]} />}
      >
        <form className="flex flex-col py-6 ">
          <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12} sm={12} md={6} lg={4}>
              <CoreInputCustom
                control={control}
                name="search"
                label="Tìm kiếm"
                placeholder="Tìm kiếm theo mã nhân viên"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4}>
              <CoreAutocomplete
                options={[
                  { label: "Quản trị viên", value: "admin" },
                  { label: "Quản lý", value: "manager" },
                  { label: "Nhân viên", value: "staff" },
                ]}
                control={control}
                name="role"
                label="Chức vụ"
                placeholder="Chọn chức vụ"
                valuePath="value"
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={4}></Grid>
          </Grid>
        </form>
        <div className="flex justify-end py-5">
          <CoreButton
            onClick={() => {
              router.push("/Constructor/Employee/addNew");
            }}
            theme="submit"
          >
            {"Thêm mới"}
          </CoreButton>
        </div>
        <CoreTable
          tableName="abc"
          columns={columns || []}
          data={tableData || []}
          page={page}
          isShowColumnStt
        />
      </PageContainer>
    </Grid>
  );
}
