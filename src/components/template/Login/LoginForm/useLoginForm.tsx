import { useFormCustom } from "@/lib/form";
import { ROUTES } from "@/routes";
import { Login } from "@/service/Login/login";
import { RequestBody } from "@/service/Login/login/type";
import { toastError, toastSuccess } from "@/toast";
import { useMutation } from "@tanstack/react-query";
import router from "next/router";
import { useContext, useEffect } from "react";
import { useForm, useFormContext } from "react-hook-form";
const defaultValues = {
  username: "",
  password: "",
  eRole: "",
};
export const useLoginForm = () => {
  const methodForm = useFormCustom<RequestBody["SAVE"]>({
    defaultValues,
  });

  const { reset, handleSubmit, control } = methodForm;

  const { mutate } = useMutation({
    mutationFn: (body: RequestBody["SAVE"]) => Login(body),

    onSuccess: (res: any) => {
      toastSuccess("Thành công");
      if (res?.data?.id) {
        router.push(ROUTES.DASHBOARD);
      }
    },

    onError: (error: any) => {
      toastError(error?.message || "Có lỗi xảy ra");
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutate(data);
    router.push(ROUTES.DASHBOARD);
  });

  return [{ control }, { onSubmit }];
};
