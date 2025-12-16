import { CustomerList } from "../getList/type";

export type CustomerSave = CustomerList;

export type RequestBody = {
  SAVE: CustomerSave;
};
