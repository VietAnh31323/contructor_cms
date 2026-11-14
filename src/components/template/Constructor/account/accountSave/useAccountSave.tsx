import { usePermission } from "@/components/hooks/permission/usePermission";
import { PERMISSIONS } from "@/helper/permissions";
import { useFormCustom } from "@/lib/form";
import { ROUTES } from "@/routes";
import { Role } from "@/service/constructor/Account/getList/type";
import {
  adminResetPassword,
  AdminResetPasswordResult,
  lockAccount,
  unlockAccount,
  updateAccountRole,
  updateForceChangePassword,
  useAccountStaffDetailQuery,
  useAllRolesQuery,
} from "@/service/constructor/Account/manage";
import { toastError, toastSuccess } from "@/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Quản trị viên (ADMIN)",
  DIRECTOR: "Giám đốc (DIRECTOR)",
  PROJECT_MANAGER: "Quản lý dự án - PM (PROJECT_MANAGER)",
  SITE_ENGINEER: "Kỹ sư giám sát / Chỉ huy trưởng (SITE_ENGINEER)",
  ACCOUNTANT: "Kế toán (ACCOUNTANT)",
  ESTIMATOR: "Dự toán (ESTIMATOR)",
  WAREHOUSE: "Kho (WAREHOUSE)",
  CUSTOMER_CARE: "Chăm sóc khách hàng (CUSTOMER_CARE)",
  CUSTOMER: "Khách hàng (CUSTOMER)",
  STAFF: "Nhân viên (STAFF)",
};

const defaultValues: Record<string, any> = {};

const useAccountSave = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const params = useParams();
  const { hasPermission } = usePermission();
  const canManageUser = hasPermission(PERMISSIONS.USER_MANAGE);

  const actionType = searchParams?.get("actionType");
  const isView = actionType === "VIEW";

  const id = Number(params?.id || router.query?.id);
  const isUpdate = Boolean(id);

  const methodForm = useFormCustom<Record<string, any>>({
    defaultValues,
  });
  const { reset, control } = methodForm;

  const { data: accountDetail, isLoading, refetch } =
    useAccountStaffDetailQuery(id, {
      enabled: Boolean(id),
    });

  const { data: allRoles = [] } = useAllRolesQuery();

  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [resetResult, setResetResult] =
    useState<AdminResetPasswordResult | null>(null);

  useEffect(() => {
    if (accountDetail) {
      reset({
        username: accountDetail.username || "",
        code: accountDetail.staff?.code || "",
        email: accountDetail.staff?.email || accountDetail.username || "",
        position: accountDetail.staff?.position || "",
        firstName:
          accountDetail.staff?.firstName || accountDetail.firstName || "",
        lastName:
          accountDetail.staff?.lastName || accountDetail.lastName || "",
        phone: accountDetail.staff?.phone || "",
        gender: accountDetail.staff?.gender || "",
        address: accountDetail.staff?.address || "",
      });
      setSelectedRoles(accountDetail.roles || []);
      setMustChangePassword(Boolean(accountDetail.mustChangePassword));
    }
  }, [accountDetail, reset]);

  const handleToggleRole = (role: Role) => {
    if (isView || !canManageUser) return;
    setSelectedRoles((prev) =>
      prev.some((r) => r.id === role.id)
        ? prev.filter((r) => r.id !== role.id)
        : [...prev, role]
    );
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!id) return;
      await updateAccountRole({
        id,
        roles: selectedRoles.map((r) => ({ id: r.id, name: r.name })),
      });
      if (Boolean(accountDetail?.mustChangePassword) !== mustChangePassword) {
        await updateForceChangePassword(id, mustChangePassword);
      }
    },
    onSuccess: () => {
      toastSuccess("Cập nhật tài khoản thành công");
      queryClient.invalidateQueries({ queryKey: ["account-list"] });
      refetch();
      router.push(ROUTES.ACCOUNT);
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.errors?.[0]?.message ||
        err?.response?.data?.message ||
        "Cập nhật tài khoản thất bại";
      toastError(msg);
    },
  });

  const lockUnlockMutation = useMutation({
    mutationFn: async (action: "LOCK" | "UNLOCK") => {
      if (!id) return;
      return action === "LOCK" ? lockAccount(id) : unlockAccount(id);
    },
    onSuccess: (_, action) => {
      toastSuccess(
        action === "LOCK"
          ? "Đã khóa tài khoản thành công"
          : "Đã mở khóa tài khoản thành công"
      );
      queryClient.invalidateQueries({ queryKey: ["account-list"] });
      refetch();
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.errors?.[0]?.message ||
        err?.response?.data?.message ||
        "Thao tác thất bại";
      toastError(msg);
    },
  });

  const resetPassMutation = useMutation({
    mutationFn: () => adminResetPassword(id, { mustChangePassword: true }),
    onSuccess: (res) => {
      toastSuccess("Đã cấp lại mật khẩu tạm thời");
      setResetResult(res);
      refetch();
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.errors?.[0]?.message ||
        err?.response?.data?.message ||
        "Đặt lại mật khẩu thất bại";
      toastError(msg);
    },
  });

  const getRoleLabel = (r: Role) =>
    ROLE_LABELS[r.name] || r.description || r.name;

  return [
    {
      isView,
      control,
      isUpdate,
      isLoading,
      id,
      canManageUser,
      accountDetail,
      allRoles,
      selectedRoles,
      mustChangePassword,
      resetResult,
      isSaving: saveMutation.isPending,
      isMutatingSecurity:
        lockUnlockMutation.isPending || resetPassMutation.isPending,
    },
    {
      handleToggleRole,
      setMustChangePassword,
      setResetResult,
      getRoleLabel,
      onSave: () => saveMutation.mutate(),
      onToggleLock: () => {
        const isLocked =
          accountDetail?.status === "LOCKED" ||
          accountDetail?.status === "INACTIVE" ||
          Boolean(
            accountDetail?.lockedUntil &&
              new Date(accountDetail.lockedUntil) > new Date()
          );
        lockUnlockMutation.mutate(isLocked ? "UNLOCK" : "LOCK");
      },
      onResetPassword: () => resetPassMutation.mutate(),
    },
  ] as const;
};

export default useAccountSave;
