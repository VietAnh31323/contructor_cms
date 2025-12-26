import { useFormCustom } from "@/lib/form";
import { ROUTES } from "@/routes";
import { putChangePass } from "@/service/constructor/Account/changePass";
import { RequestBody } from "@/service/constructor/Account/changePass/type";
import { useAccountDetailQuery } from "@/service/constructor/Account/getDetail";
import { RequestBody as RequestDetail } from "@/service/constructor/Account/getDetail/type";
import { toastError, toastSuccess } from "@/toast";
import { useMutation } from "@tanstack/react-query";
import router from "next/router";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
const defaultValues = {};
export default function useForgotPass() {
  const methodForm = useFormCustom<RequestDetail["GET"]>({
    defaultValues,
  });

  const { reset } = methodForm;
  const accountId = Number(localStorage.getItem("accountId"));
  console.log("accountId", accountId);
  const { data, isLoading, refetch } = useAccountDetailQuery(accountId);
  const methodForms = useFormCustom<RequestBody["SAVE"]>({
    defaultValues,
  });
  const { handleSubmit, control, watch } = methodForms;
  const { mutate } = useMutation({
    mutationFn: (body: RequestBody["SAVE"]) => putChangePass(body),

    onSuccess: (res: any) => {
      toastSuccess("Thành công");
      if (res?.data?.id) {
        router.push(ROUTES.DASHBOARD);
      }
      router.push(ROUTES.DASHBOARD);
    },

    onError: (error: any) => {
      toastError(error?.errorCodes.message || "Có lỗi xảy ra");
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutate(data);
  });
  useEffect(() => {
    if (data?.data) {
      reset(data.data as any);
    }
  }, [data, reset]);
  return [
    { data, control, isLoading },
    { onSubmit, watch },
  ];
}
