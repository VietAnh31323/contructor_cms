import { CodeNameRef, CustomerType } from "../../Customer/getList/type";

export type ProjectState =
  | "RECEIVED"
  | "SURVEYING"
  | "QUOTED"
  | "CONTRACT_SIGNED"
  | "IN_CONSTRUCTION"
  | "ACCEPTANCE"
  | "HANDOVER"
  | "WARRANTY"
  | "CLOSED"
  | "PAUSED"
  | "CANCELLED"
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "COMPLETED";

export type PaymentStatus = "COMPLETED" | "NOT_COMPLETED";

export type ProjectListItem = {
  id: number;
  code: string;
  name: string;
  customerId?: number | null;
  customer?: CodeNameRef | null;
  customerType?: CustomerType | null;
  owner?: string;
  address?: string | null;
  manager?: CodeNameRef | null;
  contractValue?: number;
  contractAdvance?: number;
  remainingAmount?: number;
  signDate?: string | null;
  deliveryDate?: string | null;
  actualHandoverDate?: string | null;
  warrantyEndDate?: string | null;
  state?: ProjectState;
  previousState?: ProjectState | null;
  stateReason?: string | null;
  stateChangedAt?: string | null;
  allowedNextStates?: ProjectState[];
  paymentStatus?: PaymentStatus;
  progressPercent?: number;
  memberCount?: number;
  contractCount?: number;
};

export type ProjectPageData = {
  content: ProjectListItem[];
  page?: number;
  size?: number;
  totalPages?: number;
  totalElements?: number;
};

export type Response = {
  GET: {
    message?: string;
    traceId?: string;
    data: ProjectPageData;
  };
};

export type RequestBody = {
  GET: {
    search?: string;
    customerId?: number | "";
    state?: ProjectState | "";
    categoryId?: number | "";
    page?: number;
    size?: number;
  };
};
