import { Autocomplete, Button, Grid, TextField } from "@mui/material";
import Image from "next/image";
import statistics from "@/assets/svg/statistics.svg";
import { CoreTableCustom } from "@/components/organism/CoreTableCustom";
import PageContainer from "@/components/organism/PageContainer";
import { CoreBreadcrumbs } from "@/components/atoms/CoreBreadcrumbs";
import { CoreButton } from "@/components/atoms/CoreButton";
import CoreNavbar from "@/components/organism/CoreNavbar";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";

import CoreInputCustom from "@/components/atoms/CoreInputCustom";
import { useForm, useFormContext } from "react-hook-form";
import CoreAutocomplete from "@/components/atoms/CoreAutocomplete";
import CoreSwitch from "@/components/atoms/CoreSwitch";
import { ROUTES } from "@/routes";
import useProgressManageSave from "./useProgressManageSave";
import { RowBoxCommon } from "@/components/atoms/RowBoxCommon";
import ProgressTimeline from "./components/progressTimeline/ProgressTimeline";
export default function ProgressManageSave() {
  const [value, handle] = useProgressManageSave();
  const { control } = useForm();
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        overflowY: "auto",
        overflowX: "auto",
      }}
    >
      <PageContainer
        title={
          <CoreBreadcrumbs
            breadcrumbs={[
              {
                title: "Quản lý tiến độ dự án",
                pathname: ROUTES.PROGRESS_PROJECT,
              },
              { title: "Thêm mới" },
            ]}
          />
        }
      >
        <br />
        <CoreNavbar
          breadcrumbs={[
            {
              title: "Thêm mới",
              content: (
                <div>
                  <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                      <RowBoxCommon title="Mã hồ sơ" data={""} />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                      <RowBoxCommon title="Tên dự án" data={""} />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                      <RowBoxCommon title="Chủ đầu tư" data={""} />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                      <RowBoxCommon title="Địa chỉ" data={""} />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                      <RowBoxCommon title="Ngày ký hợp đồng" data={""} />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                      <RowBoxCommon title="Ngày ký giao hồ sơ" data={""} />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                      <RowBoxCommon title="Nội dung dự án" data={""} />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                      <RowBoxCommon title="Chủ nhiệm dự án" data={""} />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                      <RowBoxCommon title="Trạng thái dự án" data={""} />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                      <RowBoxCommon
                        title="Thời gian bắt đầu dự kiến"
                        data={""}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                      <RowBoxCommon
                        title="Thời gian giao hồ sơ dự kiến"
                        data={""}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                      <RowBoxCommon title="Thời gian còn lại" data={""} />
                    </Grid>
                  </Grid>
                  <Grid container mt={4}>
                    <Grid item xs={12}>
                      <ProgressTimeline />
                    </Grid>
                  </Grid>
                  <div className="py-4 flex justify-center gap-4 items-center">
                    <CoreButton onClick={() => {}} theme="cancel">
                      {"Hủy bỏ"}
                    </CoreButton>
                    <CoreButton onClick={() => {}} theme="submit">
                      {"Lưu"}
                    </CoreButton>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </PageContainer>
    </Grid>
  );
}
