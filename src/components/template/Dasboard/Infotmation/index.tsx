import {
  Autocomplete,
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
export default function Information() {
  const [value, handle] = useInformation();
  const [date, setDate] = useState<Date | null>(null);

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
          <CoreBreadcrumbs breadcrumbs={[{ title: "Thông tin cá nhân" }]} />
        }
      >
        <br />
        <CoreNavbar
          breadcrumbs={[
            {
              title: "Thông tin ",
              content: (
                <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
                  <Grid item xs={12} sm={12} md={3} lg={3}>
                    <Image
                      src={avatar}
                      alt="statistics"
                      width={250}
                      height={250}
                      style={{
                        margin: " 0 auto",
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
                        data={"Nguyễn Việt Anh - MNV01.023"}
                        dataStyle={{ fontSize: "1.5rem", color: "#0078D4" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <RowBoxCommon title="Vị trí" data={"Kiến trúc sư"} />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <RowBoxCommon title="Ngày sinh" data={"31/03/2003"} />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <RowBoxCommon title="Email" data={"nvietanh@gmail.com"} />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <RowBoxCommon
                        title="Địa chỉ"
                        data={"Ngõ A, Thôn B, Đường C, Tỉnh D, Việt Nam"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <RowBoxCommon title="Số điện thoại" data={"0982848203"} />
                    </Grid>
                  </Grid>
                  <form className="flex flex-col p-6 ">
                    <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        <CoreInputCustom
                          control={control}
                          name="name"
                          label="Họ và tên"
                          placeholder=" "
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        <CoreInputCustom
                          control={control}
                          name="school"
                          label="Học vấn"
                          placeholder=" "
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        <CoreInputCustom
                          control={control}
                          name="email"
                          label="Email"
                          placeholder=" "
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        <CoreInputCustom
                          control={control}
                          name="position"
                          label="Vị trí"
                          placeholder=" "
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        <CoreInputCustom
                          control={control}
                          name="phone"
                          label="Số điện thoại"
                          placeholder=" "
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        <CoreInputCustom
                          control={control}
                          name="date"
                          label="Ngày sinh"
                          placeholder=" "
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
                </Grid>
              ),
            },
          ]}
        />
      </PageContainer>
    </Grid>
  );
}
