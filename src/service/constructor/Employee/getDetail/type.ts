import { BaseResponse } from "@/service/type";
import { CustomerList } from "../getList/type";

export type CustomerDetail = CustomerList;

export type Response = {
  GET: BaseResponse<CustomerDetail>;
};

export type RequestParams = {
  GET: {
    id: number;
  };
};
