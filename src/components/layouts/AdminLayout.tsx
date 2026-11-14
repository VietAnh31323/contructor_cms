"use client";

import Sidebar from "../template/Dasboard/Sidebar";
import Header from "../template/Dasboard/Header";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ROUTES } from "@/routes";
import { extractAuthFromToken } from "@/helper/permissions";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dark, setDark] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace(ROUTES.LOGIN);
      return;
    }

    const mustChange =
      localStorage.getItem("must_change_password") === "true" ||
      extractAuthFromToken().mustChangePassword;

    if (mustChange && router.pathname !== ROUTES.FORGOTPASS) {
      router.replace(ROUTES.FORGOTPASS);
    }
  }, [router.pathname]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 shadow-md z-30">
        <Header toggleDark={() => setDark((prev) => !prev)} isDark={dark} />
      </header>

      <div className="flex flex-1 pt-[56px] h-full overflow-hidden">
        <aside className="flex-shrink-0 bg-gray-100 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
          <Sidebar />
        </aside>

        <main className="flex-1 overflow-y-auto p-5 bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}
