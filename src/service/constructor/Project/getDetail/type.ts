import { CodeNameRef, CustomerType } from "../../Customer/getList/type";
import { ProjectState } from "../getList/type";
import { ContractItem, ProjectMemberItem } from "../memberContract/type";

export type ProjectCategoryMapDto = {
  id?: number;
  category: CodeNameRef;
  unit?: string | null;
  quantity?: number | string | null;
  unitPrice?: number | string | null;
  totalAmount?: number | string | null;
  note?: string | null;
};

export type PaymentPlanStatus =
  | "PLANNED"
  | "DUE"
  | "PARTIAL"
  | "PAID"
  | "OVERDUE";

export type ProjectLineDto = {
  id?: number;
  paymentNo?: number;
  paymentDate?: string | null;
  paymentAmount?: number | string | null;
  percentage?: number | string | null;
  conditionMilestone?: string | null;
  status?: PaymentPlanStatus;
  statusLabel?: string | null;
  note?: string | null;
  collectedAmount?: number | null;
  remainingLineAmount?: number | null;
};

export type BuildingType =
  | "RESIDENTIAL"
  | "VILLA"
  | "TOWNHOUSE"
  | "COMMERCIAL"
  | "INDUSTRIAL"
  | "INFRASTRUCTURE"
  | "INTERIOR"
  | "OTHER";

export const BUILDING_TYPE_OPTIONS: { value: BuildingType; label: string }[] = [
  { value: "RESIDENTIAL", label: "Nhà ở dân dụng" },
  { value: "VILLA", label: "Biệt thự / Nhà vườn" },
  { value: "TOWNHOUSE", label: "Nhà phố / Liền kề" },
  { value: "COMMERCIAL", label: "Công trình thương mại / Văn phòng" },
  { value: "INDUSTRIAL", label: "Nhà xưởng / Công nghiệp" },
  { value: "INFRASTRUCTURE", label: "Hạ tầng kỹ thuật" },
  { value: "INTERIOR", label: "Nội thất / Cải tạo" },
  { value: "OTHER", label: "Loại hình khác" },
];

export type ProjectDetail = {
  id?: number;
  code?: string;
  name: string;
  customerId?: number | null;
  customer?: CodeNameRef | null;
  customerType?: CustomerType | null;
  customerPhone?: string | null;
  customerTaxCode?: string | null;
  owner?: string;
  address?: string;
  contractValue: number | string;
  contractAdvance?: number | string | null;
  remainingAmount?: number | string | null;
  signDate?: string | null;
  deliveryDate?: string | null;
  actualHandoverDate?: string | null;
  warrantyEndDate?: string | null;
  progressPercent?: number | null;
  creator?: CodeNameRef | null;
  manager?: CodeNameRef | null;
  supporter?: CodeNameRef | null;
  description?: string;
  note?: string;
  state?: ProjectState;
  previousState?: ProjectState | null;
  stateReason?: string | null;
  stateChangedAt?: string | null;
  allowedNextStates?: ProjectState[];
  stateLogCount?: number;
  projectCategoryMaps: ProjectCategoryMapDto[];
  projectLines?: ProjectLineDto[];
  members?: ProjectMemberItem[];
  contracts?: ContractItem[];
  documentCount?: number;
  buildingType?: BuildingType | null;
  buildingTypeLabel?: string | null;
  landArea?: number | string | null;
  constructionArea?: number | string | null;
  totalFloorArea?: number | string | null;
  numberOfFloors?: number | string | null;
  constructionPermitNo?: string | null;
  constructionPermitDate?: string | null;
  designUnit?: string | null;
};

export type Response = {
  GET: {
    message?: string;
    traceId?: string;
    data: ProjectDetail;
  };
};
