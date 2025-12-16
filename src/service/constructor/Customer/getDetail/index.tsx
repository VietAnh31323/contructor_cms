import { ConsApi } from "@/config/axios";
import { Response } from "./type";
import { useQuery } from "@tanstack/react-query";

export const getCustomerDetail = async (
  id: number
): Promise<Response["GET"]> => {
  const res = await ConsApi.get("/api/v1/customer", {
    params: { id },
  });

  return {
    message: res.data.message,
    traceId: res.data.traceId,
    data: res.data.data,
  };
};

export const useCustomerDetailQuery = (
  id?: number,
  options?: {
    enabled?: boolean;
  }
) =>
  useQuery({
    queryKey: ["customer-detail", id],
    queryFn: () => getCustomerDetail(id as number),
    enabled: !!id && options?.enabled !== false,
  });
