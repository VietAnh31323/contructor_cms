import { ConsApi } from "@/config/axios";
import { RequestBody } from "./type";

export const ResetPassword = async (body: RequestBody["SAVE"]) => {
  const token = localStorage.getItem("otpToken");
  const scheme = localStorage.getItem("otpScheme");

  const res = await ConsApi.post("/password/reset", body, {
    headers: {
      Authorization: `${scheme} ${token}`,
    },
  });
  return res.data;
};
