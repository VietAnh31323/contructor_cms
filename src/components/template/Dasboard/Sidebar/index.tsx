"use client";

import { usePermission } from "@/components/hooks/permission/usePermission";
import { PERMISSIONS } from "@/helper/permissions";
import { ROUTES } from "@/routes";
import {
  AnalyticsOutlined,
  AutoGraphOutlined,
  ChevronLeft,
  ChevronRight,
  ConstructionOutlined,
  HistoryEduOutlined,
  HomeOutlined,
  PersonPinOutlined,
  SupportAgentOutlined,
} from "@mui/icons-material";
import { Box, Chip, Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import router from "next/router";
import { useState } from "react";
import { Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";

export default function AppSidebar() {
  const pathname = usePathname() || "";
  const [collapsed, setCollapsed] = useState(false);
  const { hasPermission } = usePermission();

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  const canViewProject = hasPermission([
    PERMISSIONS.PROJECT_VIEW,
    PERMISSIONS.PROJECT_CREATE,
    PERMISSIONS.PROJECT_UPDATE,
    PERMISSIONS.PROJECT_DELETE,
  ]);

  const canViewUser = hasPermission([
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.USER_MANAGE,
  ]);

  const canViewSteel = hasPermission([
    PERMISSIONS.MATERIAL_VIEW,
    PERMISSIONS.MATERIAL_MANAGE,
    PERMISSIONS.PROJECT_VIEW,
  ]);

  const canCreateSteel = hasPermission([
    PERMISSIONS.MATERIAL_MANAGE,
    PERMISSIONS.PROJECT_CREATE,
    PERMISSIONS.PROJECT_UPDATE,
  ]);

  const canViewCustomer = hasPermission([
    PERMISSIONS.CUSTOMER_VIEW,
    PERMISSIONS.CUSTOMER_MANAGE,
  ]);

  const canViewProgress = hasPermission([
    PERMISSIONS.PROGRESS_VIEW,
    PERMISSIONS.PROGRESS_UPDATE,
    PERMISSIONS.TASK_VIEW,
    PERMISSIONS.TASK_UPDATE,
  ]);

  const canViewAuditLog = hasPermission([PERMISSIONS.AUDIT_LOG_VIEW]);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(180deg, #090d16 0%, #0f172a 55%, #172554 100%)",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        position: "relative",
      }}
    >
      <Sidebar
        collapsed={collapsed}
        width="264px"
        collapsedWidth="78px"
        backgroundColor="transparent"
        rootStyles={{
          flex: 1,
          borderRight: "none",
          color: "#cbd5e1",
          overflowY: "auto",
        }}
      >
        {/* Brand Header */}
        <Box
          sx={{
            height: 68,
            px: collapsed ? 1.5 : 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            background:
              "radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 70%)",
          }}
        >
          {!collapsed && (
            <Box
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => router.push(ROUTES.DASHBOARD)}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "11px",
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontWeight: 900,
                  fontSize: 16,
                  boxShadow: "0 6px 18px rgba(59,130,246,0.45)",
                }}
              >
                C
              </Box>
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight={800}
                  sx={{ color: "#ffffff", lineHeight: 1.1, letterSpacing: 0.4 }}
                >
                  CONSTRUCTOR
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "#60a5fa", fontSize: 10, fontWeight: 700, letterSpacing: 1 }}
                >
                  ERP THI CÔNG 2.0
                </Typography>
              </Box>
            </Box>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition cursor-pointer"
          >
            {collapsed ? (
              <ChevronRight fontSize="small" />
            ) : (
              <ChevronLeft fontSize="small" />
            )}
          </button>
        </Box>

        {!collapsed && (
          <Typography
            variant="caption"
            sx={{
              display: "block",
              px: 2.5,
              pt: 2.2,
              pb: 0.6,
              color: "#64748b",
              fontWeight: 800,
              fontSize: 10,
              letterSpacing: 1.2,
            }}
          >
            ĐIỀU HÀNH &amp; DỰ ÁN
          </Typography>
        )}

        <Menu
          menuItemStyles={{
            button: ({ active, level }) => ({
              margin: "3px 10px",
              borderRadius: "11px",
              padding: level === 0 ? "9px 12px" : "7px 12px",
              fontSize: "13.5px",
              fontWeight: active ? 700 : 500,
              color: active ? "#ffffff" : "#cbd5e1",
              background: active
                ? "linear-gradient(90deg, #2563eb 0%, #0ea5e9 100%)"
                : "transparent",
              boxShadow: active ? "0 6px 16px rgba(37,99,235,0.4)" : "none",
              transition: "all 0.16s ease",
              "&:hover": {
                background: active
                  ? "linear-gradient(90deg, #2563eb 0%, #0ea5e9 100%)"
                  : "rgba(255,255,255,0.08)",
                color: "#ffffff",
                transform: collapsed ? "none" : "translateX(2px)",
              },
            }),
            subMenuContent: {
              backgroundColor: "rgba(9, 13, 22, 0.72)",
              paddingLeft: collapsed ? "0px" : "8px",
            },
            icon: ({ active }) => ({
              color: active ? "#ffffff" : "#94a3b8",
              minWidth: 30,
            }),
          }}
        >
          <MenuItem
            icon={<HomeOutlined fontSize="small" />}
            onClick={() => router.push(ROUTES.DASHBOARD)}
            active={isActive(ROUTES.DASHBOARD)}
          >
            Dashboard &amp; Báo cáo
          </MenuItem>

          {canViewProject && (
            <SubMenu
              icon={<ConstructionOutlined fontSize="small" />}
              label="Dự án xây dựng"
              defaultOpen={true}
            >
              <MenuItem
                onClick={() => router.push(ROUTES.PROJECT)}
                active={isActive(ROUTES.PROJECT)}
              >
                Danh sách dự án
              </MenuItem>
              <MenuItem
                onClick={() => router.push(ROUTES.CATEGORY)}
                active={isActive(ROUTES.CATEGORY)}
              >
                Hạng mục dự án
              </MenuItem>
            </SubMenu>
          )}

          {canViewProgress && (
            <SubMenu
              icon={<AnalyticsOutlined fontSize="small" />}
              label="Tiến độ dự án"
            >
              <MenuItem
                onClick={() => router.push(ROUTES.PROGRESS_MANAGE)}
                active={isActive(ROUTES.PROGRESS_MANAGE)}
              >
                Danh sách tiến độ
              </MenuItem>
              <MenuItem
                onClick={() => router.push(ROUTES.PROGRESS_PROJECT)}
                active={isActive(ROUTES.PROGRESS_PROJECT)}
              >
                Quản lý tiến trình
              </MenuItem>
            </SubMenu>
          )}

          {canViewSteel && (
            <SubMenu
              icon={<AutoGraphOutlined fontSize="small" />}
              label="Thống kê thép"
            >
              <MenuItem
                onClick={() => router.push(ROUTES.STEELSTATISTICS)}
                active={pathname === ROUTES.STEELSTATISTICS}
              >
                Dự án thống kê thép
              </MenuItem>
              {canCreateSteel && (
                <MenuItem
                  onClick={() => router.push(ROUTES.STEELSTATISTICSNEW)}
                  active={pathname === ROUTES.STEELSTATISTICSNEW}
                >
                  Thêm dự án thống kê
                </MenuItem>
              )}
            </SubMenu>
          )}

          {canViewCustomer && (
            <MenuItem
              icon={<SupportAgentOutlined fontSize="small" />}
              onClick={() => router.push(ROUTES.CUSTOMER)}
              active={isActive(ROUTES.CUSTOMER)}
            >
              Khách hàng
            </MenuItem>
          )}

          {canViewUser && (
            <SubMenu
              icon={<PersonPinOutlined fontSize="small" />}
              label="Nhân sự & Tài khoản"
            >
              <MenuItem
                onClick={() => router.push(ROUTES.EMPLOYEE)}
                active={isActive(ROUTES.EMPLOYEE)}
              >
                Danh sách nhân sự
              </MenuItem>
              <MenuItem
                onClick={() => router.push(ROUTES.ACCOUNT)}
                active={isActive(ROUTES.ACCOUNT)}
              >
                Quản lý tài khoản
              </MenuItem>
            </SubMenu>
          )}

          {canViewAuditLog && (
            <MenuItem
              icon={<HistoryEduOutlined fontSize="small" />}
              onClick={() => router.push(ROUTES.AUDIT_LOG)}
              active={isActive(ROUTES.AUDIT_LOG)}
            >
              Nhật ký hoạt động
            </MenuItem>
          )}
        </Menu>
      </Sidebar>

      {/* Bottom Workspace Status Card */}
      {!collapsed && (
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            bgcolor: "rgba(255,255,255,0.03)",
          }}
        >
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              background:
                "linear-gradient(135deg, rgba(37,99,235,0.22) 0%, rgba(6,182,212,0.14) 100%)",
              border: "1px solid rgba(96,165,250,0.25)",
            }}
          >
            <Box className="flex items-center justify-between mb-1">
              <Typography variant="caption" fontWeight={700} color="#e2e8f0">
                Hệ thống trực tuyến
              </Typography>
              <Chip
                size="small"
                label="v2.0"
                sx={{
                  height: 18,
                  fontSize: 10,
                  fontWeight: 800,
                  bgcolor: "rgba(16,185,129,0.2)",
                  color: "#6ee7b7",
                }}
              />
            </Box>
            <Typography variant="caption" sx={{ color: "#94a3b8", fontSize: 11 }}>
              Nhấn Ctrl + K để tìm nhanh phân hệ
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
