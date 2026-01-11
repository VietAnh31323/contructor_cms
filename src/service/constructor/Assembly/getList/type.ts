import { PageResponse } from "@/service/type";

export type AssemblyList = {
  id: number;
  code: string;
  name: string;
};

export type Response = {
  GET: PageResponse<AssemblyList[]>;
};

export type RequestBody = {
  GET: {
    search?: string;
    page?: number;
    size?: number;
    isActive?: boolean;
  };
};
