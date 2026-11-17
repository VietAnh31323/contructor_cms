import { CoreButton } from "@/components/atoms/CoreButton";
import {
  applyProcessTemplateToProject,
  getProcessTemplateDetail,
  useProcessTemplateListQuery,
} from "@/service/constructor/ProcessTemplate";
import { ProcessTemplateItem } from "@/service/constructor/ProcessTemplate/type";
import { BUILDING_TYPE_OPTIONS, BuildingType } from "@/service/constructor/Project/getDetail/type";
import { toastError, toastSuccess } from "@/toast";
import AutoFixHighOutlinedIcon from "@mui/icons-material/AutoFixHighOutlined";
import {
  Alert,
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

interface ProcessTemplateDialogProps {
  open: boolean;
  projectId: number;
  defaultBuildingType?: BuildingType | null;
  onClose: () => void;
  onApplied: () => void;
}

export default function ProcessTemplateDialog({
  open,
  projectId,
  defaultBuildingType,
  onClose,
  onApplied,
}: ProcessTemplateDialogProps) {
  const [filterType, setFilterType] = useState<BuildingType | "">(
    defaultBuildingType || ""
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | "">("");
  const [templateDetail, setTemplateDetail] =
    useState<ProcessTemplateItem | null>(null);
  const [applying, setApplying] = useState(false);

  const { data: listResp } = useProcessTemplateListQuery(filterType, {
    enabled: open,
  });
  const templates = listResp?.data ?? [];

  useEffect(() => {
    if (open && defaultBuildingType) {
      setFilterType(defaultBuildingType);
    }
  }, [open, defaultBuildingType]);

  useEffect(() => {
    if (!open || templates.length === 0) {
      setSelectedTemplateId("");
      setTemplateDetail(null);
      return;
    }
    const first = templates[0];
    if (first?.id && !templates.some((t) => t.id === selectedTemplateId)) {
      setSelectedTemplateId(first.id);
    }
  }, [open, templates, selectedTemplateId]);

  useEffect(() => {
    if (!open || !selectedTemplateId) {
      setTemplateDetail(null);
      return;
    }
    let mounted = true;
    getProcessTemplateDetail(Number(selectedTemplateId))
      .then((res) => {
        if (mounted) setTemplateDetail(res?.data ?? null);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [open, selectedTemplateId]);

  const handleApply = async () => {
    if (!selectedTemplateId) {
      toastError("Vui lòng chọn template quy trình");
      return;
    }
    try {
      setApplying(true);
      await applyProcessTemplateToProject(projectId, Number(selectedTemplateId));
      toastSuccess(
        "Đã sinh giai đoạn & công việc mặc định vào biểu đồ Gantt của dự án"
      );
      onApplied();
      onClose();
    } catch (err) {
      toastError(err);
    } finally {
      setApplying(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => !applying && onClose()}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center">
          <AutoFixHighOutlinedIcon color="primary" />
          <span>Áp dụng Template quy trình theo loại công trình (2.20)</span>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Alert severity="info" sx={{ mb: 2 }}>
          Hệ thống sẽ tự động sinh các giai đoạn thi công và công việc mặc định
          vào biểu đồ Gantt của dự án theo ngày ký hợp đồng (hoặc ngày hiện tại).
        </Alert>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 240 }}>
            <InputLabel>Lọc theo loại công trình</InputLabel>
            <Select
              value={filterType}
              label="Lọc theo loại công trình"
              onChange={(e) =>
                setFilterType(e.target.value as BuildingType | "")
              }
            >
              <MenuItem value="">Tất cả loại công trình</MenuItem>
              {BUILDING_TYPE_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel>Chọn Template quy trình</InputLabel>
            <Select
              value={selectedTemplateId}
              label="Chọn Template quy trình"
              onChange={(e) =>
                setSelectedTemplateId(e.target.value as number | "")
              }
            >
              {templates.map((tpl) => (
                <MenuItem key={tpl.id} value={tpl.id}>
                  {tpl.name} ({tpl.stageCount ?? 0} giai đoạn •{" "}
                  {tpl.taskCount ?? 0} công việc)
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {templateDetail && (
          <Box>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 1.5 }}
            >
              <Chip
                size="small"
                color="primary"
                label={templateDetail.buildingTypeLabel || templateDetail.buildingType}
              />
              {templateDetail.isDefault && (
                <Chip size="small" color="success" label="Mặc định" />
              )}
              <Typography variant="caption" color="text.secondary">
                {templateDetail.description}
              </Typography>
            </Stack>

            <Stack spacing={1.5} sx={{ maxHeight: 340, overflowY: "auto" }}>
              {(templateDetail.stages || []).map((stage, idx) => (
                <Paper
                  key={stage.id ?? idx}
                  variant="outlined"
                  sx={{ p: 1.5, borderRadius: 2, bgcolor: "#f8fafc" }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 0.5 }}
                  >
                    <Typography variant="subtitle2" fontWeight={700}>
                      {stage.name}
                    </Typography>
                    <Chip
                      size="small"
                      variant="outlined"
                      label={`${stage.durationDays ?? 14} ngày`}
                    />
                  </Stack>
                  <List dense disablePadding>
                    {(stage.tasks || []).map((t, tIdx) => (
                      <ListItem key={t.id ?? tIdx} disableGutters sx={{ py: 0.25 }}>
                        <ListItemText
                          primary={`• ${t.name}`}
                          secondary={`Bắt đầu: +${t.offsetDays ?? 0} ngày • Thời lượng: ${t.durationDays ?? 7} ngày`}
                          primaryTypographyProps={{ variant: "body2" }}
                          secondaryTypographyProps={{ variant: "caption" }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              ))}
            </Stack>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <CoreButton theme="cancel" onClick={onClose} disabled={applying}>
          Đóng
        </CoreButton>
        <CoreButton
          theme="submit"
          onClick={handleApply}
          loading={applying}
          disabled={!selectedTemplateId}
        >
          Sinh giai đoạn & công việc vào dự án
        </CoreButton>
      </DialogActions>
    </Dialog>
  );
}
