import Link from "next/link";
import { useState } from "react";
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

  const handleToggleProject = () => setOpenProject(!openProject);

  return (
    <aside className="w-64 bg-white shadow-md h-screen">
      <MenuList className="p-2">
        {/* --- Trang chủ / Thống kê --- */}
        <Link href="/Dashboard">
          <ListItemButton>
            <ListItemIcon>
              <HomeOutlined className="text-gray-600" />
            </ListItemIcon>
            <ListItemText
              primary="Thống kê"
              className="text-gray-700 font-medium"
            />
          </ListItemButton>
        </Link>

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

        <Collapse in={openProject} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Link href="/projects/progress">
              <ListItemButton sx={{ pl: 6 }}>
                <ListItemIcon>
                  <TimelineOutlined
                    fontSize="small"
                    className="text-gray-500"
                  />
                </ListItemIcon>
                <ListItemText primary="Danh sách dự án" />
              </ListItemButton>
            </Link>

            <Link href="/projects/staff">
              <ListItemButton sx={{ pl: 6 }}>
                <ListItemIcon>
                  <PeopleAltOutlined
                    fontSize="small"
                    className="text-gray-500"
                  />
                </ListItemIcon>
                <ListItemText primary="Hạng mục" />
              </ListItemButton>
            </Link>

            <Link href="/projects/cost">
              <ListItemButton sx={{ pl: 6 }}>
                <ListItemIcon>
                  <AttachMoneyOutlined
                    fontSize="small"
                    className="text-gray-500"
                  />
                </ListItemIcon>
                <ListItemText primary="Thùng rác" />
              </ListItemButton>
            </Link>
          </List>
        </Collapse>

        {/* --- Nhân sự --- */}
        <Link href="/employees">
          <ListItemButton>
            <ListItemIcon>
              <PersonPinOutlined className="text-gray-600" />
            </ListItemIcon>
            <ListItemText
              primary="Nhân sự"
              className="text-gray-700 font-medium"
            />
          </ListItemButton>
        </Link>

        {/* --- Thống kê thép --- */}
        <Link href="/steel-statistics">
          <ListItemButton>
            <ListItemIcon>
              <AutoGraphOutlined className="text-gray-600" />
            </ListItemIcon>
            <ListItemText
              primary="Thống kê thép"
              className="text-gray-700 font-medium"
            />
          </ListItemButton>
        </Link>

        {/* --- Khách hàng --- */}
        <Link href="/customers">
          <ListItemButton>
            <ListItemIcon>
              <SupportAgentOutlined className="text-gray-600" />
            </ListItemIcon>
            <ListItemText
              primary="Khách hàng"
              className="text-gray-700 font-medium"
            />
          </ListItemButton>
        </Link>

        {/* --- Tiến độ dự án --- */}
        <Link href="/project-progress">
          <ListItemButton>
            <ListItemIcon>
              <AnalyticsOutlined className="text-gray-600" />
            </ListItemIcon>
            <ListItemText
              primary="Tiến độ dự án"
              className="text-gray-700 font-medium"
            />
          </ListItemButton>
        </Link>
      </MenuList>
    </aside>
  );
}
