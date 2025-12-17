import { BaseResponse } from "@/service/type";
import { EmployeeList } from "../getList/type";

export type EmployeeDetail = EmployeeList;

export type Response = {
  GET: BaseResponse<EmployeeDetail>;
};

export type RequestParams = {
  GET: {
    id: number;
  };
};
