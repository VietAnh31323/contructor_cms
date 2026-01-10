import { Autocomplete, Button, Grid, TextField } from "@mui/material";
import Image from "next/image";
import statistics from "@/assets/svg/statistics.svg";
import { CoreTableCustom } from "@/components/organism/CoreTableCustom";
import PageContainer from "@/components/organism/PageContainer";
import { CoreBreadcrumbs } from "@/components/atoms/CoreBreadcrumbs";
import { CoreButton } from "@/components/atoms/CoreButton";
import CoreNavbar from "@/components/organism/CoreNavbar";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";

import CoreInputCustom from "@/components/atoms/CoreInputCustom";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import CoreAutocomplete from "@/components/atoms/CoreAutocomplete";
import CoreSwitch from "@/components/atoms/CoreSwitch";
import { ROUTES } from "@/routes";
import useProgressManageSave from "./useProgressManageSave";
import { RowBoxCommon } from "@/components/atoms/RowBoxCommon";
import ProgressTimeline from "./components/progressTimeline/ProgressTimeline";
import { CoreDatePicker } from "@/components/atoms/CoreDatePicker";
import CoreInputMoney from "@/components/atoms/CoreInputMoney";
import { TopAction } from "@/components/molecules/TopAction";
import router from "next/router";
export default function ProgressManageSave() {
  const [value, handle] = useProgressManageSave();
  const {
    control,
    isView,
    isLoading,
    watch,
    setValue,
    methodForm,
    id,
    onSubmit,
  } = value;

  const signDate = watch("signDate");
  const deliveryDate = watch("deliveryDate");
  const calcRemainingDays = (delivery?: string | Date) => {
    if (!delivery) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deliveryDate = new Date(delivery);
    deliveryDate.setHours(0, 0, 0, 0);

    const diffTime = deliveryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  };

  useEffect(() => {
    const updateRemainingDays = () => {
      const remainingDays = calcRemainingDays(deliveryDate);
      setValue("remainingDays" as any, remainingDays);
    };

    updateRemainingDays(); // chạy ngay khi mở form

    const interval = setInterval(updateRemainingDays, 60 * 1000);
    // 1 phút là đủ, không cần 1s

    return () => clearInterval(interval);
  }, [deliveryDate, setValue]);

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
              rightAction: isView && (
                <TopAction
                  actionList={["delete", "edit"]}
                  onEditAction={() => {
                    router.push({
                      pathname: `${ROUTES.PROGRESS_MANAGE}/[id]`,
                      query: { id: Number(id) },
                    });
                  }}
                  onDeleteAction={() => {}}
                />
              ),
              content: (
                <FormProvider {...methodForm}>
                  <form onSubmit={onSubmit}>
                    <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <CoreInputCustom
                          control={control}
                          name="code"
                          label="Mã hồ sơ"
                          placeholder="Nhập mã hồ sơ"
                          isViewProp={true}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <CoreInputCustom
                          control={control}
                          name="name"
                          label="Tên công trình dự án"
                          placeholder="Nhập tên công trình dự án"
                          required
                          rules={{ required: "Trường này là bắt buộc" }}
                          isViewProp={true}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <CoreInputCustom
                          control={control}
                          name="owner"
                          label="Chủ đầu tư"
                          placeholder="Nhập tên chủ đầu tư"
                          isViewProp={true}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <CoreInputCustom
                          control={control}
                          name="address"
                          label="Địa chỉ"
                          placeholder="Nhập địa chỉ"
                          isViewProp={true}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <CoreInputMoney
                          control={control}
                          name="contractValue"
                          label="Giá trị hợp đồng"
                          placeholder="Nhập giá trị hợp đồng"
                          type="number"
                          isViewProp={true}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <CoreInputMoney
                          control={control}
                          name="contractAdvance"
                          label="Tạm ứng hợp đồng"
                          placeholder="Hợp đồng đã tạm ứng"
                          type="number"
                          isViewProp={true}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <CoreInputMoney
                          control={control}
                          name="remainingAmount"
                          label="Số tiền còn lại"
                          placeholder="Số tiền còn lại của hợp đồng"
                          type="number"
                          isViewProp={true}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <CoreDatePicker
                          name="signDate"
                          control={control!}
                          label={"Ngày kí hợp đồng"}
                          required
                          placeholder="Chọn ngày ký hợp đồng"
                          rules={{
                            required: "Bạn phải chọn ngày kí hợp đồng",
                          }}
                          isViewProp={true}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <CoreDatePicker
                          name="deliveryDate"
                          control={control!}
                          label={"Ngày giao hồ sơ dự kiến"}
                          required
                          placeholder="Chọn ngày giao hồ sơ dự kiến"
                          rules={{
                            required: "Bạn phải chọn giao hồ sơ dự kiến",
                          }}
                          isViewProp={true}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <CoreInputCustom
                          control={control}
                          name="remainingDays"
                          label="Số ngày còn lại"
                          placeholder=" "
                          type="number"
                          disabled
                          isViewProp={true}
                        />
                      </Grid>
                    </Grid>
                    <Grid container mt={4}>
                      <Grid item xs={12}>
                        <ProgressTimeline
                          value={watch("projectProgress")}
                          onChange={(data) => {
                            setValue("projectProgress", data, {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                          }}
                          isView={isView}
                        />
                      </Grid>
                    </Grid>
                    <div className="py-4 flex justify-center gap-4 items-center">
                      <CoreButton onClick={() => {}} theme="cancel">
                        {"Hủy bỏ"}
                      </CoreButton>
                      <CoreButton type="submit" theme="submit">
                        {"Lưu"}
                      </CoreButton>
                    </div>
                  </form>
                </FormProvider>
              ),
            },
          ]}
        />
      </PageContainer>
    </Grid>
  );
}
