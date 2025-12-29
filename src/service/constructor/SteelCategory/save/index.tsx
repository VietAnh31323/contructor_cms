import { ConsApi } from "@/config/axios";
import { RequestBody } from "./type";

export const postSteelCategory = async (body: RequestBody["SAVE"]) => {
  const res = await ConsApi.post("/api/v1/steel-category", body);
  return res.data;
};

export const putSteelCategory = async (
  id: number,
  body: RequestBody["SAVE"]
) => {
  const res = await ConsApi.put(`/api/v1/steel-category?id=${id}`, body);
  return res.data;
};
