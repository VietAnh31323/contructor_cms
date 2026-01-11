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
import useCategoryList from "./useSteelStatisticsList";
import useSteelStatisticsList from "./useSteelStatisticsList";
import CoreNavbar from "@/components/organism/CoreNavbar";
import ProjectCardList from "./components/ProjectCardList";
import { ROUTES } from "@/routes";

export default function SteelStatisticsList() {
  const [value, handle] = useSteelStatisticsList();

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
          <CoreBreadcrumbs
            breadcrumbs={[{ title: "Danh sách dự án thông kê thép" }]}
          />
        }
      >
        <form className="flex flex-col py-6 ">
          <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
            {/* <Grid item xs={12} sm={12} md={6} lg={4}>
              <CoreInputCustom
                control={control}
                name="search"
                label="Tìm kiếm"
                placeholder="Tìm kiếm theo mã dự án"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4}></Grid> */}
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              className="flex justify-end items-center"
            >
              <CoreButton
                onClick={() => {
                  router.push(ROUTES.STEELSTATISTICS + "/addNew");
                }}
                theme="submit"
              >
                Thêm mới
              </CoreButton>
            </Grid>
          </Grid>
        </form>
        {/* <CoreNavbar
          breadcrumbs={[
            {
              title: "Danh sách",
              content: <ProjectCardList />,
            },
          ]}
        /> */}
        <CoreTable
          tableName="abc"
          columns={columns || []}
          data={tableData || []}
          page={page}
          isShowColumnStt
          onRowClick={(id: number) => {
            router.push({
              pathname: `${ROUTES.STEELSTATISTICS}/${id}`,
              query: { actionType: "VIEW" },
            });
          }}
        />
      </PageContainer>
    </Grid>
  );
}
