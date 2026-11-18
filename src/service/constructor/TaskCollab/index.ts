import { ConsApi } from "@/config/axios";
import { CodeNameRef } from "../Customer/getList/type";
import { useQuery } from "@tanstack/react-query";

export type UploadItem = { name: string; url: string; type?: string };

/** 2.25: Báo cáo hiện trường */
export type SiteReportPhase = "BEFORE" | "DURING" | "AFTER";

export type TaskSiteReport = {
  id?: number;
  taskId?: number;
  projectId?: number;
  reportPhase: SiteReportPhase;
  reportPhaseLabel?: string;
  note?: string | null;
  images: UploadItem[];
  latitude?: number | null;
  longitude?: number | null;
  locationAccuracy?: number | null;
  locationAddress?: string | null;
  capturedAt?: string | null;
  reporterStaffId?: number | null;
  reporterName?: string | null;
  createdAt?: string;
  canDelete?: boolean;
};

/** 2.27: Bình luận & @mention */
export type TaskComment = {
  id?: number;
  taskId?: number;
  parentId?: number | null;
  content: string;
  mentionedStaffIds?: number[];
  mentionedStaffs?: CodeNameRef[];
  attachments?: UploadItem[];
  authorStaffId?: number | null;
  authorName?: string | null;
  edited?: boolean;
  canEdit?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

const unwrap = <T,>(res: any): T => (res?.data?.data ?? res?.data) as T;

// ---------- 2.25 ----------
export const getTaskSiteReports = async (taskId: number) =>
  unwrap<TaskSiteReport[]>(await ConsApi.get(`/api/v1/task/${taskId}/site-reports`));

export const useTaskSiteReportsQuery = (taskId?: number) =>
  useQuery({
    queryKey: ["task-site-reports", taskId],
    queryFn: () => getTaskSiteReports(taskId as number),
    enabled: Boolean(taskId),
  });

export const createTaskSiteReport = async (taskId: number, body: TaskSiteReport) =>
  unwrap<TaskSiteReport>(await ConsApi.post(`/api/v1/task/${taskId}/site-reports`, body));

export const deleteTaskSiteReport = async (taskId: number, reportId: number) =>
  unwrap<void>(await ConsApi.delete(`/api/v1/task/${taskId}/site-reports/${reportId}`));

// ---------- 2.27 ----------
export const getTaskComments = async (taskId: number) =>
  unwrap<TaskComment[]>(await ConsApi.get(`/api/v1/task/${taskId}/comments`));

export const useTaskCommentsQuery = (taskId?: number) =>
  useQuery({
    queryKey: ["task-comments", taskId],
    queryFn: () => getTaskComments(taskId as number),
    enabled: Boolean(taskId),
    refetchInterval: 30000,
  });

export const createTaskComment = async (taskId: number, body: TaskComment) =>
  unwrap<TaskComment>(await ConsApi.post(`/api/v1/task/${taskId}/comments`, body));

export const updateTaskComment = async (
  taskId: number,
  commentId: number,
  body: TaskComment
) =>
  unwrap<TaskComment>(
    await ConsApi.put(`/api/v1/task/${taskId}/comments/${commentId}`, body)
  );

export const deleteTaskComment = async (taskId: number, commentId: number) =>
  unwrap<void>(await ConsApi.delete(`/api/v1/task/${taskId}/comments/${commentId}`));

// ---------- Upload dùng chung ----------
export const uploadFile = async (file: File): Promise<UploadItem> => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await ConsApi.post("/api/v1/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  const data = res.data?.data ?? res.data;
  return {
    name: data?.name || file.name,
    url: data?.url,
    type: data?.type || file.type,
  };
};
