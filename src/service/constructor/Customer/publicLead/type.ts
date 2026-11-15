import { BaseResponse } from "@/service/type";
import { CustomerType } from "../getList/type";

export type PublicCustomerLeadPayload = {
  name: string;
  phone: string;
  customerType?: CustomerType;
  representativeName?: string;
  taxCode?: string;
  email?: string;
  address?: string;
  serviceInterest?: string;
  projectScale?: string;
  estimatedBudget?: string;
  message?: string;
  source?: string;
};

export type PublicCustomerLeadResult = {
  id: number;
  code: string;
  name: string;
  existingCustomer: boolean;
};

export type Response = {
  POST: BaseResponse<PublicCustomerLeadResult>;
};
