import { CoreButton } from "@/components/atoms/CoreButton";
import { useDialog } from "@/components/hooks/dialog/useDialog";
import { usePermission } from "@/components/hooks/permission/usePermission";
import { Action } from "@/components/molecules/Action";
import { ColumnProps } from "@/components/organism/CoreTable";
import { PERMISSIONS } from "@/helper/permissions";
import { useFormCustom } from "@/lib/form";
import { ROUTES } from "@/routes";
import { CodeNameRef } from "@/service/constructor/Customer/getList/type";
import { useProjectListQuery } from "@/service/constructor/Project/getList";
import {
  ProjectListItem,
  ProjectState,
} from "@/service/constructor/Project/getList/type";
import {
  patchProjectState,
  useProjectLifecycleSummaryQuery,
} from "@/service/constructor/Project/lifecycle";
import { ProjectStateTransitionRequest } from "@/service/constructor/Project/lifecycle/type";
import { deleteProject } from "@/service/constructor/Project/save";
import { toastError, toastSuccess } from "@/toast";
import { DropResult } from "@hello-pangea/dnd";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import {
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import router from "next/router";
import { useEffect, useMemo, useState } from "react";
import { CUSTOMER_TYPE_META, formatVnd } from "../../customer/constants";
import {
  getAllowedNextProjectStates,
  normalizeProjectState,
  PROJECT_STATE_META,
} from "../constants";
import { TransitionProjectSnapshot } from "../ProjectTransitionDialog";

export type ProjectViewMode = "TABLE" | "KANBAN";

type FilterForm = {
  search: string;
  customer: CodeNameRef | null;
  state: ProjectState | "";
};

const defaultValues: FilterForm = {
  search: "",
  customer: null,
  state: "",
};

const useConstructionProjectList = () => {
  const queryClient = useQueryClient();
  const { hasPermission } = usePermission();
  const { showDialog, hideDialog } = useDialog();
  const canUpdateProject = hasPermission(PERMISSIONS.PROJECT_UPDATE);
  const canDeleteProject = hasPermission(PERMISSIONS.PROJECT_DELETE);

  const methodForm = useFormCustom<FilterForm>({ defaultValues });
  const { control, handleSubmit, reset, setValue } = methodForm;

  const [viewMode, setViewModeState] = useState<ProjectViewMode>("TABLE");
  const [queryPage, setQueryPage] = useState<{
    search?: string;
    customerId?: number | "";
    state?: ProjectState | "";
    page: number;
    size: number;
  }>({
    page: 0,
    size: 20,
  });

  const effectiveQuery = useMemo(
    () => ({
      ...queryPage,
      page: viewMode === "KANBAN" ? 0 : queryPage.page,
      size: viewMode === "KANBAN" ? 200 : queryPage.size,
    }),
    [queryPage, viewMode]
  );

  const { data, isLoading, refetch } = useProjectListQuery(effectiveQuery);
  const { data: summaryResp } = useProjectLifecycleSummaryQuery();

  const [optimisticStates, setOptimisticStates] = useState<
    Record<number, ProjectState>
  >({});

  useEffect(() => {
    setOptimisticStates({});
  }, [data]);

  const [transitionModal, setTransitionModal] = useState<{
    open: boolean;
    targetState: ProjectState | null;
    snapshot: TransitionProjectSnapshot | null;
  }>({
    open: false,
    targetState: null,
    snapshot: null,
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  const setViewMode = (mode: ProjectViewMode) => {
    setViewModeState(mode);
  };

  const rawProjects: ProjectListItem[] = useMemo(() => {
    const list = data?.data?.content ?? [];
    return list.map((item) => {
      const overridden = optimisticStates[item.id];
      if (!overridden) {
        return {
          ...item,
          state: normalizeProjectState(item.state),
        };
      }
      return {
        ...item,
        state: overridden,
        allowedNextStates: getAllowedNextProjectStates(
          overridden,
          item.previousState
        ),
      };
    });
  }, [data?.data?.content, optimisticStates]);

  const openTransitionForItem = (
    item: ProjectListItem,
    toState: ProjectState
  ) => {
    if (!canUpdateProject) {
      toastError("Bạn không có quyền cập nhật trạng thái dự án");
      return;
    }
    const currentState = normalizeProjectState(item.state);
    const normalizedTarget = normalizeProjectState(toState);
    if (currentState === normalizedTarget) return;

    const allowed =
      item.allowedNextStates && item.allowedNextStates.length > 0
        ? item.allowedNextStates.map((s) => normalizeProjectState(s))
        : getAllowedNextProjectStates(currentState, item.previousState);

    if (!allowed.includes(normalizedTarget)) {
      const fromLabel = PROJECT_STATE_META[currentState]?.label || currentState;
      const toLabel =
        PROJECT_STATE_META[normalizedTarget]?.label || normalizedTarget;
      const allowedLabels = allowed
        .map((s) => PROJECT_STATE_META[s]?.label || s)
        .join(", ");
      toastError(
        allowed.length > 0
          ? `Không thể chuyển trực tiếp từ "${fromLabel}" sang "${toLabel}". Các bước hợp lệ tiếp theo: ${allowedLabels}`
          : `Dự án đang ở trạng thái "${fromLabel}" (đã kết thúc vòng đời) nên không thể chuyển bước.`
      );
      return;
    }

    setTransitionModal({
      open: true,
      targetState: normalizedTarget,
      snapshot: {
        id: item.id,
        code: item.code,
        name: item.name,
        fromState: currentState,
        hasCustomer: Boolean(item.customer?.id || item.customerId || item.owner),
        customerType: item.customerType,
        address: item.address,
        categoryCount: 1,
        contractValue: item.contractValue,
        signDate: item.signDate,
        hasManager: Boolean(item.manager?.id),
        actualHandoverDate: item.actualHandoverDate,
        warrantyEndDate: item.warrantyEndDate,
      },
    });
  };

  const closeTransitionModal = () => {
    if (isTransitioning) return;
    setTransitionModal({ open: false, targetState: null, snapshot: null });
  };

  const confirmTransition = async (req: ProjectStateTransitionRequest) => {
    const snap = transitionModal.snapshot;
    if (!snap) return;

    const prevState = normalizeProjectState(snap.fromState);
    setIsTransitioning(true);
    setOptimisticStates((prev) => ({
      ...prev,
      [snap.id]: req.toState,
    }));

    try {
      await patchProjectState(snap.id, req);
      const toLabel = PROJECT_STATE_META[req.toState]?.label || req.toState;
      toastSuccess(
        `Đã chuyển dự án ${snap.code || snap.name} sang bước "${toLabel}"`
      );
      setTransitionModal({ open: false, targetState: null, snapshot: null });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["project-list"] }),
        queryClient.invalidateQueries({
          queryKey: ["project-lifecycle-summary"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["project-detail", snap.id],
        }),
        queryClient.invalidateQueries({
          queryKey: ["project-state-logs", snap.id],
        }),
        queryClient.invalidateQueries({ queryKey: ["customer-list"] }),
      ]);
    } catch (err) {
      setOptimisticStates((prev) => ({
        ...prev,
        [snap.id]: prevState,
      }));
      toastError(err);
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleKanbanDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const projectId = Number(draggableId.replace("project-", ""));
    const targetState = destination.droppableId as ProjectState;
    const item = rawProjects.find((p) => p.id === projectId);
    if (!item) return;

    openTransitionForItem(item, targetState);
  };

  const handleSelectStageCard = (stage: ProjectState | "") => {
    setValue("state", stage);
    setQueryPage((prev) => ({
      ...prev,
      page: 0,
      state: stage || undefined,
    }));
  };

  const columns = useMemo(
    () =>
      [
        {
          header: "Mã dự án",
          fieldName: "code",
          styleCell: { style: { minWidth: 110, fontWeight: 600 } },
        },
        {
          header: "Tên công trình / dự án",
          fieldName: "nameDisplay",
          styleCell: { style: { minWidth: 210 } },
        },
        {
          header: "Khách hàng / Chủ đầu tư",
          fieldName: "customerDisplay",
          styleCell: { style: { minWidth: 215 } },
        },
        {
          header: "Ban điều hành (2.10)",
          fieldName: "managerDisplay",
          styleCell: { style: { minWidth: 160 } },
        },
        {
          header: "Ngày ký HĐ",
          fieldName: "signDateDisplay",
          styleCell: { style: { minWidth: 110 } },
        },
        {
          header: "Bàn giao / Bảo hành",
          fieldName: "deliveryDateDisplay",
          styleCell: { style: { minWidth: 145 } },
        },
        {
          header: "Giá trị hợp đồng",
          fieldName: "contractValueDisplay",
          styleCell: { style: { minWidth: 140 } },
        },
        {
          header: "Còn phải thu",
          fieldName: "remainingDisplay",
          styleCell: { style: { minWidth: 140 } },
        },
        {
          header: "Tiến độ",
          fieldName: "progressDisplay",
          styleCell: { style: { minWidth: 120 } },
        },
        {
          header: "Vòng đời dự án",
          fieldName: "stateDisplay",
          styleCell: { style: { minWidth: 155 } },
        },
        {
          header: "Hành động",
          fieldName: "action",
          styleCell: { style: { minWidth: 120, textAlign: "center" } },
        },
      ] as ColumnProps[],
    [canUpdateProject, canDeleteProject]
  );

  const handleDeleteProject = (item: ProjectListItem) => {
    showDialog(
      <Dialog open onClose={hideDialog}>
        <DialogTitle>Xác nhận xóa dự án</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn xóa dự án <strong>{item.code || item.name}</strong> không?
          Toàn bộ thành viên, hợp đồng và tiến độ liên quan sẽ bị xóa. Thao tác này không thể hoàn tác.
        </DialogContent>
        <DialogActions>
          <CoreButton theme="cancel" onClick={hideDialog}>
            Hủy
          </CoreButton>
          <CoreButton
            theme="submit"
            onClick={async () => {
              try {
                await deleteProject({ id: item.id });
                toastSuccess(`Đã xóa dự án ${item.code || item.name} thành công`);
                hideDialog();
                await Promise.all([
                  queryClient.invalidateQueries({ queryKey: ["project-list"] }),
                  queryClient.invalidateQueries({
                    queryKey: ["project-lifecycle-summary"],
                  }),
                  queryClient.invalidateQueries({ queryKey: ["customer-list"] }),
                ]);
              } catch (err) {
                toastError(err);
              }
            }}
          >
            Xóa dự án
          </CoreButton>
        </DialogActions>
      </Dialog>
    );
  };

  const tableData = useMemo(() => {
    return rawProjects.map((item) => {
      const targetCustomerId = item.customer?.id ?? item.customerId ?? null;
      const customerName = item.customer?.name || item.owner || "—";
      const customerCode = item.customer?.code;
      const typeMeta = item.customerType
        ? CUSTOMER_TYPE_META[item.customerType]
        : null;
      const currentState = normalizeProjectState(item.state);
      const stateMeta =
        PROJECT_STATE_META[currentState] || PROJECT_STATE_META.RECEIVED;
      const pct = Math.min(
        100,
        Math.max(0, Number(item.progressPercent ?? 0))
      );

      return {
        ...item,
        nameDisplay: (
          <Stack spacing={0.25}>
            <Typography variant="body2" fontWeight={600}>
              {item.name}
            </Typography>
            {item.address && (
              <Typography variant="caption" color="text.secondary" noWrap>
                {item.address}
              </Typography>
            )}
          </Stack>
        ),
        customerDisplay: (
          <Stack spacing={0.5} alignItems="flex-start">
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{
                color: targetCustomerId ? "primary.main" : "text.primary",
                cursor: targetCustomerId ? "pointer" : "default",
                "&:hover": targetCustomerId
                  ? { textDecoration: "underline" }
                  : undefined,
              }}
              onClick={(e) => {
                if (!targetCustomerId) return;
                e.stopPropagation();
                router.push({
                  pathname: `${ROUTES.CUSTOMER}/${targetCustomerId}`,
                  query: { actionType: "VIEW" },
                });
              }}
            >
              {customerCode ? `${customerCode} - ${customerName}` : customerName}
            </Typography>
            {typeMeta && (
              <Chip
                size="small"
                variant="outlined"
                color={typeMeta.color}
                icon={
                  item.customerType === "BUSINESS" ? (
                    <BusinessOutlinedIcon fontSize="small" />
                  ) : (
                    <PersonOutlineIcon fontSize="small" />
                  )
                }
                label={typeMeta.label}
                sx={{ height: 22, fontSize: "0.72rem" }}
              />
            )}
          </Stack>
        ),
        managerDisplay: (
          <Stack spacing={0.25} alignItems="flex-start">
            <Typography variant="body2" fontWeight={600}>
              {item.manager?.name || "Chưa gán PM"}
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Chip
                size="small"
                label={`${item.memberCount ?? 0} thành viên`}
                color="info"
                variant="outlined"
                sx={{
                  height: 19,
                  fontSize: "0.68rem",
                  cursor: "pointer",
                  "&:hover": { bgcolor: "info.light" },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push({
                    pathname: `${ROUTES.PROJECT}/${item.id}`,
                    query: { actionType: "VIEW", tab: "members" },
                  });
                }}
              />
              {(item.contractCount ?? 0) > 0 && (
                <Chip
                  size="small"
                  label={`${item.contractCount} HĐ`}
                  color="success"
                  variant="outlined"
                  sx={{
                    height: 19,
                    fontSize: "0.68rem",
                    cursor: "pointer",
                    "&:hover": { bgcolor: "success.light" },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push({
                      pathname: `${ROUTES.PROJECT}/${item.id}`,
                      query: { actionType: "VIEW", tab: "contracts" },
                    });
                  }}
                />
              )}
            </Stack>
          </Stack>
        ),
        signDateDisplay: item.signDate
          ? moment(item.signDate).format("DD/MM/YYYY")
          : "—",
        deliveryDateDisplay: (
          <Stack spacing={0.25}>
            <Typography variant="body2">
              {item.actualHandoverDate
                ? `BG: ${moment(item.actualHandoverDate).format("DD/MM/YYYY")}`
                : item.deliveryDate
                ? `DK: ${moment(item.deliveryDate).format("DD/MM/YYYY")}`
                : "—"}
            </Typography>
            {item.warrantyEndDate && (
              <Typography variant="caption" color="success.main" fontWeight={600}>
                BH đến: {moment(item.warrantyEndDate).format("DD/MM/YYYY")}
              </Typography>
            )}
          </Stack>
        ),
        contractValueDisplay: (
          <Typography variant="body2" fontWeight={600}>
            {formatVnd(item.contractValue)}
          </Typography>
        ),
        remainingDisplay: (
          <Typography
            variant="body2"
            fontWeight={600}
            color={
              Number(item.remainingAmount ?? 0) > 0
                ? "warning.main"
                : "success.main"
            }
          >
            {formatVnd(item.remainingAmount)}
          </Typography>
        ),
        progressDisplay: (
          <Stack spacing={0.5}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="caption" fontWeight={600}>
                {pct.toFixed(0)}%
              </Typography>
              <Typography
                variant="caption"
                color="primary.main"
                fontWeight={700}
                sx={{
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push({
                    pathname: `${ROUTES.PROJECT}/${item.id}`,
                    query: { actionType: "VIEW", tab: "gantt" },
                  });
                }}
              >
                Gantt
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={pct}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Stack>
        ),
        stateDisplay: item.stateReason ? (
          <Tooltip title={`Ghi chú: ${item.stateReason}`}>
            <Chip
              size="small"
              color={stateMeta.color}
              label={stateMeta.shortLabel}
              sx={{ fontWeight: 600 }}
            />
          </Tooltip>
        ) : (
          <Chip
            size="small"
            color={stateMeta.color}
            label={stateMeta.shortLabel}
            sx={{ fontWeight: 600 }}
          />
        ),
        action: (
          <div onClick={(e) => e.stopPropagation()}>
            <Action
              actionList={[
                "watch",
                ...(canUpdateProject ? (["edit"] as const) : []),
                ...(canDeleteProject ? (["delete"] as const) : []),
              ]}
              onWatchAction={() => {
                router.push({
                  pathname: `${ROUTES.PROJECT}/${item.id}`,
                  query: { actionType: "VIEW" },
                });
              }}
              onEditAction={() => {
                router.push({
                  pathname: `${ROUTES.PROJECT}/${item.id}`,
                  query: { actionType: "EDIT" },
                });
              }}
              onDeleteAction={() => handleDeleteProject(item)}
            />
          </div>
        ),
      };
    });
  }, [rawProjects, canUpdateProject, canDeleteProject]);

  const onSubmit = handleSubmit((formData) => {
    setQueryPage((prev) => ({
      ...prev,
      page: 0,
      search: formData.search?.trim() || undefined,
      customerId: formData.customer?.id || undefined,
      state: formData.state || undefined,
    }));
  });

  const onReset = () => {
    reset(defaultValues);
    setQueryPage({
      page: 0,
      size: 20,
    });
  };

  const onChangePageSize = (val: { page?: number; size?: number }) => {
    setQueryPage((prev) => ({
      ...prev,
      page: val.page ?? 0,
      size: val.size ?? prev.size,
    }));
  };

  const onRowClick = (id: number) => {
    router.push({
      pathname: `${ROUTES.PROJECT}/${id}`,
      query: { actionType: "VIEW" },
    });
  };

  return [
    {
      control,
      columns,
      tableData,
      rawProjects,
      lifecycleSummary: summaryResp?.data ?? null,
      activeStateFilter: queryPage.state || "",
      viewMode,
      canUpdateProject,
      canDeleteProject,
      isLoading,
      page: data?.data?.page ?? queryPage.page,
      size: data?.data?.size ?? queryPage.size,
      totalPages: data?.data?.totalPages ?? 0,
      totalElements: data?.data?.totalElements ?? 0,
      transitionModal,
      isTransitioning,
    },
    {
      onSubmit,
      onReset,
      onChangePageSize,
      onRowClick,
      refetch,
      setViewMode,
      handleSelectStageCard,
      handleKanbanDragEnd,
      openTransitionForItem,
      closeTransitionModal,
      confirmTransition,
      handleDeleteProject,
    },
  ] as const;
};

export default useConstructionProjectList;
