import { PageResponse } from "@/service/type";
import { Role } from "../../Account/getList/type";

export type EmployeeList = {
  id: number;
  code: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  birthDate?: string;
  phone?: string;
  position?: string;
  department?: string;
  joinDate?: string;
  status?: string;
  idCardNumber?: string;
  certificateCount?: number;
  expiringSoonCertificateCount?: number;
  expiredCertificateCount?: number;

  // 2.03: Tài khoản liên kết
  hasAccount?: boolean;
  accountId?: number | null;
  accountUsername?: string | null;
  accountStatus?: string | null;
  roles?: Role[];

  // 2.04: Tải dự án & công việc
  activeProjectCount?: number;
  activeTaskCount?: number;
  overdueTaskCount?: number;
  workloadLevel?: "NORMAL" | "HIGH" | "OVERLOADED";
};

export type Response = {
  GET: PageResponse<EmployeeList[]>;
};

export type RequestBody = {
  GET: {
    search?: string;
    position?: string | null;
    department?: string | null;
    status?: string | null;
    page?: number;
    size?: number;
  };
};
