import { PageResponse } from "@/service/type";

export type CategoryList = {
  id: number;
  code: string;
  name: string;
  description: string;
  isActive: boolean;
  parentId?: number | null;
  parentName?: string | null;
  unit?: string | null;
  defaultUnitPrice?: number | null;
  sortOrder?: number | null;
  children?: CategoryList[];
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
