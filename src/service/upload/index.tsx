import { AxiosProgressEvent } from "axios";
import { ConsApi } from "@/config/axios";

export const fileUpload = (
  data: FormData,
  params: Record<string, any> = {},
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
) => {
  return ConsApi.post("/api/v1/upload", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    params,
    onUploadProgress,
  });
};
