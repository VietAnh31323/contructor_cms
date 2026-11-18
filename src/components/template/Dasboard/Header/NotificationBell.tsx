import {
  markAllNotificationsRead,
  markNotificationRead,
  NotificationItem,
  NotificationType,
  useMyNotificationsQuery,
  useMyUnreadCountQuery,
} from "@/service/constructor/Notification";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import ScheduleSendOutlinedIcon from "@mui/icons-material/ScheduleSendOutlined";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import {
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  Popover,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import router from "next/router";
import React, { useState } from "react";

const TYPE_META: Record<NotificationType, { icon: React.ReactNode; color: string }> = {
  TASK_OVERDUE: { icon: <WarningAmberRoundedIcon fontSize="small" />, color: "#dc2626" },
  TASK_SUBMITTED: { icon: <ScheduleSendOutlinedIcon fontSize="small" />, color: "#7c3aed" },
  TASK_APPROVED: { icon: <AssignmentTurnedInOutlinedIcon fontSize="small" />, color: "#16a34a" },
  TASK_RETURNED: { icon: <UndoRoundedIcon fontSize="small" />, color: "#ea580c" },
  TASK_MENTION: { icon: <AlternateEmailIcon fontSize="small" />, color: "#2563eb" },
  TASK_COMMENT: { icon: <ChatBubbleOutlineIcon fontSize="small" />, color: "#0891b2" },
  TASK_SITE_REPORT: { icon: <PhotoCameraOutlinedIcon fontSize="small" />, color: "#b45309" },
};

/**
 * Chuông thông báo: cảnh báo trễ hạn (2.26), trình duyệt / duyệt / trả lại (2.23),
 * báo cáo hiện trường (2.25), @mention & bình luận (2.27).
 */
export default function NotificationBell() {
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const open = Boolean(anchorEl);

  const { data: unread = 0 } = useMyUnreadCountQuery();
  const { data: page, isLoading } = useMyNotificationsQuery(unreadOnly, open);
  const items: NotificationItem[] = page?.content ?? [];

  const refresh = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["my-notifications-unread"] }),
      queryClient.invalidateQueries({ queryKey: ["my-notifications"] }),
    ]);

  const handleOpenItem = async (n: NotificationItem) => {
    try {
      if (!n.isRead) await markNotificationRead(n.id);
    } catch {
      // bỏ qua lỗi đánh dấu đã đọc
    }
    refresh();
    setAnchorEl(null);
    if (n.link) router.push(n.link);
  };

  const handleReadAll = async () => {
    try {
      await markAllNotificationsRead();
    } finally {
      refresh();
    }
  };

  return (
    <>
      <Tooltip title="Thông báo">
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ color: "white" }}>
          <Badge badgeContent={unread} color="error" max={99}>
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { width: 400, maxWidth: "95vw", borderRadius: 2, mt: 1 } }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2, pt: 1.5 }}>
          <Typography variant="subtitle1" fontWeight={800}>
            Thông báo
          </Typography>
          <Button size="small" onClick={handleReadAll} disabled={unread === 0} sx={{ textTransform: "none" }}>
            Đánh dấu đã đọc tất cả
          </Button>
        </Stack>
        <Tabs value={unreadOnly ? 1 : 0} onChange={(_, v) => setUnreadOnly(v === 1)} sx={{ px: 1, minHeight: 36 }}>
          <Tab label="Tất cả" sx={{ textTransform: "none", minHeight: 36 }} />
          <Tab label={`Chưa đọc (${unread})`} sx={{ textTransform: "none", minHeight: 36 }} />
        </Tabs>
        <Divider />
        <Box sx={{ maxHeight: 440, overflowY: "auto" }}>
          {isLoading ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 3, textAlign: "center" }}>
              Đang tải...
            </Typography>
          ) : items.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 3, textAlign: "center" }}>
              Không có thông báo nào.
            </Typography>
          ) : (
            items.map((n) => {
              const meta = TYPE_META[n.type] ?? TYPE_META.TASK_COMMENT;
              return (
                <Box
                  key={n.id}
                  onClick={() => handleOpenItem(n)}
                  sx={{
                    px: 2,
                    py: 1.25,
                    display: "flex",
                    gap: 1.25,
                    cursor: "pointer",
                    bgcolor: n.isRead ? "#fff" : "#eff6ff",
                    borderBottom: "1px solid #f1f5f9",
                    "&:hover": { bgcolor: "#f8fafc" },
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      flexShrink: 0,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: meta.color,
                      bgcolor: `${meta.color}1a`,
                    }}
                  >
                    {meta.icon}
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={n.isRead ? 500 : 700} sx={{ lineHeight: 1.35 }}>
                      {n.title}
                    </Typography>
                    {n.content && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {n.content}
                      </Typography>
                    )}
                    <Typography variant="caption" sx={{ color: meta.color, fontWeight: 600, display: "block" }}>
                      {n.typeLabel} • {n.createdAt ? moment(n.createdAt).format("DD/MM HH:mm") : ""}
                    </Typography>
                  </Box>
                </Box>
              );
            })
          )}
        </Box>
      </Popover>
    </>
  );
}
