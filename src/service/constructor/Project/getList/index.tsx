import { ConsApi } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";
import { RequestBody, Response } from "./type";

export const getProjectList = async (
  params?: RequestBody["GET"]
): Promise<Response["GET"]> => {
  const cleanParams: Record<string, any> = {};
  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        cleanParams[key] = val;
      }
    });
  }
  const res = await ConsApi.get("/api/v1/project/list", {
    params: cleanParams,
  });
  return {
    message: res.data.message,
    traceId: res.data.traceId,
    data: res.data.data,
  };
};

export const useProjectListQuery = (params?: RequestBody["GET"]) =>
  useQuery({
    queryKey: ["project-list", params],
    queryFn: () => getProjectList(params),
  });
