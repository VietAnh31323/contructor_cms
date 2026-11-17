import { ConsApi } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";
import { ProjectLineDto } from "../getDetail/type";
import {
  ProjectPaymentItem,
  ProjectPaymentStatus,
  ProjectPaymentSummary,
  UploadItem,
} from "./type";

export const getProjectPayments = async (
  projectId: number
): Promise<{ message?: string; traceId?: string; data: ProjectPaymentSummary }> => {
  const res = await ConsApi.get(`/api/v1/project/${projectId}/payments`);
  return res.data;
};

export const useProjectPaymentsQuery = (
  projectId?: number,
  options?: { enabled?: boolean }
) =>
  useQuery({
    queryKey: ["project-payments", projectId],
    queryFn: () => getProjectPayments(projectId as number),
    enabled: Boolean(projectId) && options?.enabled !== false,
  });

export const savePaymentPlans = async (
  projectId: number,
  lines: ProjectLineDto[]
): Promise<{ message?: string; traceId?: string; data: ProjectLineDto[] }> => {
  const res = await ConsApi.put(
    `/api/v1/project/${projectId}/payment-plans`,
    lines
  );
  return res.data;
};

export const createProjectPayment = async (
  projectId: number,
  body: ProjectPaymentItem
) => {
  const res = await ConsApi.post(`/api/v1/project/${projectId}/payments`, body);
  return res.data;
};

export const updateProjectPayment = async (
  projectId: number,
  paymentId: number,
  body: ProjectPaymentItem
) => {
  const res = await ConsApi.put(
    `/api/v1/project/${projectId}/payments/${paymentId}`,
    body
  );
  return res.data;
};

export const updateProjectPaymentStatus = async (
  projectId: number,
  paymentId: number,
  status: ProjectPaymentStatus
) => {
  const res = await ConsApi.patch(
    `/api/v1/project/${projectId}/payments/${paymentId}/status`,
    null,
    { params: { status } }
  );
  return res.data;
};

export const deleteProjectPayment = async (
  projectId: number,
  paymentId: number
) => {
  const res = await ConsApi.delete(
    `/api/v1/project/${projectId}/payments/${paymentId}`
  );
  return res.data;
};

export const uploadPaymentAttachment = async (
  file: File
): Promise<UploadItem> => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await ConsApi.post("/api/v1/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data?.data ?? res.data;
};
