import { BaseResponse } from "@/service/type";

export type ProgressDetail = {};

export type Response = {
  GET: BaseResponse<ProgressDetail>;
};

export type RequestParams = {
  GET: {
    id: number;
  };
};
