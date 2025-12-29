import { ConsApi } from "@/config/axios";
import { Response } from "./type";
import { useQuery } from "@tanstack/react-query";

export type SteelCategoryParams = {
  search?: string;
  page?: number;
  size?: number;
  isActive?: boolean;
};

export const getSteelCategoryList = async (
  params?: SteelCategoryParams
): Promise<Response["GET"]> => {
  const res = await ConsApi.get("/api/v1/steel-category/list", {
    params,
  });

  return {
    message: res.data.message,
    traceId: res.data.traceId,
    data: res.data.data,
  };
};

export const useSteelCategoryListQuery = (params?: SteelCategoryParams) =>
  useQuery({
    queryKey: ["steel-category-list", params],
    queryFn: () => getSteelCategoryList(params),
    enabled: true,
  });
