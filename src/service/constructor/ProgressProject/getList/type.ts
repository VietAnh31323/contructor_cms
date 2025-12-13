import { PageResponse } from "@/service/type";

export type ProgressProjectList = {
  id: number;
  code: string;
  name: string;
  description: string;
  isActive: boolean;
};

export type Response = {
  GET: PageResponse<ProgressProjectList[]>;
};

export type RequestBody = {
  GET: {
    search?: string;
    page?: number;
    size?: number;
  };
};
