import React from "react";
import Link from "next/link";
import { ROUTES } from "@/routes";

interface AuthShowcaseShellProps {
  children: React.ReactNode;
  topActionHref?: string;
  topActionLabel?: string;
}

export const AuthShowcaseShell: React.FC<AuthShowcaseShellProps> = ({
  children,
  topActionHref = ROUTES.LANDING,
  topActionLabel = "Trang khách hàng",
}) => {
  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] text-[#18181B] flex flex-col lg:flex-row">
      {/* Left editorial architectural panel (desktop) */}
      <aside className="hidden lg:flex lg:w-[44%] xl:w-[42%] bg-[#141413] text-[#F4F4F5] flex-col justify-between p-12 xl:p-16 border-r border-[#27272A]">
        {/* Brand wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-[#F4F4F5] text-[#141413] flex items-center justify-center font-semibold text-sm tracking-tight">
            C
          </div>
          <span className="text-[15px] font-medium tracking-tight text-[#F4F4F5]">
            Constructor
          </span>
        </div>

        {/* Restrained architectural focal statement */}
        <div className="max-w-md space-y-8 my-auto">
          {/* Minimal 1px architectural elevation linework */}
          <svg
            viewBox="0 0 320 96"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-64 h-auto text-[#52525B]"
            aria-hidden="true"
          >
            <line x1="0" y1="95.5" x2="320" y2="95.5" stroke="currentColor" />
            <rect x="24" y="28" width="76" height="67" stroke="currentColor" />
            <rect x="100" y="8" width="96" height="87" stroke="#A1A1AA" />
            <rect x="196" y="44" width="84" height="51" stroke="currentColor" />
            <line x1="124" y1="8" x2="124" y2="95" stroke="currentColor" strokeDasharray="3 3" />
            <line x1="172" y1="8" x2="172" y2="95" stroke="currentColor" strokeDasharray="3 3" />
            <line x1="100" y1="36" x2="196" y2="36" stroke="currentColor" />
            <line x1="100" y1="64" x2="196" y2="64" stroke="currentColor" />
          </svg>

          <div className="space-y-3">
            <h2 className="text-2xl xl:text-[28px] font-medium tracking-tight leading-[1.25] text-[#FAFAFA]">
              Điều hành dự án xây dựng từ dự toán đến quyết toán.
            </h2>
            <p className="text-sm leading-relaxed text-[#A1A1AA]">
              Không gian làm việc thống nhất cho ban giám đốc, kỹ sư hiện trường,
              kế toán và bộ phận vật tư.
            </p>
          </div>
        </div>

        {/* Quiet footer */}
        <div className="flex items-center justify-between text-xs text-[#71717A] pt-6 border-t border-[#27272A]">
          <span>Constructor Operations</span>
          <span>Hệ thống nội bộ</span>
        </div>
      </aside>

      {/* Right clean form canvas */}
      <main className="flex-1 flex flex-col min-h-screen bg-[#F7F7F8]">
        {/* Top bar */}
        <header className="w-full px-6 sm:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="w-7 h-7 rounded-lg bg-[#18181B] text-[#FAFAFA] flex items-center justify-center font-semibold text-xs">
              C
            </div>
            <span className="text-sm font-medium tracking-tight text-[#18181B]">
              Constructor
            </span>
          </div>
          <div className="hidden lg:block" />

          <Link
            href={topActionHref}
            className="text-xs font-medium text-[#52525B] hover:text-[#18181B] px-3 py-1.5 rounded-full hover:bg-white/80 transition-colors"
          >
            {topActionLabel} →
          </Link>
        </header>

        {/* Centered soft-framed form card */}
        <div className="flex-1 flex items-center justify-center px-5 py-8 sm:px-10">
          <div className="w-full max-w-[430px] bg-[#FFFFFF] rounded-2xl border border-[#E4E4E7]/80 p-7 sm:p-9 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_16px_36px_-16px_rgba(0,0,0,0.08)]">
            {children}
          </div>
        </div>

        {/* Mobile footer */}
        <footer className="lg:hidden px-6 py-4 text-center text-xs text-[#A1A1AA]">
          Constructor Operations
        </footer>
      </main>
    </div>
  );
};
