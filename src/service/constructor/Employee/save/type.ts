import { EmployeeList } from "../getList/type";

export type EmployeeSave = EmployeeList;

export type RequestBody = {
  SAVE: EmployeeSave;
};
