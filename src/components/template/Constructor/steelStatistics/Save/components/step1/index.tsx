import CoreInputCustom from "@/components/atoms/CoreInputCustom";
import { Grid, InputAdornment, TextField, Typography } from "@mui/material";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EditText from "@/components/atoms/EditText";
export default function Step1() {
  const [date, setDate] = useState<Date | null>(null);
  const { control } = useForm();
  const [editorText, setEditorText] = useState("");
  return (
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
            name="person"
            label="Chủ đầu tư"
            placeholder="Nhập chủ đầu tư"
            required
            rules={{ required: "Trường này là bắt buộc" }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4}>
          <CoreInputCustom
            control={control}
            name="address"
            label="Địa chỉ"
            placeholder="Nhập tên đỉa chỉ"
            required
            rules={{ required: "Trường này là bắt buộc" }}
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
                        <CalendarMonthIcon sx={{ cursor: "pointer" }} />
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
                        <CalendarMonthIcon sx={{ cursor: "pointer" }} />
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
            error={editorText.length === 0 ? "Vui lòng nhập nội dung" : ""}
            height={300}
          />
        </Grid>
        <br />
      </Grid>
    </form>
  );
}
