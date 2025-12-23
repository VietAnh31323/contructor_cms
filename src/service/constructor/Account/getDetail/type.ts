import { BaseResponse } from "@/service/type";

export type AccountDetail = {
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
  genPassword: string;
};

export type Response = {
  GET: BaseResponse<AccountDetail>;
};

export type RequestBody = {
  GET: {};
};
