import { usePermission } from "@/components/hooks/permission/usePermission";
import { PERMISSIONS } from "@/helper/permissions";
import { useFormCustom } from "@/lib/form";
import { ROUTES } from "@/routes";
import { getCustomerDetail } from "@/service/constructor/Customer/getDetail";
import { CustomerDetail } from "@/service/constructor/Customer/getDetail/type";
import { CodeNameRef } from "@/service/constructor/Customer/getList/type";
import { useProjectDetailQuery } from "@/service/constructor/Project/getDetail";
import {
  BuildingType,
  ProjectDetail,
  ProjectLineDto,
} from "@/service/constructor/Project/getDetail/type";
import { ProjectState } from "@/service/constructor/Project/getList/type";
import { patchProjectState } from "@/service/constructor/Project/lifecycle";
import { ProjectStateTransitionRequest } from "@/service/constructor/Project/lifecycle/type";
import {
  postProject,
  putProject,
} from "@/service/constructor/Project/save";
import { toastError, toastSuccess } from "@/toast";
import { DropResult } from "@hello-pangea/dnd";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray } from "react-hook-form";
import {
  getAllowedNextProjectStates,
  normalizeProjectState,
  PROJECT_STATE_META,
} from "../constants";
import { TransitionProjectSnapshot } from "../ProjectTransitionDialog";

export type ProjectFormValues = {
  code: string;
  name: string;
  customer: CodeNameRef | null;
  address: string;
  contractValue: number | string;
  contractAdvance: number | string;
  signDate: string | null;
  deliveryDate: string | null;
  actualHandoverDate: string | null;
  warrantyEndDate: string | null;
  categories: CodeNameRef[];
  creator: CodeNameRef | null;
  manager: CodeNameRef | null;
  supporter: CodeNameRef | null;
  projectLines: {
    lineId?: number;
    paymentDate: string | null;
    paymentAmount: number | string;
    percentage?: number | string;
    conditionMilestone?: string;
    note?: string;
  }[];
  note: string;
  state: ProjectState;
  stateReason: string;
  buildingType: BuildingType | "";
  landArea: number | string;
  constructionArea: number | string;
  totalFloorArea: number | string;
  numberOfFloors: number | string;
  constructionPermitNo: string;
  constructionPermitDate: string | null;
  designUnit: string;
};

const defaultValues: ProjectFormValues = {
  code: "",
  name: "",
  customer: null,
  address: "",
  contractValue: 0,
  contractAdvance: 0,
  signDate: null,
  deliveryDate: null,
  actualHandoverDate: null,
  warrantyEndDate: null,
  categories: [],
  creator: null,
  manager: null,
  supporter: null,
  projectLines: [
    {
      paymentDate: null,
      paymentAmount: "",
      percentage: "",
      conditionMilestone: "",
      note: "",
    },
  ],
  note: "",
  state: "RECEIVED",
  stateReason: "",
  buildingType: "",
  landArea: "",
  constructionArea: "",
  totalFloorArea: "",
  numberOfFloors: "",
  constructionPermitNo: "",
  constructionPermitDate: null,
  designUnit: "",
};

