import { ConsApi } from "@/config/axios";
import { Response } from "./type";
import { useQuery } from "@tanstack/react-query";

export const getProjectDetail = async (
  id: number
): Promise<Response["GET"]> => {
  const res = await ConsApi.get("/api/v1/project", {
    params: { id },
  });

  return {
    message: res.data.message,
    traceId: res.data.traceId,
    data: res.data.data,
  };
};

export const useProjectDetailQuery = (
  id?: number,
  options?: {
    enabled?: boolean;
  }
) =>
  useQuery({
    queryKey: ["project-detail", id],
    queryFn: () => getProjectDetail(id as number),
    enabled: !!id && options?.enabled !== false,
  });
