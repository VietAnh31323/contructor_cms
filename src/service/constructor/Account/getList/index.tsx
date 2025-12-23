import { useQuery } from "@tanstack/react-query";
import { ConsApi } from "@/config/axios";
import { Response } from "./type";

export const getAccountList = async (): Promise<Response["GET"]> => {
  const res = await ConsApi.get("/api/v1/account/list");
  return {
    message: res.data.message,
    traceId: res.data.traceId,
    data: res.data.data,
  };
};

export const useAccountListQuery = () =>
  useQuery({
    queryKey: ["account-list"],
    queryFn: getAccountList,
  });