const useConstructionProjectSave = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { hasPermission } = usePermission();
  const canUpdateProject = hasPermission(PERMISSIONS.PROJECT_UPDATE);

  const id = router.query?.id ? Number(router.query.id) : undefined;
  const isUpdate = !!id;
  const isView = router.query?.actionType === "VIEW";
  const preselectedCustomerId = router.query?.customerId
    ? Number(router.query.customerId)
    : undefined;

  const methodForm = useFormCustom<ProjectFormValues>({
    defaultValues,
  });

  const { handleSubmit, reset, control, watch, getValues, setValue } =
    methodForm;

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "projectLines",
  });

  const [editorText, setEditorText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCustomerInfo, setSelectedCustomerInfo] =
    useState<CustomerDetail | null>(null);

  const [transitionTarget, setTransitionTarget] =
    useState<ProjectState | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { data: detailResp, isLoading, refetch } = useProjectDetailQuery(id, {
    enabled: isUpdate,
  });

  const projectDetail = detailResp?.data ?? null;

  useEffect(() => {
    const detail = detailResp?.data;
    if (!detail) return;

    const mappedLines =
      detail.projectLines && detail.projectLines.length > 0
        ? detail.projectLines.map((line) => ({
            lineId: line.id,
            paymentDate: line.paymentDate || null,
            paymentAmount:
              line.paymentAmount !== null && line.paymentAmount !== undefined
                ? line.paymentAmount
                : "",
            percentage:
              line.percentage !== null && line.percentage !== undefined
                ? line.percentage
                : "",
            conditionMilestone: line.conditionMilestone || "",
            note: line.note || "",
          }))
        : [
            {
              paymentDate: null,
              paymentAmount: "",
              percentage: "",
              conditionMilestone: "",
              note: "",
            },
          ];

    const resolvedCustomer: CodeNameRef | null = detail.customer
      ? detail.customer
      : detail.customerId
      ? {
          id: detail.customerId,
          code: "",
          name: detail.owner || "",
        }
      : null;

    reset({
      code: detail.code || "",
      name: detail.name || "",
      customer: resolvedCustomer,
      address: detail.address || "",
      contractValue:
        detail.contractValue !== null && detail.contractValue !== undefined
          ? detail.contractValue
          : 0,
      contractAdvance:
        detail.contractAdvance !== null && detail.contractAdvance !== undefined
          ? detail.contractAdvance
          : 0,
      signDate: detail.signDate || null,
      deliveryDate: detail.deliveryDate || null,
      actualHandoverDate: detail.actualHandoverDate || null,
      warrantyEndDate: detail.warrantyEndDate || null,
      categories: (detail.projectCategoryMaps || [])
        .map((m) => m.category)
        .filter(Boolean),
      creator: detail.creator || null,
      manager: detail.manager || null,
      supporter: detail.supporter || null,
      projectLines: mappedLines,
      note: detail.note || "",
      state: normalizeProjectState(detail.state),
      stateReason: detail.stateReason || "",
      buildingType: detail.buildingType || "",
      landArea:
        detail.landArea !== null && detail.landArea !== undefined
          ? detail.landArea
          : "",
      constructionArea:
        detail.constructionArea !== null && detail.constructionArea !== undefined
          ? detail.constructionArea
          : "",
      totalFloorArea:
        detail.totalFloorArea !== null && detail.totalFloorArea !== undefined
          ? detail.totalFloorArea
          : "",
      numberOfFloors:
        detail.numberOfFloors !== null && detail.numberOfFloors !== undefined
          ? detail.numberOfFloors
          : "",
      constructionPermitNo: detail.constructionPermitNo || "",
      constructionPermitDate: detail.constructionPermitDate || null,
      designUnit: detail.designUnit || "",
    });
    setEditorText(detail.description || "");
  }, [detailResp, reset]);

  // Pre-fill customer when navigating from Customer screen (?customerId=...)
  useEffect(() => {
    if (isUpdate || !preselectedCustomerId) return;
    let mounted = true;
    getCustomerDetail(preselectedCustomerId)
      .then((res) => {
        if (!mounted || !res?.data) return;
        const cust = res.data;
        setSelectedCustomerInfo(cust);
        setValue("customer", {
          id: cust.id,
          code: cust.code,
          name: cust.name,
        });
        if (!getValues("address") && cust.address) {
          setValue("address", cust.address);
        }
        if (!getValues("supporter") && cust.assignedStaff) {
          setValue("supporter", cust.assignedStaff);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [isUpdate, preselectedCustomerId, setValue, getValues]);

  const watchedCustomer = watch("customer");
  const watchedAddress = watch("address");
  const watchedContractValue = watch("contractValue");
  const watchedContractAdvance = watch("contractAdvance");
  const watchedSignDate = watch("signDate");
  const watchedManager = watch("manager");
  const watchedCategories = watch("categories");
  const watchedLines = watch("projectLines");
  const watchedState = watch("state");

  // Load selected customer details for quick CRM info card & legal validation
  useEffect(() => {
    const custId = watchedCustomer?.id;
    if (!custId) {
      setSelectedCustomerInfo(null);
      return;
    }
    let mounted = true;
    getCustomerDetail(custId)
      .then((res) => {
        if (!mounted || !res?.data) return;
        const cust = res.data;
        setSelectedCustomerInfo(cust);
        if (!isUpdate && !isView) {
          if (!getValues("address") && cust.address) {
            setValue("address", cust.address);
          }
          if (!getValues("supporter") && cust.assignedStaff) {
            setValue("supporter", cust.assignedStaff);
          }
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [watchedCustomer?.id, isUpdate, isView, getValues, setValue]);

  const financialSummary = useMemo(() => {
    const contractVal = Number(watchedContractValue || 0) || 0;
    const advanceVal = Number(watchedContractAdvance || 0) || 0;
    const installmentsPaid = (watchedLines || []).reduce((sum, line) => {
      const amount = Number(line?.paymentAmount || 0);
      return sum + (Number.isFinite(amount) ? amount : 0);
    }, 0);
    const totalPaid = advanceVal + installmentsPaid;
    const remaining = contractVal - totalPaid;
    return {
      contractVal,
      advanceVal,
      installmentsPaid,
      totalPaid,
      remaining,
    };
  }, [watchedContractValue, watchedContractAdvance, watchedLines]);

  const currentState: ProjectState = useMemo(
    () => normalizeProjectState(projectDetail?.state || watchedState),
    [projectDetail?.state, watchedState]
  );

  const allowedNextStates: ProjectState[] = useMemo(() => {
    if (
      projectDetail?.allowedNextStates &&
      projectDetail.allowedNextStates.length > 0
    ) {
      return projectDetail.allowedNextStates.map((s) =>
        normalizeProjectState(s)
      );
    }
    return getAllowedNextProjectStates(
      currentState,
      projectDetail?.previousState
    );
  }, [projectDetail?.allowedNextStates, projectDetail?.previousState, currentState]);

  const transitionSnapshot: TransitionProjectSnapshot | null = useMemo(() => {
    if (!id || !projectDetail) return null;
    return {
      id,
      code: projectDetail.code,
      name: watchedCustomer ? getValues("name") || projectDetail.name : projectDetail.name,
      fromState: currentState,
      hasCustomer: Boolean(
        watchedCustomer?.id ||
          projectDetail.customer?.id ||
          projectDetail.customerId ||
          projectDetail.owner
      ),
      customerType:
        selectedCustomerInfo?.customerType ?? projectDetail.customerType,
      customerInfo: selectedCustomerInfo,
      address: isView ? projectDetail.address : watchedAddress,
      categoryCount: isView
        ? projectDetail.projectCategoryMaps?.length ?? 0
        : watchedCategories?.length ?? 0,
      contractValue: isView ? projectDetail.contractValue : watchedContractValue,
      signDate: isView ? projectDetail.signDate : watchedSignDate,
      hasManager: Boolean(
        isView ? projectDetail.manager?.id : watchedManager?.id
      ),
      actualHandoverDate: projectDetail.actualHandoverDate,
      warrantyEndDate: projectDetail.warrantyEndDate,
    };
  }, [
    id,
    projectDetail,
    currentState,
    watchedCustomer,
    selectedCustomerInfo,
    isView,
    watchedAddress,
    watchedCategories,
    watchedContractValue,
    watchedSignDate,
    watchedManager,
    getValues,
  ]);

  const openTransitionDialog = (toState: ProjectState) => {
    if (!canUpdateProject) {
      toastError("Bạn không có quyền chuyển trạng thái dự án");
      return;
    }
    const normalized = normalizeProjectState(toState);
    if (normalized === currentState) return;
    if (!allowedNextStates.includes(normalized)) {
      const fromLabel = PROJECT_STATE_META[currentState]?.label || currentState;
      const toLabel = PROJECT_STATE_META[normalized]?.label || normalized;
      toastError(
        `Chưa thể chuyển trực tiếp từ "${fromLabel}" sang "${toLabel}" theo quy trình vòng đời dự án.`
      );
      return;
    }
    setTransitionTarget(normalized);
  };

  const closeTransitionDialog = () => {
    if (isTransitioning) return;
    setTransitionTarget(null);
  };

  const confirmTransition = async (req: ProjectStateTransitionRequest) => {
    if (!id) return;
    try {
      setIsTransitioning(true);
      await patchProjectState(id, req);
      const toLabel = PROJECT_STATE_META[req.toState]?.label || req.toState;
      toastSuccess(`Đã chuyển trạng thái dự án sang bước "${toLabel}"`);
      setTransitionTarget(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["project-detail", id] }),
        queryClient.invalidateQueries({ queryKey: ["project-state-logs", id] }),
        queryClient.invalidateQueries({ queryKey: ["project-list"] }),
        queryClient.invalidateQueries({
          queryKey: ["project-lifecycle-summary"],
        }),
        queryClient.invalidateQueries({ queryKey: ["customer-detail"] }),
        queryClient.invalidateQueries({ queryKey: ["customer-list"] }),
      ]);
    } catch (err) {
      toastError(err);
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (isView) return;
    const { source, destination } = result;
    if (!destination) return;
    move(source.index, destination.index);
  };

  const onSubmit = handleSubmit(async (formData) => {
    if (!formData.customer?.id) {
      toastError("Vui lòng chọn Khách hàng / Chủ đầu tư");
      return;
    }
    if (!formData.name?.trim()) {
      toastError("Vui lòng nhập tên công trình dự án");
      return;
    }
    const parsedContractValue =
      formData.contractValue === "" ||
      formData.contractValue === null ||
      formData.contractValue === undefined
        ? 0
        : Number(formData.contractValue);

    if (Number.isNaN(parsedContractValue) || parsedContractValue < 0) {
      toastError("Vui lòng nhập giá trị hợp đồng / dự toán hợp lệ (>= 0)");
      return;
    }
    if (!formData.categories || formData.categories.length === 0) {
      toastError("Vui lòng chọn ít nhất 1 hạng mục dự án");
      return;
    }

    const chosenState = normalizeProjectState(formData.state);
    if (!isUpdate) {
      if (chosenState === "SURVEYING" && !formData.address?.trim()) {
        toastError("Bước Khảo sát yêu cầu phải có Địa điểm xây dựng");
        return;
      }
      if (
        (chosenState === "QUOTED" ||
          chosenState === "CONTRACT_SIGNED" ||
          chosenState === "IN_CONSTRUCTION") &&
        parsedContractValue <= 0
      ) {
        toastError(
          `Bước "${PROJECT_STATE_META[chosenState]?.label}" yêu cầu Giá trị hợp đồng / báo giá > 0 VNĐ`
        );
        return;
      }
      if (
        (chosenState === "CONTRACT_SIGNED" ||
          chosenState === "IN_CONSTRUCTION") &&
        !formData.signDate
      ) {
        toastError("Vui lòng chọn Ngày ký hợp đồng cho dự án đã ký HĐ");
        return;
      }
      if (chosenState === "IN_CONSTRUCTION" && !formData.manager?.id) {
        toastError(
          "Bước Thi công yêu cầu phân công Chủ nhiệm dự án (PM / Chỉ huy trưởng)"
        );
        return;
      }
    }

    const normalizedLines: ProjectLineDto[] = [];
    for (let i = 0; i < (formData.projectLines || []).length; i++) {
      const line = formData.projectLines[i];
      const hasDate = !!line.paymentDate;
      const hasAmount =
        line.paymentAmount !== "" &&
        line.paymentAmount !== null &&
        line.paymentAmount !== undefined;
      const hasPct =
        line.percentage !== "" &&
        line.percentage !== null &&
        line.percentage !== undefined;
      if (!hasDate && !hasAmount && !hasPct && !line.conditionMilestone?.trim()) {
        continue;
      }
      if (!hasDate || (!hasAmount && !hasPct)) {
        toastError(
          `Đợt thanh toán lần ${
            i + 1
          }: Vui lòng nhập đầy đủ ngày dự kiến và % hoặc số tiền hợp lệ`
        );
        return;
      }
      const pctVal = hasPct ? Number(line.percentage) : undefined;
      const amtVal = hasAmount
        ? Number(line.paymentAmount)
        : pctVal !== undefined && parsedContractValue > 0
        ? Math.round((parsedContractValue * pctVal) / 100)
        : 0;
      normalizedLines.push({
        id: line.lineId,
        paymentNo: normalizedLines.length + 1,
        paymentDate: line.paymentDate,
        paymentAmount: amtVal,
        percentage: pctVal,
        conditionMilestone: line.conditionMilestone?.trim() || undefined,
        note: line.note?.trim() || undefined,
      });
    }

    const payload: ProjectDetail = {
      id,
      code: formData.code?.trim() || undefined,
      name: formData.name.trim(),
      customerId: formData.customer.id,
      customer: {
        id: formData.customer.id,
        code: formData.customer.code,
        name: formData.customer.name,
      },
      owner: formData.customer.name,
      address: formData.address?.trim() || undefined,
      contractValue: parsedContractValue,
      contractAdvance:
        formData.contractAdvance !== "" &&
        formData.contractAdvance !== null &&
        formData.contractAdvance !== undefined
          ? Number(formData.contractAdvance)
          : 0,
      signDate: formData.signDate || null,
      deliveryDate: formData.deliveryDate || null,
      actualHandoverDate: formData.actualHandoverDate || null,
      warrantyEndDate: formData.warrantyEndDate || null,
      creator: formData.creator || null,
      manager: formData.manager || null,
      supporter: formData.supporter || null,
      description: editorText || undefined,
      note: formData.note?.trim() || undefined,
      state: isUpdate ? currentState : chosenState,
      stateReason: formData.stateReason?.trim() || undefined,
      projectCategoryMaps: formData.categories.map((cat) => ({
        category: {
          id: cat.id,
          code: cat.code,
          name: cat.name,
        },
      })),
      projectLines: normalizedLines,
      buildingType: formData.buildingType || null,
      landArea: formData.landArea !== "" ? Number(formData.landArea) : null,
      constructionArea:
        formData.constructionArea !== ""
          ? Number(formData.constructionArea)
          : null,
      totalFloorArea:
        formData.totalFloorArea !== "" ? Number(formData.totalFloorArea) : null,
      numberOfFloors:
        formData.numberOfFloors !== "" ? Number(formData.numberOfFloors) : null,
      constructionPermitNo: formData.constructionPermitNo?.trim() || null,
      constructionPermitDate: formData.constructionPermitDate || null,
      designUnit: formData.designUnit?.trim() || null,
    };

    try {
      setIsSubmitting(true);
      if (isUpdate && id) {
        await putProject(id, payload);
        toastSuccess("Cập nhật thông tin dự án thành công");
      } else {
        const res = await postProject(payload);
        const createdId = res?.data?.id;
        toastSuccess("Tạo mới dự án thành công");
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["project-list"] }),
          queryClient.invalidateQueries({
            queryKey: ["project-lifecycle-summary"],
          }),
          queryClient.invalidateQueries({ queryKey: ["customer-detail"] }),
          queryClient.invalidateQueries({ queryKey: ["customer-list"] }),
        ]);
        if (createdId) {
          router.push({
            pathname: `${ROUTES.PROJECT}/${createdId}`,
            query: { actionType: "VIEW" },
          });
          return;
        }
        router.push(ROUTES.PROJECT);
        return;
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["project-list"] }),
        queryClient.invalidateQueries({
          queryKey: ["project-lifecycle-summary"],
        }),
        queryClient.invalidateQueries({ queryKey: ["project-detail", id] }),
        queryClient.invalidateQueries({ queryKey: ["project-state-logs", id] }),
        queryClient.invalidateQueries({ queryKey: ["customer-detail"] }),
        queryClient.invalidateQueries({ queryKey: ["customer-list"] }),
      ]);
      router.push({
        pathname: `${ROUTES.PROJECT}/${id}`,
        query: { actionType: "VIEW" },
      });
    } catch (err) {
      toastError(err);
    } finally {
      setIsSubmitting(false);
    }
  });

  return {
    id,
    isUpdate,
    isView,
    isLoading,
    isSubmitting,
    fields,
    append,
    remove,
    handleDragEnd,
    control,
    methodForm,
    editorText,
    setEditorText,
    selectedCustomerInfo,
    financialSummary,
    projectDetail,
    currentState,
    allowedNextStates,
    transitionTarget,
    transitionSnapshot,
    isTransitioning,
    openTransitionDialog,
    closeTransitionDialog,
    confirmTransition,
    onSubmit,
    refetchDetail: refetch,
  };
};

export default useConstructionProjectSave;
