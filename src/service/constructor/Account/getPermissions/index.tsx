import { ConsApi } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";

export const getCurrentPermissions = async (): Promise<string[]> => {
  const res = await ConsApi.get("/api/v1/account/permissions");
  const data = res.data?.data;
  return Array.isArray(data) ? data : [];
};

export const useCurrentPermissionsQuery = (enabled = true) =>
  useQuery({
    queryKey: ["account-current-permissions"],
    queryFn: getCurrentPermissions,
    enabled,
    staleTime: 60 * 1000,
    retry: false,
  });
