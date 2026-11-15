import { CustomerDetail } from "@/service/constructor/Customer/getDetail/type";
import { CustomerType } from "@/service/constructor/Customer/getList/type";
import { ProjectState } from "@/service/constructor/Project/getList/type";

export type ChipColor =
  | "default"
  | "primary"
  | "secondary"
  | "info"
  | "success"
  | "warning"
  | "error";

export type ProjectStateMeta = {
  label: string;
  shortLabel: string;
  step: number;
  isMainFlow: boolean;
  isTerminal: boolean;
  color: ChipColor;
  accent: string;
  bg: string;
  description: string;
};

export const PROJECT_MAIN_FLOW_STATES: ProjectState[] = [
  "RECEIVED",
  "SURVEYING",
  "QUOTED",
  "CONTRACT_SIGNED",
  "IN_CONSTRUCTION",
  "ACCEPTANCE",
  "HANDOVER",
  "WARRANTY",
  "CLOSED",
];

export const PROJECT_KANBAN_STATES: ProjectState[] = [
  ...PROJECT_MAIN_FLOW_STATES,
  "PAUSED",
  "CANCELLED",
];

export const PROJECT_STATE_META: Record<string, ProjectStateMeta> = {
  RECEIVED: {
    label: "Tiếp nhận",
    shortLabel: "1. Tiếp nhận",
    step: 1,
    isMainFlow: true,
    isTerminal: false,
    color: "default",
    accent: "#475569",
    bg: "#f8fafc",
    description: "Tiếp nhận yêu cầu tư vấn / thiết kế / thi công từ chủ đầu tư",
  },
  SURVEYING: {
    label: "Khảo sát",
    shortLabel: "2. Khảo sát",
    step: 2,
    isMainFlow: true,
    isTerminal: false,
    color: "info",
    accent: "#0284c7",
    bg: "#f0f9ff",
    description: "Khảo sát thực địa, hiện trạng khu đất và nhu cầu chi tiết",
  },
  QUOTED: {
    label: "Báo giá",
    shortLabel: "3. Báo giá",
    step: 3,
    isMainFlow: true,
    isTerminal: false,
    color: "warning",
    accent: "#d97706",
    bg: "#fffbeb",
    description: "Lập phương án & gửi báo giá / dự toán cho chủ đầu tư",
  },
  CONTRACT_SIGNED: {
    label: "Ký HĐ",
    shortLabel: "4. Ký HĐ",
    step: 4,
    isMainFlow: true,
    isTerminal: false,
    color: "primary",
    accent: "#2563eb",
    bg: "#eff6ff",
    description: "Đã ký kết hợp đồng chính thức với chủ đầu tư",
  },
  IN_CONSTRUCTION: {
    label: "Thi công",
    shortLabel: "5. Thi công",
    step: 5,
    isMainFlow: true,
    isTerminal: false,
    color: "warning",
    accent: "#ea580c",
    bg: "#fff7ed",
    description: "Đang triển khai thiết kế / thi công các hạng mục dự án",
  },
  ACCEPTANCE: {
    label: "Nghiệm thu",
    shortLabel: "6. Nghiệm thu",
    step: 6,
    isMainFlow: true,
    isTerminal: false,
    color: "secondary",
    accent: "#7c3aed",
    bg: "#f5f3ff",
    description: "Kiểm tra chất lượng, khối lượng và nghiệm thu hoàn thành",
  },
  HANDOVER: {
    label: "Bàn giao",
    shortLabel: "7. Bàn giao",
    step: 7,
    isMainFlow: true,
    isTerminal: false,
    color: "success",
    accent: "#0d9488",
    bg: "#f0fdfa",
    description: "Bàn giao hồ sơ / công trình cho chủ đầu tư đưa vào sử dụng",
  },
  WARRANTY: {
    label: "Bảo hành",
    shortLabel: "8. Bảo hành",
    step: 8,
    isMainFlow: true,
    isTerminal: false,
    color: "success",
    accent: "#16a34a",
    bg: "#f0fdf4",
    description: "Theo dõi và thực hiện bảo hành công trình định kỳ",
  },
  CLOSED: {
    label: "Đóng",
    shortLabel: "9. Đóng",
    step: 9,
    isMainFlow: true,
    isTerminal: true,
    color: "default",
    accent: "#334155",
    bg: "#f1f5f9",
    description: "Đã quyết toán & đóng hoàn tất toàn bộ vòng đời dự án",
  },
  PAUSED: {
    label: "Tạm dừng",
    shortLabel: "Tạm dừng",
    step: 10,
    isMainFlow: false,
    isTerminal: false,
    color: "warning",
    accent: "#ca8a04",
    bg: "#fefce8",
    description: "Tạm dừng triển khai dự án (có thể khôi phục lại bước trước)",
  },
  CANCELLED: {
    label: "Hủy",
    shortLabel: "Hủy",
    step: 11,
    isMainFlow: false,
    isTerminal: true,
    color: "error",
    accent: "#dc2626",
    bg: "#fef2f2",
    description: "Dự án đã bị hủy bỏ và dừng theo dõi thi công",
  },
  // Legacy compatibility keys
  NOT_STARTED: {
    label: "Tiếp nhận",
    shortLabel: "1. Tiếp nhận",
    step: 1,
    isMainFlow: true,
    isTerminal: false,
    color: "default",
    accent: "#475569",
    bg: "#f8fafc",
    description: "Tiếp nhận dự án",
  },
  IN_PROGRESS: {
    label: "Thi công",
    shortLabel: "5. Thi công",
    step: 5,
    isMainFlow: true,
    isTerminal: false,
    color: "warning",
    accent: "#ea580c",
    bg: "#fff7ed",
    description: "Đang thi công",
  },
  COMPLETED: {
    label: "Đóng",
    shortLabel: "9. Đóng",
    step: 9,
    isMainFlow: true,
    isTerminal: true,
    color: "success",
    accent: "#16a34a",
    bg: "#f0fdf4",
    description: "Đã hoàn thành",
  },
};

