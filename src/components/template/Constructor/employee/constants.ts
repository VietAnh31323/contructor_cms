import moment from "moment";

export const POSITION_OPTIONS = [
  { label: "Kiến trúc sư", value: "ARCHITECT", requiresCertificate: false },
  {
    label: "Kỹ sư kết cấu",
    value: "STRUCTURAL_ENGINEER",
    requiresCertificate: false,
  },
  {
    label: "Kỹ sư cơ điện (MEP)",
    value: "MEP_ENGINEER",
    requiresCertificate: false,
  },
  {
    label: "Kỹ sư giám sát",
    value: "SUPERVISOR",
    requiresCertificate: true,
  },
  {
    label: "Chỉ huy trưởng công trình",
    value: "SITE_MANAGER",
    requiresCertificate: true,
  },
  {
    label: "Quản lý dự án (PM)",
    value: "PROJECT_MANAGER",
    requiresCertificate: false,
  },
  { label: "Kỹ sư dự toán", value: "ESTIMATOR", requiresCertificate: false },
  { label: "Kế toán", value: "ACCOUNTANT", requiresCertificate: false },
  {
    label: "Thủ kho / Vật tư",
    value: "WAREHOUSE_KEEPER",
    requiresCertificate: false,
  },
  {
    label: "Hành chính - Nhân sự / CSKH",
    value: "ADMIN_STAFF",
    requiresCertificate: false,
  },
];

export const CERTIFICATE_REQUIRED_POSITIONS = new Set(
  POSITION_OPTIONS.filter((item) => item.requiresCertificate).map(
    (item) => item.value
  )
);

export const DEPARTMENT_OPTIONS = [
  { label: "Ban giám đốc", value: "BOARD_OF_DIRECTORS" },
  { label: "Phòng Kiến trúc - Thiết kế", value: "ARCHITECTURE" },
  { label: "Phòng Kỹ thuật - Thi công", value: "ENGINEERING" },
  { label: "Ban Giám sát công trình", value: "SUPERVISION" },
  { label: "Phòng Dự toán - Đấu thầu", value: "ESTIMATION" },
  { label: "Phòng Tài chính - Kế toán", value: "FINANCE_ACCOUNTING" },
  { label: "Phòng Vật tư - Kho", value: "PROCUREMENT_WAREHOUSE" },
  { label: "Phòng Hành chính - Nhân sự", value: "HR_ADMIN" },
  { label: "Phòng Kinh doanh - CSKH", value: "CUSTOMER_SERVICE" },
];

export const STAFF_STATUS_OPTIONS = [
  { label: "Đang làm việc", value: "WORKING", color: "success" as const },
  { label: "Thử việc", value: "PROBATION", color: "info" as const },
  { label: "Tạm nghỉ", value: "ON_LEAVE", color: "warning" as const },
  { label: "Đã nghỉ việc", value: "RESIGNED", color: "default" as const },
];

export const GENDER_OPTIONS = [
  { label: "Nam", value: "MALE" },
  { label: "Nữ", value: "FEMALE" },
  { label: "Khác", value: "OTHER" },
];

export const CERTIFICATE_TYPE_OPTIONS = [
  { label: "Giám sát thi công xây dựng", value: "CONSTRUCTION_SUPERVISION" },
  { label: "Chỉ huy trưởng công trường", value: "SITE_MANAGEMENT" },
  { label: "Thiết kế kiến trúc công trình", value: "ARCHITECTURAL_DESIGN" },
  { label: "Thiết kế kết cấu công trình", value: "STRUCTURAL_DESIGN" },
  { label: "Thiết kế cơ - điện công trình (MEP)", value: "MEP_DESIGN" },
  { label: "Định giá xây dựng / Dự toán", value: "CONSTRUCTION_VALUATION" },
  { label: "Khảo sát xây dựng", value: "SURVEYING" },
  { label: "Quản lý dự án đầu tư xây dựng", value: "PROJECT_MANAGEMENT" },
  { label: "An toàn vệ sinh lao động", value: "SAFETY_LABOR" },
  { label: "Chứng chỉ khác", value: "OTHER" },
];

export const CERTIFICATE_RANK_OPTIONS = [
  { label: "Hạng I", value: "HANG_I" },
  { label: "Hạng II", value: "HANG_II" },
  { label: "Hạng III", value: "HANG_III" },
];

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Quản trị viên (ADMIN)",
  DIRECTOR: "Giám đốc (DIRECTOR)",
  PROJECT_MANAGER: "Quản lý dự án - PM (PROJECT_MANAGER)",
  SITE_ENGINEER: "Kỹ sư giám sát / Chỉ huy trưởng (SITE_ENGINEER)",
  ACCOUNTANT: "Kế toán (ACCOUNTANT)",
  ESTIMATOR: "Dự toán (ESTIMATOR)",
  WAREHOUSE: "Kho / Vật tư (WAREHOUSE)",
  CUSTOMER_CARE: "Chăm sóc khách hàng (CUSTOMER_CARE)",
  CUSTOMER: "Khách hàng (CUSTOMER)",
  STAFF: "Nhân viên (STAFF)",
};

