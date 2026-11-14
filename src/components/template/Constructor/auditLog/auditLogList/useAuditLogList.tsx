import {
  AuditLogItem,
  AuditLogQueryParams,
  useAuditLogDetailQuery,
  useAuditLogListQuery,
} from "@/service/constructor/AuditLog";
import { Chip } from "@mui/material";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

const ACTION_CONFIG: Record<
  string,
  { label: string; color: "success" | "info" | "error" | "warning" | "default" }
> = {
  CREATE: { label: "Thêm mới", color: "success" },
  UPDATE: { label: "Cập nhật", color: "info" },
  DELETE: { label: "Xóa", color: "error" },
  LOGIN: { label: "Đăng nhập", color: "default" },
  LOCK_ACCOUNT: { label: "Khóa TK", color: "error" },
  UNLOCK_ACCOUNT: { label: "Mở khóa TK", color: "success" },
  RESET_PASSWORD: { label: "Reset MK", color: "warning" },
  CHANGE_PASSWORD: { label: "Đổi MK", color: "warning" },
  FORCE_CHANGE_PASSWORD: { label: "Bắt đổi MK", color: "warning" },
  UPDATE_ROLE: { label: "Phân quyền", color: "info" },
};

const MODULE_LABELS: Record<string, string> = {
  ACCOUNT: "Tài khoản",
  STAFF: "Nhân sự",
  PROJECT: "Dự án",
  CATEGORY: "Hạng mục",
  CUSTOMER: "Khách hàng",
  PROGRESS: "Tiến trình",
  TASK: "Công việc",
  PAYMENT: "Thanh toán",
  STEEL: "Thống kê thép",
  SYSTEM: "Hệ thống",
};

const defaultValues: AuditLogQueryParams = {
  search: "",
  module: null,
  action: null,
  fromDate: "",
  toDate: "",
  page: 0,
  size: 20,
};

export function formatDateTime(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("vi-VN");
}

export function safeParseJson(raw?: string): Record<string, any> | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : { value: parsed };
  } catch {
    return null;
  }
}

const useAuditLogList = () => {
  const methodForm = useForm<AuditLogQueryParams>({
    defaultValues,
  });
  const { control, handleSubmit, reset } = methodForm;

  const [queryPage, setQueryPage] = useState<AuditLogQueryParams>({
    page: 0,
    size: 20,
  });

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedRowFallback, setSelectedRowFallback] =
    useState<AuditLogItem | null>(null);

  const { data, isLoading } = useAuditLogListQuery(queryPage);
  const { data: detailData, isLoading: isDetailLoading } =
    useAuditLogDetailQuery(selectedId, {
      enabled: Boolean(selectedId),
    });

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

  const columns = useMemo(
    () => [
      { header: "Thời gian", fieldName: "createdAtFormatted" },
      { header: "Người thực hiện", fieldName: "usernameDisplay" },
      { header: "Hành động", fieldName: "actionChip" },
      { header: "Phân hệ", fieldName: "moduleDisplay" },
      { header: "Đối tượng", fieldName: "entityDisplay" },
      { header: "Mô tả", fieldName: "descriptionDisplay" },
      { header: "Địa chỉ IP", fieldName: "ipDisplay" },
    ],
    []
  );

  const tableData =
    data?.data?.content?.map((item) => {
      const cfg = ACTION_CONFIG[item.action] || {
        label: item.action || "—",
        color: "default" as const,
      };
      return {
        ...item,
        createdAtFormatted: formatDateTime(item.createdAt),
        usernameDisplay: item.username || "system",
        actionChip: <Chip size="small" label={cfg.label} color={cfg.color} />,
        moduleDisplay: MODULE_LABELS[item.module] || item.module || "—",
        entityDisplay: item.entityName
          ? `${item.entityName}${item.entityId ? ` #${item.entityId}` : ""}`
          : "—",
        descriptionDisplay: item.description || "—",
        ipDisplay: item.ipAddress || "—",
      };
    }) ?? [];

  const activeDetail = detailData || selectedRowFallback;

  return [
    {
      control,
      columns,
      tableData,
      isLoading,
      page: data?.data?.page ?? queryPage.page ?? 0,
      size: data?.data?.size ?? queryPage.size ?? 20,
      totalPages: data?.data?.totalPages ?? 1,
      selectedId,
      activeDetail,
      isDetailLoading,
      moduleOptions: Object.entries(MODULE_LABELS).map(([value, label]) => ({
        value,
        label,
      })),
      actionOptions: Object.entries(ACTION_CONFIG).map(([value, cfg]) => ({
        value,
        label: cfg.label,
      })),
    },
    {
      onSubmit,
      onReset,
      onChangePageSize,
      openDetail: (id: number, row?: AuditLogItem) => {
        setSelectedRowFallback(row || null);
        setSelectedId(id);
      },
      closeDetail: () => {
        setSelectedId(null);
        setSelectedRowFallback(null);
      },
    },
  ] as const;
};

export default useAuditLogList;
