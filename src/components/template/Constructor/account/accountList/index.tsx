import { Button, Grid, TextField } from "@mui/material";
import Image from "next/image";
import statistics from "@/assets/svg/statistics.svg";
import { CoreTableCustom } from "@/components/organism/CoreTableCustom";
import PageContainer from "@/components/organism/PageContainer";
import { CoreBreadcrumbs } from "@/components/atoms/CoreBreadcrumbs";
import { CoreButton } from "@/components/atoms/CoreButton";
import router from "next/router";
import CoreInputCustom from "@/components/atoms/CoreInputCustom";
import { useForm } from "react-hook-form";
import CoreAutocomplete from "@/components/atoms/CoreAutocomplete";
import { CoreTable } from "@/components/organism/CoreTable";
import { ROUTES } from "@/routes";
import useAccountList from "./useAccountList";

export default function Account() {
  const [value, handle] = useAccountList();

  const { columns, tableData, page, rowsPerPage, control } = value;
  const { setPage, setRowsPerPage } = handle;
  // const { control } = useForm();
  console.log("avatar", tableData);
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
        {/* <div className="flex justify-end py-5">
          <CoreButton
            onClick={() => {
              router.push(ROUTES.EMPLOYEE + "/addNew");
            }}
            theme="submit"
          >
            {"Thêm mới"}
          </CoreButton>
        </div> */}
        <CoreTable
          tableName="abc"
          columns={columns || []}
          data={tableData || []}
          page={page}
          isShowColumnStt
          onRowClick={(id: number) => {
            router.push({
              pathname: `${ROUTES.ACCOUNT}/${id}`,
              query: { actionType: "VIEW" },
            });
          }}
        />
      </PageContainer>
    </Grid>
  );
}
