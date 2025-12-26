import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  InputAdornment,
  Paper,
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
import { useEffect, useState } from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CoreInputCustom from "@/components/atoms/CoreInputCustom";
import { useForm, useFormContext, useWatch } from "react-hook-form";
import CoreAutocomplete from "@/components/atoms/CoreAutocomplete";
import { ROUTES } from "@/routes";
import useAccountSave from "./useAccountSave";
import CoreLoading from "@/components/molecules/CoreLoading";
import router from "next/router";
import { TopAction } from "@/components/molecules/TopAction";
type Permission = {
  id: number;
  label: string;
  name?: string;
};

export default function EmployeeSave() {
  const [selected, setSelected] = useState<Permission[]>([]);
  const [value, handle] = useAccountSave(selected);
  const [date, setDate] = useState<Date | null>(null);
  const { isView, control, isLoading, id, data, setValue } = value;
  const { onSubmit } = handle;
  const [permissions, setPermissions] = useState([
    { id: 1, label: "Quản lý", name: "ADMIN", checked: true },
    { id: 2, label: "Nhân viên", name: "STAFF", checked: false },
    { id: 3, label: "CSKH", name: "CUSTOMER_CARE", checked: true },
  ]);

  const avatar = useWatch<any>({
    control,
    name: "staff.avatar",
  });
  const accountRoles = data?.data?.roles;
  useEffect(() => {
    const apiRoles = data?.data?.roles;
    if (!apiRoles?.length) return;

    const mappedSelected = permissions.filter((p) =>
      apiRoles.some((r: any) => r.name === p.name)
    );

    setSelected(mappedSelected);

    if (!setValue) return;

    setValue(
      "roles",
      selected.map((r) => ({
        id: r.id,
        name: r.name,
      }))
    );
  }, [data, permissions, setValue]);

  const handleToggle = (item: Permission) => {
    const exists = selected.some((p) => p.id === item.id);

    if (exists) {
      setSelected(selected.filter((p) => p.id !== item.id));
    } else {
      setSelected([...selected, item]);
    }
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
              { title: "Quản lý tài khoản", pathname: ROUTES.ACCOUNT },
              { title: "Thêm mới" },
            ]}
          />
        }
      >
        <br />
        <CoreNavbar
          breadcrumbs={[
            {
              title: "Phân quyền",
              rightAction: isView && (
                <TopAction
                  actionList={["delete", "edit"]}
                  onEditAction={() => {
                    router.push({
                      pathname: `${ROUTES.ACCOUNT}/[id]`,
                      query: { id: Number(id) },
                    });
                  }}
                />
              ),
              content: isLoading ? (
                <CoreLoading />
              ) : (
                <form className="flex flex-col py-6 " onSubmit={onSubmit}>
                  <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Avatar
                        src={avatar}
                        alt="avatar"
                        sx={{
                          width: 250,
                          height: 250,
                          borderRadius: 5,
                          boxShadow: 5,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <CoreInputCustom
                        control={control}
                        name="staff.code"
                        label="Mã nhân sự"
                        placeholder="Mã nhân sự"
                        isViewProp={true}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <CoreInputCustom
                        control={control}
                        name="staff.email"
                        label="Email"
                        placeholder="Email nhân sự"
                        isViewProp={true}
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
                        name="staff.position"
                        label="Chức vụ"
                        placeholder="Chọn chức vụ"
                        valuePath="value"
                        isViewProp={true}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <CoreInputCustom
                        control={control}
                        name="staff.firstName"
                        label="First Name"
                        placeholder="First Name"
                        isViewProp={true}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <CoreInputCustom
                        control={control}
                        name="staff.lastName"
                        label="Last Name"
                        placeholder="Last Name"
                        isViewProp={true}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <CoreInputCustom
                        control={control}
                        name="staff.phone"
                        label="Số điện thoại"
                        placeholder="Nhập số điện thoại"
                        isViewProp={true}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <CoreAutocomplete
                        options={[
                          { label: "Nam", value: "MALE" },
                          { label: "Nữ", value: "FEMALE" },
                        ]}
                        control={control}
                        name="staff.gender"
                        label="Giới tính"
                        placeholder="Chọn giới tính"
                        valuePath="value"
                        isViewProp={true}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <CoreInputCustom
                        control={control}
                        name="staff.address"
                        label="Địa chỉ"
                        placeholder="Nhập địa chỉ"
                        isViewProp={true}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Typography
                        style={{
                          fontWeight: "bold",
                        }}
                      >
                        Phân quyền nhân sự
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Box display="flex" gap={2}>
                        <Box
                          component="fieldset"
                          sx={{
                            flex: 1,
                            border: "1px solid #ccc",
                            borderRadius: 2,
                            p: 2,
                          }}
                        >
                          <Box
                            component="legend"
                            sx={{ px: 1, fontSize: 14, color: "gray" }}
                          >
                            Danh sách quyền
                          </Box>

                          {permissions.map((item) => (
                            <FormControlLabel
                              key={item.id}
                              control={
                                <Checkbox
                                  checked={selected.some(
                                    (p) => p.id === item.id
                                  )}
                                  onChange={() => handleToggle(item)}
                                  disabled={isView}
                                />
                              }
                              label={item.label}
                              sx={{ display: "block", ml: 0 }}
                            />
                          ))}
                        </Box>

                        {/* RIGHT FIELDSET */}
                        <Box
                          component="fieldset"
                          sx={{
                            flex: 1,
                            border: "1px solid #ccc",
                            borderRadius: 2,
                            p: 2,
                          }}
                        >
                          <Box
                            component="legend"
                            sx={{ px: 1, fontSize: 14, color: "gray" }}
                          >
                            Danh sách quyền đã chọn
                          </Box>

                          {selected.map((item) => (
                            <Box key={item.id} sx={{ py: 0.5 }}>
                              {item.label}
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                  {!isView && (
                    <div className="py-4 flex justify-center gap-4 items-center">
                      <CoreButton
                        onClick={() => {
                          router.push(ROUTES.ACCOUNT);
                        }}
                        theme="cancel"
                      >
                        {"Hủy bỏ"}
                      </CoreButton>
                      <CoreButton type="submit" theme="submit">
                        {"Lưu"}
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
