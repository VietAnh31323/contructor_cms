import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CoreInput from "@/components/atoms/CoreInput";
import CoreAutocomplete from "@/components/atoms/CoreAutocomplete";
import { ROUTES } from "@/routes";
import { AuthShowcaseShell } from "../AuthShowcaseShell";
import { authFieldSx } from "../authFieldSx";
import { useResetPass } from "./useResetPass";

const ArrowLeftIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c6.4 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3.6 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
  </svg>
);

type Step = "SEND" | "VERIFY" | "RESET";

const ROLE_OPTIONS = [
  { label: "Quản trị hệ thống (Admin)", value: "ADMIN" },
  { label: "Ban giám đốc", value: "DIRECTOR" },
  { label: "Quản lý dự án (PM)", value: "PROJECT_MANAGER" },
  { label: "Kỹ sư hiện trường", value: "SITE_ENGINEER" },
  { label: "Kế toán", value: "ACCOUNTANT" },
  { label: "Dự toán / Đấu thầu", value: "ESTIMATOR" },
  { label: "Thủ kho / Vật tư", value: "WAREHOUSE" },
  { label: "Chăm sóc khách hàng", value: "CUSTOMER_CARE" },
  { label: "Khách hàng", value: "CUSTOMER" },
  { label: "Nhân viên", value: "STAFF" },
];

const STEP_META: Record<
  Step,
  { index: number; title: string; description: string }
> = {
  SEND: {
    index: 1,
    title: "Khôi phục mật khẩu",
    description:
      "Nhập email hoặc tên đăng nhập để nhận mã xác thực OTP.",
  },
  VERIFY: {
    index: 2,
    title: "Xác thực mã OTP",
    description:
      "Nhập mã 6 chữ số đã được gửi tới email đăng ký tài khoản của bạn.",
  },
  RESET: {
    index: 3,
    title: "Tạo mật khẩu mới",
    description:
      "Thiết lập mật khẩu mới có độ dài tối thiểu 8 ký tự cho tài khoản.",
  },
};

