import { ConsApi } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";
import { StaffWorkload } from "./type";

export const getEmployeeWorkload = async (
  staffId: number
): Promise<StaffWorkload> => {
  const res = await ConsApi.get(`/api/v1/staff/${staffId}/workload`);
  return res.data?.data;
};

export const useEmployeeWorkloadQuery = (
  staffId: number,
  options?: { enabled?: boolean }
) =>
  useQuery({
    queryKey: ["staff-workload", staffId],
    queryFn: () => getEmployeeWorkload(staffId),
    enabled: Boolean(staffId && !Number.isNaN(staffId)) && options?.enabled !== false,
  });
