"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  MenuList,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  HomeOutlined,
  ConstructionOutlined,
  PersonPinOutlined,
  AutoGraphOutlined,
  SupportAgentOutlined,
  AnalyticsOutlined,
  TimelineOutlined,
  PeopleAltOutlined,
  AttachMoneyOutlined,
} from "@mui/icons-material";

export default function Sidebar() {
  const [openProject, setOpenProject] = useState(false);
  const pathname = usePathname();

  const handleToggleProject = () => setOpenProject(!openProject);
  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  useEffect(() => {
    if (pathname.startsWith("/projects")) setOpenProject(true);
  }, [pathname]);
  console.log("Sidebar render");
  return (
    <aside className="w-60 bg-white shadow-md h-screen overflow-y-auto">
      <MenuList className="p-2">
        {/* --- Trang chủ / Thống kê --- */}
        <ListItemButton
          component={Link}
          href="/Dashboard"
          sx={{
            backgroundColor: isActive("/Dashboard") ? "#f0f4ff" : "transparent",
            color: isActive("/Dashboard") ? "#002C66" : "#374151",
            borderLeft: isActive("/Dashboard") ? "7px solid #002C66" : "none",
            "&:hover": { backgroundColor: "#e5e7eb" },
          }}
        >
          <ListItemIcon>
            <HomeOutlined
              className={
                isActive("/Dashboard") ? "text-[#002C66]" : "text-gray-600"
              }
            />
          </ListItemIcon>
          <ListItemText primary="Thống kê" />
        </ListItemButton>

        {/* --- Dự án (có submenu) --- */}
        <ListItemButton onClick={handleToggleProject}>
          <ListItemIcon>
            <ConstructionOutlined className="text-gray-600" />
          </ListItemIcon>
          <ListItemText
            primary="Dự án xây dựng"
            className="text-gray-700 font-medium"
          />
          {openProject ? (
            <ExpandLess className="text-gray-600" />
          ) : (
            <ExpandMore className="text-gray-600" />
          )}
        </ListItemButton>

        <Collapse in={openProject} unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              component={Link}
              href="/Constructor/Project"
              sx={{
                pl: 6,
                backgroundColor: isActive("/Constructor/Project")
                  ? "#f0f4ff"
                  : "transparent",
                color: isActive("/Constructor/Project") ? "#002C66" : "#374151",
                borderLeft: isActive("/Constructor/Project")
                  ? "7px solid #002C66"
                  : "none",
              }}
            >
              <ListItemText primary="Danh sách" />
            </ListItemButton>

            <ListItemButton
              component={Link}
              href="/Constructor/Category"
              sx={{
                pl: 6,
                backgroundColor: isActive("/Constructor/Category")
                  ? "#f0f4ff"
                  : "transparent",
                color: isActive("/Constructor/Category")
                  ? "#002C66"
                  : "#374151",
                borderLeft: isActive("/Constructor/Category")
                  ? "7px solid #002C66"
                  : "none",
              }}
            >
              <ListItemText primary="Hạng mục" />
            </ListItemButton>

            <ListItemButton
              component={Link}
              href="/projects/cost"
              sx={{
                pl: 6,
                backgroundColor: isActive("/projects/cost")
                  ? "#f0f4ff"
                  : "transparent",
                color: isActive("/projects/cost") ? "#002C66" : "#374151",
                borderLeft: isActive("/projects/cost")
                  ? "7px solid #002C66"
                  : "none",
              }}
            >
              <ListItemText primary="Thùng rác" />
            </ListItemButton>
          </List>
        </Collapse>

        {/* --- Nhân sự --- */}
        <ListItemButton
          component={Link}
          href="/Constructor/Employee"
          sx={{
            backgroundColor: isActive("/Constructor/Employee")
              ? "#f0f4ff"
              : "transparent",
            color: isActive("/Constructor/Employee") ? "#002C66" : "#374151",
            borderLeft: isActive("/Constructor/Employee")
              ? "7px solid #002C66"
              : "none",
          }}
        >
          <ListItemIcon>
            <PersonPinOutlined
              className={
                isActive("/Employee") ? "text-[#002C66]" : "text-gray-600"
              }
            />
          </ListItemIcon>
          <ListItemText primary="Nhân sự" />
        </ListItemButton>

        {/* --- Thống kê thép --- */}
        <ListItemButton
          component={Link}
          href="/steel-statistics"
          sx={{
            backgroundColor: isActive("/steel-statistics")
              ? "#f0f4ff"
              : "transparent",
            color: isActive("/steel-statistics") ? "#002C66" : "#374151",
            borderLeft: isActive("/steel-statistics")
              ? "7px solid #002C66"
              : "none",
          }}
        >
          <ListItemIcon>
            <AutoGraphOutlined
              className={
                isActive("/steel-statistics")
                  ? "text-[#002C66]"
                  : "text-gray-600"
              }
            />
          </ListItemIcon>
          <ListItemText primary="Thống kê thép" />
        </ListItemButton>

        {/* --- Khách hàng --- */}
        <ListItemButton
          component={Link}
          href="/Constructor/Customer"
          sx={{
            backgroundColor: isActive("/Constructor/Customer")
              ? "#f0f4ff"
              : "transparent",
            color: isActive("/Constructor/Customer") ? "#002C66" : "#374151",
            borderLeft: isActive("/Constructor/Customer")
              ? "7px solid #002C66"
              : "none",
          }}
        >
          <ListItemIcon>
            <SupportAgentOutlined
              className={
                isActive("/Constructor/Customer")
                  ? "text-[#002C66]"
                  : "text-gray-600"
              }
            />
          </ListItemIcon>
          <ListItemText primary="Khách hàng" />
        </ListItemButton>

        {/* --- Tiến độ dự án --- */}
        <ListItemButton
          component={Link}
          href="/project-progress"
          sx={{
            backgroundColor: isActive("/project-progress")
              ? "#f0f4ff"
              : "transparent",
            color: isActive("/project-progress") ? "#002C66" : "#374151",
            borderLeft: isActive("/project-progress")
              ? "7px solid #002C66"
              : "none",
          }}
        >
          <ListItemIcon>
            <AnalyticsOutlined
              className={
                isActive("/project-progress")
                  ? "text-[#002C66]"
                  : "text-gray-600"
              }
            />
          </ListItemIcon>
          <ListItemText primary="Tiến độ dự án" />
        </ListItemButton>
      </MenuList>
    </aside>
  );
}
