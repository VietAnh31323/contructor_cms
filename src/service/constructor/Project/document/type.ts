export type ProjectDocumentFolder =
  | "CONTRACT"
  | "DRAWING"
  | "ESTIMATE"
  | "MINUTES"
  | "SITE_PHOTO";

export type ProjectDocumentItem = {
  id?: number;
  projectId?: number;
  folder: ProjectDocumentFolder;
  folderLabel?: string;
  name: string;
  fileName?: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: number;
  version?: string;
  uploadedByName?: string;
  uploadedAt?: string;
  description?: string;
};

export const PROJECT_DOCUMENT_FOLDERS: {
  value: ProjectDocumentFolder;
  label: string;
  color: string;
  bg: string;
}[] = [
  { value: "CONTRACT", label: "Hợp đồng", color: "#1d4ed8", bg: "#eff6ff" },
  { value: "DRAWING", label: "Bản vẽ", color: "#0369a1", bg: "#f0f9ff" },
  { value: "ESTIMATE", label: "Dự toán", color: "#b45309", bg: "#fffbeb" },
  { value: "MINUTES", label: "Biên bản", color: "#7c3aed", bg: "#f5f3ff" },
  { value: "SITE_PHOTO", label: "Ảnh hiện trường", color: "#047857", bg: "#ecfdf5" },
];
