import { EmployeeList } from "../getList/type";

export type EmployeeSave = {
  id: number;
  code: string;
  email: string;
  position: string;
  firstName: string;
  lastName: string;
  avatar: string;
  birthDate: string;
  address: string;
  phone: string;
  gender: string;
  description: string;
  password: string;
};

export type RequestBody = {
  SAVE: EmployeeSave;
};
