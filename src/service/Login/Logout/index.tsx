import { ConsApi } from "@/config/axios";
import { RequestBody } from "./type";

export const Logout = async (body: RequestBody["SAVE"]) => {
  const res = await ConsApi.post("/logout", body);
  return res.data;
};
