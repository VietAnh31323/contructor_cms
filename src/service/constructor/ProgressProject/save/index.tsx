import { ConsApi } from "@/config/axios";
import { RequestBody } from "./type";

export const postProgressProject = async (body: RequestBody["SAVE"]) => {
  const res = await ConsApi.post("/api/v1/progress", body);
  return res.data;
};

export const putProgressProject = async (
  id: number,
  body: RequestBody["SAVE"]
) => {
  const res = await ConsApi.put(`/api/v1/progress?id=${id}`, body);
  return res.data;
};
