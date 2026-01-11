import { findFirstError } from "@/helper/utils";
import { errors } from "@/lib/errors";
import { useFormCustom } from "@/lib/form";
import { ROUTES } from "@/routes";
import {
  postSteelProject,
  putSteelProject,
} from "@/service/constructor/SteelProject/save";
import { RequestBody } from "@/service/constructor/SteelProject/save/type";
import { toastError, toastSuccess } from "@/toast";
import { useMutation } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { Step2Data } from "./components/step2/useStep2";
import { useSteelProjectDetailQuery } from "@/service/constructor/SteelProject/getDetail";
const defaultValues = {};
const useSteelStatisticsSave = () => {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const actionType = searchParams.get("actionType");
  const isView = actionType === "VIEW";

  const id = Number(params?.id);
  const isUpdate = !!id;
  const [stepData, setStepData] = useState<{
    step1?: any;
    step2?: Step2Data;
  }>({});

  const methodForm = useFormCustom<RequestBody["SAVE"]>({
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    control,
    trigger,
    setFocus,
    getValues,

    formState: { errors },
  } = methodForm;

  const { data, isLoading } = useSteelProjectDetailQuery(id, {
    enabled: !!id,
  });

  const { mutate } = useMutation({
    mutationFn: (body: RequestBody["SAVE"]) =>
      isUpdate ? putSteelProject(id, body) : postSteelProject(body),

    onSuccess: (res: any) => {
      toastSuccess("Thành công");
      if (res?.data?.id) {
        router.push(`${ROUTES.STEELSTATISTICS}/${res.data.id}?actionType=VIEW`);
      }
    },

    onError: (error: any) => {
      toastError(error?.message || "Có lỗi xảy ra");
    },
  });

  const onSubmit = () => {
    if (!stepData.step1) {
      toastError("Vui lòng điền thông tin Step1");
      return;
    }

    const payload = {
      ...stepData.step1,
      steelProjectAssemblyMaps: (
        stepData.step2?.steelProjectAssemblyMaps || []
      ).map((assembly) => ({
        ...assembly,
        steels: (assembly.steels || []).map((steel) => ({
          id: steel.id || 0,
          barCode: steel.barCode,
          assemblyName: steel.assemblyName,
          images: (steel.images || []).map((img: any) => ({
            name: img.name,
            url: img.url,
            type: img.type || "IMAGE",
          })),
          barDiameter: steel.barDiameter,
          barQuantity: steel.barQuantity,
          spliceLength: steel.spliceLength,
          length: steel.steelLinesText, // map nếu cần
        })),
      })),
    };

    console.log("🚀 FINAL PAYLOAD SEND BE:", payload);

    mutate(payload); // gọi API save
  };

  const handleChangeStep = async (val: number) => {
    await trigger();
    const hasError = errors && Object.keys(errors).length > 0;

    if (hasError) {
      const firstErrorField = findFirstError(errors);
      if (firstErrorField) setFocus(firstErrorField);
    } else {
      setStep(val);
    }
  };

  useEffect(() => {
    if (id && data?.data) {
      reset(data.data);
    }
  }, [id, data, reset]);

  return [
    {
      methodForm,

      isView,
      isUpdate,
      stepData,
      id,
      step,
      router,
      isLoading,
    },
    { onSubmit, handleChangeStep, setStepData },
  ] as const;
};

export default useSteelStatisticsSave;
