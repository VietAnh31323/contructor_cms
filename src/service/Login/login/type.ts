export type Login = {
  username: string;
  password: string;
  eRole: string;
};

export type RequestBody = {
  SAVE: Login;
};
