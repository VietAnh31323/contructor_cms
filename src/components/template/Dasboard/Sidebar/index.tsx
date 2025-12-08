"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";

import {
  HomeOutlined,
  ConstructionOutlined,
  PersonPinOutlined,
  AutoGraphOutlined,
  SupportAgentOutlined,
  AnalyticsOutlined,
  MenuOpen,
} from "@mui/icons-material";
import { ROUTES } from "@/routes";
import router from "next/router";

export default function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // check active
  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  return (
    <Sidebar
      collapsed={collapsed}
      backgroundColor="#ffffff"
      style={{ height: "100vh", borderRight: "1px solid #e5e7eb" }}
    >
      {/* Nút thu gọn */}
      <div className="flex justify-end p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-gray-200"
        >
          <MenuOpen />
        </button>
      </div>

      <Menu
        menuItemStyles={{
          button: ({ active }) => ({
            backgroundColor: active ? "#f0f4ff" : "transparent",
            color: active ? "#0078D4" : "#374151",
            borderLeft: active ? "6px solid #0078D4" : "none",
            "&:hover": { backgroundColor: "#e5e7eb" },
          }),
        }}
      >
        {/* --- Dashboard --- */}
        <MenuItem
          icon={<HomeOutlined />}
          onClick={() => {
            router.push(ROUTES.DASHBOARD);
          }}
          active={isActive(ROUTES.DASHBOARD)}
        >
          Thống kê
        </MenuItem>

        {/* --- Dự án xây dựng (Submenu) --- */}
        <SubMenu
          icon={<ConstructionOutlined />}
          label="Dự án xây dựng"
          defaultOpen={
            pathname.startsWith("/projects") ||
            pathname.startsWith("/Constructor")
          }
        >
          <MenuItem
            component={<Link href="/Constructor/Project" />}
            active={isActive("/Constructor/Project")}
          >
            Danh sách dự án
          </MenuItem>

          <MenuItem
            onClick={() => {
              router.push(ROUTES.CATEGORY);
            }}
            active={isActive(ROUTES.CATEGORY)}
          >
            Hạng mục dự án
          </MenuItem>

          <MenuItem
            component={<Link href="/projects/cost" />}
            active={isActive("/projects/cost")}
          >
            Thùng rác
          </MenuItem>
        </SubMenu>

        {/* --- Nhân sự --- */}
        <SubMenu icon={<PersonPinOutlined />} label="Nhân sự">
          <MenuItem
            onClick={() => {
              router.push(ROUTES.EMPLOYEE);
            }}
            active={isActive(ROUTES.EMPLOYEE)}
          >
            Danh sách nhân sự
          </MenuItem>
          <MenuItem
            onClick={() => {
              router.push(ROUTES.ACCOUNT);
            }}
            active={isActive(ROUTES.ACCOUNT)}
          >
            Quản lý tài khoản
          </MenuItem>
        </SubMenu>

        {/* --- Thống kê thép --- */}
        <MenuItem
          icon={<AutoGraphOutlined />}
          component={<Link href="/steel-statistics" />}
          active={isActive("/steel-statistics")}
        >
          Thống kê thép
        </MenuItem>

        {/* --- Khách hàng --- */}
        <MenuItem
          icon={<SupportAgentOutlined />}
          onClick={() => {
            router.push(ROUTES.CUSTOMER);
          }}
          active={isActive(ROUTES.CUSTOMER)}
        >
          Khách hàng
        </MenuItem>

        {/* --- Tiến độ dự án --- */}
        <SubMenu icon={<AnalyticsOutlined />} label="Tiến độ dự án">
          <MenuItem
            component={<Link href="/project-progress" />}
            active={isActive("/project-progress")}
          >
            Danh sách tiến độ dự án
          </MenuItem>
          <MenuItem
            onClick={() => {
              router.push(ROUTES.PROGRESS_PROJECT);
            }}
            active={isActive(ROUTES.PROGRESS_PROJECT)}
          >
            Quản lý tiến trình
          </MenuItem>
        </SubMenu>
      </Menu>
    </Sidebar>
  );
}
