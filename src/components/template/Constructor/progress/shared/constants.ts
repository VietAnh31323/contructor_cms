import {
  ScheduleStatus,
  TaskState,
} from "@/service/constructor/Project/gantt/type";

type ChipColor = "default" | "info" | "success" | "warning" | "error" | "primary" | "secondary";

/** 2.23: Workflow trạng thái công việc */
export const TASK_STATE_META: Record<
  TaskState,
  { label: string; barBg: string; barFill: string; chipColor: ChipColor; actionLabel: string }
> = {
  NOT_STARTED: {
    label: "Chưa làm",
    barBg: "#cbd5e1",
    barFill: "#64748b",
    chipColor: "default",
    actionLabel: "Chuyển về Chưa làm",
  },
  IN_PROGRESS: {
    label: "Đang làm",
    barBg: "#93c5fd",
    barFill: "#2563eb",
    chipColor: "info",
    actionLabel: "Bắt đầu thực hiện",
  },
  PENDING_REVIEW: {
    label: "Chờ duyệt",
    barBg: "#ddd6fe",
    barFill: "#7c3aed",
    chipColor: "secondary",
    actionLabel: "Trình duyệt",
  },
  RETURNED: {
    label: "Trả lại",
    barBg: "#fed7aa",
    barFill: "#ea580c",
    chipColor: "warning",
    actionLabel: "Trả lại",
  },
  COMPLETED: {
    label: "Hoàn thành",
    barBg: "#86efac",
    barFill: "#16a34a",
    chipColor: "success",
    actionLabel: "Duyệt hoàn thành",
  },
};

/** Nhãn nút hành động theo (trạng thái hiện tại → trạng thái đích) */
export const getTransitionLabel = (from: TaskState, to: TaskState): string => {
  if (from === "COMPLETED" && to === "IN_PROGRESS") return "Mở lại công việc";
  if (from === "RETURNED" && to === "IN_PROGRESS") return "Làm lại";
  return TASK_STATE_META[to].actionLabel;
};

/** 2.26: Tình trạng tiến độ so với kế hoạch */
export const SCHEDULE_STATUS_META: Record<
  ScheduleStatus,
  { label: string; color: ChipColor; hex: string }
> = {
  NOT_SCHEDULED: { label: "Chưa lập kế hoạch", color: "default", hex: "#94a3b8" },
  ON_TRACK: { label: "Đúng tiến độ", color: "success", hex: "#16a34a" },
  AT_RISK: { label: "Nguy cơ trễ", color: "warning", hex: "#d97706" },
  OVERDUE: { label: "Trễ hạn", color: "error", hex: "#dc2626" },
  COMPLETED_ON_TIME: { label: "Xong đúng hạn", color: "success", hex: "#15803d" },
  COMPLETED_LATE: { label: "Xong trễ hạn", color: "warning", hex: "#b45309" },
};

export const SITE_REPORT_PHASE_META = {
  BEFORE: { label: "Trước thi công", color: "#0369a1", bg: "#e0f2fe" },
  DURING: { label: "Trong thi công", color: "#b45309", bg: "#fef3c7" },
  AFTER: { label: "Sau thi công", color: "#15803d", bg: "#dcfce7" },
} as const;
