import { PageResponse } from "@/service/type";
import { SteelProjectSave } from "../../SteelProject/save/type";

export type SteelPrjectList = SteelProjectSave;
export type Response = {
  GET: PageResponse<SteelPrjectList[]>;
};

export type RequestBody = {
  GET: {
    search?: string;
    page?: number;
    size?: number;
    isActive?: boolean;
  };
};
