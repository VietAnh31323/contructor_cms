import { ConsApi } from "@/config/axios";
import { Response } from "./type";
import { useQuery } from "@tanstack/react-query";

export const getAssemblyDetail = async (
  id: number,
): Promise<Response["GET"]> => {
  const res = await ConsApi.get("/api/v1/steel-project", {
    params: { id },
  });

  return {
    message: res.data.message,
    traceId: res.data.traceId,
    data: res.data.data,
  };
};

export const useAssemblyDetailQuery = (
  id?: number,
  options?: {
    enabled?: boolean;
  },
) =>
  useQuery({
    queryKey: ["assembly-detail", id],
    queryFn: () => getAssemblyDetail(id as number),
    enabled: !!id && options?.enabled !== false,
  });
