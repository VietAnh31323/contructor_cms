import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
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
import { useDialog } from "@/components/hooks/dialog/useDialog";
import { deleteCategory } from "@/service/constructor/Category/delete";
import { toastError, toastSuccess } from "@/toast";
import router from "next/router";
import useCustomerSave from "./useCustomerSave";
import CoreLoading from "@/components/molecules/CoreLoading";
import { TopAction } from "@/components/molecules/TopAction";
import { BLUE, GREEN, ORANGE, RED } from "@/helper/colors";
import { deleteCustomer } from "@/service/constructor/Customer/delete";
export default function CustomerSave() {
  const [value, handle] = useCustomerSave();
  const { isView, control, isLoading, id } = value;
  const { onSubmit } = handle;
  const { showDialog, hideDialog } = useDialog();

  const handleDelete = (id: number) => {
    showDialog(
      <Dialog open onClose={hideDialog}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn xóa hạng mục này?</DialogContent>
        <DialogActions>
          <CoreButton onClick={hideDialog}>Hủy</CoreButton>
          <CoreButton
            color="error"
            onClick={async () => {
              try {
                await deleteCustomer({ id }); // dùng id trực tiếp
                toastSuccess("Xóa thành công!");
                hideDialog();
                router.push(ROUTES.CUSTOMER);
              } catch (err: any) {
                toastError(err?.message || "Xóa thất bại");
              }
            }}
          >
            Đồng ý
          </CoreButton>
        </DialogActions>
      </Dialog>
    );
  };
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
            breadcrumbs={[
              {
                title: "Quản lý thông tin khách hàng",
                pathname: ROUTES.CUSTOMER,
              },
              { title: isView ? "Chi tiết" : "Chỉnh sửa" },
            ]}
          />
        }
      >
        <br />
        <CoreNavbar
          breadcrumbs={[
            {
              title: "Chi tiết",
              rightAction: isView && (
                <TopAction
                  actionList={["delete", "edit"]}
                  onEditAction={() => {
                    router.push({
                      pathname: `${ROUTES.CUSTOMER}/[id]`,
                      query: { id: Number(id) },
                    });
                  }}
                  onDeleteAction={() => handleDelete(id)}
                />
              ),
              content: isLoading ? (
                <CoreLoading />
              ) : (
                <form className="flex flex-col py-6" onSubmit={onSubmit}>
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
                      <CoreAutocomplete
                        options={[
                          {
                            label: "Chưa liên hệ",
                            value: "NOT_CONTACTED",
                            ORANGE,
                          },
                          { label: "Đã liên hệ", value: "CONTACTED", GREEN },
                          {
                            label: "Không phản hồi",
                            value: "NO_RESPONSE",
                            RED,
                          },
                          { label: "Đã phản hồi", value: "RESPONDED", BLUE },
                        ]}
                        control={control}
                        name="contactStatus"
                        label="Trạng thái"
                        placeholder="Chọn trạng thái"
                        valuePath="value"
                      />
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <CoreInputCustom
                        control={control}
                        name="description"
                        label="Nội dung tư vấn"
                        placeholder="Nhập nội dung tư vấn"
                        multiline
                        rows={2}
                        sx={{ width: "100%", padding: "0" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <CoreInputCustom
                        control={control}
                        name="note"
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
                          name="isPotential"
                          label="Khách hàng hàng tiềm năng"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  {!isView && (
                    <div className="py-4 flex justify-center gap-4 items-center">
                      <CoreButton onClick={() => {}} theme="cancel">
                        Hủy bỏ
                      </CoreButton>
                      <CoreButton
                        theme="submit"
                        type="submit"
                        loading={isLoading}
                      >
                        Lưu
                      </CoreButton>
                    </div>
                  )}
                </form>
              ),
            },
          ]}
        />
      </PageContainer>
    </Grid>
  );
}
