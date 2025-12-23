export type ChangePassword = {
  oldPassword: string;
  newPassword: string;
};

export type RequestBody = {
  SAVE: ChangePassword;
};
