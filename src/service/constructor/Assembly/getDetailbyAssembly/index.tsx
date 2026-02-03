import { ConsApi } from "@/config/axios";
import { Response } from "./type";
import { useQuery } from "@tanstack/react-query";

export const getByAssemblyDetail = async (
  assemblyId: number,
): Promise<Response["GET"]> => {
  const res = await ConsApi.get("/api/v1/steel/by-assembly/list", {
    params: { assemblyId },
  });

  return {
    message: res.data.message,
    traceId: res.data.traceId,
    data: res.data.data,
  };
};

export const useByAssemblyDetailQuery = (
  assemblyId?: number,
  options?: {
    enabled?: boolean;
  },
) =>
  useQuery({
    queryKey: ["assembly-detail", assemblyId],
    queryFn: () => getByAssemblyDetail(assemblyId as number),
    enabled: !!assemblyId && options?.enabled !== false,
  });
