import { PageResponse } from "@/service/type";

export type ProgressList = {
  id: number;
  code: string;
  name: string;
  description: string;
  isActive: boolean;
};

export type ProgressProjectList = ProgressList;

export type Response = {
  GET: PageResponse<ProgressList[]>;
};

export type RequestBody = {
  GET: {
    search?: string;
    page?: number;
    size?: number;
  };
};
