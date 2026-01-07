import { Button, Grid, TextField, Typography } from "@mui/material";

import PageContainer from "@/components/organism/PageContainer";
import { CoreBreadcrumbs } from "@/components/atoms/CoreBreadcrumbs";
import { CoreButton } from "@/components/atoms/CoreButton";
import useEmployeeList from "@/components/template/Constructor/employee/employeeList/useEmployeeList";
import CoreInputCustom from "@/components/atoms/CoreInputCustom";
import { useForm } from "react-hook-form";
import CoreAutocomplete from "@/components/atoms/CoreAutocomplete";
import { CoreTable } from "@/components/organism/CoreTable";
import useProgressProjectList from "./useProgressManageList";
import { ROUTES } from "@/routes";
import router from "next/router";
import useProgressManageList from "./useProgressManageList";

export default function ProgressManageList() {
  const [value, handle] = useProgressManageList();

  const { columns, tableData, page, rowsPerPage } = value;
  const { setPage, setRowsPerPage } = handle;
  const { control } = useForm();
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
          <CoreBreadcrumbs breadcrumbs={[{ title: "Quản lý tiến độ dự án" }]} />
        }
      >
        <form className="flex flex-col py-6 ">
          <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12} sm={12} md={6} lg={4}>
              <CoreInputCustom
                control={control}
                name="search"
                label="Tìm kiếm"
                placeholder="Tìm kiếm theo mã dự án"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4}>
              <CoreAutocomplete
                options={[
                  { label: "Hoàn thành", value: "admin" },
                  { label: "Đang thực hiện", value: "manager" },
                  { label: "Chưa hoàn thành", value: "staff" },
                ]}
                control={control}
                name="role"
                label="Trạng thái"
                placeholder="Chọn trạng thái"
                valuePath="value"
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={4}>
              <div className="py-4 flex justify-center gap-4 items-center">
                <CoreButton onClick={() => {}} theme="cancel">
                  Hủy
                </CoreButton>
                <CoreButton theme="submit" type="submit">
                  Tìm kiếm
                </CoreButton>
              </div>
            </Grid>
          </Grid>
        </form>
        <div className="flex justify-end py-5">
          <CoreButton
            onClick={() => {
              router.push(ROUTES.PROGRESS_MANAGE + "/addNew");
            }}
            theme="submit"
          >
            {"Thêm mới "}
          </CoreButton>
        </div>
        <CoreTable
          tableName="abc"
          columns={columns || []}
          data={tableData || []}
          page={page}
          isShowColumnStt
          onRowClick={(id: number) => {
            router.push({
              pathname: `${ROUTES.PROGRESS_MANAGE}/${id}`,
              query: { actionType: "VIEW" },
            });
          }}
        />
      </PageContainer>
    </Grid>
  );
}
