import { ROUTES } from "@/routes";
import {
  Avatar,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Switch,
  Typography,
} from "@mui/material";

import Person2Icon from "@mui/icons-material/Person2";
import PasswordIcon from "@mui/icons-material/Password";
import LanguageIcon from "@mui/icons-material/Language";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

import React from "react";
import router from "next/router";

export default function Header({
  toggleDark,
  isDark,
}: {
  toggleDark: () => void;
  isDark: boolean;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  return (
    <div className="bg-[#0078D4] p-2 text-white flex justify-between items-center">
      <Typography sx={{ fontWeight: 500 }}>
        Công ty cổ phần kiến trúc, xây dựng ABC
      </Typography>

      <Avatar onClick={handleClick} className="w-10 h-10 cursor-pointer">
        H
      </Avatar>

      {/* --- MENU --- */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            width: 260,
            borderRadius: 2,
            mt: 1.5,
            overflow: "visible",
          },
        }}
      >
        <MenuItem onClick={() => router.push(ROUTES.INFORMATION)}>
          <ListItemIcon>
            <Person2Icon fontSize="medium" />
          </ListItemIcon>
          Thông tin cá nhân
        </MenuItem>

        <MenuItem onClick={() => router.push(ROUTES.FORGOTPASS)}>
          <ListItemIcon>
            <PasswordIcon fontSize="medium" />
          </ListItemIcon>
          Đổi mật khẩu
        </MenuItem>

        <MenuItem>
          <ListItemIcon>
            <LanguageIcon fontSize="medium" />
          </ListItemIcon>
          Ngôn ngữ
        </MenuItem>

        {/* ---------- DARK MODE ---------- */}
        <MenuItem
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className="flex items-center gap-2">
            <ListItemIcon>
              {isDark ? (
                <DarkModeIcon className="text-[#0078D4]" />
              ) : (
                <LightModeIcon />
              )}
            </ListItemIcon>

            <span>{isDark ? "Dark Mode" : "Light Mode"}</span>
          </div>

          <Switch edge="end" checked={isDark} onChange={toggleDark} />
        </MenuItem>

        <Divider />

        <MenuItem
          sx={{ display: "flex", justifyContent: "center", color: "#0078D4" }}
        >
          Đăng xuất
        </MenuItem>
      </Menu>
    </div>
  );
}
