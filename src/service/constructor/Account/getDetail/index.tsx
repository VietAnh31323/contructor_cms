import { ConsApi } from "@/config/axios";
import { Response } from "./type";
import { useQuery } from "@tanstack/react-query";

export const getAccountDetail = async (): Promise<Response["GET"]> => {
  const res = await ConsApi.get("/api/v1/account");

  return {
    message: res.data.message,
    traceId: res.data.traceId,
    data: res.data.data,
  };
};

export const useAccountDetailQuery = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: ["account-detail"],
    queryFn: getAccountDetail,
    enabled: options?.enabled !== false,
  });
