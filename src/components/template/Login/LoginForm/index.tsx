import React, { useState } from "react";
import { useRouter } from "next/router";
import CoreInput from "@/components/atoms/CoreInput";
import CoreAutocomplete from "@/components/atoms/CoreAutocomplete";
import { ROUTES } from "@/routes";
import { AuthShowcaseShell } from "../AuthShowcaseShell";
import { authFieldSx } from "../authFieldSx";
import { useLoginForm } from "./useLoginForm";

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

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const [values, handle] = useLoginForm();
  const { control, isPending } = values;
  const { onSubmit } = handle;

  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);

  return (
    <AuthShowcaseShell
      topActionHref={ROUTES.LANDING}
      topActionLabel="Cổng khách hàng"
    >
      <div className="space-y-8">
        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-[#18181B]">
            Đăng nhập
          </h1>
          <p className="text-sm text-[#71717A]">
            Sử dụng tài khoản nội bộ được cấp để truy cập hệ thống.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
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

            <CoreInput
              control={control}
              name="password"
              label="Mật khẩu"
              placeholder="Nhập mật khẩu"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              sx={authFieldSx}
              required
              rules={{ required: "Vui lòng nhập mật khẩu" }}
              InputProps={{
                endAdornment: (
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    className="p-1.5 mr-0.5 rounded-lg text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F4F5] transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                ),
              }}
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
              required
              rules={{ required: "Vui lòng chọn vai trò truy cập" }}
            />
          </div>

          {/* Terms & Forgot link */}
          <div className="flex items-center justify-between gap-3 pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#52525B]">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="h-4 w-4 rounded-md border-[#D4D4D8] accent-[#18181B] cursor-pointer"
              />
              <span>Đồng ý với điều khoản sử dụng</span>
            </label>

            <button
              type="button"
              onClick={() => router.push(ROUTES.RESET_PASSWORD)}
              className="text-xs font-medium text-[#18181B] hover:underline underline-offset-4 whitespace-nowrap cursor-pointer"
            >
              Quên mật khẩu?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending || !agreed}
            className="w-full h-11 rounded-xl bg-[#18181B] hover:bg-[#27272A] active:scale-[0.99] disabled:bg-[#E4E4E7] disabled:text-[#A1A1AA] text-[#FAFAFA] text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <SpinnerIcon />
                <span>Đang đăng nhập...</span>
              </>
            ) : (
              <span>Đăng nhập</span>
            )}
          </button>
        </form>

        {/* Subtle footer note */}
        <p className="text-xs text-[#A1A1AA] pt-2 border-t border-[#F4F4F5]">
          Gặp sự cố đăng nhập? Liên hệ quản trị viên CNTT của doanh nghiệp để
          được cấp lại quyền truy cập.
        </p>
      </div>
    </AuthShowcaseShell>
  );
};

export default LoginForm;
