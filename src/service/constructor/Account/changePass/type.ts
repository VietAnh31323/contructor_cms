export type ChangePassword = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type RequestBody = {
  SAVE: ChangePassword;
};
