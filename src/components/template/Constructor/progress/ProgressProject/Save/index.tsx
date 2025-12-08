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
import useProgressProjectSave from "./useProgressProjectSave";
export default function ProgressProjectSave() {
  const [value, handle] = useProgressProjectSave();
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
                title: "Quản lý tiến trình",
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
                <form className="flex flex-col py-6 ">
                  <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <CoreInputCustom
                        control={control}
                        name="code"
                        label="Mã tiến trình"
                        placeholder="Nhập mã tiến trình"
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <CoreInputCustom
                        control={control}
                        name="name"
                        label="Tên tiến trình"
                        placeholder="Nhập tên tiến trình"
                      />
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <CoreInputCustom
                        control={control}
                        name="content"
                        label="Mô tả"
                        placeholder="Nhập mô tả"
                        variant="standard"
                        multiline
                        rows={4}
                        sx={{ width: "100%", padding: "0" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <CoreSwitch
                        control={control}
                        name="isActive"
                        label="Trạng thái"
                      />
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
                </form>
              ),
            },
          ]}
        />
      </PageContainer>
    </Grid>
  );
}