export const PROJECT_FILTER_STATE_OPTIONS: {
  label: string;
  value: ProjectState | "";
}[] = [
  { label: "Tất cả trạng thái vòng đời", value: "" },
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

export const PROJECT_CREATE_INITIAL_STATE_OPTIONS: {
  label: string;
  value: ProjectState;
}[] = [
  { label: "1. Tiếp nhận (Mới nhận yêu cầu)", value: "RECEIVED" },
  { label: "2. Khảo sát (Đang khảo sát thực địa)", value: "SURVEYING" },
  { label: "3. Báo giá (Đã lập dự toán / báo giá)", value: "QUOTED" },
  { label: "4. Ký HĐ (Đã ký hợp đồng chính thức)", value: "CONTRACT_SIGNED" },
  { label: "5. Thi công (Đang triển khai ngay)", value: "IN_CONSTRUCTION" },
];

export const normalizeProjectState = (
  state?: string | null
): ProjectState => {
  if (!state) return "RECEIVED";
  if (state === "NOT_STARTED") return "RECEIVED";
  if (state === "IN_PROGRESS") return "IN_CONSTRUCTION";
  if (state === "COMPLETED") return "CLOSED";
  return state as ProjectState;
};

export const getAllowedNextProjectStates = (
  rawCurrent?: ProjectState | null,
  rawPrevious?: ProjectState | null
): ProjectState[] => {
  const current = normalizeProjectState(rawCurrent);
  const previous = rawPrevious ? normalizeProjectState(rawPrevious) : null;

  if (current === "CLOSED" || current === "CANCELLED") {
    return [];
  }
  if (current === "PAUSED") {
    const resumeTarget =
      previous && previous !== "PAUSED" && !PROJECT_STATE_META[previous]?.isTerminal
        ? previous
        : "RECEIVED";
    return [resumeTarget, "CANCELLED"];
  }

  switch (current) {
    case "RECEIVED":
      return ["SURVEYING", "QUOTED", "CONTRACT_SIGNED", "PAUSED", "CANCELLED"];
    case "SURVEYING":
      return ["QUOTED", "CONTRACT_SIGNED", "RECEIVED", "PAUSED", "CANCELLED"];
    case "QUOTED":
      return ["CONTRACT_SIGNED", "SURVEYING", "PAUSED", "CANCELLED"];
    case "CONTRACT_SIGNED":
      return ["IN_CONSTRUCTION", "PAUSED", "CANCELLED"];
    case "IN_CONSTRUCTION":
      return ["ACCEPTANCE", "PAUSED", "CANCELLED"];
    case "ACCEPTANCE":
      return ["HANDOVER", "IN_CONSTRUCTION", "PAUSED", "CANCELLED"];
    case "HANDOVER":
      return ["WARRANTY", "CLOSED"];
    case "WARRANTY":
      return ["CLOSED", "IN_CONSTRUCTION"];
    default:
      return [];
  }
};

export const requiresTransitionReason = (
  rawFrom?: ProjectState | null,
  rawTo?: ProjectState | null
): boolean => {
  if (!rawTo) return false;
  const from = normalizeProjectState(rawFrom);
  const to = normalizeProjectState(rawTo);
  if (to === "PAUSED" || to === "CANCELLED") {
    return true;
  }
  const fromMeta = PROJECT_STATE_META[from];
  const toMeta = PROJECT_STATE_META[to];
  if (fromMeta?.isMainFlow && toMeta?.isMainFlow && toMeta.step < fromMeta.step) {
    return true;
  }
  return false;
};

export type ConditionCheckItem = {
  label: string;
  passed: boolean;
  hint?: string;
};

export const evaluateTransitionChecklist = (
  rawToState: ProjectState,
  snapshot: {
    hasCustomer: boolean;
    customerType?: CustomerType | null;
    customerInfo?: CustomerDetail | null;
    address?: string | null;
    categoryCount?: number;
    contractValue?: number | string | null;
    signDate?: string | null;
    hasManager: boolean;
  }
): ConditionCheckItem[] => {
  const toState = normalizeProjectState(rawToState);
  const valNum = Number(snapshot.contractValue ?? 0);
  const hasPositiveValue = Number.isFinite(valNum) && valNum > 0;
  const hasAddress = Boolean(snapshot.address && snapshot.address.trim());
  const hasSignDate = Boolean(snapshot.signDate);
  const hasCategories = (snapshot.categoryCount ?? 0) > 0;

  const isBusiness =
    snapshot.customerType === "BUSINESS" ||
    snapshot.customerInfo?.customerType === "BUSINESS";
  const businessLegalOk = !isBusiness
    ? true
    : snapshot.customerInfo
    ? Boolean(
        snapshot.customerInfo.taxCode?.trim() &&
          snapshot.customerInfo.representativeName?.trim()
      )
    : true;

  switch (toState) {
    case "SURVEYING":
      return [
        {
          label: "Đã liên kết Khách hàng / Chủ đầu tư",
          passed: snapshot.hasCustomer,
        },
        {
          label: "Có địa điểm xây dựng / khảo sát",
          passed: hasAddress,
          hint: "Cần nhập địa chỉ công trình trước khi đi khảo sát",
        },
      ];
    case "QUOTED":
      return [
        {
          label: "Đã chọn ít nhất 1 hạng mục dự án",
          passed: hasCategories,
        },
        {
          label: "Giá trị báo giá / dự toán > 0 VNĐ",
          passed: hasPositiveValue,
          hint: "Cập nhật giá trị hợp đồng/báo giá dự kiến lớn hơn 0",
        },
      ];
    case "CONTRACT_SIGNED": {
      const items: ConditionCheckItem[] = [
        {
          label: "Đã liên kết Khách hàng / Chủ đầu tư",
          passed: snapshot.hasCustomer,
        },
        {
          label: "Giá trị hợp đồng chính thức > 0 VNĐ",
          passed: hasPositiveValue,
        },
        {
          label: "Đã cập nhật Ngày ký hợp đồng",
          passed: hasSignDate,
        },
      ];
      if (isBusiness) {
        items.push({
          label: "Khách hàng Doanh nghiệp đủ Mã số thuế & Người đại diện",
          passed: businessLegalOk,
        });
      }
      return items;
    }
    case "IN_CONSTRUCTION": {
      const items: ConditionCheckItem[] = [
        {
          label: "Đã đủ thông tin Hợp đồng (Khách hàng, Ngày ký HĐ, Giá trị HĐ > 0)",
          passed: snapshot.hasCustomer && hasPositiveValue && hasSignDate,
        },
        {
          label: "Đã phân công Chủ nhiệm dự án (PM / Chỉ huy trưởng)",
          passed: snapshot.hasManager,
        },
        {
          label: "Đã có Địa điểm xây dựng công trình",
          passed: hasAddress,
        },
      ];
      if (isBusiness) {
        items.push({
          label: "Khách hàng Doanh nghiệp đủ Mã số thuế & Người đại diện",
          passed: businessLegalOk,
        });
      }
      return items;
    }
    case "ACCEPTANCE":
      return [
        {
          label:
            "Tất cả công việc (Task) thuộc dự án đã hoàn thành 100% (hệ thống tự động kiểm tra)",
          passed: true,
          hint: "Nếu còn công việc chưa hoàn thành, hệ thống sẽ cảnh báo khi xác nhận",
        },
      ];
    case "HANDOVER":
      return [
        {
          label: "Đã qua bước Nghiệm thu & ghi nhận Ngày bàn giao thực tế",
          passed: true,
        },
      ];
    case "WARRANTY":
      return [
        {
          label: "Đã bàn giao công trình & kích hoạt thời hạn Bảo hành",
          passed: true,
        },
      ];
    case "CLOSED":
      return [
        {
          label: "Hoàn tất bàn giao / bảo hành để đóng hồ sơ dự án",
          passed: true,
        },
      ];
    case "PAUSED":
      return [
        {
          label: "Bắt buộc nhập Lý do tạm dừng dự án (ghi vào nhật ký vòng đời)",
          passed: true,
        },
      ];
    case "CANCELLED":
      return [
        {
          label:
            "Bắt buộc nhập Lý do hủy dự án (lưu ý: sau khi Hủy không thể mở lại)",
          passed: true,
        },
      ];
    default:
      return [];
  }
};
