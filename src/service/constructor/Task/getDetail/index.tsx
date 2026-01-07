import { ConsApi } from "@/config/axios";
import { Response } from "./type";
import { useQuery } from "@tanstack/react-query";

export const getProgressProjectDetail = async (
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

export const useProgressProjectDetailQuery = (
  id?: number,
  options?: {
    enabled?: boolean;
  }
) =>
  useQuery({
    queryKey: ["progressProject-detail", id],
    queryFn: () => getProgressProjectDetail(id as number),
    enabled: !!id && options?.enabled !== false,
  });
