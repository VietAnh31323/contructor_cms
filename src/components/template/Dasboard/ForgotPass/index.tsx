import {
  Autocomplete,
  Button,
  Grid,
  InputAdornment,
  TextField,
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
import useForgotPass from "./useForgotPass";
import { RowBoxCommon } from "@/components/atoms/RowBoxCommon";
import { ROUTES } from "@/routes";
import router from "next/router";
import CoreLoading from "@/components/molecules/CoreLoading";
export default function ForgotPassword() {
  const [value, handle] = useForgotPass();
  const { data, control, isLoading } = value;
  const { onSubmit } = handle;
  const [date, setDate] = useState<Date | null>(null);

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
          <CoreBreadcrumbs breadcrumbs={[{ title: "Mật khẩu cá nhân" }]} />
        }
      >
        <br />
        <CoreNavbar
          breadcrumbs={[
            {
              title: " Mật khẩu",
              content: isLoading ? (
                <CoreLoading />
              ) : (
                <Grid>
                  <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        <RowBoxCommon
                          title="Tài khoản đăng nhập"
                          data={data?.data?.email ?? "N/A"}
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        <RowBoxCommon
                          title="Tên người dùng"
                          data={
                            data?.data?.firstName + " " + data?.data?.lastName
                          }
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <form className="flex flex-col py-6 " onSubmit={onSubmit}>
                    <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        <CoreInputCustom
                          control={control}
                          name="oldPassword"
                          label="Mật khẩu cũ"
                          placeholder="Nhập mật khẩu cũ"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        <CoreInputCustom
                          control={control}
                          name="newPassword"
                          label="Mật khẩu mới"
                          placeholder="Nhập mật khẩu mới"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        <CoreInputCustom
                          control={control}
                          name="confirmPassword"
                          label="Xác nhận mật khẩu"
                          placeholder="Nhập lại mật khẩu mới"
                        />
                      </Grid>
                    </Grid>
                    <div className="py-5 flex justify-center gap-4 items-center">
                      <CoreButton
                        onClick={() => {
                          router.push(ROUTES.DASHBOARD);
                        }}
                        theme="cancel"
                      >
                        {"Hủy bỏ"}
                      </CoreButton>
                      <CoreButton theme="submit" type="submit">
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
