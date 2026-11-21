import { WHITE } from "@/helper/colors";
import {
  markAllNotificationsRead,
  markNotificationRead,
  NotificationItem,
  useMyNotificationsQuery,
  useMyUnreadCountQuery,
} from "@/service/constructor/Notification";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  Badge,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItemButton,
  Menu,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useRouter } from "next/router";
import { useState } from "react";

export const Notifications = ({ numberUnRead: _ignored }: { numberUnRead?: number }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [tab, setTab] = useState<"ALL" | "UNREAD">("ALL");

  const open = Boolean(anchorEl);
  const { data: unreadCount = 0 } = useMyUnreadCountQuery();
  const { data: notifPage, isLoading } = useMyNotificationsQuery(
    tab === "UNREAD",
    open
  );
  const items: NotificationItem[] = notifPage?.content ?? [];

  const refreshAll = () => {
    queryClient.invalidateQueries({ queryKey: ["my-notifications-unread"] });
    queryClient.invalidateQueries({ queryKey: ["my-notifications"] });
  };

  const handleClickItem = async (item: NotificationItem) => {
    if (!item.isRead) {
      try {
        await markNotificationRead(item.id);
        refreshAll();
      } catch {
        // ignore
      }
    }
    setAnchorEl(null);
    if (item.link) {
      router.push(item.link);
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllNotificationsRead();
      refreshAll();
    } catch {
      // ignore
    }
  };

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Badge
          badgeContent={unreadCount}
          color="error"
          max={99}
          invisible={unreadCount <= 0}
        >
          <NotificationsIcon fontSize="small" sx={{ color: WHITE }} />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { width: 390, maxWidth: "95vw", mt: 1 } }}
      >
        <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle1" fontWeight={700}>
              Thông báo ({unreadCount} chưa đọc)
            </Typography>
            {unreadCount > 0 && (
              <Button
                size="small"
                startIcon={<DoneAllIcon fontSize="small" />}
                onClick={handleMarkAll}
                sx={{ textTransform: "none" }}
              >
                Đọc tất cả
              </Button>
            )}
          </Stack>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{ minHeight: 36, mt: 0.5 }}
          >
            <Tab
              value="ALL"
              label="Tất cả"
              sx={{ minHeight: 36, textTransform: "none" }}
            />
            <Tab
              value="UNREAD"
              label="Chưa đọc"
              sx={{ minHeight: 36, textTransform: "none" }}
            />
          </Tabs>
        </Box>
        <Divider />

        {isLoading ? (
          <Box className="py-8 flex justify-center">
            <CircularProgress size={24} />
          </Box>
        ) : items.length === 0 ? (
          <Box className="py-8 px-4 text-center">
            <Typography variant="body2" color="text.secondary">
              {tab === "UNREAD"
                ? "Không có thông báo chưa đọc."
                : "Chưa có thông báo nào."}
            </Typography>
          </Box>
        ) : (
          <List sx={{ maxHeight: 380, overflowY: "auto", p: 0 }}>
            {items.map((item) => (
              <ListItemButton
                key={item.id}
                onClick={() => handleClickItem(item)}
                sx={{
                  alignItems: "flex-start",
                  bgcolor: item.isRead ? "transparent" : "#eff6ff",
                  borderBottom: "1px solid #f1f5f9",
                  py: 1.2,
                }}
              >
                <Box sx={{ width: "100%" }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={1}
                    sx={{ mb: 0.4 }}
                  >
                    <Chip
                      size="small"
                      label={item.typeLabel || item.type}
                      color={
                        item.type === "TASK_OVERDUE" || item.type === "PAYMENT_DUE"
                          ? "error"
                          : item.type === "TASK_DUE_SOON" ||
                            item.type === "TASK_SUBMITTED"
                          ? "warning"
                          : "primary"
                      }
                      variant="outlined"
                      sx={{ height: 20, fontSize: 11 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {item.createdAt
                        ? moment(item.createdAt).format("DD/MM HH:mm")
                        : ""}
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    fontWeight={item.isRead ? 500 : 700}
                  >
                    {item.title}
                  </Typography>
                  {item.content && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      sx={{ mt: 0.3 }}
                    >
                      {item.content}
                    </Typography>
                  )}
                </Box>
              </ListItemButton>
            ))}
          </List>
        )}
      </Menu>
    </>
  );
};
