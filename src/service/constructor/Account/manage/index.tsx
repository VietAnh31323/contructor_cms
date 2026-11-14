import { ConsApi } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";
import { AccountList, Role } from "../getList/type";

export type AdminResetPasswordInput = {
  newPassword?: string;
  mustChangePassword?: boolean;
};

export type AdminResetPasswordResult = {
  accountId: number;
  username: string;
  temporaryPassword: string;
  mustChangePassword: boolean;
};

export const getAccountStaffDetail = async (
  accountId: number
): Promise<AccountList> => {
  const res = await ConsApi.get("/api/v1/account/staff", {
    params: { accountId },
  });
  return res.data?.data;
};

export const useAccountStaffDetailQuery = (
  accountId: number,
  options?: { enabled?: boolean }
) =>
  useQuery({
    queryKey: ["account-staff-detail", accountId],
    queryFn: () => getAccountStaffDetail(accountId),
    enabled: Boolean(accountId) && options?.enabled !== false,
  });

export const getAllRoles = async (): Promise<Role[]> => {
  const res = await ConsApi.get("/api/v1/account/roles");
  return res.data?.data || [];
};

export const useAllRolesQuery = () =>
  useQuery({
    queryKey: ["account-all-roles"],
    queryFn: getAllRoles,
    staleTime: 5 * 60 * 1000,
  });

export const updateAccountRole = async (body: {
  id: number;
  roles: { id: number; name?: string }[];
}) => {
  const res = await ConsApi.put("/api/v1/account/role", body);
  return res.data;
};

export const lockAccount = async (accountId: number) => {
  const res = await ConsApi.put(`/api/v1/account/${accountId}/lock`);
  return res.data;
};

export const unlockAccount = async (accountId: number) => {
  const res = await ConsApi.put(`/api/v1/account/${accountId}/unlock`);
  return res.data;
};

export const adminResetPassword = async (
  accountId: number,
  body?: AdminResetPasswordInput
): Promise<AdminResetPasswordResult> => {
  const res = await ConsApi.post(
    `/api/v1/account/${accountId}/reset-password`,
    body || { mustChangePassword: true }
  );
  return res.data?.data;
};

export const updateForceChangePassword = async (
  accountId: number,
  mustChangePassword: boolean
) => {
  const res = await ConsApi.put(
    `/api/v1/account/${accountId}/force-change-password`,
    { mustChangePassword }
  );
  return res.data;
};
