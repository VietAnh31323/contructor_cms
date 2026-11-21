import { clearAuthStorage } from "@/config/axios";
import { extractAuthFromToken } from "@/helper/permissions";
import { ROUTES } from "@/routes";
import { Logout } from "@/service/Login/Logout";
import { toastSuccess } from "@/toast";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PasswordIcon from "@mui/icons-material/Password";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import SearchIcon from "@mui/icons-material/Search";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import router, { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import NotificationBell from "./NotificationBell";
import WeatherWidget from "./WeatherWidget";

const QUICK_NAV = [
  { label: "Dashboard & Báo cáo điều hành", path: ROUTES.DASHBOARD, group: "Tổng quan" },
  { label: "Danh sách dự án xây dựng", path: ROUTES.PROJECT, group: "Dự án" },
  { label: "Tiếp nhận / Thêm dự án mới", path: `${ROUTES.PROJECT}/addNew`, group: "Thao tác nhanh" },
  { label: "Hạng mục công trình (BOQ)", path: ROUTES.CATEGORY, group: "Dự án" },
  { label: "Thống kê thép kết cấu", path: ROUTES.STEELSTATISTICS, group: "Kỹ thuật" },
  { label: "Tạo bảng thống kê thép mới", path: ROUTES.STEELSTATISTICSNEW, group: "Thao tác nhanh" },
  { label: "Khách hàng & Pipeline (CRM)", path: ROUTES.CUSTOMER, group: "Kinh doanh" },
  { label: "Quản lý tiến độ thi công", path: ROUTES.PROGRESS_MANAGE, group: "Thi công" },
  { label: "Danh sách nhân sự", path: ROUTES.EMPLOYEE, group: "Nhân sự" },
  { label: "Quản lý tài khoản & phân quyền", path: ROUTES.ACCOUNT, group: "Hệ thống" },
  { label: "Nhật ký hoạt động (Audit Log)", path: ROUTES.AUDIT_LOG, group: "Hệ thống" },
];

function resolvePageTitle(pathname: string): string {
  if (pathname.startsWith(ROUTES.DASHBOARD)) return "Dashboard & Báo cáo";
  if (pathname.startsWith(ROUTES.PROJECT)) return "Quản lý Dự án";
  if (pathname.startsWith(ROUTES.CATEGORY)) return "Hạng mục Công trình";
  if (pathname.startsWith(ROUTES.STEELSTATISTICS)) return "Thống kê Thép";
  if (pathname.startsWith(ROUTES.CUSTOMER)) return "Quản lý Khách hàng";
  if (pathname.startsWith(ROUTES.PROGRESS_MANAGE) || pathname.startsWith(ROUTES.PROGRESS_PROJECT))
    return "Tiến độ Thi công";
  if (pathname.startsWith(ROUTES.EMPLOYEE)) return "Quản lý Nhân sự";
  if (pathname.startsWith(ROUTES.ACCOUNT)) return "Quản lý Tài khoản";
  if (pathname.startsWith(ROUTES.AUDIT_LOG)) return "Nhật ký Hệ thống";
  return "Constructor ERP";
}

export default function Header({
  toggleDark,
  isDark,
}: {
  toggleDark: () => void;
  isDark: boolean;
}) {
  const nextRouter = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [quickCreateEl, setQuickCreateEl] = useState<null | HTMLElement>(null);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState("");
  const open = Boolean(anchorEl);
  const queryClient = useQueryClient();

  const displayName = useMemo(() => {
    if (typeof window === "undefined") return "Admin";
    const info = extractAuthFromToken() as { username?: string };
    return info.username || localStorage.getItem("username") || "Người dùng";
  }, []);
  const initials = displayName.slice(0, 2).toUpperCase();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filteredNav = useMemo(() => {
    const q = cmdQuery.trim().toLowerCase();
    if (!q) return QUICK_NAV;
    return QUICK_NAV.filter(
      (n) =>
        n.label.toLowerCase().includes(q) || n.group.toLowerCase().includes(q)
    );
  }, [cmdQuery]);

  const { mutate: logoutMutate } = useMutation({
    mutationFn: Logout,
    onSuccess: () => {
      toastSuccess("Đăng xuất thành công");
      clearAuthStorage();
      queryClient.clear();
      router.push(ROUTES.LOGIN);
    },
    onError: () => {
      clearAuthStorage();
      queryClient.clear();
      router.push(ROUTES.LOGIN);
    },
  });

  const pageTitle = resolvePageTitle(nextRouter.pathname);

  return (
    <>
      <Box className="h-[68px] px-5 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 bg-white/85 dark:bg-slate-900/90 backdrop-blur-md">
        {/* Left: Current Module Title */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 8,
              height: 24,
              borderRadius: 4,
              background: "linear-gradient(180deg, #2563eb 0%, #06b6d4 100%)",
            }}
          />
          <Box>
            <Typography variant="subtitle1" fontWeight={800} sx={{ lineHeight: 1.2 }}>
              {pageTitle}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
              Công ty CP Kiến trúc &amp; Xây dựng Constructor
            </Typography>
          </Box>
        </Stack>

        {/* Center: Ctrl+K Command Palette Trigger */}
        <Box
          onClick={() => {
            setCmdQuery("");
            setCmdOpen(true);
          }}
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "space-between",
            width: 320,
            px: 1.8,
            py: 0.9,
            borderRadius: "12px",
            border: "1px solid",
            borderColor: isDark ? "rgba(255,255,255,0.12)" : "#e2e8f0",
            bgcolor: isDark ? "rgba(255,255,255,0.05)" : "#f8fafc",
            cursor: "pointer",
            transition: "all 0.15s",
            "&:hover": {
              borderColor: "#3b82f6",
              boxShadow: "0 2px 10px rgba(37,99,235,0.08)",
            },
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary" fontSize={13}>
              Tìm nhanh màn hình, chức năng...
            </Typography>
          </Stack>
          <Chip
            size="small"
            label="Ctrl K"
            sx={{
              height: 22,
              fontSize: 11,
              fontWeight: 700,
              bgcolor: isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0",
            }}
          />
        </Box>

        {/* Right: Weather, Quick Create, Theme Toggle, Notifications, User Profile */}
        <Stack direction="row" spacing={1.2} alignItems="center">
          <WeatherWidget />
          <Button
            size="small"
            variant="contained"
            startIcon={<AddCircleOutlineIcon fontSize="small" />}
            onClick={(e) => setQuickCreateEl(e.currentTarget)}
            sx={{
              display: { xs: "none", sm: "inline-flex" },
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 700,
              background: "linear-gradient(90deg, #2563eb 0%, #0284c7 100%)",
              boxShadow: "0 4px 12px rgba(37,99,235,0.28)",
            }}
          >
            Tạo nhanh
          </Button>

          <Tooltip title={isDark ? "Giao diện sáng" : "Giao diện tối"}>
            <IconButton
              onClick={toggleDark}
              sx={{
                bgcolor: isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(15, 23, 42, 0.04)",
                color: isDark ? "#fbbf24" : "#475569",
              }}
            >
              {isDark ? (
                <LightModeOutlinedIcon fontSize="small" />
              ) : (
                <DarkModeOutlinedIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>

          <NotificationBell />

          <Divider orientation="vertical" flexItem sx={{ my: 1.5, mx: 0.4 }} />

          <Box
            onClick={(e) => setAnchorEl(e.currentTarget)}
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Box sx={{ position: "relative" }}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  fontSize: 13,
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
                }}
              >
                {initials}
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
            </Box>
            <Box sx={{ display: { xs: "none", lg: "block" }, textAlign: "left" }}>
              <Typography
                variant="body2"
                fontWeight={700}
                sx={{ lineHeight: 1.2, maxWidth: 150 }}
                noWrap
              >
                {displayName}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                Trực tuyến
              </Typography>
            </Box>
            <KeyboardArrowDownIcon fontSize="small" sx={{ color: "text.secondary" }} />
          </Box>
        </Stack>
      </Box>

      {/* Quick Create Menu */}
      <Menu
        anchorEl={quickCreateEl}
        open={Boolean(quickCreateEl)}
        onClose={() => setQuickCreateEl(null)}
        PaperProps={{ sx: { width: 220, borderRadius: 2.5, mt: 1 } }}
      >
        <MenuItem
          onClick={() => {
            setQuickCreateEl(null);
            router.push(`${ROUTES.PROJECT}/addNew`);
          }}
        >
          + Dự án mới
        </MenuItem>
        <MenuItem
          onClick={() => {
            setQuickCreateEl(null);
            router.push(ROUTES.STEELSTATISTICSNEW);
          }}
        >
          + Bảng thống kê thép
        </MenuItem>
        <MenuItem
          onClick={() => {
            setQuickCreateEl(null);
            router.push(`${ROUTES.CUSTOMER}/addNew`);
          }}
        >
          + Khách hàng mới
        </MenuItem>
      </Menu>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          elevation: 4,
          sx: {
            width: 250,
            borderRadius: 2.5,
            mt: 1,
            border: "1px solid #e2e8f0",
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.2 }}>
          <Typography variant="caption" color="text.secondary">
            Tài khoản đăng nhập
          </Typography>
          <Typography variant="body2" fontWeight={700} noWrap>
            {displayName}
          </Typography>
        </Box>
        <Divider />

        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            router.push(ROUTES.INFORMATION);
          }}
        >
          <ListItemIcon>
            <Person2OutlinedIcon fontSize="small" />
          </ListItemIcon>
          Thông tin cá nhân
        </MenuItem>

        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            router.push(ROUTES.FORGOTPASS);
          }}
        >
          <ListItemIcon>
            <PasswordIcon fontSize="small" />
          </ListItemIcon>
          Đổi mật khẩu
        </MenuItem>

        <MenuItem
          sx={{ display: "flex", justifyContent: "space-between" }}
          onClick={toggleDark}
        >
          <Stack direction="row" alignItems="center">
            <ListItemIcon>
              {isDark ? (
                <DarkModeOutlinedIcon fontSize="small" color="primary" />
              ) : (
                <LightModeOutlinedIcon fontSize="small" />
              )}
            </ListItemIcon>
            <Typography variant="body2">
              {isDark ? "Chế độ tối" : "Chế độ sáng"}
            </Typography>
          </Stack>
          <Switch size="small" checked={isDark} onChange={toggleDark} />
        </MenuItem>

        <Divider />

        <MenuItem
          sx={{ color: "error.main", fontWeight: 600 }}
          onClick={() => logoutMutate({})}
        >
          <ListItemIcon>
            <LogoutOutlinedIcon fontSize="small" color="error" />
          </ListItemIcon>
          Đăng xuất
        </MenuItem>
      </Menu>

      {/* Ctrl+K Command Palette Dialog */}
      <Dialog
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}
      >
        <Box sx={{ p: 2, borderBottom: "1px solid #e2e8f0" }}>
          <TextField
            autoFocus
            fullWidth
            size="small"
            placeholder="Nhập tên màn hình hoặc chức năng (VD: dự án, thép, dashboard)..."
            value={cmdQuery}
            onChange={(e) => setCmdQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <DialogContent sx={{ p: 0, maxHeight: 360 }}>
          <List>
            {filteredNav.map((item) => (
              <ListItemButton
                key={item.path}
                onClick={() => {
                  setCmdOpen(false);
                  router.push(item.path);
                }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
                />
                <Chip size="small" label={item.group} variant="outlined" />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
}
