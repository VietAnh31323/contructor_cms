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
import useEmployeeList from "@/components/template/Constructor/employee/employeeList/useEmployeeList";
import CoreNavbar from "@/components/organism/CoreNavbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CoreInputCustom from "@/components/atoms/CoreInputCustom";
import { useForm, useFormContext } from "react-hook-form";
import CoreAutocomplete from "@/components/atoms/CoreAutocomplete";
import useConstructionProjectSave from "./useConstructionProjectSave";
import { RowBoxCommon } from "@/components/atoms/RowBoxCommon";
import EditText from "@/components/atoms/EditText";
import UploadFiles from "@/components/atoms/UploadFiles";
import upload from "@/assets/png/upload.png";
export default function ConstructionProjectSave() {
  const [value, handle] = useConstructionProjectSave();
  const [date, setDate] = useState<Date | null>(null);
  const { columns, tableData, page, rowsPerPage } = value;
  const { setPage, setRowsPerPage } = handle;
  const { control } = useForm();
  const [editorText, setEditorText] = useState("");
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        overflowY: "auto",
      }}
    >
      <PageContainer
        title={
          <CoreBreadcrumbs
            breadcrumbs={[{ title: "Quản lý dự án" }, { title: "Thêm mới" }]}
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
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <CoreInputCustom
                        control={control}
                        name="code"
                        label="Mã hồ sơ"
                        placeholder="Nhập mã hồ sơ"
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
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <CoreInputCustom
                        control={control}
                        name="investor"
                        label="Chủ đầu tư"
                        placeholder="Nhập tên chủ đầu tư"
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
                        name="contract"
                        label="Giá trị hợp đồng"
                        placeholder=" "
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <CoreInputCustom
                        control={control}
                        name="advance"
                        label="Tạm ứng hợp đồng"
                        placeholder=" "
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <CoreInputCustom
                        control={control}
                        name="remaining"
                        label="Số tiền còn lại"
                        placeholder=" "
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <div style={{ width: "100%" }}>
                        <DatePicker
                          selected={date}
                          onChange={(d) => setDate(d)}
                          placeholderText=" "
                          customInput={
                            <TextField
                              label="Ngày kí hợp đồng"
                              variant="standard"
                              fullWidth
                              focused
                              placeholder=" "
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
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <div style={{ width: "100%" }}>
                        <DatePicker
                          selected={date}
                          onChange={(d) => setDate(d)}
                          placeholderText=" "
                          customInput={
                            <TextField
                              label="Ngày giao hồ sơ dự kiến"
                              variant="standard"
                              fullWidth
                              focused
                              placeholder=" "
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
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                        }}
                      >
                        Hạng mục
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <CoreAutocomplete
                        control={control}
                        name="category"
                        label="Hạng mục"
                        placeholder=" "
                        options={[
                          { label: "Thiết kế kiến trúc", value: "abc" },
                          { label: "Thiết kế nội thất", value: "adeg" },
                        ]}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                        }}
                      >
                        Nhân sự dự án
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <CoreAutocomplete
                        control={control}
                        name="createPerson"
                        label="Người tạo dự án"
                        placeholder=" "
                        options={[
                          { label: "KTS.Nguyễn Văn A", value: "abc" },
                          { label: "KS. Nguyễn Văn B", value: "adeg" },
                        ]}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <CoreAutocomplete
                        control={control}
                        name="Person"
                        label="Chủ nhiệm dự án"
                        placeholder=" "
                        options={[
                          { label: "KTS.Nguyễn Văn A", value: "abc" },
                          { label: "KS. Nguyễn Văn B", value: "adeg" },
                        ]}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <CoreAutocomplete
                        control={control}
                        name="CSKH"
                        label="Nhân viên chăm sóc"
                        placeholder=" "
                        options={[
                          { label: "KTS.Nguyễn Văn A", value: "abc" },
                          { label: "KS. Nguyễn Văn B", value: "adeg" },
                        ]}
                      />
                    </Grid>
                  </Grid>
                  <br />
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      Thanh toán
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <RowBoxCommon title=" " data={"Đã thanh toán"} />
                  </Grid>
                  <br />
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      Mô tả dự án
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <EditText
                      editorText={editorText}
                      setEditorText={setEditorText}
                      disabled={false}
                      error={
                        editorText.length === 0 ? "Vui lòng nhập nội dung" : ""
                      }
                      height={300}
                    />
                  </Grid>
                  <br />
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      Ghi chú
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <EditText
                      editorText={editorText}
                      setEditorText={setEditorText}
                      disabled={false}
                      error={
                        editorText.length === 0 ? "Vui lòng nhập nội dung" : ""
                      }
                      height={300}
                    />
                  </Grid>
                  <br />
                  <Grid item xs={12} sm={12} md={6} lg={4}>
                    <CoreAutocomplete
                      control={control}
                      name="status"
                      label="Trạng thái"
                      placeholder=" "
                      options={[
                        { label: "Chưa bắt đầu", value: "abc" },
                        { label: "Hoàn thành", value: "adeg" },
                        { label: "Đã bắt đầu", value: "as" },
                      ]}
                    />
                  </Grid>
                  <br />
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        marginBottom: 2,
                      }}
                    >
                      Hợp đồng dự án
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Image src={upload} alt="upload" className="h-100vh" />
                  </Grid>
                  <br />
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        marginBottom: 2,
                      }}
                    >
                      Hình ảnh mẫu
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Image src={upload} alt="upload" className="h-100vh" />
                  </Grid>
                  <br />
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        marginBottom: 2,
                      }}
                    >
                      Hình ảnh công trình
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Image src={upload} alt="upload" className="h-100vh" />
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
