import { PageResponse } from "@/service/type";

export type ProjectList = {
  id: number;
  code: string;
  name: string;
  owner: string;
  address: string;
  contractValue: number;
  contractAdvance: number;
  remainingAmount: number;
  signDate: string;
  deliveryDate: string;
  state: string;
};

export type Response = {
  GET: PageResponse<ProjectList[]>;
};

export type RequestBody = {
  GET: {
    search?: string;
    page?: number;
    size?: number;
  };
};
