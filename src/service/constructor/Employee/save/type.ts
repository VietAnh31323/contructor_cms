import { Role } from "../../Account/getList/type";

export type StaffCertificateItem = {
  id?: number | null;
  staffId?: number | null;
  certificateType: string;
  certificateNumber: string;
  certificateRank?: string | null;
  issuedBy?: string | null;
  issueDate: string;
  expiryDate: string;
  note?: string | null;
  validityStatus?: "VALID" | "EXPIRING_SOON" | "EXPIRED";
  daysRemaining?: number;
};

export type EmployeeSave = {
  id?: number;
  code?: string;
  email: string;
  position: string;
  department?: string | null;
  joinDate?: string | null;
  status?: string | null;
  idCardNumber?: string | null;
  idCardIssueDate?: string | null;
  idCardIssuePlace?: string | null;
  firstName: string;
  lastName: string;
  name?: string;
  avatar?: string;
  birthDate?: string | null;
  address?: string;
  phone?: string;
  gender?: string | null;
  description?: string;
  genPassword?: string;
  certificates?: StaffCertificateItem[];

  // 2.03: Thiết lập / liên kết tài khoản đăng nhập & phân quyền
  createAccount?: boolean;
  assignAccountId?: number | null;
  initialPassword?: string | null;
  mustChangePassword?: boolean;
  roles?: { id?: number; name?: string; description?: string }[] | Role[];
  hasAccount?: boolean;
  accountId?: number | null;
  accountUsername?: string | null;
  accountStatus?: "ACTIVE" | "LOCKED" | "INACTIVE" | string | null;
};

export type RequestBody = {
  SAVE: EmployeeSave;
};
