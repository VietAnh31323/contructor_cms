import { downloadExcelFromUrl } from "@/service/constructor/Dashboard";
import { toastError } from "@/toast";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Button } from "@mui/material";
import { useState } from "react";

interface ExportExcelButtonProps {
  endpoint: string;
  filename: string;
  params?: Record<string, any>;
  label?: string;
}

export default function ExportExcelButton({
  endpoint,
  filename,
  params,
  label = "Xuất Excel",
}: ExportExcelButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      await downloadExcelFromUrl(endpoint, filename, params);
    } catch (err) {
      toastError(err, "Xuất file Excel thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outlined"
      color="success"
      size="small"
      startIcon={<FileDownloadIcon />}
      disabled={loading}
      onClick={handleClick}
      sx={{ textTransform: "none", fontWeight: 600 }}
    >
      {loading ? "Đang xuất..." : label}
    </Button>
  );
}
