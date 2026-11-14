import { getEnum } from "@/components/atoms/TextColor";
import { usePermission } from "@/components/hooks/permission/usePermission";
import { PERMISSIONS } from "@/helper/permissions";
import { useAccountListQuery } from "@/service/constructor/Account/getList";
import { AccountList, RequestBody } from "@/service/constructor/Account/getList/type";
import {
  adminResetPassword,
  AdminResetPasswordResult,
  lockAccount,
  unlockAccount,
} from "@/service/constructor/Account/manage";
import { toastError, toastSuccess } from "@/toast";
import {
  ContentCopyOutlined,
  LockOpenOutlined,
  LockOutlined,
  LockResetOutlined,
} from "@mui/icons-material";
import { Chip, IconButton, Stack, Tooltip } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import _ from "lodash";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Quản trị viên",
  DIRECTOR: "Giám đốc",
  PROJECT_MANAGER: "Quản lý dự án (PM)",
  SITE_ENGINEER: "Kỹ sư giám sát / Chỉ huy trưởng",
  ACCOUNTANT: "Kế toán",
  ESTIMATOR: "Dự toán",
  WAREHOUSE: "Kho",
  CUSTOMER_CARE: "Chăm sóc khách hàng",
  CUSTOMER: "Khách hàng",
  STAFF: "Nhân viên",
};

const defaultValues: RequestBody["GET"] = {
  search: "",
  accountStatus: null,
  page: 0,
  size: 20,
};

