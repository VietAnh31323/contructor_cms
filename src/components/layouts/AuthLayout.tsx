import Link from "next/link";
import { ROUTES } from "@/routes";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}

      {/* Content */}
      <main className="flex-1 bg-gray-100 ">{children}</main>
    </div>
  );
}
