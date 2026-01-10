import { PageResponse } from "@/service/type";

export type SteelCategoryListLine = {
  id: number;
  paramName: string;
};

export type Response = {
  GET: PageResponse<SteelCategoryListLine[]>;
};

export type RequestBody = {
  GET: {
    search?: string;
    page?: number;
    size?: number;
    steelCategoryId?: number;
  };
};
