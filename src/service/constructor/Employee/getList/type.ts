import { PageResponse } from "@/service/type";

export type CustomerList = {
  id: number;
  code: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string;
  position: string;
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
