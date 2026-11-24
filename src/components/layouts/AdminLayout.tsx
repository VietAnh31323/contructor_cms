"use client";

import { extractAuthFromToken } from "@/helper/permissions";
import { ROUTES } from "@/routes";
import { ThemeProvider } from "@mui/material/styles";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Header from "../template/Dasboard/Header";
import Sidebar from "../template/Dasboard/Sidebar";
import { createAppTheme } from "./theme";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dark, setDark] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("cms_dark_mode");
    if (saved === "true") {
      setDark(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cms_dark_mode", String(dark));
    }
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  const appTheme = useMemo(
    () => createAppTheme(dark ? "dark" : "light"),
    [dark]
  );

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
    <ThemeProvider theme={appTheme}>
      <div className="flex h-screen overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <aside className="flex-shrink-0 z-20">
          <Sidebar />
        </aside>

        <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
          <header className="flex-shrink-0 z-10">
            <Header toggleDark={() => setDark((prev) => !prev)} isDark={dark} />
          </header>

          <main
            className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-100 dark:bg-slate-950"
            style={{
              backgroundImage: dark
                ? undefined
                : "radial-gradient(at 0% 0%, rgba(59,130,246,0.07) 0, transparent 50%), radial-gradient(at 100% 0%, rgba(6,182,212,0.06) 0, transparent 45%)",
            }}
          >
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
