import { BaseResponse } from "@/service/type";
import { ProgressProjectList } from "../getList/type";

export type ProgressProjectDetail = ProgressProjectList;

export type Response = {
  GET: BaseResponse<ProgressProjectDetail>;
};

export type RequestParams = {
  GET: {
    id: number;
  };
};
