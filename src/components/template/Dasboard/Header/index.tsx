import { ROUTES } from "@/routes";
import {
  Cloud,
  ContentCopy,
  ContentCut,
  ContentPaste,
} from "@mui/icons-material";
import {
  Avatar,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Switch,
  Typography,
} from "@mui/material";
import Link from "next/link";
import React from "react";
import Person2Icon from "@mui/icons-material/Person2";
import PasswordIcon from "@mui/icons-material/Password";
import LanguageIcon from "@mui/icons-material/Language";
import LightModeIcon from "@mui/icons-material/LightMode";
export default function Header() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <div className="bg-[#0078D4] p-2 text-white flex justify-between">
        <Typography sx={{ textAlign: "center", margin: "auto 0" }}>
          Công ty cổ phần kiến trúc, xây dựng ABC
        </Typography>

        <Avatar onClick={handleClick} className="w-10 h-10 cursor-pointer">
          H
        </Avatar>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          // onClick={handleClose}
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
          <MenuItem>
            <ListItemIcon>
              <Person2Icon fontSize="medium" />
            </ListItemIcon>
            Thông tin cá nhân
          </MenuItem>

          <MenuItem>
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
          <MenuItem
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div className="flex items-center ">
              <ListItemIcon>
                <LightModeIcon fontSize="medium" />
              </ListItemIcon>
              Light Mode
            </div>

            <Switch size="medium" />
          </MenuItem>

          <Divider />

          <MenuItem sx={{ display: "flex", justifyContent: "center" }}>
            Đăng xuất
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}
