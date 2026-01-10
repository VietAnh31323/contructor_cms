import { ConsApi } from "@/config/axios";
import { Response } from "./type";
import { useQuery } from "@tanstack/react-query";

export type SteelCategoryParams = {
  search?: string;
  page?: number;
  size?: number;
  steelCategoryId?: number;
};

export const getSteelCategoryListLine = async (
  params?: SteelCategoryParams
): Promise<Response["GET"]> => {
  const res = await ConsApi.get("/api/v1/steel-category/line/list", {
    params,
  });

  return {
    message: res.data.message,
    traceId: res.data.traceId,
    data: res.data.data,
  };
};

export const useSteelCategoryListLineQuery = (params?: SteelCategoryParams) =>
  useQuery({
    queryKey: ["steel-category-list", params],
    queryFn: () => getSteelCategoryListLine(params),
    enabled: true,
  });
