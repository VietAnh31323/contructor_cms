import { ProjectListItem } from "@/service/constructor/Project/getList/type";
import { SteelProjectDto } from "@/service/constructor/SteelProject/type";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Autocomplete,
  Box,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
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
    <Grid container spacing={2.5}>
      <Grid item xs={12} md={6}>
        <Paper
          variant="outlined"
          sx={{ p: 2.5, borderRadius: 2.5, height: "100%" }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
            <BusinessOutlinedIcon color="primary" fontSize="small" />
            <Typography variant="subtitle1" fontWeight={700}>
              Liên kết Dự án &amp; Định danh
            </Typography>
          </Stack>
          <Divider sx={{ mb: 2 }} />

          <Stack spacing={2.2}>
            <Box>
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
                    helperText="Chọn dự án để tự động điền chủ đầu tư, địa điểm & mốc ngày"
                  />
                )}
              />
              {selectedProject && (
                <Chip
                  size="small"
                  color="success"
                  variant="outlined"
                  label={`Đã liên kết: ${selectedProject.code} - ${selectedProject.name}`}
                  sx={{ mt: 1, fontWeight: 600 }}
                />
              )}
            </Box>

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
          </Stack>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper
          variant="outlined"
          sx={{ p: 2.5, borderRadius: 2.5, height: "100%" }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
            <InfoOutlinedIcon color="primary" fontSize="small" />
            <Typography variant="subtitle1" fontWeight={700}>
              Chủ đầu tư, Địa điểm &amp; Thời gian
            </Typography>
          </Stack>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12}>
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

            <Grid item xs={12}>
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

            <Grid item xs={12} sm={6}>
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

            <Grid item xs={12} sm={6}>
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
                    rows={2}
                    disabled={isView}
                    label="Ghi chú / Mô tả kỹ thuật"
                    placeholder="Nhập ghi chú kỹ thuật hoặc phạm vi thống kê thép"
                  />
                )}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
