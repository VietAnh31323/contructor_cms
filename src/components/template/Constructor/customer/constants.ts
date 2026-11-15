import { CareChannel, CareOutcome } from "@/service/constructor/Customer/careLogs/type";
import {
  ContactStatus,
  CustomerPipelineStage,
  CustomerType,
} from "@/service/constructor/Customer/getList/type";

export const CUSTOMER_TYPE_OPTIONS: { label: string; value: CustomerType }[] = [
  { label: "Cá nhân", value: "INDIVIDUAL" },
  { label: "Doanh nghiệp", value: "BUSINESS" },
];

export const CUSTOMER_TYPE_META: Record<
  CustomerType,
  { label: string; color: "info" | "secondary"; bg: string; textColor: string }
> = {
  INDIVIDUAL: {
    label: "Cá nhân",
    color: "info",
    bg: "#e0f2fe",
    textColor: "#0369a1",
  },
  BUSINESS: {
    label: "Doanh nghiệp",
    color: "secondary",
    bg: "#f3e8ff",
    textColor: "#7e22ce",
  },
};

export const PIPELINE_FLOW_STAGES: CustomerPipelineStage[] = [
  "LEAD",
  "QUOTED",
  "CONTRACT_SIGNED",
  "IN_CONSTRUCTION",
  "WARRANTY",
];

export const PIPELINE_STAGE_OPTIONS: {
  label: string;
  value: CustomerPipelineStage;
}[] = [
  { label: "1. Tiềm năng", value: "LEAD" },
  { label: "2. Báo giá", value: "QUOTED" },
  { label: "3. Ký HĐ", value: "CONTRACT_SIGNED" },
  { label: "4. Đang thi công", value: "IN_CONSTRUCTION" },
  { label: "5. Bảo hành", value: "WARRANTY" },
  { label: "Ngưng theo dõi", value: "LOST" },
];

export const PIPELINE_STAGE_META: Record<
  CustomerPipelineStage,
  {
    label: string;
    shortLabel: string;
    step: number;
    chipColor: "default" | "info" | "warning" | "primary" | "success" | "error";
    accent: string;
    bg: string;
  }
> = {
  LEAD: {
    label: "Tiềm năng",
    shortLabel: "Tiềm năng",
    step: 1,
    chipColor: "info",
    accent: "#0284c7",
    bg: "#f0f9ff",
  },
  QUOTED: {
    label: "Báo giá",
    shortLabel: "Báo giá",
    step: 2,
    chipColor: "warning",
    accent: "#d97706",
    bg: "#fffbeb",
  },
  CONTRACT_SIGNED: {
    label: "Ký HĐ",
    shortLabel: "Ký HĐ",
    step: 3,
    chipColor: "primary",
    accent: "#2563eb",
    bg: "#eff6ff",
  },
  IN_CONSTRUCTION: {
    label: "Đang thi công",
    shortLabel: "Đang thi công",
    step: 4,
    chipColor: "warning",
    accent: "#ea580c",
    bg: "#fff7ed",
  },
  WARRANTY: {
    label: "Bảo hành",
    shortLabel: "Bảo hành",
    step: 5,
    chipColor: "success",
    accent: "#16a34a",
    bg: "#f0fdf4",
  },
  LOST: {
    label: "Ngưng theo dõi",
    shortLabel: "Ngưng theo dõi",
    step: 6,
    chipColor: "error",
    accent: "#dc2626",
    bg: "#fef2f2",
  },
};

export const CONTACT_STATUS_OPTIONS: {
  label: string;
  value: ContactStatus;
}[] = [
  { label: "Chưa liên hệ", value: "NOT_CONTACTED" },
  { label: "Đã liên hệ", value: "CONTACTED" },
  { label: "Đã phản hồi", value: "RESPONDED" },
  { label: "Không phản hồi", value: "NO_RESPONSE" },
];

export const CONTACT_STATUS_META: Record<
  ContactStatus,
  { label: string; color: "warning" | "info" | "success" | "error" }
> = {
  NOT_CONTACTED: { label: "Chưa liên hệ", color: "warning" },
  CONTACTED: { label: "Đã liên hệ", color: "info" },
  RESPONDED: { label: "Đã phản hồi", color: "success" },
  NO_RESPONSE: { label: "Không phản hồi", color: "error" },
};

