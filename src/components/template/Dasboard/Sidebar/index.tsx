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
  const isActive = (path: string) => {
    if (!pathname) return false;

    return pathname === path || pathname.startsWith(path + "/");
  };

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
          defaultOpen={true}
        >
          <MenuItem
            onClick={() => {
              router.push(ROUTES.PROJECT);
            }}
            active={isActive(ROUTES.PROJECT)}
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
        <SubMenu icon={<AutoGraphOutlined />} label="Thống kê thép">
          <MenuItem
            onClick={() => router.push(ROUTES.STEELSTATISTICS)}
            active={pathname === ROUTES.STEELSTATISTICS}
          >
            Dự án thống kê thép
          </MenuItem>
          <MenuItem
            onClick={() => router.push(ROUTES.STEELCATEGORY)}
            active={pathname === ROUTES.STEELCATEGORY}
          >
            Quản lý kiểu thanh thép
          </MenuItem>
          <MenuItem
            onClick={() => router.push(ROUTES.STEELSTATISTICSNEW)}
            active={pathname === ROUTES.STEELSTATISTICSNEW}
          >
            Thêm dự án thống kê
          </MenuItem>
        </SubMenu>

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
            onClick={() => {
              router.push(ROUTES.PROGRESS_MANAGE);
            }}
            active={isActive(ROUTES.PROGRESS_MANAGE)}
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
