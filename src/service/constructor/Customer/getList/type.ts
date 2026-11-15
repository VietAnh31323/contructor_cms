import { PageResponse } from "@/service/type";

export type CustomerType = "INDIVIDUAL" | "BUSINESS";

export type CustomerPipelineStage =
  | "LEAD"
  | "QUOTED"
  | "CONTRACT_SIGNED"
  | "IN_CONSTRUCTION"
  | "WARRANTY"
  | "LOST";

export type ContactStatus =
  | "NOT_CONTACTED"
  | "CONTACTED"
  | "NO_RESPONSE"
  | "RESPONDED";

export type CodeNameRef = {
  id: number;
  code?: string;
  name: string;
};

export type CustomerProjectItem = {
  id: number;
  code: string;
  name: string;
  address?: string;
  contractValue?: number;
  contractAdvance?: number;
  remainingAmount?: number;
  signDate?: string;
  deliveryDate?: string;
  progressPercent?: number;
  state?: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  paymentStatus?: "COMPLETED" | "NOT_COMPLETED";
  manager?: CodeNameRef | null;
};

export type CustomerItem = {
  id: number;
  code: string;
  name: string;
  customerType: CustomerType;
  taxCode?: string;
  representativeName?: string;
  representativePosition?: string;
  idCardNumber?: string;
  bankAccountNumber?: string;
  bankName?: string;
  bankBranch?: string;
  bankAccountHolder?: string;
  phone?: string;
  email?: string;
  address?: string;
  contactStatus?: ContactStatus;
  pipelineStage?: CustomerPipelineStage;
  assignedStaffId?: number | null;
  assignedStaff?: CodeNameRef | null;
  isPotential?: boolean;
  description?: string;
  note?: string;
  projectCount?: number;
  totalContractValue?: number;
  careLogCount?: number;
  lastCareTime?: string;
  nextActionDate?: string;
  nextActionNote?: string;
  overdueFollowUp?: boolean;
  projects?: CustomerProjectItem[];
};

export type Response = {
  GET: PageResponse<CustomerItem[]>;
};

export type RequestBody = {
  GET: {
    search?: string;
    customerType?: CustomerType | "";
    pipelineStage?: CustomerPipelineStage | "";
    contactStatus?: ContactStatus | "";
    assignedStaffId?: number | "";
    isPotential?: boolean;
    page?: number;
    size?: number;
  };
};
