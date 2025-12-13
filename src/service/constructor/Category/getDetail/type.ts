import { BaseResponse } from "@/service/type";
import { CategoryList } from "../getList/type";

export type CategoryDetail = CategoryList;

export type Response = {
  GET: BaseResponse<CategoryDetail>;
};

export type RequestParams = {
  GET: {
    id: number;
  };
};
