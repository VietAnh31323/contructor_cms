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

  const { handleSubmit, control } = methodForm;

  const { mutate, isPending } = useMutation({
    mutationFn: (body: RequestBody["SAVE"]) => Login(body),

    onSuccess: (res: any) => {
      if (!res?.data?.token) {
        toastError(res?.errorCodes?.message || "Đăng nhập thất bại");
        return;
      }

      toastSuccess("Thành công");

      const token = res.data.token;
      const refresh = res.data.refreshToken;
      const accountId = res.data.userId;

      localStorage.setItem("accountId", accountId.toString());
      localStorage.setItem("access_token", token);
      localStorage.setItem("refresh_token", refresh);

      router.push(ROUTES.DASHBOARD);
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutate(data);
  });

  return [{ control, isPending }, { onSubmit }];
};
