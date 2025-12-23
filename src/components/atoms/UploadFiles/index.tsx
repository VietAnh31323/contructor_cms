import { fileUpload } from "@/service/upload";
import { toastError, toastSuccess } from "@/toast";
import { useState } from "react";

export const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  const [uploadProgress, setUploadProgress] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState(data?.data?.avatar);
  if (!file) return;

  // Optional: validate ảnh
  if (!file.type.startsWith("image/")) {
    toastError("Chỉ cho phép upload ảnh");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    setUploadProgress(0);

    const res = await fileUpload(
      formData,
      { folder: "avatar" },
      (progressEvent) => {
        if (!progressEvent.total) return;
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percent);
      }
    );

    const imageUrl = res.data?.data?.url;
    setAvatarUrl(imageUrl);

    toastSuccess("Cập nhật ảnh đại diện thành công");
  } catch (error) {
    toastError("Upload ảnh thất bại");
  } finally {
    setUploadProgress(0);
  }
};
