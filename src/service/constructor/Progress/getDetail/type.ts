import { BaseResponse } from "@/service/type";
import { ProgressList } from "../getList/type";

export type ProgressDetail = ProgressList;
export type ProgressProjectDetail = ProgressDetail;

export type Response = {
  GET: BaseResponse<ProgressDetail>;
};

export type RequestParams = {
  GET: {
    id: number;
  };
};
