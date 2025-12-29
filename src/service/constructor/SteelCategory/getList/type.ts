import { PageResponse } from "@/service/type";

export type SteelCategoryList = {
  id: number;
  code: string;
  name: string;
  images: Image[];
  description: string;
  isActive: boolean;
};
export interface Image {
  name: string;
  url: string;
  type: string;
}
export type Response = {
  GET: PageResponse<SteelCategoryList[]>;
};

export type RequestBody = {
  GET: {
    search?: string;
    page?: number;
    size?: number;
    isActive?: boolean;
  };
};
