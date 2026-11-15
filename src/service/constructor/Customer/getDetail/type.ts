import { BaseResponse } from "@/service/type";
import { CustomerItem } from "../getList/type";

export type CustomerDetail = CustomerItem;

export type Response = {
  GET: BaseResponse<CustomerDetail>;
};
