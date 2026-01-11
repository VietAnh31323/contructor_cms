import { ConsApi } from "@/config/axios";
import { Response } from "./type";
import { useQuery } from "@tanstack/react-query";

export const getSteelProjectDetail = async (
  id: number
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

export const useSteelProjectDetailQuery = (
  id?: number,
  options?: {
    enabled?: boolean;
  }
) =>
  useQuery({
    queryKey: ["steel-project-detail", id],
    queryFn: () => getSteelProjectDetail(id as number),
    enabled: !!id && options?.enabled !== false,
  });
