import { PageResponse } from "@/service/type";

export type AccountList = {
  id: number;
  username: string;
  roles: Role[];
  staff: Staff;
};
export interface Role {
  id: number;
  name: string;
}

export interface Staff {
  id: number;
  username: string;
  roles: Role[];
  staff: Staff;
}
export interface Role {
  id: number;
  name: string;
}

export interface Staff {
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
}

export type Response = {
  GET: PageResponse<AccountList[]>;
};

export type RequestBody = {
  GET: {
    search?: string;
    page?: number;
    size?: number;
  };
};
