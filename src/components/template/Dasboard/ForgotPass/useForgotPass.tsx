import { clearAuthStorage } from "@/config/axios";
import { extractAuthFromToken } from "@/helper/permissions";
import { useFormCustom } from "@/lib/form";
import { ROUTES } from "@/routes";
import { putChangePass } from "@/service/constructor/Account/changePass";
import { RequestBody } from "@/service/constructor/Account/changePass/type";
import { useAccountDetailQuery } from "@/service/constructor/Account/getDetail";
import { RequestBody as RequestDetail } from "@/service/constructor/Account/getDetail/type";
import { toastError, toastSuccess } from "@/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import router from "next/router";
import { useEffect, useState } from "react";

const defaultValues = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function useForgotPass() {
  const queryClient = useQueryClient();
  const [isForcedChange, setIsForcedChange] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const forced =
        localStorage.getItem("must_change_password") === "true" ||
        extractAuthFromToken().mustChangePassword;
      setIsForcedChange(forced);
    }
  }, []);

  const methodForm = useFormCustom<RequestDetail["GET"]>({
    defaultValues: {},
  });
  const { reset } = methodForm;
  const { data, isLoading } = useAccountDetailQuery();

  const methodForms = useFormCustom<RequestBody["SAVE"]>({
    defaultValues,
  });
  const { handleSubmit, control } = methodForms;

  const { mutate, isPending } = useMutation({
    mutationFn: (body: RequestBody["SAVE"]) => putChangePass(body),

    onSuccess: () => {
      toastSuccess("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
      clearAuthStorage();
      queryClient.clear();
      router.push(ROUTES.LOGIN);
    },

    onError: (error: any) => {
      const apiMsg =
        error?.response?.data?.errors?.[0]?.message ||
        error?.response?.data?.message ||
        error?.errorCodes?.message ||
        "Đổi mật khẩu thất bại";
      toastError(apiMsg);
    },
  });

  const onSubmit = handleSubmit((formData) => {
    if (formData.newPassword !== formData.confirmPassword) {
      toastError("Xác nhận mật khẩu mới không khớp!");
      return;
    }
    if (!formData.newPassword || formData.newPassword.length < 6) {
      toastError("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }
    mutate({
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
    });
  });

  useEffect(() => {
    if (data?.data) {
      reset(data.data);
    }
  }, [data, reset]);

  return [
    { data, control, isLoading, isPending, isForcedChange },
    { onSubmit },
  ] as const;
}
