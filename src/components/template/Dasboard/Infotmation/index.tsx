import {
  Autocomplete,
  Avatar,
  Button,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import statistics from "@/assets/svg/statistics.svg";
import { CoreTableCustom } from "@/components/organism/CoreTableCustom";
import PageContainer from "@/components/organism/PageContainer";
import { CoreBreadcrumbs } from "@/components/atoms/CoreBreadcrumbs";
import { CoreButton } from "@/components/atoms/CoreButton";
import useInformation from "@/components/template/Dasboard/Infotmation/useInformation";
import CoreNavbar from "@/components/organism/CoreNavbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CoreInputCustom from "@/components/atoms/CoreInputCustom";
import { useForm, useFormContext } from "react-hook-form";
import CoreAutocomplete from "@/components/atoms/CoreAutocomplete";
import avatar from "@/assets/png/Avatar.png";
import edit from "@/assets/svg/edit.svg";
import { RowBoxCommon } from "@/components/atoms/RowBoxCommon";
import { CoreDatePicker } from "@/components/atoms/CoreDatePicker";
import { getEnum } from "@/components/atoms/TextColor";
import router from "next/router";
import { ROUTES } from "@/routes";
import CoreLoading from "@/components/molecules/CoreLoading";
export default function Information() {
  const [value, handle] = useInformation();
  const { onSubmit } = handle;
  const { control, data, isLoading } = value;
  const [date, setDate] = useState<Date | null>(null);
  console.log("data", data);
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
          <CoreBreadcrumbs breadcrumbs={[{ title: "Thông tin cá nhân" }]} />
        }
      >
        <br />
        <CoreNavbar
          breadcrumbs={[
            {
              title: "Thông tin ",
              content: isLoading ? (
                <CoreLoading />
              ) : (
                <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
                  <Grid item xs={12} sm={12} md={3} lg={3}>
                    <Avatar
                      src={data?.data?.avatar}
                      alt="statistics"
                      sx={{
                        width: 220,
                        height: 220,
                        margin: "0 auto",
                      }}
                    />

                    <Typography
                      align="center"
                      color={"#0078D4"}
                      display={"flex"}
                      justifyContent={"center"}
                      marginTop={"10px"}
                    >
                      Cập nhật hình ảnh
                      <Image
                        src={edit}
                        alt="statistics"
                        width={20}
                        height={20}
                        style={{
                          margin: " 0 5px",
                        }}
                      />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={9} lg={9}>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <RowBoxCommon
                        title=" "
                        data={
                          data?.data?.code +
                          " - " +
                          data?.data?.firstName +
                          " " +
                          data?.data?.lastName
                        }
                        dataStyle={{ fontSize: "1.5rem", color: "#0078D4" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <RowBoxCommon
                        title="Vị trí"
                        data={
                          getEnum(data?.data?.position, [
                            { label: "Kiến trúc sư", value: "ARCHITECT" },
                            { label: "Kĩ sư điện nước", value: "MEP_ENGINEER" },
                            {
                              label: "Kĩ sư kết cấu",
                              value: "STRUCTURAL_ENGINEER",
                            },
                            { label: "Kĩ sư giám sát", value: "ESTIMATOR" },
                            { label: "Dự toán viên", value: "SUPERVISOR" },
                          ]) ?? "N/A"
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <RowBoxCommon
                        title="Ngày sinh"
                        data={data?.data?.birthDate ?? "N/A"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <RowBoxCommon
                        title="Email"
                        data={data?.data?.email ?? "N/A"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <RowBoxCommon
                        title="Địa chỉ"
                        data={data?.data?.address ?? "N/A"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <RowBoxCommon
                        title="Số điện thoại"
                        data={data?.data?.phone ?? "N/A"}
                      />
                    </Grid>
                  </Grid>
                  <form className="flex flex-col p-6 " onSubmit={onSubmit}>
                    <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        <CoreInputCustom
                          control={control}
                          name="firstName"
                          label="First Name"
                          placeholder="Nhập họ và tên"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        <CoreInputCustom
                          control={control}
                          name="lastName"
                          label="Last Name"
                          placeholder="Nhập họ và tên"
                        />
                      </Grid>

                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        <CoreInputCustom
                          control={control}
                          name="phone"
                          label="Số điện thoại"
                          placeholder="Nhập số điện thoại"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        <CoreAutocomplete
                          options={[
                            { label: "Nam", value: "MALE" },
                            { label: "Nữ", value: "FEMALE" },
                          ]}
                          control={control}
                          name="gender"
                          label="Giới tính"
                          placeholder="Chọn giới tính"
                          valuePath="value"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        <CoreInputCustom
                          control={control}
                          name="email"
                          label="Email"
                          placeholder="Nhập email"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        <CoreAutocomplete
                          options={[
                            { label: "Kiến trúc sư", value: "ARCHITECT" },
                            { label: "Kĩ sư điện nước", value: "MEP_ENGINEER" },
                            {
                              label: "Kĩ sư kết cấu",
                              value: "STRUCTURAL_ENGINEER",
                            },
                            { label: "Kĩ sư giám sát", value: "ESTIMATOR" },
                            { label: "Dự toán viên", value: "SUPERVISOR" },
                          ]}
                          control={control}
                          name="position"
                          label="Chức vụ"
                          placeholder="Chọn chức vụ"
                          valuePath="value"
                        />
                      </Grid>

                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        <CoreDatePicker
                          name="birthDate"
                          control={control!}
                          label={"Ngày sinh"}
                          placeholder="Chọn ngày sinh"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        <CoreInputCustom
                          control={control}
                          name="address"
                          label="Địa chỉ"
                          placeholder="Nhập địa chỉ"
                        />
                      </Grid>
                    </Grid>
                    <div className="py-4 flex justify-center gap-4 items-center">
                      <CoreButton
                        onClick={() => {
                          router.push(ROUTES.DASHBOARD);
                        }}
                        theme="cancel"
                      >
                        {"Hủy bỏ"}
                      </CoreButton>
                      <CoreButton
                        // onClick={() => {}}
                        theme="submit"
                        type="submit"
                      >
                        {"Lưu"}
                      </CoreButton>
                    </div>
                  </form>
                </Grid>
              ),
            },
          ]}
        />
      </PageContainer>
    </Grid>
  );
}
