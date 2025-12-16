import { PageResponse } from "@/service/type";

export type CustomerList = {
  id: number;
  code: string;
  name: string;
  phone: string;
  email: string;
  contactStatus: string;
  isPotential: boolean;
  description: string;
  note: string;
};

export type Response = {
  GET: PageResponse<CustomerList[]>;
};

export type RequestBody = {
  GET: {
    search?: string;
    page?: number;
    size?: number;
  };
};