export const ResetPass: React.FC = () => {
  const router = useRouter();
  const [values, handle] = useResetPass();
  const { control, isPendingForgot, isPendingVerify, isPendingReset } = values;
  const { sendOtp, verifyOtp, resetPass } = handle;

  const [step, setStep] = useState<Step>("SEND");
  const [timer, setTimer] = useState(300);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (step !== "VERIFY" || timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [step, timer]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendOtp();
    setTimer(300);
    setStep("VERIFY");
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    await verifyOtp();
    setStep("RESET");
  };

  const handleResetPass = async (e: React.FormEvent) => {
    e.preventDefault();
    await resetPass();
  };

  const meta = STEP_META[step];

  return (
    <AuthShowcaseShell
      topActionHref={ROUTES.LOGIN}
      topActionLabel="Đăng nhập"
    >
      <div className="space-y-8">
        {/* Back link + minimal step progress */}
        <div className="space-y-5">
          <button
            type="button"
            onClick={() => {
              if (step === "SEND") {
                router.push(ROUTES.LOGIN);
              } else if (step === "VERIFY") {
                setStep("SEND");
              } else {
                setStep("VERIFY");
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#71717A] hover:text-[#18181B] transition-colors cursor-pointer"
          >
            <ArrowLeftIcon />
            <span>{step === "SEND" ? "Quay lại đăng nhập" : "Quay lại bước trước"}</span>
          </button>

          {/* Thin 3-segment progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#71717A]">
              <span>Bước {meta.index} / 3</span>
              <span>
                {step === "SEND"
                  ? "Xác định tài khoản"
                  : step === "VERIFY"
                    ? "Xác thực OTP"
                    : "Đặt mật khẩu mới"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`h-1 rounded-full transition-colors ${idx <= meta.index ? "bg-[#18181B]" : "bg-[#E4E4E7]"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-[#18181B]">
            {meta.title}
          </h1>
          <p className="text-sm text-[#71717A] leading-relaxed">
            {meta.description}
          </p>
        </div>

        {/* Step 1: Send OTP */}
        {step === "SEND" && (
          <form onSubmit={handleSendOtp} className="space-y-5" noValidate>
            <div className="space-y-4">
              <CoreInput
                control={control}
                name="username"
                label="Tài khoản hoặc Email"
                placeholder="name@company.vn"
                variant="outlined"
                sx={authFieldSx}
                required
                rules={{ required: "Vui lòng nhập tài khoản hoặc email" }}
              />

              <CoreAutocomplete
                control={control}
                name="eRole"
                label="Vai trò truy cập"
                placeholder="Chọn chức vụ"
                variant="outlined"
                sx={authFieldSx}
                options={ROLE_OPTIONS}
                valuePath="value"
                labelPath="label"
              />
            </div>

            <button
              type="submit"
              disabled={isPendingForgot}
              className="w-full h-11 rounded-xl bg-[#18181B] hover:bg-[#27272A] active:scale-[0.99] disabled:bg-[#E4E4E7] disabled:text-[#A1A1AA] text-[#FAFAFA] text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isPendingForgot ? (
                <>
                  <SpinnerIcon />
                  <span>Đang gửi mã...</span>
                </>
              ) : (
                <span>Gửi mã xác thực</span>
              )}
            </button>
          </form>
        )}

        {/* Step 2: Verify OTP */}
        {step === "VERIFY" && (
          <form onSubmit={handleVerifyOtp} className="space-y-5" noValidate>
            <div className="space-y-3">
              <CoreInput
                control={control}
                name="otp"
                label="Mã xác thực OTP"
                placeholder="Nhập mã 6 chữ số"
                variant="outlined"
                sx={authFieldSx}
                required
                rules={{ required: "Vui lòng nhập mã OTP" }}
              />

              <div className="flex items-center justify-between text-xs text-[#71717A]">
                <span>
                  Hiệu lực mã:{" "}
                  <span className="font-medium text-[#18181B] tabular-nums">
                    {formatTimer(timer)}
                  </span>
                </span>
                <button
                  type="button"
                  disabled={timer > 0 || isPendingForgot}
                  onClick={() => {
                    sendOtp();
                    setTimer(300);
                  }}
                  className="font-medium text-[#18181B] hover:underline underline-offset-4 disabled:text-[#A1A1AA] disabled:no-underline cursor-pointer disabled:cursor-not-allowed"
                >
                  Gửi lại mã
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPendingVerify}
              className="w-full h-11 rounded-xl bg-[#18181B] hover:bg-[#27272A] active:scale-[0.99] disabled:bg-[#E4E4E7] disabled:text-[#A1A1AA] text-[#FAFAFA] text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isPendingVerify ? (
                <>
                  <SpinnerIcon />
                  <span>Đang xác thực...</span>
                </>
              ) : (
                <span>Xác nhận mã OTP</span>
              )}
            </button>
          </form>
        )}

        {/* Step 3: Reset Password */}
        {step === "RESET" && (
          <form onSubmit={handleResetPass} className="space-y-5" noValidate>
            <div className="space-y-4">
              <CoreInput
                control={control}
                name="newPassword"
                label="Mật khẩu mới"
                placeholder="Tối thiểu 8 ký tự"
                type={showNewPassword ? "text" : "password"}
                variant="outlined"
                sx={authFieldSx}
                required
                rules={{
                  required: "Vui lòng nhập mật khẩu mới",
                  minLength: {
                    value: 8,
                    message: "Mật khẩu phải có ít nhất 8 ký tự",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      aria-label={showNewPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                      className="p-1.5 mr-0.5 rounded-lg text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F4F5] transition-colors cursor-pointer"
                    >
                      {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  ),
                }}
              />

              <CoreInput
                control={control}
                name="confirmPassword"
                label="Xác nhận mật khẩu"
                placeholder="Nhập lại mật khẩu mới"
                type={showConfirmPassword ? "text" : "password"}
                variant="outlined"
                sx={authFieldSx}
                required
                rules={{
                  required: "Vui lòng xác nhận mật khẩu mới",
                }}
                InputProps={{
                  endAdornment: (
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      aria-label={
                        showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                      }
                      className="p-1.5 mr-0.5 rounded-lg text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F4F5] transition-colors cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  ),
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isPendingReset}
              className="w-full h-11 rounded-xl bg-[#18181B] hover:bg-[#27272A] active:scale-[0.99] disabled:bg-[#E4E4E7] disabled:text-[#A1A1AA] text-[#FAFAFA] text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isPendingReset ? (
                <>
                  <SpinnerIcon />
                  <span>Đang cập nhật...</span>
                </>
              ) : (
                <span>Cập nhật mật khẩu</span>
              )}
            </button>
          </form>
        )}
      </div>
    </AuthShowcaseShell>
  );
};

export default ResetPass;
