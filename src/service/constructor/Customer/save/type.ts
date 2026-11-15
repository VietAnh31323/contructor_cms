import { CustomerItem } from "../getList/type";

export type CustomerSavePayload = Partial<CustomerItem> & {
  name: string;
};

export type RequestBody = {
  SAVE: CustomerSavePayload;
};
