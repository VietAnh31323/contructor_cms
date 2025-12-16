import { ConsApi } from "@/config/axios";
import { RequestBody } from "./type";

export const postCustomer = async (body: RequestBody["SAVE"]) => {
  const res = await ConsApi.post("/api/v1/customer", body);
  return res.data;
};

export const putCustomer = async (id: number, body: RequestBody["SAVE"]) => {
  const res = await ConsApi.put(`/api/v1/customer?id=${id}`, body);
  return res.data;
};
