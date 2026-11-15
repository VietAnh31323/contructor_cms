import { useQuery } from "@tanstack/react-query";
import { ConsApi } from "@/config/axios";
import { Response } from "./type";

export const getCategoryList = async (
  params?: Record<string, any>
): Promise<Response["GET"]> => {
  const cleanParams: Record<string, any> = {};
  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        cleanParams[key] = val;
      }
    });
  }
  const res = await ConsApi.get("/api/v1/category/list", {
    params: cleanParams,
  });
  return {
    message: res.data.message,
    traceId: res.data.traceId,
    data: res.data.data,
  };
};

export const useCategoryListQuery = (params?: Record<string, any>) =>
  useQuery({
    queryKey: ["category-list", params],
    queryFn: () => getCategoryList(params),
  });
