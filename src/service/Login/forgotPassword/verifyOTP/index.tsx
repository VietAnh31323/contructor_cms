import { ConsApi } from "@/config/axios";
import { RequestBody } from "./type";

export const VerifyOTP = async (body: RequestBody["SAVE"]) => {
  const res = await ConsApi.post("/password/verify-otp", body);
  return res.data;
};
