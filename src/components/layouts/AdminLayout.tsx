"use client";

import Sidebar from "../template/Dasboard/Sidebar";
import Header from "../template/Dasboard/Header";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dark, setDark] = useState(false);

  // Khi dark thay đổi → thêm class vào document.documentElement
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 shadow-md">
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
