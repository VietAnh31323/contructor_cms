import { Grid } from "@mui/material";
import PageContainer from "@/components/organism/PageContainer";
import { CoreBreadcrumbs } from "@/components/atoms/CoreBreadcrumbs";
import { CoreButton } from "@/components/atoms/CoreButton";
import useEmployeeList from "@/components/template/Constructor/employee/employeeList/useEmployeeList";
import router from "next/router";
import CoreInputCustom from "@/components/atoms/CoreInputCustom";
import CoreAutocomplete from "@/components/atoms/CoreAutocomplete";
import { CoreTable } from "@/components/organism/CoreTable";
import { ROUTES } from "@/routes";
import Can from "@/components/atoms/Can";
import { PERMISSIONS } from "@/helper/permissions";
import {
  DEPARTMENT_OPTIONS,
  POSITION_OPTIONS,
  STAFF_STATUS_OPTIONS,
} from "../constants";

export default function Employee() {
  const [value, handle] = useEmployeeList();

  const { columns, tableData, page, size, totalPages, isLoading, control } =
    value;
  const { onSubmit, onReset, onChangePageSize } = handle;

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
          <CoreBreadcrumbs breadcrumbs={[{ title: "Quản lý nhân sự" }]} />
        }
      >
        <form className="flex flex-col py-6" onSubmit={onSubmit}>
          <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <CoreInputCustom
                control={control}
                name="search"
                label="Tìm kiếm"
                placeholder="Mã, tên, email, SĐT, CCCD..."
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CoreAutocomplete
                options={POSITION_OPTIONS}
                control={control}
                name="position"
                label="Chức vụ"
                placeholder="Tất cả chức vụ"
                valuePath="value"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CoreAutocomplete
                options={DEPARTMENT_OPTIONS}
                control={control}
                name="department"
                label="Phòng ban"
                placeholder="Tất cả phòng ban"
                valuePath="value"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CoreAutocomplete
                options={STAFF_STATUS_OPTIONS}
                control={control}
                name="status"
                label="Trạng thái làm việc"
                placeholder="Tất cả trạng thái"
                valuePath="value"
              />
            </Grid>

            <Grid item xs={12}>
              <div className="pt-2 flex justify-center gap-4 items-center">
                <CoreButton onClick={onReset} theme="cancel">
                  Làm mới
                </CoreButton>
                <CoreButton theme="submit" type="submit">
                  Tìm kiếm
                </CoreButton>
              </div>
            </Grid>
          </Grid>
        </form>

        <Can permission={PERMISSIONS.USER_MANAGE}>
          <div className="flex justify-end pb-4">
            <CoreButton
              onClick={() => {
                router.push(ROUTES.EMPLOYEE + "/addNew");
              }}
              theme="submit"
            >
              Thêm mới
            </CoreButton>
          </div>
        </Can>

        <CoreTable
          tableName="employee-table"
          columns={columns || []}
          data={tableData || []}
          page={page}
          size={size}
          totalPages={totalPages}
          isLoading={isLoading}
          onChangePageSize={onChangePageSize}
          isShowColumnStt
          onRowClick={(id: number) => {
            router.push({
              pathname: `${ROUTES.EMPLOYEE}/${id}`,
              query: { actionType: "VIEW" },
            });
          }}
        />
      </PageContainer>
    </Grid>
  );
}
