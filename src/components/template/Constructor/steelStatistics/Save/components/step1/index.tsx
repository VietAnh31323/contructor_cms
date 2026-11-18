import { ProjectListItem } from "@/service/constructor/Project/getList/type";
import { SteelProjectDto } from "@/service/constructor/SteelProject/type";
import { Autocomplete, Grid, TextField } from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";

interface Step1Props {
  form: UseFormReturn<SteelProjectDto>;
  projects: ProjectListItem[];
  isView?: boolean;
  onSelectProject: (projectId: number | null) => void;
}

export default function Step1({
  form,
  projects,
  isView,
  onSelectProject,
}: Step1Props) {
  const { control, watch } = form;
  const projectId = watch("projectId");
  const selectedProject = projects.find((p) => p.id === projectId) ?? null;

  return (
    <div className="px-4 py-2">
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Autocomplete
            disabled={isView}
            options={projects}
            value={selectedProject}
            getOptionLabel={(opt) =>
              opt.code ? `${opt.code} - ${opt.name}` : opt.name
            }
            isOptionEqualToValue={(opt, val) => opt.id === val.id}
            onChange={(_, val) => onSelectProject(val ? val.id : null)}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                label="Gắn với dự án chính"
                placeholder="Chọn dự án xây dựng (tùy chọn)"
                helperText="Chọn dự án chính để tự động điền thông tin công trình & chủ đầu tư"
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name="code"
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                disabled={isView}
                label="Mã bảng thống kê thép"
                placeholder="Để trống để tự động sinh mã (DATKT...)"
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name="name"
            rules={{ required: "Vui lòng nhập tên bảng thống kê" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                required
                size="small"
                disabled={isView}
                label="Tên bảng thống kê thép / Công trình"
                placeholder="VD: Thống kê thép sàn tầng 1 - Nhà phố Anh Minh"
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name="owner"
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                disabled={isView}
                label="Chủ đầu tư"
                placeholder="Nhập tên chủ đầu tư"
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name="address"
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                disabled={isView}
                label="Địa điểm công trình"
                placeholder="Nhập địa điểm thi công"
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Controller
            control={control}
            name="signDate"
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                type="date"
                disabled={isView}
                label="Ngày ký"
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Controller
            control={control}
            name="deliveryDate"
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                type="date"
                disabled={isView}
                label="Ngày giao dự kiến"
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                multiline
                rows={3}
                disabled={isView}
                label="Ghi chú / Mô tả"
                placeholder="Nhập ghi chú kỹ thuật hoặc mô tả phạm vi thống kê thép"
              />
            )}
          />
        </Grid>
      </Grid>
    </div>
  );
}
