import React, { ChangeEvent, useRef, useState } from "react";
import { uploadFile } from "@/service/constructor/TaskCollab";
import { toastError, toastSuccess } from "@/toast";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";

interface AvatarUploadFieldProps {
  value?: string | null;
  onChange: (url: string) => void;
  fallbackText?: string;
  disabled?: boolean;
  label?: string;
  helperText?: string;
  size?: number;
}

export const AvatarUploadField: React.FC<AvatarUploadFieldProps> = ({
  value,
  onChange,
  fallbackText = "NV",
  disabled = false,
  label = "Ảnh đại diện nhân sự",
  helperText = "Hỗ trợ PNG, JPG, JPEG (tối đa 5MB)",
  size = 84,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toastError("Vui lòng chọn tệp hình ảnh (PNG, JPG, JPEG)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toastError("Dung lượng ảnh không được vượt quá 5MB");
      return;
    }

    setUploading(true);
    try {
      const uploaded = await uploadFile(file);
      const uploadedUrl = uploaded?.url;
      if (uploadedUrl) {
        onChange(uploadedUrl);
        toastSuccess("Tải ảnh lên thành công");
      } else {
        toastError("Không nhận được đường dẫn ảnh từ máy chủ");
      }
    } catch (err: any) {
      toastError(err?.message || "Tải ảnh lên thất bại");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2.5,
        border: "1px solid",
        borderColor: isDark ? "#1e293b" : "#e2e8f0",
        bgcolor: isDark ? "#0b1120" : "#f8fafc",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "flex-start", sm: "center" }}
      >
        <Box sx={{ position: "relative", flexShrink: 0 }}>
          <Avatar
            src={value || undefined}
            sx={{
              width: size,
              height: size,
              fontSize: Math.round(size * 0.32),
              fontWeight: 800,
              bgcolor: "#2563eb",
              color: "#ffffff",
              border: `3px solid ${isDark ? "#1e293b" : "#ffffff"}`,
              boxShadow: "0 4px 12px rgba(15, 23, 42, 0.12)",
            }}
          >
            {fallbackText.slice(0, 2).toUpperCase()}
          </Avatar>
          {uploading && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                bgcolor: "rgba(15, 23, 42, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress size={24} sx={{ color: "#ffffff" }} />
            </Box>
          )}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="subtitle2"
            fontWeight={700}
            sx={{ color: "text.primary" }}
          >
            {label}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 1.25 }}
          >
            {helperText}
          </Typography>

          {!disabled && (
            <Stack direction="row" spacing={1} alignItems="center">
              <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                size="small"
                variant="outlined"
                disabled={uploading}
                startIcon={<CloudUploadOutlinedIcon fontSize="small" />}
                onClick={() => inputRef.current?.click()}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                {value ? "Thay ảnh khác" : "Tải ảnh lên"}
              </Button>
              {value && (
                <Tooltip title="Xóa ảnh">
                  <IconButton
                    size="small"
                    color="error"
                    disabled={uploading}
                    onClick={() => onChange("")}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          )}
        </Box>
      </Stack>
    </Box>
  );
};
