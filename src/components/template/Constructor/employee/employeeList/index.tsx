import { Button, Grid, TextField } from "@mui/material";
import Image from "next/image";
import statistics from "@/assets/svg/statistics.svg";
import { CoreTableCustom } from "@/components/organism/CoreTableCustom";
import PageContainer from "@/components/organism/PageContainer";
import { CoreBreadcrumbs } from "@/components/atoms/CoreBreadcrumbs";
import { CoreButton } from "@/components/atoms/CoreButton";
import useEmployeeList from "@/components/template/Constructor/employee/employeeList/useEmployeeList";
import router from "next/router";

export default function Employee() {
  const [value, handle] = useEmployeeList();

  const { columns, tableData, page, rowsPerPage } = value;
  const { setPage, setRowsPerPage } = handle;
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
              <TextField
                // error
                id="standard"
                label="Tìm kiếm"
                placeholder="Tìm kiếm theo mã khách hàng"
                variant="standard"
                focused
                sx={{ width: "100%", padding: "0" }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4}>
              <TextField
                // error
                id="standard"
                label="Trạng thái"
                placeholder="Đang tư vấn"
                variant="standard"
                focused
                sx={{ width: "100%", padding: "0" }}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={4}></Grid>
          </Grid>
        </form>
        <div className="flex justify-end py-5">
          <CoreButton onClick={() => {}} theme="submit">
            {"Thêm mới"}
          </CoreButton>
        </div>
        <CoreTableCustom
          columns={columns || []}
          rows={tableData || []}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
        />
      </PageContainer>
    </Grid>
  );
}
