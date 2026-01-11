import CoreInputCustom from "@/components/atoms/CoreInputCustom";
import { Grid, InputAdornment, TextField, Typography } from "@mui/material";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { useForm, useFormContext } from "react-hook-form";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EditText from "@/components/atoms/EditText";
import { CoreButton } from "@/components/atoms/CoreButton";
import useStep1 from "./useStep1";
import { CoreDatePicker } from "@/components/atoms/CoreDatePicker";
type Props = {
  isLoadingSubmit?: boolean;
  handleChangeStep?: (val: number) => void;
  onChange?: (data: any) => void;
};
export default function Step1(props: Props) {
  const [{ control, watch, setValue, isView }, {}] = useStep1();
  const [date, setDate] = useState<Date | null>(null);
  const { handleChangeStep, isLoadingSubmit, onChange } = props;
  const { getValues } = useFormContext();

  const [editorText, setEditorText] = useState("");
  return (
    <>
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
            name="owner"
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
          <CoreDatePicker
            name="signDate"
            control={control!}
            label={"Ngày ký hợp đồng"}
            required={!isView}
            placeholder="Chọn ký hợp đồng"
            // rules={{
            //   required: "Bạn phải nhập ngày sinh",
            // }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4}>
          <CoreDatePicker
            name="deliveryDate"
            control={control!}
            label={"Ngày hoàn thành dự kiến"}
            required={!isView}
            placeholder="Chọn ngày hoàn thành"
            // rules={{
            //   required: "Bạn phải nhập ngày sinh",
            // }}
          />
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
      {!isView && (
        <div className="flex justify-center mt-15">
          <div className="m-5">
            <CoreButton theme="cancel" onClick={() => {}}>
              'Hủy'
            </CoreButton>
          </div>

          <div className="m-5">
            <CoreButton
              theme="submit"
              onClick={() => {
                // lấy toàn bộ giá trị trong form Step1
                const values = getValues(); // từ useFormContext()
                onChange?.(values); // gửi dữ liệu lên parent

                handleChangeStep && handleChangeStep(1); // chuyển bước 2
              }}
            >
              Chuyển bước 2
            </CoreButton>
          </div>
        </div>
      )}
    </>
  );
}
