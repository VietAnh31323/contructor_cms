import { useQuery } from "@tanstack/react-query";
import { ConsApi } from "@/config/axios";
import { Response } from "./type";

export const getEmployeeList = async (): Promise<Response["GET"]> => {
  const res = await ConsApi.get("/api/v1/staff/list");
  return {
    message: res.data.message,
    traceId: res.data.traceId,
    data: res.data.data,
  };
};

export const useEmployeeListQuery = () =>
  useQuery({
    queryKey: ["staff-list"],
    queryFn: getEmployeeList,
  });
