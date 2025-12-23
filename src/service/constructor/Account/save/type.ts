export type AccountSave = {
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

export type RequestBody = {
  SAVE: AccountSave;
};
