import { ConsApi } from "@/config/axios";
import { RequestBody } from "./type";

export const Login = async (body: RequestBody["SAVE"]) => {
  const res = await ConsApi.post("/sign-in", body);
  return res.data;
};
