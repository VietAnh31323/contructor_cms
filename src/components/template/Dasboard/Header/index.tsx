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
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { RequestBody as RequestDetail } from "@/service/constructor/Account/getDetail/type";
import React from "react";
import router from "next/router";
import { useMutation } from "@tanstack/react-query";
import { Logout } from "@/service/Login/Logout";
import { toastError, toastSuccess } from "@/toast";
import { useFormCustom } from "@/lib/form";
import { useAccountDetailQuery } from "@/service/constructor/Account/getDetail";
const defaultValues = {};
export default function Header({
  toggleDark,
  isDark,
}: {
  toggleDark: () => void;
  isDark: boolean;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const methodForm = useFormCustom<RequestDetail["GET"]>({
    defaultValues,
  });
  const { data, isLoading, refetch } = useAccountDetailQuery();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);
  const { mutate: logoutMutate } = useMutation({
    mutationFn: Logout,
    onSuccess: () => {
      toastSuccess("Đăng xuất thành công");

      localStorage.removeItem("access_token");

      router.push(ROUTES.LOGIN);
    },
    onError: (err: any) => {
      toastError(err?.message || "Lỗi đăng xuất");
    },
  });

  return (
    <div className="bg-[#0078D4] p-2 px-5 text-white flex justify-between items-center">
      <Typography
        sx={{
          fontWeight: 500,
          animation: "fadeIn 0.6s ease-in-out",
        }}
      >
        Công ty cổ phần kiến trúc, xây dựng ABC
      </Typography>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      <div
        className="relative flex items-center gap-3 cursor-pointer"
        onClick={handleClick}
      >
        <Avatar
          src={data?.data?.avatar}
          className="w-10 h-10"
          sx={{
            boxShadow: 5,
            border: "3px solid #fff",
          }}
        ></Avatar>

        <KeyboardArrowDownIcon
          sx={{
            fontSize: 20,
            color: "white",
          }}
        />

        <span
          className="absolute bottom-0 right-7 w-3 h-3 bg-green-500 rounded-full ring-2 "
          style={{ border: "1px solid #fff" }}
        ></span>
      </div>

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
          onClick={() => logoutMutate({})}
        >
          Đăng xuất
        </MenuItem>
      </Menu>
    </div>
  );
}
