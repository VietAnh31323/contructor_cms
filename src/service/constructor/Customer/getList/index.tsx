import { useQuery } from "@tanstack/react-query";
import { ConsApi } from "@/config/axios";
import { Response } from "./type";

export const getCustomerList = async (): Promise<Response["GET"]> => {
  const res = await ConsApi.get("/api/v1/customer/list");
  return {
    message: res.data.message,
    traceId: res.data.traceId,
    data: res.data.data,
  };
};

export const useCustomerListQuery = () =>
  useQuery({
    queryKey: ["customer-list"],
    queryFn: getCustomerList,
  });
