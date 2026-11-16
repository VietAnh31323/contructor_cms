import { CodeNameRef, CustomerType } from "../../Customer/getList/type";
import { ProjectState } from "../getList/type";
import { ContractItem, ProjectMemberItem } from "../memberContract/type";

export type ProjectCategoryMapDto = {
  id?: number;
  category: CodeNameRef;
};

export type ProjectLineDto = {
  id?: number;
  paymentNo?: number;
  paymentDate?: string | null;
  paymentAmount?: number | string | null;
};

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
};

export type Response = {
  GET: {
    message?: string;
    traceId?: string;
    data: ProjectDetail;
  };
};
