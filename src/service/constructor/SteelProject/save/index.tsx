import { ConsApi } from "@/config/axios";
import { RequestBody } from "./type";

export const postSteelProject = async (body: RequestBody["SAVE"]) => {
  const res = await ConsApi.post("/api/v1/steel-project", body);
  return res.data;
};

export const putSteelProject = async (
  id: number,
  body: RequestBody["SAVE"]
) => {
  const res = await ConsApi.put(`/api/v1/steel-project?id=${id}`, body);
  return res.data;
};
