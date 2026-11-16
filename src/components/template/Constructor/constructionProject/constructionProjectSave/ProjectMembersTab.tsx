import { CoreButton } from "@/components/atoms/CoreButton";
import { useDialog } from "@/components/hooks/dialog/useDialog";
import { getEmployeeList } from "@/service/constructor/Employee/getList";
import {
  addProjectMember,
  deleteProjectMember,
  updateProjectMember,
} from "@/service/constructor/Project/memberContract";
import {
  PROJECT_MEMBER_ROLE_OPTIONS,
  ProjectMemberItem,
  ProjectMemberRole,
} from "@/service/constructor/Project/memberContract/type";
import { toastError, toastSuccess } from "@/toast";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import StarIcon from "@mui/icons-material/Star";
import {
  Alert,
  Autocomplete,
  Box,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";

interface ProjectMembersTabProps {
  projectId: number;
  members: ProjectMemberItem[];
  isView?: boolean;
  onRefresh: () => void;
}

export default function ProjectMembersTab({
  projectId,
  members,
  isView = false,
  onRefresh,
}: ProjectMembersTabProps) {
  const { showDialog, hideDialog } = useDialog();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<ProjectMemberItem | null>(null);
  const [staffOptions, setStaffOptions] = useState<any[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(false);

  // Form state
  const [selectedStaff, setSelectedStaff] = useState<any | null>(null);
  const [memberRole, setMemberRole] = useState<ProjectMemberRole>("PROJECT_MANAGER");
  const [isPrimary, setIsPrimary] = useState(false);
  const [joinedDate, setJoinedDate] = useState(moment().format("YYYY-MM-DD"));
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch staff list for dropdown
  useEffect(() => {
    if (!dialogOpen) return;
    setLoadingStaff(true);
    getEmployeeList({ page: 0, size: 200 } as any)
      .then((res: any) => {
        const list = res?.data?.content || res?.data || [];
        setStaffOptions(list);
      })
      .catch((err) => {
        console.error("Failed to load staff list", err);
      })
      .finally(() => setLoadingStaff(false));
  }, [dialogOpen]);

  const handleOpenAdd = () => {
    setEditingMember(null);
    setSelectedStaff(null);
    setMemberRole("PROJECT_MANAGER");
    setIsPrimary(false);
    setJoinedDate(moment().format("YYYY-MM-DD"));
    setNote("");
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: ProjectMemberItem) => {
    setEditingMember(item);
    setSelectedStaff({
      id: item.staffId,
      code: item.staffCode,
      name: item.staffName,
      firstName: item.staffName,
      phone: item.staffPhone,
      email: item.staffEmail,
    });
    setMemberRole(item.memberRole);
    setIsPrimary(Boolean(item.isPrimary));
    setJoinedDate(item.joinedDate || moment().format("YYYY-MM-DD"));
    setNote(item.note || "");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!selectedStaff?.id) {
      toastError("Vui lòng chọn nhân sự");
      return;
    }
    setSubmitting(true);
    try {
      const payload: ProjectMemberItem = {
        projectId,
        staffId: selectedStaff.id,
        memberRole,
        isPrimary,
        joinedDate,
        note: note.trim() || undefined,
      };

      if (editingMember?.id) {
        await updateProjectMember(projectId, editingMember.id, payload);
        toastSuccess("Cập nhật thông tin thành viên thành công");
      } else {
        await addProjectMember(projectId, payload);
        toastSuccess("Thêm thành viên vào dự án thành công");
      }
      setDialogOpen(false);
      onRefresh();
    } catch (err: any) {
      toastError(err?.message || "Không thể lưu thông tin thành viên");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (item: ProjectMemberItem) => {
    showDialog(
      <Dialog open onClose={hideDialog}>
        <DialogTitle sx={{ fontWeight: 700 }}>Xóa thành viên khỏi dự án</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn xóa nhân sự &quot;{item.staffName || item.staffCode}&quot; khỏi ban điều hành dự án?
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <CoreButton theme="cancel" onClick={hideDialog}>
            Hủy
          </CoreButton>
          <CoreButton
            theme="submit"
            onClick={async () => {
              hideDialog();
              try {
                if (item.id) {
                  await deleteProjectMember(projectId, item.id);
                  toastSuccess("Đã xóa thành viên khỏi dự án");
                  onRefresh();
                }
              } catch (err: any) {
                toastError(err?.message || "Không thể xóa thành viên");
              }
            }}
          >
            Đồng ý xóa
          </CoreButton>
        </DialogActions>
      </Dialog>
    );
  };

  const roleMetaMap = useMemo(() => {
    const map = new Map<string, { label: string; color: any }>();
    PROJECT_MEMBER_ROLE_OPTIONS.forEach((opt) => map.set(opt.value, opt));
    return map;
  }, []);

  const pmMembers = members.filter((m) => m.memberRole === "PROJECT_MANAGER");
  const otherMembers = members.filter((m) => m.memberRole !== "PROJECT_MANAGER");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Banner giới thiệu phân quyền dữ liệu 2.10 */}
      <Alert severity="info" sx={{ borderRadius: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Mục 2.10: Ban điều hành & Phân quyền dữ liệu theo phạm vi dự án
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          Các quản lý dự án (PM), kỹ sư giám sát và thành viên được phân công trong danh sách dưới đây sẽ được phân quyền trực tiếp để theo dõi tiến độ, xem hợp đồng và nhận báo cáo của dự án này.
        </Typography>
      </Alert>

      {/* Thống kê nhanh */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: "#f8fafc" }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Tổng số thành viên tham gia
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "#0284c7" }}>
                {members.length} nhân sự
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: "#f0fdf4" }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Chỉ huy trưởng / PM phụ trách chính
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#16a34a" }}>
                {pmMembers.find((m) => m.isPrimary)?.staffName || pmMembers[0]?.staffName || "Chưa phân công"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4} sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
          {!isView && (
            <CoreButton
              theme="submit"
              onClick={handleOpenAdd}
              sx={{ px: 2.5, py: 1, height: 40, borderRadius: 2 }}
            >
              <AddIcon sx={{ mr: 1, fontSize: 18 }} />
              Thêm thành viên dự án
            </CoreButton>
          )}
        </Grid>
      </Grid>

      {/* Bảng danh sách thành viên */}
      <TableContainer component={Card} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: "#f1f5f9" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, width: 60 }}>STT</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Nhân sự / Mã NV</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Vai trò trong dự án</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Phòng ban / Chức danh</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Liên hệ</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Ngày tham gia</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Ghi chú</TableCell>
              {!isView && (
                <TableCell align="center" sx={{ fontWeight: 700, width: 110 }}>
                  Thao tác
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isView ? 7 : 8} align="center" sx={{ py: 4 }}>
                  <GroupsOutlinedIcon sx={{ fontSize: 40, color: "#94a3b8", mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Chưa có thành viên nào trong dự án này. Nhấn &quot;Thêm thành viên&quot; để bổ sung ban điều hành.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              members.map((item, idx) => {
                const meta = roleMetaMap.get(item.memberRole);
                return (
                  <TableRow key={item.id || idx} hover>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {item.staffName || item.staff?.name || "--"}
                            {item.isPrimary && (
                              <Tooltip title="Chỉ huy trưởng / Phụ trách chính">
                                <StarIcon sx={{ fontSize: 16, color: "#eab308", ml: 0.5, verticalAlign: "middle" }} />
                              </Tooltip>
                            )}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Mã: {item.staffCode || item.staff?.code || "--"}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={meta?.label || item.memberRoleLabel || item.memberRole}
                        color={meta?.color || "default"}
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{item.staffPosition || "--"}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.staffDepartment || "--"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {item.staffPhone && (
                        <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <PhoneOutlinedIcon sx={{ fontSize: 13 }} /> {item.staffPhone}
                        </Typography>
                      )}
                      {item.staffEmail && (
                        <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}>
                          <EmailOutlinedIcon sx={{ fontSize: 13 }} /> {item.staffEmail}
                        </Typography>
                      )}
                      {!item.staffPhone && !item.staffEmail && "--"}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {item.joinedDate ? moment(item.joinedDate).format("DD/MM/YYYY") : "--"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {item.note || "--"}
                      </Typography>
                    </TableCell>
                    {!isView && (
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5} justifyContent="center">
                          <Tooltip title="Chỉnh sửa vai trò">
                            <IconButton size="small" onClick={() => handleOpenEdit(item)}>
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa khỏi dự án">
                            <IconButton size="small" color="error" onClick={() => handleDelete(item)}>
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal Thêm/Sửa Thành Viên */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          {editingMember ? "Cập nhật thành viên dự án" : "Thêm thành viên vào dự án"}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 3 }}>
          <Autocomplete
            options={staffOptions}
            loading={loadingStaff}
            disabled={Boolean(editingMember)}
            value={selectedStaff}
            getOptionLabel={(option) => {
              const name = option.name || [option.lastName, option.firstName].filter(Boolean).join(" ");
              return option.code ? `${option.code} - ${name}` : name;
            }}
            onChange={(_, val) => setSelectedStaff(val)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Chọn nhân sự tham gia *"
                placeholder="Tìm theo tên hoặc mã nhân viên"
                size="small"
              />
            )}
          />

          <FormControl fullWidth size="small">
            <InputLabel>Vai trò trong dự án *</InputLabel>
            <Select
              value={memberRole}
              label="Vai trò trong dự án *"
              onChange={(e) => setMemberRole(e.target.value as ProjectMemberRole)}
            >
              {PROJECT_MEMBER_ROLE_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Ngày tham gia"
            type="date"
            size="small"
            value={joinedDate}
            onChange={(e) => setJoinedDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Là phụ trách chính (Chỉ huy trưởng dự án)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Tự động đồng bộ làm người quản lý trực tiếp hiển thị tại danh sách dự án
                </Typography>
              </Box>
            }
          />

          <TextField
            label="Ghi chú phân công"
            multiline
            rows={3}
            size="small"
            placeholder="Nhiệm vụ cụ thể, khu vực phụ trách, quyết định bổ nhiệm..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2 }}>
          <CoreButton theme="cancel" onClick={() => setDialogOpen(false)} disabled={submitting}>
            Hủy
          </CoreButton>
          <CoreButton theme="submit" onClick={handleSave} loading={submitting}>
            Lưu thành viên
          </CoreButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
