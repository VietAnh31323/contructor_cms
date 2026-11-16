export type ProjectMemberRole =
  | "PROJECT_MANAGER"
  | "SUPERVISOR"
  | "SITE_ENGINEER"
  | "STRUCTURAL_ENGINEER"
  | "MEP_ENGINEER"
  | "ARCHITECT"
  | "ESTIMATOR"
  | "ACCOUNTANT"
  | "SAFETY_OFFICER"
  | "CREATOR"
  | "SUPPORTER";

export const PROJECT_MEMBER_ROLE_OPTIONS: {
  value: ProjectMemberRole;
  label: string;
  color:
    | "primary"
    | "secondary"
    | "info"
    | "success"
    | "warning"
    | "error"
    | "default";
}[] = [
  {
    value: "PROJECT_MANAGER",
    label: "Chỉ huy trưởng / Quản lý dự án (PM)",
    color: "primary",
  },
  { value: "SUPERVISOR", label: "Kỹ sư giám sát", color: "info" },
  { value: "SITE_ENGINEER", label: "Kỹ sư hiện trường", color: "secondary" },
  {
    value: "STRUCTURAL_ENGINEER",
    label: "Kỹ sư kết cấu",
    color: "default",
  },
  { value: "MEP_ENGINEER", label: "Kỹ sư cơ điện (MEP)", color: "default" },
  { value: "ARCHITECT", label: "Kiến trúc sư", color: "info" },
  { value: "ESTIMATOR", label: "Kỹ sư dự toán", color: "warning" },
  { value: "ACCOUNTANT", label: "Kế toán dự án", color: "success" },
  { value: "SAFETY_OFFICER", label: "Cán bộ an toàn", color: "error" },
  { value: "CREATOR", label: "Người tạo dự án", color: "default" },
  { value: "SUPPORTER", label: "Nhân sự hỗ trợ", color: "default" },
];

export interface ProjectMemberItem {
  id?: number;
  projectId?: number;
  staffId: number;
  staff?: {
    id: number;
    code: string;
    name: string;
  };
  staffCode?: string;
  staffName?: string;
  staffPhone?: string;
  staffEmail?: string;
  staffDepartment?: string;
  staffPosition?: string;
  memberRole: ProjectMemberRole;
  memberRoleLabel?: string;
  isPrimary?: boolean;
  joinedDate?: string;
  note?: string;
}

export type ContractType = "MAIN" | "PRINCIPLE" | "SUB_CONTRACT" | "CONSULTING";
export type ContractStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "SIGNED"
  | "LIQUIDATED"
  | "TERMINATED";
export type AddendumAdjustmentType =
  | "INCREASE"
  | "DECREASE"
  | "EXTEND_TIME"
  | "SCOPE_CHANGE"
  | "OTHER";

export const CONTRACT_TYPE_OPTIONS: { value: ContractType; label: string }[] = [
  { value: "MAIN", label: "Hợp đồng chính" },
  { value: "PRINCIPLE", label: "Hợp đồng nguyên tắc" },
  { value: "SUB_CONTRACT", label: "Hợp đồng thầu phụ" },
  { value: "CONSULTING", label: "Hợp đồng tư vấn / thiết kế" },
];

export const CONTRACT_STATUS_OPTIONS: {
  value: ContractStatus;
  label: string;
  color: "default" | "warning" | "success" | "info" | "error";
}[] = [
  { value: "DRAFT", label: "Dự thảo", color: "default" },
  { value: "PENDING_APPROVAL", label: "Chờ duyệt", color: "warning" },
  { value: "SIGNED", label: "Đã ký kết", color: "success" },
  { value: "LIQUIDATED", label: "Đã thanh lý", color: "info" },
  { value: "TERMINATED", label: "Đã chấm dứt", color: "error" },
];

export const ADDENDUM_ADJUSTMENT_TYPE_OPTIONS: {
  value: AddendumAdjustmentType;
  label: string;
  color: "success" | "warning" | "info" | "primary" | "default";
}[] = [
  { value: "INCREASE", label: "Phát sinh tăng giá trị (+)", color: "success" },
  { value: "DECREASE", label: "Giảm trừ khối lượng (-)", color: "warning" },
  { value: "EXTEND_TIME", label: "Gia hạn tiến độ", color: "info" },
  { value: "SCOPE_CHANGE", label: "Điều chỉnh điều khoản/phạm vi", color: "primary" },
  { value: "OTHER", label: "Khác", color: "default" },
];

export interface ContractAddendumItem {
  id?: number;
  contractId?: number;
  projectId?: number;
  addendumNumber: string;
  name: string;
  adjustmentType: AddendumAdjustmentType;
  adjustmentTypeLabel?: string;
  signDate?: string;
  effectiveDate?: string;
  adjustedDays?: number;
  newEndDate?: string;
  valueBeforeTax?: number;
  vatPercent?: number;
  vatAmount?: number;
  valueAfterTax?: number;
  reason?: string;
  content?: string;
  note?: string;
  addendumFiles?: any[];
}

export interface ContractItem {
  id?: number;
  projectId?: number;
  contractNumber: string;
  name: string;
  contractType: ContractType;
  contractTypeLabel?: string;
  status: ContractStatus;
  statusLabel?: string;
  signDate?: string;
  startDate?: string;
  endDate?: string;
  valueBeforeTax?: number;
  vatPercent?: number;
  vatAmount?: number;
  valueAfterTax?: number;
  advanceAmount?: number;
  warrantyMonths?: number;
  warrantyPercent?: number;
  warrantyAmount?: number;
  terms?: string;
  note?: string;
  contractFiles?: any[];
  addendums?: ContractAddendumItem[];
  totalAdjustedValue?: number;
  totalAddendumCount?: number;
}
