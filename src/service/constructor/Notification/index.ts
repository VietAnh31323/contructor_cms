import { ConsApi } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";

export type NotificationType =
  | "TASK_OVERDUE"
  | "TASK_SUBMITTED"
  | "TASK_APPROVED"
  | "TASK_RETURNED"
  | "TASK_MENTION"
  | "TASK_COMMENT"
  | "TASK_SITE_REPORT";

export type NotificationItem = {
  id: number;
  type: NotificationType;
  typeLabel?: string;
  title: string;
  content?: string | null;
  link?: string | null;
  refType?: string | null;
  refId?: number | null;
  isRead: boolean;
  readAt?: string | null;
  createdAt?: string;
};

export const getMyNotifications = async (params: {
  unreadOnly?: boolean;
  page?: number;
  size?: number;
}) => {
  const res = await ConsApi.get("/api/v1/notification/my", {
    params: { unreadOnly: params.unreadOnly ?? false, page: params.page ?? 0, size: params.size ?? 15 },
  });
  return (res.data?.data ?? res.data) as {
    content: NotificationItem[];
    totalElements?: number;
    totalPages?: number;
  };
};

export const useMyNotificationsQuery = (unreadOnly: boolean, enabled = true) =>
  useQuery({
    queryKey: ["my-notifications", unreadOnly],
    queryFn: () => getMyNotifications({ unreadOnly, size: 20 }),
    enabled,
  });

export const getMyUnreadCount = async () => {
  const res = await ConsApi.get("/api/v1/notification/my/unread-count");
  const data = res.data?.data ?? res.data;
  return Number(data?.count ?? 0);
};

export const useMyUnreadCountQuery = () =>
  useQuery({
    queryKey: ["my-notifications-unread"],
    queryFn: getMyUnreadCount,
    refetchInterval: 60000,
    retry: false,
  });

export const markNotificationRead = async (id: number) =>
  ConsApi.patch(`/api/v1/notification/${id}/read`);

export const markAllNotificationsRead = async () =>
  ConsApi.patch(`/api/v1/notification/my/read-all`);

export const scanOverdueNow = async () => {
  const res = await ConsApi.post(`/api/v1/notification/scan-overdue`);
  const data = res.data?.data ?? res.data;
  return Number(data?.notifiedTasks ?? 0);
};
