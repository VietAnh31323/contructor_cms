import { PageResponse } from "@/service/type";

export type CategoryList = {
  id: number;
  code: string;
  name: string;
  description: string;
  isActive: boolean;
};

export type Response = {
  GET: PageResponse<CategoryList[]>;
};

export type RequestBody = {
  GET: {
    search?: string;
    page?: number;
    size?: number;
  };
};
