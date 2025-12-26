import { PageResponse } from "@/service/type";

export type EmployeeList = {
  id: number;
  code: string;
  email: string;
  position: string;
  firstName: string;
  lastName: string;
  name: string;
  avatar: string;
  birthDate: string;
  address: string;
  phone: string;
  gender: string;
  description: string;
  genPassword: string;
};

export type Response = {
  GET: PageResponse<EmployeeList[]>;
};

export type RequestBody = {
  GET: {
    search?: string;
    page?: number;
    size?: number;
  };
};
