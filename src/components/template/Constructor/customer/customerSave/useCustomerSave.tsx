import { useFormCustom } from "@/lib/form";
import { ROUTES } from "@/routes";
import { useCustomerCareLogsQuery } from "@/service/constructor/Customer/careLogs";
import { useCustomerDetailQuery } from "@/service/constructor/Customer/getDetail";
import { CustomerPipelineStage } from "@/service/constructor/Customer/getList/type";
import { patchCustomerPipelineStage } from "@/service/constructor/Customer/pipeline";
import { postCustomer, putCustomer } from "@/service/constructor/Customer/save";
import { RequestBody } from "@/service/constructor/Customer/save/type";
import { toastError, toastSuccess } from "@/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const defaultValues: RequestBody["SAVE"] = {
  code: "",
  name: "",
  customerType: "INDIVIDUAL",
  taxCode: "",
  representativeName: "",
  representativePosition: "",
  idCardNumber: "",
  bankAccountNumber: "",
  bankName: "",
  bankBranch: "",
  bankAccountHolder: "",
  phone: "",
  email: "",
  address: "",
  contactStatus: "NOT_CONTACTED",
  pipelineStage: "LEAD",
  assignedStaff: null,
  isPotential: true,
  description: "",
  note: "",
};

export default function useCustomerSave() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const params = useParams();

  const actionType = searchParams.get("actionType");
  const tabParam = searchParams.get("tab");
  const isView = actionType === "VIEW";

  const id = Number(params?.id || router.query?.id || 0);
  const isUpdate = !!id;

  const initialTab =
    tabParam === "care" ? 1 : tabParam === "projects" ? 2 : 0;

  const [stageModalOpen, setStageModalOpen] = useState(false);
  const [targetStage, setTargetStage] =
    useState<CustomerPipelineStage>("LEAD");
  const [stageNote, setStageNote] = useState("");
  const [isUpdatingStage, setIsUpdatingStage] = useState(false);

  const methodForm = useFormCustom<RequestBody["SAVE"]>({
    defaultValues,
  });

  const { reset, handleSubmit, control, watch, setValue } = methodForm;
  const watchedCustomerType = watch("customerType") || "INDIVIDUAL";
  const watchedPipelineStage = watch("pipelineStage") || "LEAD";

  const {
    data,
    isLoading,
    refetch: refetchDetail,
  } = useCustomerDetailQuery(id, {
    enabled: isUpdate,
  });

  const {
    data: careLogsRes,
    isLoading: isLoadingCareLogs,
    refetch: refetchCareLogs,
  } = useCustomerCareLogsQuery(id, {
    enabled: isUpdate,
  });

  const customerDetail = data?.data;
  const careLogs = careLogsRes?.data ?? [];

  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: (body: RequestBody["SAVE"]) =>
      isUpdate ? putCustomer(id, body) : postCustomer(body),

    onSuccess: (res: any) => {
      toastSuccess(
        isUpdate
          ? "Cập nhật hồ sơ khách hàng thành công!"
          : "Thêm mới khách hàng thành công!"
      );
      queryClient.invalidateQueries({ queryKey: ["customer-list"] });
      queryClient.invalidateQueries({ queryKey: ["customer-pipeline-summary"] });
      const savedId = res?.data?.id || id;
      if (savedId) {
        queryClient.invalidateQueries({
          queryKey: ["customer-detail", Number(savedId)],
        });
        router.push(`${ROUTES.CUSTOMER}/${savedId}?actionType=VIEW`);
      }
    },

    onError: (error: any) => {
      toastError(
        error?.response?.data?.message || error?.message || "Có lỗi xảy ra"
      );
    },
  });

  const onSubmit = handleSubmit((values) => {
    const stage = values.pipelineStage || "LEAD";
    const requiresLegalInfo =
      stage === "CONTRACT_SIGNED" ||
      stage === "IN_CONSTRUCTION" ||
      stage === "WARRANTY";
    if (values.customerType === "BUSINESS" && requiresLegalInfo) {
      if (!values.taxCode?.trim() || !values.representativeName?.trim()) {
        toastError(
          "Khách hàng Doanh nghiệp cần bổ sung đầy đủ Mã số thuế và Người đại diện trước khi Ký hợp đồng / Thi công!"
        );
        return;
      }
    }
    const payload: RequestBody["SAVE"] = {
      ...values,
      assignedStaffId: values.assignedStaff?.id ?? null,
    };
    mutate(payload);
  });

  const handleOpenStageTransition = (nextStage: CustomerPipelineStage) => {
    if (!isUpdate || nextStage === customerDetail?.pipelineStage) {
      if (!isUpdate) {
        setValue("pipelineStage", nextStage);
      }
      return;
    }
    setTargetStage(nextStage);
    setStageNote("");
    setStageModalOpen(true);
  };

  const handleConfirmStageTransition = async () => {
    if (!id) return;
    setIsUpdatingStage(true);
    try {
      await patchCustomerPipelineStage(id, {
        pipelineStage: targetStage,
        note: stageNote.trim() || undefined,
      });
      toastSuccess("Đã cập nhật giai đoạn Pipeline khách hàng!");
      setStageModalOpen(false);
      await Promise.all([refetchDetail(), refetchCareLogs()]);
      queryClient.invalidateQueries({ queryKey: ["customer-list"] });
      queryClient.invalidateQueries({ queryKey: ["customer-pipeline-summary"] });
    } catch (err: any) {
      toastError(
        err?.response?.data?.message ||
          err?.message ||
          "Không thể chuyển giai đoạn Pipeline"
      );
    } finally {
      setIsUpdatingStage(false);
    }
  };

  const handleRefreshCareLogs = async () => {
    await Promise.all([refetchCareLogs(), refetchDetail()]);
    queryClient.invalidateQueries({ queryKey: ["customer-list"] });
    queryClient.invalidateQueries({ queryKey: ["customer-pipeline-summary"] });
  };

  useEffect(() => {
    if (isUpdate && customerDetail) {
      reset({
        ...defaultValues,
        ...customerDetail,
        customerType: customerDetail.customerType || "INDIVIDUAL",
        contactStatus: customerDetail.contactStatus || "NOT_CONTACTED",
        pipelineStage: customerDetail.pipelineStage || "LEAD",
        assignedStaff: customerDetail.assignedStaff || null,
      });
    }
  }, [isUpdate, customerDetail, reset]);

  return [
    {
      id,
      isView,
      isUpdate,
      initialTab,
      control,
      methodForm,
      isLoading,
      isSubmitting,
      watchedCustomerType,
      watchedPipelineStage,
      customerDetail,
      careLogs,
      isLoadingCareLogs,
      stageModalOpen,
      targetStage,
      stageNote,
      isUpdatingStage,
    },
    {
      onSubmit,
      setValue,
      setStageModalOpen,
      setStageNote,
      handleOpenStageTransition,
      handleConfirmStageTransition,
      handleRefreshCareLogs,
    },
  ] as const;
}
