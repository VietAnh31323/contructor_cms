import Link from "next/link";
import { ROUTES } from "@/routes";
import Sidebar from "../template/Dasboard/Sidebar";
import Header from "../template/Dasboard/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="flex h-screen">
        <Sidebar />
        <main>{children}</main>
      </div>
    </div>
  );
}
