import {
  downloadSteelImportTemplate,
  importSteelProjectExcel,
} from "@/service/constructor/SteelProject";
import {
  SteelImportErrorDto,
  SteelProjectDto,
} from "@/service/constructor/SteelProject/type";
import { toastError, toastSuccess } from "@/toast";
import DownloadIcon from "@mui/icons-material/Download";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";

export function triggerBlobDownload(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

interface SteelImportDialogProps {
  open: boolean;
  steelProjectId: number;
  onClose: () => void;
  onImported: (updated?: SteelProjectDto) => void;
}

export default function SteelImportDialog({
  open,
  steelProjectId,
  onClose,
  onImported,
}: SteelImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [replaceExisting, setReplaceExisting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [downloadingTpl, setDownloadingTpl] = useState(false);
  const [errors, setErrors] = useState<SteelImportErrorDto[]>([]);
  const [summaryMsg, setSummaryMsg] = useState<string | null>(null);

  const handleDownloadTemplate = async () => {
    try {
      setDownloadingTpl(true);
      const blob = await downloadSteelImportTemplate();
      triggerBlobDownload(blob, "mau-nhap-thong-ke-thep.xlsx");
    } catch (err) {
      toastError(err, "Không thể tải file mẫu Excel");
    } finally {
      setDownloadingTpl(false);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toastError(null, "Vui lòng chọn file Excel (.xlsx)");
      return;
    }
    try {
      setSubmitting(true);
      setErrors([]);
      setSummaryMsg(null);
      const res = await importSteelProjectExcel(
        steelProjectId,
        file,
        replaceExisting
      );
      if (!res.success) {
        setErrors(res.errors ?? []);
        setSummaryMsg(
          `Kiểm tra ${res.totalRows} dòng: ${res.validRows} dòng hợp lệ, ${res.errorCount} lỗi cần sửa trước khi nhập.`
        );
        return;
      }
      toastSuccess(
        `Đã nhập thành công ${res.importedAssemblyCount} cấu kiện (${res.importedBarCount} thanh thép)`
      );
      onImported(res.steelProject);
      handleResetAndClose();
    } catch (err) {
      toastError(err, "Nhập dữ liệu từ Excel thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setFile(null);
    setErrors([]);
    setSummaryMsg(null);
    setReplaceExisting(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleResetAndClose} maxWidth="md" fullWidth>
      <DialogTitle fontWeight={700}>Nhập bảng thống kê thép từ Excel</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5}>
          <Alert severity="info">
            Tải file mẫu Excel chuẩn, điền danh sách cấu kiện &amp; thanh thép
            (sheet <b>DuLieuThep</b>, tra cứu mã hình dạng tại sheet{" "}
            <b>DanhMucHinhDang</b>) rồi tải lên để hệ thống kiểm tra và tính toán
            tự động.
          </Alert>

          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadTemplate}
              disabled={downloadingTpl}
            >
              {downloadingTpl ? "Đang tải mẫu..." : "Tải file mẫu Excel (.xlsx)"}
            </Button>

            <Button
              variant="contained"
              component="label"
              startIcon={<UploadFileIcon />}
            >
              Chọn file Excel
              <input
                type="file"
                hidden
                accept=".xlsx,.xls"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  setFile(f);
                  setErrors([]);
                  setSummaryMsg(null);
                }}
              />
            </Button>

            {file && (
              <Typography variant="body2" fontWeight={600} color="primary.main">
                {file.name}
              </Typography>
            )}
          </Stack>

          <FormControlLabel
            control={
              <Checkbox
                checked={replaceExisting}
                onChange={(e) => setReplaceExisting(e.target.checked)}
              />
            }
            label="Ghi đè toàn bộ cấu kiện hiện tại (bỏ chọn để thêm nối tiếp)"
          />

          {summaryMsg && (
            <Alert severity="error" sx={{ fontWeight: 600 }}>
              {summaryMsg}
            </Alert>
          )}

          {errors.length > 0 && (
            <Box>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                Chi tiết lỗi từng dòng:
              </Typography>
              <TableContainer sx={{ maxHeight: 280, border: "1px solid #e2e8f0", borderRadius: 1 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, width: 80 }}>Dòng</TableCell>
                      <TableCell sx={{ fontWeight: 700, width: 170 }}>Cột</TableCell>
                      <TableCell sx={{ fontWeight: 700, width: 160 }}>Giá trị</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Mô tả lỗi</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {errors.map((e, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{e.rowNumber}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{e.column}</TableCell>
                        <TableCell sx={{ color: "text.secondary" }}>
                          {e.rawValue || "—"}
                        </TableCell>
                        <TableCell sx={{ color: "error.main" }}>
                          {e.message}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleResetAndClose} disabled={submitting}>
          Đóng
        </Button>
        <Button
          variant="contained"
          onClick={handleImport}
          disabled={!file || submitting}
        >
          {submitting ? "Đang kiểm tra & nhập..." : "Kiểm tra & Nhập dữ liệu"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
