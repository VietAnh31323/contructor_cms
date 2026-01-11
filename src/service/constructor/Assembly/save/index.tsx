import { ConsApi } from "@/config/axios";
import { RequestBody } from "./type";

export const postAssembly = async (body: RequestBody["SAVE"]) => {
  const res = await ConsApi.post("/api/v1/assembly", body);
  return res.data;
};

export const putAssembly = async (body: RequestBody["SAVE"]) => {
  const res = await ConsApi.put(`/api/v1/assembly`, body);
  return res.data;
};
