import { PageResponse } from "@/service/type";

export type EmployeeList = {
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
  GET: PageResponse<EmployeeList[]>;
};

export type RequestBody = {
  GET: {
    search?: string;
    page?: number;
    size?: number;
  };
};
