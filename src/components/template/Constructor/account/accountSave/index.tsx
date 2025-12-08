import {
  Autocomplete,
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
import { useState } from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CoreInputCustom from "@/components/atoms/CoreInputCustom";
import { useForm, useFormContext } from "react-hook-form";
import CoreAutocomplete from "@/components/atoms/CoreAutocomplete";
import { ROUTES } from "@/routes";
type Permission = {
  id: number;
  label: string;
};
export default function EmployeeSave() {
  const [value, handle] = useEmployeeList();
  const [date, setDate] = useState<Date | null>(null);
  const { columns, tableData, page, rowsPerPage } = value;
  const { setPage, setRowsPerPage } = handle;
  const { control } = useForm();
  const [permissions, setPermissions] = useState([
    { id: 1, label: "Quản lý", checked: true },
    { id: 2, label: "Nhân viên", checked: false },
    { id: 3, label: "CSKH", checked: true },
  ]);

  const [selected, setSelected] = useState<Permission[]>([]);

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
        height: "100vh",
        overflowY: "hidden",
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
              title: "Thêm mới",
              content: (
                <form className="flex flex-col py-6 ">
                  <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <CoreInputCustom
                        control={control}
                        name="code"
                        label="Mã nhân sự"
                        placeholder="Nhập mã nhân sự"
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
                      <CoreInputCustom
                        control={control}
                        name="firstName"
                        label="First Name"
                        placeholder=" "
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <CoreInputCustom
                        control={control}
                        name="lastName"
                        label="Last Name"
                        placeholder=" "
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
                        {/* LEFT FIELDSET */}
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
