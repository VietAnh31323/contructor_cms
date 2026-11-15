import { ConsApi } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";
import { CustomerCareLog, Response } from "./type";

export const getCustomerCareLogs = async (
  customerId: number
): Promise<Response["LIST"]> => {
  const res = await ConsApi.get(`/api/v1/customer/${customerId}/care-logs`);
  return {
    message: res.data.message,
    traceId: res.data.traceId,
    data: res.data.data,
  };
};

export const postCustomerCareLog = async (
  customerId: number,
  body: CustomerCareLog
) => {
  const res = await ConsApi.post(
    `/api/v1/customer/${customerId}/care-logs`,
    body
  );
  return res.data;
};

export const putCustomerCareLog = async (
  customerId: number,
  logId: number,
  body: CustomerCareLog
) => {
  const res = await ConsApi.put(
    `/api/v1/customer/${customerId}/care-logs/${logId}`,
    body
  );
  return res.data;
};

export const deleteCustomerCareLog = async (
  customerId: number,
  logId: number
) => {
  const res = await ConsApi.delete(
    `/api/v1/customer/${customerId}/care-logs/${logId}`
  );
  return res.data;
};

export const useCustomerCareLogsQuery = (
  customerId?: number,
  options?: { enabled?: boolean }
) =>
  useQuery({
    queryKey: ["customer-care-logs", customerId],
    queryFn: () => getCustomerCareLogs(customerId as number),
    enabled: !!customerId && options?.enabled !== false,
  });
