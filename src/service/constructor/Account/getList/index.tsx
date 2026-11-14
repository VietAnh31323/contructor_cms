import { useQuery } from "@tanstack/react-query";
import { ConsApi } from "@/config/axios";
import { RequestBody, Response } from "./type";

export const getAccountList = async (
  params?: RequestBody["GET"]
): Promise<Response["GET"]> => {
  const cleanParams: Record<string, any> = {};
  if (params?.search?.trim()) cleanParams.search = params.search.trim();
  if (params?.accountStatus) cleanParams.accountStatus = params.accountStatus;
  if (params?.page !== undefined) cleanParams.page = params.page;
  if (params?.size !== undefined) cleanParams.size = params.size;

  const res = await ConsApi.get("/api/v1/account/list", {
    params: cleanParams,
  });
  return {
    message: res.data.message,
    traceId: res.data.traceId,
    data: res.data.data,
  };
};

export const useAccountListQuery = (params?: RequestBody["GET"]) =>
  useQuery({
    queryKey: ["account-list", params],
    queryFn: () => getAccountList(params),
  });
