import { ConsApi } from "@/config/axios";
import { RequestBody } from "./type";


export const putChangePass = async (body: RequestBody["SAVE"]) => {
  const res = await ConsApi.put(`/api/v1/account/change-password`, body);
  return res.data;
};
