import { CoreButton } from "@/components/atoms/CoreButton";
import { useDialog } from "@/components/hooks/dialog/useDialog";
import { usePermission } from "@/components/hooks/permission/usePermission";
import CoreLoading from "@/components/molecules/CoreLoading";
import { PERMISSIONS } from "@/helper/permissions";
import {
  addProjectDocument,
  deleteProjectDocument,
  updateProjectDocument,
  useProjectDocumentsQuery,
} from "@/service/constructor/Project/document";
import {
  PROJECT_DOCUMENT_FOLDERS,
  ProjectDocumentFolder,
  ProjectDocumentItem,
} from "@/service/constructor/Project/document/type";
import { uploadPaymentAttachment } from "@/service/constructor/Project/payment";
import { toastError, toastSuccess } from "@/toast";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
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
import { useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import React, { useMemo, useState } from "react";

interface ProjectDocumentsTabProps {
  projectId: number;
  onRefreshProject?: () => void;
}

type DocFormState = {
  id?: number;
  folder: ProjectDocumentFolder;
  name: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize?: number;
  version: string;
  description: string;
};

const emptyDocForm = (
  folder: ProjectDocumentFolder = "DRAWING"
): DocFormState => ({
  folder,
  name: "",
  fileName: "",
  fileUrl: "",
  fileType: "",
  version: "v1.0",
  description: "",
});

const formatBytes = (bytes?: number) => {
  if (!bytes || bytes <= 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export default function ProjectDocumentsTab({
  projectId,
  onRefreshProject,
}: ProjectDocumentsTabProps) {
  const queryClient = useQueryClient();
  const { showDialog, hideDialog } = useDialog();
  const { hasPermission } = usePermission();
  const canUpdateProject = hasPermission(PERMISSIONS.PROJECT_UPDATE);

  const [selectedFolder, setSelectedFolder] = useState<
    ProjectDocumentFolder | "ALL"
  >("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [docForm, setDocForm] = useState<DocFormState>(emptyDocForm());
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const { data: docsResp, isLoading } = useProjectDocumentsQuery(
    projectId,
    "",
    { enabled: Boolean(projectId) }
  );

  const allDocs = docsResp?.data ?? [];

  const folderCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: allDocs.length };
    for (const f of PROJECT_DOCUMENT_FOLDERS) {
      counts[f.value] = allDocs.filter((d) => d.folder === f.value).length;
    }
    return counts;
  }, [allDocs]);

  const filteredDocs = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return allDocs.filter((d) => {
      if (selectedFolder !== "ALL" && d.folder !== selectedFolder) {
        return false;
      }
      if (!q) return true;
      return (
        (d.name || "").toLowerCase().includes(q) ||
        (d.fileName || "").toLowerCase().includes(q) ||
        (d.version || "").toLowerCase().includes(q) ||
        (d.uploadedByName || "").toLowerCase().includes(q)
      );
    });
  }, [allDocs, selectedFolder, searchTerm]);

  const invalidateDocs = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["project-documents", projectId],
      }),
      queryClient.invalidateQueries({
        queryKey: ["project-detail", projectId],
      }),
    ]);
    onRefreshProject?.();
  };

  const openAddDialog = () => {
    const defaultFolder: ProjectDocumentFolder =
      selectedFolder === "ALL" ? "DRAWING" : selectedFolder;
    setDocForm(emptyDocForm(defaultFolder));
    setDialogOpen(true);
  };

  const openEditDialog = (doc: ProjectDocumentItem) => {
    setDocForm({
      id: doc.id,
      folder: doc.folder,
      name: doc.name,
      fileName: doc.fileName || "",
      fileUrl: doc.fileUrl,
      fileType: doc.fileType || "",
      fileSize: doc.fileSize,
      version: doc.version || "v1.0",
      description: doc.description || "",
    });
    setDialogOpen(true);
  };

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const res = await uploadPaymentAttachment(file);
      if (res?.url) {
        setDocForm((prev) => ({
          ...prev,
          name: prev.name || file.name.replace(/\.[^/.]+$/, ""),
          fileName: res.name || file.name,
          fileUrl: res.url,
          fileType: res.type || file.type,
          fileSize: file.size,
        }));
        toastSuccess("Đã tải file lên hệ thống");
      }
    } catch (err) {
      toastError(err);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSaveDoc = async () => {
    if (!docForm.name.trim()) {
      toastError("Vui lòng nhập tên tài liệu");
      return;
    }
    if (!docForm.fileUrl.trim()) {
      toastError("Vui lòng tải file lên hoặc nhập đường dẫn tài liệu");
      return;
    }

    const payload: ProjectDocumentItem = {
      folder: docForm.folder,
      name: docForm.name.trim(),
      fileName: docForm.fileName?.trim() || undefined,
      fileUrl: docForm.fileUrl.trim(),
      fileType: docForm.fileType?.trim() || undefined,
      fileSize: docForm.fileSize,
      version: docForm.version?.trim() || "v1.0",
      description: docForm.description?.trim() || undefined,
    };

    try {
      setSaving(true);
      if (docForm.id) {
        await updateProjectDocument(projectId, docForm.id, payload);
        toastSuccess("Đã cập nhật tài liệu & phiên bản mới");
      } else {
        await addProjectDocument(projectId, payload);
        toastSuccess("Đã lưu tài liệu vào dự án");
      }
      setDialogOpen(false);
      await invalidateDocs();
    } catch (err) {
      toastError(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDoc = (doc: ProjectDocumentItem) => {
    if (!doc.id) return;
    showDialog(
      <Dialog open onClose={hideDialog}>
        <DialogTitle>Xác nhận xóa tài liệu</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn xóa tài liệu{" "}
          <strong>{doc.name}</strong> ({doc.version}) không?
        </DialogContent>
        <DialogActions>
          <CoreButton theme="cancel" onClick={hideDialog}>
            Hủy
          </CoreButton>
          <CoreButton
            theme="submit"
            onClick={async () => {
              try {
                await deleteProjectDocument(projectId, doc.id as number);
                toastSuccess("Đã xóa tài liệu");
                hideDialog();
                await invalidateDocs();
              } catch (err) {
                toastError(err);
              }
            }}
          >
            Xóa tài liệu
          </CoreButton>
        </DialogActions>
      </Dialog>
    );
  };

  if (isLoading) {
    return <CoreLoading />;
  }

  return (
    <Box className="py-4">
      {/* ================= DANH SÁCH THƯ MỤC (2.15) ================= */}
      <Stack
        direction="row"
        spacing={1.25}
        flexWrap="wrap"
        useFlexGap
        sx={{ mb: 2.5 }}
      >
        <Chip
          icon={<FolderOutlinedIcon />}
          label={`Tất cả tài liệu (${folderCounts.ALL || 0})`}
          color={selectedFolder === "ALL" ? "primary" : "default"}
          variant={selectedFolder === "ALL" ? "filled" : "outlined"}
          onClick={() => setSelectedFolder("ALL")}
          sx={{ fontWeight: 600 }}
        />
        {PROJECT_DOCUMENT_FOLDERS.map((folder) => {
          const isActive = selectedFolder === folder.value;
          return (
            <Chip
              key={folder.value}
              icon={<FolderOutlinedIcon sx={{ color: `${folder.color} !important` }} />}
              label={`${folder.label} (${folderCounts[folder.value] || 0})`}
              onClick={() => setSelectedFolder(folder.value)}
              variant={isActive ? "filled" : "outlined"}
              sx={{
                fontWeight: 600,
                bgcolor: isActive ? folder.bg : "#ffffff",
                color: folder.color,
                borderColor: folder.color,
              }}
            />
          );
        })}
      </Stack>

      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <TextField
            size="small"
            placeholder="Tìm theo tên tài liệu, phiên bản, người tải..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: { xs: "100%", sm: 320 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          {canUpdateProject && (
            <CoreButton
              theme="submit"
              startIcon={<AddIcon />}
              onClick={openAddDialog}
            >
              Tải lên tài liệu
            </CoreButton>
          )}
        </Stack>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8fafc" }}>
                <TableCell sx={{ fontWeight: 700 }}>Tên tài liệu</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Thư mục</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Phiên bản</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Người tải</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Ngày tải</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Dung lượng
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">
                  Hành động
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDocs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Chưa có tài liệu nào trong thư mục này.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredDocs.map((doc) => {
                  const folderMeta =
                    PROJECT_DOCUMENT_FOLDERS.find(
                      (f) => f.value === doc.folder
                    ) || PROJECT_DOCUMENT_FOLDERS[1];

                  return (
                    <TableRow key={doc.id} hover>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <InsertDriveFileOutlinedIcon
                            color="primary"
                            fontSize="small"
                          />
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {doc.name}
                            </Typography>
                            {(doc.fileName || doc.description) && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                              >
                                {doc.fileName}
                                {doc.fileName && doc.description ? " • " : ""}
                                {doc.description}
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={doc.folderLabel || folderMeta.label}
                          sx={{
                            bgcolor: folderMeta.bg,
                            color: folderMeta.color,
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          variant="outlined"
                          color="primary"
                          label={doc.version || "v1.0"}
                        />
                      </TableCell>
                      <TableCell>{doc.uploadedByName || "—"}</TableCell>
                      <TableCell>
                        {doc.uploadedAt
                          ? moment(doc.uploadedAt).format("DD/MM/YYYY HH:mm")
                          : "—"}
                      </TableCell>
                      <TableCell align="right">
                        {formatBytes(doc.fileSize)}
                      </TableCell>
                      <TableCell align="center">
                        <Stack
                          direction="row"
                          spacing={0.5}
                          justifyContent="center"
                        >
                          <Tooltip title="Mở / Tải xuống tài liệu">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => window.open(doc.fileUrl, "_blank")}
                            >
                              <OpenInNewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {canUpdateProject && (
                            <>
                              <Tooltip title="Cập nhật / Nâng phiên bản">
                                <IconButton
                                  size="small"
                                  color="warning"
                                  onClick={() => openEditDialog(doc)}
                                >
                                  <EditOutlinedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Xóa tài liệu">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDeleteDoc(doc)}
                                >
                                  <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* ================= DIALOG TẢI LÊN / CẬP NHẬT TÀI LIỆU ================= */}
      <Dialog
        open={dialogOpen}
        onClose={() => !saving && setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {docForm.id
            ? "Cập nhật thông tin / Phiên bản tài liệu"
            : "Tải lên tài liệu dự án"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Thư mục</InputLabel>
                <Select
                  value={docForm.folder}
                  label="Thư mục"
                  onChange={(e) =>
                    setDocForm((prev) => ({
                      ...prev,
                      folder: e.target.value as ProjectDocumentFolder,
                    }))
                  }
                >
                  {PROJECT_DOCUMENT_FOLDERS.map((f) => (
                    <MenuItem key={f.value} value={f.value}>
                      {f.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Phiên bản"
                placeholder="VD: v1.0, v1.1, v2.0"
                value={docForm.version}
                onChange={(e) =>
                  setDocForm((prev) => ({ ...prev, version: e.target.value }))
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                required
                label="Tên tài liệu"
                placeholder="VD: Bản vẽ kết cấu móng tầng hầm"
                value={docForm.name}
                onChange={(e) =>
                  setDocForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadOutlinedIcon />}
                  disabled={uploading}
                >
                  {uploading ? "Đang tải file..." : "Chọn file từ máy tính"}
                  <input type="file" hidden onChange={handleUploadFile} />
                </Button>
                {docForm.fileName && (
                  <Typography variant="caption" color="primary.main" noWrap>
                    {docForm.fileName} ({formatBytes(docForm.fileSize)})
                  </Typography>
                )}
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                required
                label="Đường dẫn tệp (tự điền khi tải file)"
                value={docForm.fileUrl}
                onChange={(e) =>
                  setDocForm((prev) => ({ ...prev, fileUrl: e.target.value }))
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                multiline
                minRows={2}
                label="Mô tả / Ghi chú phiên bản"
                value={docForm.description}
                onChange={(e) =>
                  setDocForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <CoreButton
            theme="cancel"
            onClick={() => setDialogOpen(false)}
            disabled={saving}
          >
            Hủy
          </CoreButton>
          <CoreButton theme="submit" onClick={handleSaveDoc} loading={saving}>
            {docForm.id ? "Lưu cập nhật" : "Lưu tài liệu"}
          </CoreButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