const useAccountList = () => {
  const { hasPermission } = usePermission();
  const canManageUser = hasPermission(PERMISSIONS.USER_MANAGE);

  const methodForm = useForm<RequestBody["GET"]>({
    defaultValues,
  });
  const { handleSubmit, control, reset } = methodForm;

  const [queryPage, setQueryPage] = useState<RequestBody["GET"]>(
    _.omitBy(defaultValues, _.isNil)
  );

  const [confirmTarget, setConfirmTarget] = useState<{
    type: "LOCK" | "UNLOCK";
    account: AccountList;
  } | null>(null);

  const [resetTarget, setResetTarget] = useState<AccountList | null>(null);
  const [customPassword, setCustomPassword] = useState("");
  const [forceChangeOnNextLogin, setForceChangeOnNextLogin] = useState(true);
  const [resetResult, setResetResult] =
    useState<AdminResetPasswordResult | null>(null);

  const { data, isLoading, refetch } = useAccountListQuery(queryPage);

  const onSubmit = handleSubmit((input) => {
    setQueryPage({
      ...input,
      page: 0,
      size: queryPage.size ?? 20,
    });
  });

  const onReset = () => {
    reset(defaultValues);
    setQueryPage({ page: 0, size: 20 });
  };

  const onChangePageSize = (val: { page?: number; size?: number }) => {
    setQueryPage((prev) => ({
      ...prev,
      page: val.page ?? 0,
      size: val.size ?? 20,
    }));
  };

  const lockMutation = useMutation({
    mutationFn: (accountId: number) => lockAccount(accountId),
    onSuccess: () => {
      toastSuccess("Đã khóa tài khoản và thu hồi phiên đăng nhập");
      setConfirmTarget(null);
      refetch();
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.errors?.[0]?.message ||
        err?.response?.data?.message ||
        "Không thể khóa tài khoản";
      toastError(msg);
    },
  });

  const unlockMutation = useMutation({
    mutationFn: (accountId: number) => unlockAccount(accountId),
    onSuccess: () => {
      toastSuccess("Đã mở khóa tài khoản");
      setConfirmTarget(null);
      refetch();
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.errors?.[0]?.message ||
        err?.response?.data?.message ||
        "Không thể mở khóa tài khoản";
      toastError(msg);
    },
  });

  const resetPassMutation = useMutation({
    mutationFn: ({
      accountId,
      newPassword,
      mustChangePassword,
    }: {
      accountId: number;
      newPassword?: string;
      mustChangePassword: boolean;
    }) =>
      adminResetPassword(accountId, {
        newPassword: newPassword?.trim() ? newPassword.trim() : undefined,
        mustChangePassword,
      }),
    onSuccess: (result) => {
      toastSuccess("Đặt lại mật khẩu thành công");
      setResetTarget(null);
      setCustomPassword("");
      setResetResult(result);
      refetch();
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.errors?.[0]?.message ||
        err?.response?.data?.message ||
        "Không thể đặt lại mật khẩu";
      toastError(msg);
    },
  });

  const columns = useMemo(() => {
    const baseCols: any[] = [
      { header: "Mã nhân sự", fieldName: "code" },
      { header: "Tên nhân sự", fieldName: "name" },
      { header: "Tên tài khoản", fieldName: "username" },
      { header: "Chức vụ", fieldName: "position" },
      { header: "Vai trò", fieldName: "rolesText" },
      { header: "Trạng thái", fieldName: "statusChip" },
      { header: "Đổi MK lần đầu", fieldName: "mustChangeChip" },
    ];

    if (canManageUser) {
      baseCols.push({
        header: "Thao tác",
        fieldName: "actions",
        styleCell: { style: { minWidth: 130, textAlign: "center" } },
      });
    }
    return baseCols;
  }, [canManageUser]);

  const tableData =
    data?.data?.content?.map((item) => {
      const isLockedStatus =
        item.status === "LOCKED" || item.status === "INACTIVE";
      const isTempLocked =
        !isLockedStatus &&
        Boolean(item.lockedUntil && new Date(item.lockedUntil) > new Date());

      const statusChip = isLockedStatus ? (
        <Chip label="Đã khóa" color="error" size="small" />
      ) : isTempLocked ? (
        <Chip label="Tạm khóa đăng nhập" color="warning" size="small" />
      ) : (
        <Chip label="Hoạt động" color="success" size="small" />
      );

      const mustChangeChip = item.mustChangePassword ? (
        <Chip label="Bắt buộc đổi MK" color="warning" size="small" variant="outlined" />
      ) : (
        <Chip label="Đã cập nhật" color="default" size="small" variant="outlined" />
      );

      const actions = canManageUser ? (
        <Stack
          direction="row"
          spacing={0.5}
          justifyContent="center"
          onClick={(e) => e.stopPropagation()}
        >
          {isLockedStatus || isTempLocked ? (
            <Tooltip title="Mở khóa tài khoản">
              <IconButton
                size="small"
                color="success"
                onClick={() =>
                  setConfirmTarget({ type: "UNLOCK", account: item })
                }
              >
                <LockOpenOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Khóa tài khoản">
              <IconButton
                size="small"
                color="error"
                onClick={() =>
                  setConfirmTarget({ type: "LOCK", account: item })
                }
              >
                <LockOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Reset mật khẩu">
            <IconButton
              size="small"
              color="primary"
              onClick={() => {
                setCustomPassword("");
                setForceChangeOnNextLogin(true);
                setResetTarget(item);
              }}
            >
              <LockResetOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ) : null;

      return {
        ...item,
        rolesText:
          item.roles
            ?.map((r) => ROLE_LABELS[r.name] || r.name)
            .filter(Boolean)
            .join(", ") || "N/A",
        position: getEnum(item?.staff?.position || "", [
          { label: "Kiến trúc sư", value: "ARCHITECT" },
          { label: "Kĩ sư điện nước", value: "MEP_ENGINEER" },
          { label: "Kĩ sư kết cấu", value: "STRUCTURAL_ENGINEER" },
          { label: "Kĩ sư giám sát", value: "ESTIMATOR" },
          { label: "Dự toán viên", value: "SUPERVISOR" },
        ]),
        name:
          [
            item?.staff?.firstName || item?.firstName,
            item?.staff?.lastName || item?.lastName,
          ]
            .filter(Boolean)
            .join(" ") || "N/A",
        code: item?.staff?.code || "—",
        statusChip,
        mustChangeChip,
        actions,
      };
    }) ?? [];

  const handleCopyTempPassword = async (pwd: string) => {
    try {
      await navigator.clipboard.writeText(pwd);
      toastSuccess("Đã sao chép mật khẩu tạm thời");
    } catch {
      toastError("Không thể sao chép tự động");
    }
  };

  return [
    {
      columns,
      tableData,
      page: data?.data?.page ?? queryPage.page ?? 0,
      size: data?.data?.size ?? queryPage.size ?? 20,
      totalPages: data?.data?.totalPages ?? 1,
      isLoading,
      control,
      confirmTarget,
      resetTarget,
      customPassword,
      forceChangeOnNextLogin,
      resetResult,
      isMutating:
        lockMutation.isPending ||
        unlockMutation.isPending ||
        resetPassMutation.isPending,
      CopyIcon: ContentCopyOutlined,
    },
    {
      onSubmit,
      onReset,
      onChangePageSize,
      setConfirmTarget,
      setResetTarget,
      setCustomPassword,
      setForceChangeOnNextLogin,
      setResetResult,
      confirmLockOrUnlock: () => {
        if (!confirmTarget) return;
        if (confirmTarget.type === "LOCK") {
          lockMutation.mutate(confirmTarget.account.id);
        } else {
          unlockMutation.mutate(confirmTarget.account.id);
        }
      },
      submitResetPassword: () => {
        if (!resetTarget) return;
        resetPassMutation.mutate({
          accountId: resetTarget.id,
          newPassword: customPassword,
          mustChangePassword: forceChangeOnNextLogin,
        });
      },
      handleCopyTempPassword,
    },
  ] as const;
};

export default useAccountList;
