import { BaseResponse } from "@/service/type";
import { EmployeeSave } from "../save/type";

export type EmployeeDetail = EmployeeSave & {
  id: number;
};

export type Response = {
  GET: BaseResponse<EmployeeDetail>;
};

export type RequestParams = {
  GET: {
    id: number;
  };
};
