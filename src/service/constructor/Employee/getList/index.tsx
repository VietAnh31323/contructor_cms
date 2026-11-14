import { useQuery } from "@tanstack/react-query";
import { ConsApi } from "@/config/axios";
import { RequestBody, Response } from "./type";

export const getEmployeeList = async (
  params?: RequestBody["GET"]
): Promise<Response["GET"]> => {
  const cleanParams: Record<string, any> = {};
  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        cleanParams[key] = val;
      }
    });
  }
  const res = await ConsApi.get("/api/v1/staff/list", { params: cleanParams });
  return {
    message: res.data.message,
    traceId: res.data.traceId,
    data: res.data.data,
  };
};

export const useEmployeeListQuery = (params?: RequestBody["GET"]) =>
  useQuery({
    queryKey: ["staff-list", params],
    queryFn: () => getEmployeeList(params),
  });
