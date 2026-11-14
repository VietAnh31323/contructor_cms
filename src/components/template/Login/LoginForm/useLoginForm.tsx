import { useFormCustom } from "@/lib/form";
import { ROUTES } from "@/routes";
import { Login } from "@/service/Login/login";
import { RequestBody } from "@/service/Login/login/type";
import { toastError, toastSuccess } from "@/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import router from "next/router";

const defaultValues = {
  username: "",
  password: "",
  eRole: "",
};

export const useLoginForm = () => {
  const queryClient = useQueryClient();
  const methodForm = useFormCustom<RequestBody["SAVE"]>({
    defaultValues,
  });

  const { handleSubmit, control } = methodForm;

  const { mutate, isPending } = useMutation({
    mutationFn: (body: RequestBody["SAVE"]) => Login(body),

    onSuccess: (res: any) => {
      const data = res?.data || {};
      const token = data?.token || "";
      const refresh = data?.refreshToken || "";
      const roles = Array.isArray(data?.roles) ? data.roles : [];
      const permissions = Array.isArray(data?.permissions)
        ? data.permissions
        : [];
      const mustChangePassword = Boolean(data?.mustChangePassword);

      localStorage.setItem("access_token", token);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("user_roles", JSON.stringify(roles));
      localStorage.setItem("user_permissions", JSON.stringify(permissions));
      localStorage.setItem(
        "must_change_password",
        mustChangePassword ? "true" : "false"
      );

      queryClient.invalidateQueries({
        queryKey: ["account-current-permissions"],
      });

      if (mustChangePassword) {
        toastSuccess(
          "Đăng nhập thành công. Vui lòng đổi mật khẩu trong lần đăng nhập đầu tiên!"
        );
        router.push(ROUTES.FORGOTPASS);
      } else {
        toastSuccess("Đăng nhập thành công");
        router.push(ROUTES.DASHBOARD);
      }
    },
    onError: (error: any) => {
      const apiMsg =
        error?.response?.data?.errors?.[0]?.message ||
        error?.response?.data?.message ||
        error?.message ||
        "Đăng nhập thất bại";
      toastError(apiMsg);
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutate(data);
  });

  return [{ control, isPending }, { onSubmit }];
};
