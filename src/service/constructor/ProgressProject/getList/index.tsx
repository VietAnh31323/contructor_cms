import { useQuery } from "@tanstack/react-query";
import { ConsApi } from "@/config/axios";
import { Response } from "./type";
export type Params = {
  search?: string;
  page?: number;
  size?: number;
  isActive?: boolean;
};

export const getProgressProjectList = async (
  params?: Params
): Promise<Response["GET"]> => {
  const res = await ConsApi.get("/api/v1/progress/list", {
    params,
  });
  return {
    message: res.data.message,
    traceId: res.data.traceId,
    data: res.data.data,
  };
};

export const useProgressProjectListQuery = (params?: Params) =>
  useQuery({
    queryKey: ["progressProject-list", params],
    queryFn: () => getProgressProjectList(params),
    enabled: true,
  });
