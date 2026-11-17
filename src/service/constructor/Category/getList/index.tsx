import { useQuery } from "@tanstack/react-query";
import { ConsApi } from "@/config/axios";
import { CategoryList, Response } from "./type";

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

export const getCategoryTree = async (): Promise<{
  message?: string;
  traceId?: string;
  data: CategoryList[];
}> => {
  const res = await ConsApi.get("/api/v1/category/tree");
  return res.data;
};

export const useCategoryTreeQuery = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: ["category-tree"],
    queryFn: getCategoryTree,
    enabled: options?.enabled !== false,
  });
