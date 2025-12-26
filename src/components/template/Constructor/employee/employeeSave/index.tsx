import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  LinearProgress,
  TextField,
  Typography,
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
import { useRef, useState } from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CoreInputCustom from "@/components/atoms/CoreInputCustom";
import { useForm, useFormContext } from "react-hook-form";
import CoreAutocomplete from "@/components/atoms/CoreAutocomplete";
import { useDialog } from "@/components/hooks/dialog/useDialog";
import useEmployeeSave from "./useEmployeeLSave";
import { deleteEmployee } from "@/service/constructor/Employee/delete";
import { toastError, toastSuccess } from "@/toast";
import router from "next/router";
import { ROUTES } from "@/routes";
import { TopAction } from "@/components/molecules/TopAction";
import CoreLoading from "@/components/molecules/CoreLoading";
import CoreInput from "@/components/atoms/CoreInput";
import { CoreDatePicker } from "@/components/atoms/CoreDatePicker";
import { fileUpload } from "@/service/upload";
export default function EmployeeSave() {
  const [value, handle] = useEmployeeSave();
  const [date, setDate] = useState<Date | null>(null);
  const { isView, control, isLoading, id, data } = value;
  const { onSubmit, setValue } = handle;
  const { showDialog, hideDialog } = useDialog();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toastError("Chỉ cho phép upload ảnh");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadProgress(0);

      const res = await fileUpload(
        formData,
        { folder: "avatar" },
        (progressEvent) => {
          if (!progressEvent.total) return;
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent);
        }
      );

      const imageUrl = res.data?.data?.url;

      setAvatarUrl(imageUrl);
      setValue?.("avatar", imageUrl, { shouldDirty: true });

      toastSuccess("Cập nhật ảnh đại diện thành công");
    } catch {
      toastError("Upload ảnh thất bại");
    } finally {
      setUploadProgress(0);
    }
  };

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
                await deleteEmployee({ id }); // dùng id trực tiếp
                toastSuccess("Xóa thành công!");
                hideDialog();
                router.push(ROUTES.EMPLOYEE);
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
              { title: "Quản lý nhân sư", pathname: ROUTES.EMPLOYEE },
              { title: isView ? "Chi tiết" : "Chỉnh sửa" },
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
                      pathname: `${ROUTES.EMPLOYEE}/[id]`,
                      query: { id: Number(id) },
                    });
                  }}
                  onDeleteAction={() => handleDelete(id)}
                />
              ),
              content: isLoading ? (
                <CoreLoading />
              ) : (
                <form className="flex flex-col py-6 " onSubmit={onSubmit}>
                  <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <CoreInputCustom
                        control={control}
                        name="code"
                        label="Mã nhân sự"
                        placeholder="Nhập mã nhân sự"
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <CoreInputCustom
                        control={control}
                        name="email"
                        label="Email"
                        placeholder="Nhập email"
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
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

                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <CoreInputCustom
                        control={control}
                        name="firstName"
                        label="FirstName"
                        placeholder="Nhập FirstName"
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <CoreInputCustom
                        control={control}
                        name="lastName"
                        label="LastName"
                        placeholder="Nhập LastName"
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      {/* <div style={{ width: "100%" }}>
                        <DatePicker
                          selected={date}
                          onChange={(d) => setDate(d)}
                          placeholderText="Chọn ngày"
                          name="birthDate"
                          customInput={
                            <TextField
                              label="Chọn ngày"
                              variant="standard"
                              fullWidth
                              focused
                              name="birthDate"
                              placeholder="Chọn ngày"
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <CalendarMonthIcon
                                      sx={{ cursor: "pointer" }}
                                    />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          }
                          popperPlacement="bottom"
                          wrapperClassName="w-full"
                          className="w-full"
                        />
                      </div> */}
                      <CoreDatePicker
                        name="birthDate"
                        control={control!}
                        label={"Ngày sinh"}
                        required={!isView}
                        placeholder="Chọn ngày sinh"
                        rules={{
                          required: "Bạn phải nhập ngày sinh",
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <CoreInputCustom
                        control={control}
                        name="address"
                        label="Địa chỉ"
                        placeholder="Nhập địa chỉ"
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <CoreInputCustom
                        control={control}
                        name="phone"
                        label="Số điện thoại"
                        placeholder="Nhập số điện thoại"
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
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
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <CoreInput
                        control={control}
                        name="genPassword"
                        label="Mật khẩu ban đầu"
                        placeholder="Chọn giới tính"
                        disabled={true}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <CoreInputCustom
                        control={control}
                        name="description"
                        label="Ghi chú"
                        placeholder="Nhập ghi chú"
                        variant="standard"
                        multiline
                        rows={4}
                        sx={{ width: "100%", padding: "0" }}
                      />
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
