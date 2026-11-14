import { ConsApi } from "@/config/axios";
import { PageResponse } from "@/service/type";
import { useQuery } from "@tanstack/react-query";

export type AuditLogItem = {
  id: number;
  username: string;
  action: string;
  module: string;
  entityName?: string;
  entityId?: string;
  oldValue?: string;
  newValue?: string;
  ipAddress?: string;
  userAgent?: string;
  description?: string;
  createdAt?: string;
};

export type AuditLogQueryParams = {
  search?: string;
  username?: string;
  module?: string | null;
  action?: string | null;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
};

export const getAuditLogList = async (
  params?: AuditLogQueryParams
): Promise<PageResponse<AuditLogItem[]>> => {
  const cleanParams: Record<string, any> = {};
  if (params?.search?.trim()) cleanParams.search = params.search.trim();
  if (params?.username?.trim()) cleanParams.username = params.username.trim();
  if (params?.module) cleanParams.module = params.module;
  if (params?.action) cleanParams.action = params.action;
  if (params?.fromDate) cleanParams.fromDate = params.fromDate;
  if (params?.toDate) cleanParams.toDate = params.toDate;
  if (params?.page !== undefined) cleanParams.page = params.page;
  if (params?.size !== undefined) cleanParams.size = params.size;

  const res = await ConsApi.get("/api/v1/audit-log/list", {
    params: cleanParams,
  });

  return {
    message: res.data.message,
    traceId: res.data.traceId,
    data: res.data.data,
  };
};

export const useAuditLogListQuery = (params?: AuditLogQueryParams) =>
  useQuery({
    queryKey: ["audit-log-list", params],
    queryFn: () => getAuditLogList(params),
  });

export const getAuditLogDetail = async (id: number): Promise<AuditLogItem> => {
  const res = await ConsApi.get("/api/v1/audit-log", { params: { id } });
  return res.data?.data;
};

export const useAuditLogDetailQuery = (
  id: number | null,
  options?: { enabled?: boolean }
) =>
  useQuery({
    queryKey: ["audit-log-detail", id],
    queryFn: () => getAuditLogDetail(id as number),
    enabled: Boolean(id) && options?.enabled !== false,
  });
