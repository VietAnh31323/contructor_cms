import Sidebar from "../template/Dasboard/Sidebar";
import Header from "../template/Dasboard/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <Header />
      </header>

      <div className="flex flex-1 pt-[64px] h-full overflow-hidden">
        <aside className="w-64 flex-shrink-0 bg-gray-100 border-r">
          <Sidebar />
        </aside>
        <main className="flex-1 overflow-y-auto p-5 ">{children}</main>
      </div>
    </div>
  );
}