export const ROLE_SHORT_LABELS: Record<string, string> = {
  ADMIN: "Admin",
  DIRECTOR: "Giám đốc",
  PROJECT_MANAGER: "PM",
  SITE_ENGINEER: "GS / CHT",
  ACCOUNTANT: "Kế toán",
  ESTIMATOR: "Dự toán",
  WAREHOUSE: "Kho",
  CUSTOMER_CARE: "CSKH",
  CUSTOMER: "Khách hàng",
  STAFF: "Nhân viên",
};

export const POSITION_DEFAULT_ROLES: Record<string, string[]> = {
  PROJECT_MANAGER: ["PROJECT_MANAGER"],
  SITE_MANAGER: ["SITE_ENGINEER"],
  SUPERVISOR: ["SITE_ENGINEER"],
  ESTIMATOR: ["ESTIMATOR"],
  ACCOUNTANT: ["ACCOUNTANT"],
  WAREHOUSE_KEEPER: ["WAREHOUSE"],
  ADMIN_STAFF: ["CUSTOMER_CARE", "STAFF"],
  ARCHITECT: ["STAFF"],
  STRUCTURAL_ENGINEER: ["STAFF"],
  MEP_ENGINEER: ["STAFF"],
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
  COMPLETED: { label: "Đã hoàn thành", color: "success" },
};

export const TASK_STATE_META: Record<
  string,
  { label: string; color: "default" | "info" | "success" | "warning" | "error" }
> = {
  NOT_STARTED: { label: "Chưa bắt đầu", color: "default" },
  IN_PROGRESS: { label: "Đang thực hiện", color: "info" },
  COMPLETED: { label: "Hoàn thành", color: "success" },
};

export const PRIORITY_META: Record<
  string,
  { label: string; color: "default" | "info" | "warning" | "error" }
> = {
  LOW: { label: "Thấp", color: "default" },
  MEDIUM: { label: "Trung bình", color: "info" },
  HIGH: { label: "Cao", color: "error" },
};

export const PROJECT_ROLE_LABELS: Record<string, string> = {
  MANAGER: "Quản lý dự án / CHT",
  CREATOR: "Người lập dự án",
  SUPPORTER: "Nhân sự hỗ trợ",
  TASK_MEMBER: "Thực hiện / Duyệt CV",
};

export const TASK_ROLE_LABELS: Record<string, string> = {
  ASSIGNEE: "Người thực hiện",
  REVIEWER: "Người duyệt / Giám sát",
};

export const WORKLOAD_LEVEL_META: Record<
  string,
  {
    label: string;
    color: "success" | "warning" | "error";
    severity: "success" | "warning" | "error";
    advice: string;
  }
> = {
  NORMAL: {
    label: "Tải bình thường",
    color: "success",
    severity: "success",
    advice: "Nhân sự đang có khối lượng công việc ổn định, có thể phân công thêm dự án/công việc mới.",
  },
  HIGH: {
    label: "Tải cao",
    color: "warning",
    severity: "warning",
    advice: "Nhân sự đang phụ trách khá nhiều hạng mục hoặc có việc trễ hạn. Nên cân nhắc kỹ tiến độ trước khi giao thêm.",
  },
  OVERLOADED: {
    label: "Cảnh báo quá tải",
    color: "error",
    severity: "error",
    advice: "Nhân sự đang quá tải dự án/công việc hoặc có nhiều đầu việc quá hạn. Khuyến nghị điều phối bớt công việc sang nhân sự khác!",
  },
};

export const getOptionLabel = (
  value: string | undefined | null,
  options: { label: string; value: string }[]
) => {
  if (!value) return "—";
  return options.find((opt) => opt.value === value)?.label ?? value;
};

export const getCertificateValidityMeta = (expiryDate?: string | null) => {
  if (!expiryDate) {
    return null;
  }
  const exp = moment(expiryDate).startOf("day");
  if (!exp.isValid()) {
    return null;
  }
  const today = moment().startOf("day");
  const daysRemaining = exp.diff(today, "days");
  if (daysRemaining < 0) {
    return {
      status: "EXPIRED" as const,
      label: `Đã hết hạn (${Math.abs(daysRemaining)} ngày)`,
      color: "error" as const,
      daysRemaining,
    };
  }
  if (daysRemaining <= 30) {
    return {
      status: "EXPIRING_SOON" as const,
      label:
        daysRemaining === 0
          ? "Hết hạn hôm nay"
          : `Sắp hết hạn (còn ${daysRemaining} ngày)`,
      color: "warning" as const,
      daysRemaining,
    };
  }
  return {
    status: "VALID" as const,
    label: `Còn hiệu lực (còn ${daysRemaining} ngày)`,
    color: "success" as const,
    daysRemaining,
  };
};
