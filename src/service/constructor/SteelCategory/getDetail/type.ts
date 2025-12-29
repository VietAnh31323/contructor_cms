import { BaseResponse } from "@/service/type";
import { SteelCategorySave } from "../save/type";

export type SteelCategoryDetail = SteelCategorySave;

export type Response = {
  GET: BaseResponse<SteelCategoryDetail>;
};

export type RequestParams = {
  GET: {
    id: number;
  };
};
