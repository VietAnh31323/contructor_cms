import { useFormCustom } from "@/lib/form";
import { Forgot } from "@/service/Login/forgotPassword/forgot";

import { RequestBody as ForgotRequest } from "@/service/Login/forgotPassword/forgot/type";
import { RequestBody as VerifyRequest } from "@/service/Login/forgotPassword/verifyOTP/type";
import { RequestBody as ResetPass } from "@/service/Login/forgotPassword/reset/type";

import { VerifyOTP } from "@/service/Login/forgotPassword/verifyOTP";
import { ResetPassword } from "@/service/Login/forgotPassword/reset";
import { toastError, toastSuccess } from "@/toast";
import { useMutation } from "@tanstack/react-query";
import router from "next/router";
import { UseFormWatch } from "react-hook-form";

const defaultValues = {
  username: "",
  otp: "",
  newPassword: "",
};

type UseResetPassReturn = [
  {
    control: any;
    isPendingForgot: boolean;
    isPendingVerify: boolean;
    isPendingReset: boolean;
  },
  {
    sendOtp: () => void;
    verifyOtp: () => void;
    resetPass: () => void;
    watch: UseFormWatch<any>;
  }
];

export const useResetPass = (): UseResetPassReturn => {
  const methodForm = useFormCustom<any>({
    defaultValues,
  });

  const { handleSubmit, control, watch } = methodForm;

  const { mutate: sendOtpMutate, isPending: isPendingForgot } = useMutation({
    mutationFn: (body: ForgotRequest["SAVE"]) => Forgot(body),
    onSuccess: (res) => toastSuccess(res?.message),
    onError: () => toastError("Gửi OTP thất bại"),
  });

  const { mutate: verifyOtpMutate, isPending: isPendingVerify } = useMutation({
    mutationFn: (body: VerifyRequest["SAVE"]) => VerifyOTP(body),
    onSuccess: (res) => {
      toastSuccess(res.message);

      const token = res?.data?.token;
      const scheme = res?.data?.authScheme;
      const formattedScheme = scheme
        ? scheme.charAt(0).toUpperCase() + scheme.slice(1).toLowerCase()
        : "";
      if (token && scheme) {
        localStorage.setItem("otpToken", token);
        // console.log("abc", token);
        localStorage.setItem("otpScheme", formattedScheme);
        // console.log("vịdh", scheme);
      }
    },
    onError: () => toastError("OTP không đúng"),
  });

  const { mutate: resetPassMutate, isPending: isPendingReset } = useMutation({
    mutationFn: (body: ResetPass["SAVE"]) => ResetPassword(body),
    onSuccess: (res) => {
      toastSuccess(res?.message);
      router.push("http://localhost:3000/login");
    },
    onError: () => toastError("Lỗi khi đổi mật khẩu mới"),
  });

  const sendOtp = handleSubmit((data) => {
    sendOtpMutate({
      username: data.username,
      eRole: data.eRole,
    });
  });

  const verifyOtp = handleSubmit((data) => {
    verifyOtpMutate({
      username: data.username,
      otp: data.otp,
      token: "",
      authScheme: "",
    });
  });
  const resetPass = handleSubmit((data) => {
    resetPassMutate({
      newPassword: data.newPassword,
      // eRole: data.eRole,
    });
  });
  return [
    { control, isPendingForgot, isPendingVerify, isPendingReset },
    { sendOtp, verifyOtp, resetPass, watch },
  ];
};
