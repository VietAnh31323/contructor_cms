import { BaseResponse } from "@/service/type";
import { SteelProjectSave } from "../save/type";

export type SteelProjectDetail = SteelProjectSave;

export type Response = {
  GET: BaseResponse<SteelProjectDetail>;
};

export type RequestParams = {
  GET: {
    id: number;
  };
};
