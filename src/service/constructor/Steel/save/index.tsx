import { ConsApi } from "@/config/axios";
import { RequestBody } from "./type";

export const postSteel = async (body: RequestBody["SAVE"]) => {
  const res = await ConsApi.post("/api/v1/steel", body);
  return res.data;
};

export const putSteel = async (body: RequestBody["SAVE"]) => {
  const res = await ConsApi.put(`/api/v1/steel`, body);
  return res.data;
};
