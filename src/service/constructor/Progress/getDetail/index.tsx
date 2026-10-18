import { ConsApi } from "@/config/axios";
import { Response } from "./type";
import { useQuery } from "@tanstack/react-query";

export const getProgressDetail = async (
  id: number
): Promise<Response["GET"]> => {
  const res = await ConsApi.get("/api/v1/progress", {
    params: { id },
  });

  return {
    message: res.data.message,
    traceId: res.data.traceId,
    data: res.data.data,
  };
};

export const useProgressDetailQuery = (
  id?: number,
  options?: {
    enabled?: boolean;
  }
) =>
  useQuery({
    queryKey: ["progress-detail", id],
    queryFn: () => getProgressDetail(id as number),
    enabled: !!id && options?.enabled !== false,
  });

export const getProgressProjectDetail = getProgressDetail;
export const useProgressProjectDetailQuery = useProgressDetailQuery;
