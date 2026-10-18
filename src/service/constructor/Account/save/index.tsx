import { ConsApi } from "@/config/axios";
import { RequestBody } from "./type";


export const putAccount = async (body: RequestBody["SAVE"]) => {
  const res = await ConsApi.put(`/api/v1/account`, body);
  return res.data;
};
