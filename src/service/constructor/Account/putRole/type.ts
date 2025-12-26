import { AccountDetail } from "../getDetail/type";

export type UpdateRole = {
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
export type RequestBody = {
  SAVE: UpdateRole;
};
