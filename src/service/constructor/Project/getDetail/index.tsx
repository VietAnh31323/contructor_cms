import { ConsApi } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";
import { Response } from "./type";

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
  options?: { enabled?: boolean }
) =>
  useQuery({
    queryKey: ["project-detail", id],
    queryFn: () => getProjectDetail(id as number),
    enabled: !!id && options?.enabled !== false,
  });
