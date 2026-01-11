import { ConsApi } from "@/config/axios";
import { Response } from "./type";
import { useQuery } from "@tanstack/react-query";

export type AssemblyParams = {
  search?: string;
  page?: number;
  size?: number;
  isActive?: boolean;
};

export const getAssemblyList = async (
  params?: AssemblyParams
): Promise<Response["GET"]> => {
  const res = await ConsApi.get("/api/v1/assembly/list", {
    params,
  });

  return {
    message: res.data.message,
    traceId: res.data.traceId,
    data: res.data.data,
  };
};

export const useCategoryListQuery = (params?: AssemblyParams) =>
  useQuery({
    queryKey: ["assembly-list", params],
    queryFn: () => getAssemblyList(params),
    enabled: true,
  });
