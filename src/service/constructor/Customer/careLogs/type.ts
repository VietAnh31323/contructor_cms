import { BaseResponse } from "@/service/type";
import { CodeNameRef } from "../getList/type";

export type CareChannel =
  | "CALL"
  | "MEETING"
  | "SITE_SURVEY"
  | "ZALO_SMS"
  | "EMAIL"
  | "OTHER";

export type CareOutcome =
  | "POSITIVE"
  | "NEED_FOLLOW_UP"
  | "NO_ANSWER"
  | "DECLINED";

export type CustomerCareLog = {
  id?: number;
  customerId?: number;
  staffId?: number | null;
  staff?: CodeNameRef | null;
  careChannel: CareChannel;
  careTime?: string;
  summary?: string;
  content: string;
  outcome?: CareOutcome | "";
  nextActionDate?: string | null;
  nextActionNote?: string;
  overdueFollowUp?: boolean;
  upcomingFollowUp?: boolean;
  createdAt?: string;
  createdBy?: string;
};

export type Response = {
  LIST: BaseResponse<CustomerCareLog[]>;
};
