export type VerifyOTP = {
  username: string;
  otp: string;
  token: string;
  authScheme: string;
};

export type RequestBody = {
  SAVE: VerifyOTP;
};
