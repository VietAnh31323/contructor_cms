import { ConsApi } from "@/config/axios";
import { Response } from "./type";
import { useQuery } from "@tanstack/react-query";

export type SteelCategoryParams = {
  search?: string;
  page?: number;
  size?: number;
  isActive?: boolean;
};

export const getSteelProjectList = async (
  params?: SteelCategoryParams
): Promise<Response["GET"]> => {
  const res = await ConsApi.get("/api/v1/steel-project/list", {
    params,
  });

  return {
    message: res.data.message,
    traceId: res.data.traceId,
    data: res.data.data,
  };
};

export const useSteelProjectListQuery = (params?: SteelCategoryParams) =>
  useQuery({
    queryKey: ["steel-category-list", params],
    queryFn: () => getSteelProjectList(params),
    enabled: true,
  });
