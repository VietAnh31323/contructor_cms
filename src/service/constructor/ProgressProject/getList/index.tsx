import { useQuery } from "@tanstack/react-query";
import { ConsApi } from "@/config/axios";
import { Response } from "./type";

export const getProgressProjectList = async (): Promise<Response["GET"]> => {
  const res = await ConsApi.get("/api/v1/progress/list");
  return {
    message: res.data.message,
    traceId: res.data.traceId,
    data: res.data.data,
  };
};

export const useProgressProjectListQuery = () =>
  useQuery({
    queryKey: ["progressProject-list"],
    queryFn: getProgressProjectList,
  });
