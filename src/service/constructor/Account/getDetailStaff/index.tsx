import { ConsApi } from "@/config/axios";
import { Response } from "./type";
import { useQuery } from "@tanstack/react-query";

export const getAccountDetailStaff = async (
  accountId: number
): Promise<Response["GET"]> => {
  const res = await ConsApi.get("/api/v1/account/staff", {
    params: { accountId },
  });

  return {
    message: res.data.message,
    traceId: res.data.traceId,
    data: res.data.data,
  };
};

export const useAccountDetailStaffQuery = (
  accountId: number,
  options?: { enabled?: boolean }
) =>
  useQuery({
    queryKey: ["account-detail", accountId],
    queryFn: () => getAccountDetailStaff(accountId),
    enabled: !!accountId && options?.enabled !== false,
  });
