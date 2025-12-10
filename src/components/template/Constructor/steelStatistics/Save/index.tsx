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
import useCategoryList from "./useSteelStatisticsSave";
import useSteelStatisticsList from "./useSteelStatisticsSave";
import CoreNavbar from "@/components/organism/CoreNavbar";

import { ROUTES } from "@/routes";
import useSteelStatisticsSave from "./useSteelStatisticsSave";

export default function SteelStatisticsSave() {
  const [value, handle] = useSteelStatisticsSave();

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
        title={
          <CoreBreadcrumbs
            breadcrumbs={[
              {
                title: "Danh sách dự án thông kê thép",
                pathname: ROUTES.STEELSTATISTICS,
              },
              { title: "Thêm mới" },
            ]}
          />
        }
      >
        <CoreNavbar
          breadcrumbs={[
            {
              title: "Thêm mới",
              content: <div>abc</div>,
            },
          ]}
        />
      </PageContainer>
    </Grid>
  );
}
