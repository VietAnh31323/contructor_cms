import { usePermission } from "@/components/hooks/permission/usePermission";
import { DropResult } from "@hello-pangea/dnd";
import { PERMISSIONS } from "@/helper/permissions";
import { ROUTES } from "@/routes";
import { useCustomerListQuery } from "@/service/constructor/Customer/getList";
import {
  CustomerItem,
  CustomerPipelineStage,
  RequestBody,
} from "@/service/constructor/Customer/getList/type";
import {
  patchCustomerPipelineStage,
  useCustomerPipelineSummaryQuery,
} from "@/service/constructor/Customer/pipeline";
import { toastError, toastSuccess } from "@/toast";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PhoneInTalkOutlinedIcon from "@mui/icons-material/PhoneInTalkOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import {
  Chip,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import router from "next/router";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  CONTACT_STATUS_META,
  CUSTOMER_TYPE_META,
  formatVnd,
  PIPELINE_STAGE_META,
  PIPELINE_STAGE_OPTIONS,
} from "../constants";

const defaultValues: RequestBody["GET"] = {
  search: "",
  customerType: "",
  pipelineStage: "",
  contactStatus: "",
  page: 0,
  size: 20,
};

export type CustomerViewMode = "TABLE" | "PIPELINE";

const useCustomerList = () => {
  const queryClient = useQueryClient();
  const { hasPermission } = usePermission();
  const canManageCustomer = hasPermission(PERMISSIONS.CUSTOMER_MANAGE);

  const [viewMode, setViewMode] = useState<CustomerViewMode>("TABLE");
  const [optimisticStages, setOptimisticStages] = useState<
    Record<number, CustomerPipelineStage>
  >({});
  const [queryPage, setQueryPage] =
    useState<RequestBody["GET"]>(defaultValues);

  const methodForm = useForm<RequestBody["GET"]>({
    defaultValues,
  });
  const { handleSubmit, control, reset, setValue } = methodForm;

  const effectiveParams = useMemo(
    () =>
      viewMode === "PIPELINE"
        ? { ...queryPage, pipelineStage: "" as const, page: 0, size: 200 }
        : queryPage,
    [queryPage, viewMode]
  );

  const { data, isLoading, refetch } = useCustomerListQuery(effectiveParams);
  const { data: summaryRes, refetch: refetchSummary } =
    useCustomerPipelineSummaryQuery();

  const pipelineSummary = summaryRes?.data;
  const serverCustomers: CustomerItem[] = data?.data?.content ?? [];
  const rawCustomers: CustomerItem[] = useMemo(
    () =>
      serverCustomers.map((c) =>
        optimisticStages[c.id]
          ? { ...c, pipelineStage: optimisticStages[c.id] }
          : c
      ),
    [serverCustomers, optimisticStages]
  );
  const page = data?.data?.page ?? queryPage.page ?? 0;
  const size = data?.data?.size ?? queryPage.size ?? 20;
  const totalPages = data?.data?.totalPages ?? 0;

  const onSubmit = handleSubmit((input) => {
    setQueryPage({
      ...input,
      page: 0,
      size: queryPage.size ?? 20,
    });
  });

  const onReset = () => {
    reset(defaultValues);
    setQueryPage(defaultValues);
  };

  const onSelectStageFilter = (stage: CustomerPipelineStage | "") => {
    setValue("pipelineStage", stage);
    setQueryPage((prev) => ({
      ...prev,
      pipelineStage: stage,
      page: 0,
    }));
  };

  const onChangePageSize = (val: { page?: number; size?: number }) => {
    setQueryPage((prev) => ({
      ...prev,
      page: val.page ?? 0,
      size: val.size ?? prev.size ?? 20,
    }));
  };

  const handleQuickChangeStage = async (
    customerId: number,
    nextStage: CustomerPipelineStage
  ) => {
    setOptimisticStages((prev) => ({ ...prev, [customerId]: nextStage }));
    try {
      await patchCustomerPipelineStage(customerId, {
        pipelineStage: nextStage,
      });
      toastSuccess(
        `Đã chuyển sang giai đoạn "${
          PIPELINE_STAGE_META[nextStage]?.shortLabel || nextStage
        }"!`
      );
      await Promise.all([refetch(), refetchSummary()]);
      queryClient.invalidateQueries({
        queryKey: ["customer-detail", customerId],
      });
    } catch (err: any) {
      toastError(
        err?.response?.data?.message ||
          err?.message ||
          "Không thể cập nhật trạng thái Pipeline"
      );
    } finally {
      setOptimisticStages((prev) => {
        const next = { ...prev };
        delete next[customerId];
        return next;
      });
    }
  };

  const handleKanbanDragEnd = (result: DropResult) => {
    if (!canManageCustomer) return;
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const customerId = Number(draggableId);
    const nextStage = destination.droppableId as CustomerPipelineStage;
    if (!customerId || !nextStage) return;

    handleQuickChangeStage(customerId, nextStage);
  };

  const columns = useMemo(
    () => [
      { header: "Mã KH", fieldName: "code" },
      { header: "Khách hàng / Phân loại", fieldName: "customerInfo" },
      { header: "Liên hệ", fieldName: "contactInfo" },
      { header: "Pipeline (2.08)", fieldName: "pipelineCell" },
      { header: "Phản hồi", fieldName: "contactStatusCell" },
      { header: "Dự án liên kết", fieldName: "projectSummary" },
      { header: "Chăm sóc & Lịch hẹn", fieldName: "careSummary" },
      { header: "Phụ trách", fieldName: "assignedStaffName" },
    ],
    []
  );

  const tableData = useMemo(
    () =>
      rawCustomers.map((item) => {
        const typeKey = item.customerType || "INDIVIDUAL";
        const typeMeta =
          CUSTOMER_TYPE_META[typeKey] || CUSTOMER_TYPE_META.INDIVIDUAL;
        const stageKey = item.pipelineStage || "LEAD";
        const stageMeta =
          PIPELINE_STAGE_META[stageKey] || PIPELINE_STAGE_META.LEAD;
        const contactKey = item.contactStatus || "NOT_CONTACTED";
        const contactMeta =
          CONTACT_STATUS_META[contactKey] || CONTACT_STATUS_META.NOT_CONTACTED;

        return {
          ...item,
          customerInfo: (
            <Stack spacing={0.4}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" fontWeight={700}>
                  {item.name}
                </Typography>
                <Chip
                  size="small"
                  icon={
                    typeKey === "BUSINESS" ? (
                      <BusinessOutlinedIcon fontSize="small" />
                    ) : (
                      <PersonOutlineIcon fontSize="small" />
                    )
                  }
                  color={typeMeta.color}
                  variant="outlined"
                  label={typeMeta.label}
                />
              </Stack>
              {typeKey === "BUSINESS" ? (
                <Typography variant="caption" color="text.secondary">
                  MST: <strong>{item.taxCode || "—"}</strong>
                  {item.representativeName
                    ? ` • ĐD: ${item.representativeName}`
                    : ""}
                </Typography>
              ) : item.idCardNumber ? (
                <Typography variant="caption" color="text.secondary">
                  CCCD: {item.idCardNumber}
                </Typography>
              ) : null}
            </Stack>
          ),
          contactInfo: (
            <Stack spacing={0.3}>
              <Typography variant="body2">{item.phone || "—"}</Typography>
              {item.email && (
                <Typography variant="caption" color="text.secondary">
                  {item.email}
                </Typography>
              )}
            </Stack>
          ),
          pipelineCell: canManageCustomer ? (
            <div onClick={(e) => e.stopPropagation()}>
              <Select
                size="small"
                value={stageKey}
                onChange={(e) =>
                  handleQuickChangeStage(
                    item.id,
                    e.target.value as CustomerPipelineStage
                  )
                }
                sx={{
                  minWidth: 148,
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  bgcolor: stageMeta.bg,
                  color: stageMeta.accent,
                }}
              >
                {PIPELINE_STAGE_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </div>
          ) : (
            <Chip
              size="small"
              color={stageMeta.chipColor}
              label={stageMeta.label}
            />
          ),
          contactStatusCell: (
            <Chip
              size="small"
              variant="outlined"
              color={contactMeta.color}
              label={contactMeta.label}
            />
          ),
          projectSummary:
            (item.projectCount ?? 0) > 0 ? (
              <Stack
                direction="row"
                spacing={0.5}
                alignItems="center"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push({
                    pathname: `${ROUTES.CUSTOMER}/${item.id}`,
                    query: { actionType: "VIEW", tab: "projects" },
                  });
                }}
                sx={{ cursor: "pointer" }}
              >
                <Stack spacing={0.2}>
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    color="primary.main"
                  >
                    {item.projectCount} dự án
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatVnd(item.totalContractValue)}
                  </Typography>
                </Stack>
                <OpenInNewIcon fontSize="inherit" color="primary" />
              </Stack>
            ) : (
              <Typography variant="caption" color="text.secondary">
                Chưa có DA
              </Typography>
            ),
          careSummary: (
            <Stack
              spacing={0.4}
              onClick={(e) => {
                e.stopPropagation();
                router.push({
                  pathname: `${ROUTES.CUSTOMER}/${item.id}`,
                  query: { actionType: "VIEW", tab: "care" },
                });
              }}
              sx={{ cursor: "pointer" }}
            >
              <Stack direction="row" spacing={0.5} alignItems="center">
                <PhoneInTalkOutlinedIcon fontSize="inherit" color="action" />
                <Typography variant="body2">
                  <strong>{item.careLogCount ?? 0}</strong> lần CS
                </Typography>
              </Stack>
              {item.nextActionDate && (
                <Tooltip title={item.nextActionNote || "Lịch hẹn chăm sóc tiếp theo"}>
                  <Chip
                    size="small"
                    icon={
                      item.overdueFollowUp ? (
                        <WarningAmberOutlinedIcon fontSize="small" />
                      ) : (
                        <EventAvailableOutlinedIcon fontSize="small" />
                      )
                    }
                    color={item.overdueFollowUp ? "error" : "warning"}
                    label={`Hẹn: ${moment(item.nextActionDate).format(
                      "DD/MM HH:mm"
                    )}`}
                  />
                </Tooltip>
              )}
            </Stack>
          ),
          assignedStaffName: item.assignedStaff?.name || (
            <Typography variant="caption" color="text.secondary">
              Chưa phân công
            </Typography>
          ),
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rawCustomers, canManageCustomer]
  );

  return [
    {
      columns,
      tableData,
      rawCustomers,
      pipelineSummary,
      activeStageFilter: queryPage.pipelineStage || "",
      viewMode,
      page,
      size,
      totalPages,
      isLoading,
      control,
      canManageCustomer,
    },
    {
      setViewMode,
      onSubmit,
      onReset,
      onSelectStageFilter,
      onChangePageSize,
      handleQuickChangeStage,
      handleKanbanDragEnd,
    },
  ] as const;
};

export default useCustomerList;
