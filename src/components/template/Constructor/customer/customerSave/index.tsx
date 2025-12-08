import { Autocomplete, Button, Grid, TextField } from "@mui/material";
import Image from "next/image";
import statistics from "@/assets/svg/statistics.svg";
import { CoreTableCustom } from "@/components/organism/CoreTableCustom";
import PageContainer from "@/components/organism/PageContainer";
import { CoreBreadcrumbs } from "@/components/atoms/CoreBreadcrumbs";
import { CoreButton } from "@/components/atoms/CoreButton";
import useEmployeeList from "@/components/template/Constructor/employee/employeeList/useEmployeeList";
import CoreNavbar from "@/components/organism/CoreNavbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";

import CoreInputCustom from "@/components/atoms/CoreInputCustom";
import { useForm, useFormContext } from "react-hook-form";
import CoreAutocomplete from "@/components/atoms/CoreAutocomplete";
import { ROUTES } from "@/routes";
import CoreSwitch from "@/components/atoms/CoreSwitch";
export default function CustomerSave() {
  const [value, handle] = useEmployeeList();
  const [date, setDate] = useState<Date | null>(null);
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
                title: "Quản lý thông tin khách hàng",
                pathname: ROUTES.CUSTOMER,
              },
              { title: "Chi tiết" },
            ]}
          />
        }
      >
        <br />
        <CoreNavbar
          breadcrumbs={[
            {
              title: "Chi tiết",
              content: (
                <form className="flex flex-col py-6 ">
                  <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <CoreInputCustom
                        control={control}
                        name="code"
                        label="Mã yêu cầu"
                        placeholder=" "
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <CoreInputCustom
                        control={control}
                        name="name"
                        label="Họ tên khách hàng"
                        placeholder=" "
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <CoreInputCustom
                        control={control}
                        name="phone"
                        label="Số điện thoại"
                        placeholder=" "
                      />
                    </Grid>

                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <CoreInputCustom
                        control={control}
                        name="email"
                        label="Email"
                        placeholder=" "
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <CoreInputCustom
                        control={control}
                        name="address"
                        label="Địa chỉ"
                        placeholder=" "
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <CoreInputCustom
                        control={control}
                        name="status"
                        label="Trạng thái"
                        placeholder="Đang liên hệ"
                      />
                    </Grid>

                    <Grid item xs={12} sm={12} md={4} lg={4}>
                      <CoreInputCustom
                        control={control}
                        name="address"
                        label="Địa chỉ"
                        placeholder="Nhập địa chỉ"
                      />
                    </Grid>

                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <CoreAutocomplete
                        options={[
                          { label: "Nam", value: "admin" },
                          { label: "Nữ", value: "manager" },
                        ]}
                        control={control}
                        name="role"
                        label="Giới tính"
                        placeholder="Chọn giới tính"
                        valuePath="value"
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <CoreInputCustom
                        control={control}
                        name="description"
                        label="Mô tả"
                        placeholder="Nhập mô tả"
                        multiline
                        rows={2}
                        sx={{ width: "100%", padding: "0" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <CoreInputCustom
                        control={control}
                        name="class"
                        label="Ghi chú"
                        placeholder="Nhập ghi chú"
                        variant="standard"
                        multiline
                        rows={4}
                        sx={{ width: "100%", padding: "0" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <CoreSwitch
                          control={control}
                          name="isActive"
                          label="Khách hàng hàng tiềm năng"
                        />
                      </Grid>
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
