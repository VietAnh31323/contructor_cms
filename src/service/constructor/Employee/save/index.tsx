import { ConsApi } from "@/config/axios";
import { RequestBody } from "./type";

export const postEmployee = async (body: RequestBody["SAVE"]) => {
  const res = await ConsApi.post("/api/v1/staff", body);
  return res.data;
};

export const putEmployee = async (id: number, body: RequestBody["SAVE"]) => {
  const res = await ConsApi.put(`/api/v1/staff?id=${id}`, body);
  return res.data;
};
