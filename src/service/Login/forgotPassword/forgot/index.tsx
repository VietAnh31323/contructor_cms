import { ConsApi } from "@/config/axios";
import { RequestBody } from "./type";

export const Forgot = async (body: RequestBody["SAVE"]) => {
  const res = await ConsApi.post("/password/forgot", body);
  return res.data;
};
