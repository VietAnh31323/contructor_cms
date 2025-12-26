import { ConsApi } from "@/config/axios";
import { Response } from "./type";
import { useQuery } from "@tanstack/react-query";

export type ProjectParams = {
  search?: string;
  page?: number;
  size?: number;
};

export const getProjectList = async (
  params?: ProjectParams
): Promise<Response["GET"]> => {
  const res = await ConsApi.get("/api/v1/project/list", {
    params,
  });

  return {
    message: res.data.message,
    traceId: res.data.traceId,
    data: res.data.data,
  };
};

export const useProjectListQuery = (params?: ProjectParams) =>
  useQuery({
    queryKey: ["project-list", params],
    queryFn: () => getProjectList(params),
    enabled: true,
  });