export const CARE_CHANNEL_OPTIONS: { label: string; value: CareChannel }[] = [
  { label: "Cuộc gọi điện thoại", value: "CALL" },
  { label: "Gặp trực tiếp", value: "MEETING" },
  { label: "Khảo sát thực tế", value: "SITE_SURVEY" },
  { label: "Zalo / Tin nhắn", value: "ZALO_SMS" },
  { label: "Email", value: "EMAIL" },
  { label: "Khác", value: "OTHER" },
];

export const CARE_CHANNEL_LABELS: Record<CareChannel, string> = {
  CALL: "Cuộc gọi",
  MEETING: "Gặp trực tiếp",
  SITE_SURVEY: "Khảo sát thực tế",
  ZALO_SMS: "Zalo / Tin nhắn",
  EMAIL: "Email",
  OTHER: "Khác",
};

export const CARE_OUTCOME_OPTIONS: { label: string; value: CareOutcome }[] = [
  { label: "Tích cực / Quan tâm", value: "POSITIVE" },
  { label: "Cần chăm sóc thêm", value: "NEED_FOLLOW_UP" },
  { label: "Không nghe máy / Chưa phản hồi", value: "NO_ANSWER" },
  { label: "Từ chối / Tạm hoãn", value: "DECLINED" },
];

export const CARE_OUTCOME_META: Record<
  CareOutcome,
  { label: string; color: "success" | "warning" | "default" | "error" }
> = {
  POSITIVE: { label: "Tích cực / Quan tâm", color: "success" },
  NEED_FOLLOW_UP: { label: "Cần chăm sóc thêm", color: "warning" },
  NO_ANSWER: { label: "Không nghe máy", color: "default" },
  DECLINED: { label: "Từ chối / Tạm hoãn", color: "error" },
};

export const PROJECT_STATE_META: Record<
  string,
  {
    label: string;
    color: "default" | "primary" | "secondary" | "info" | "success" | "warning" | "error";
  }
> = {
  RECEIVED: { label: "Tiếp nhận", color: "default" },
  SURVEYING: { label: "Khảo sát", color: "info" },
  QUOTED: { label: "Báo giá", color: "warning" },
  CONTRACT_SIGNED: { label: "Ký HĐ", color: "primary" },
  IN_CONSTRUCTION: { label: "Thi công", color: "warning" },
  ACCEPTANCE: { label: "Nghiệm thu", color: "secondary" },
  HANDOVER: { label: "Bàn giao", color: "success" },
  WARRANTY: { label: "Bảo hành", color: "success" },
  CLOSED: { label: "Đóng", color: "default" },
  PAUSED: { label: "Tạm dừng", color: "warning" },
  CANCELLED: { label: "Hủy", color: "error" },
  NOT_STARTED: { label: "Tiếp nhận", color: "default" },
  IN_PROGRESS: { label: "Thi công", color: "info" },
  COMPLETED: { label: "Đóng", color: "success" },
};

export const PROJECT_STATE_OPTIONS = [
  { label: "1. Tiếp nhận", value: "RECEIVED" },
  { label: "2. Khảo sát", value: "SURVEYING" },
  { label: "3. Báo giá", value: "QUOTED" },
  { label: "4. Ký HĐ", value: "CONTRACT_SIGNED" },
  { label: "5. Thi công", value: "IN_CONSTRUCTION" },
  { label: "6. Nghiệm thu", value: "ACCEPTANCE" },
  { label: "7. Bàn giao", value: "HANDOVER" },
  { label: "8. Bảo hành", value: "WARRANTY" },
  { label: "9. Đóng", value: "CLOSED" },
  { label: "Tạm dừng", value: "PAUSED" },
  { label: "Hủy", value: "CANCELLED" },
];

export const formatVnd = (amount?: number | string | null): string => {
  if (amount === undefined || amount === null || amount === "") {
    return "0 đ";
  }
  const num = Number(amount);
  if (Number.isNaN(num)) {
    return "0 đ";
  }
  return new Intl.NumberFormat("vi-VN").format(num) + " đ";
};
