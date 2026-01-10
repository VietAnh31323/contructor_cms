import { ConsApi } from "@/config/axios";
import { RequestBody } from "./type";

export const postProjectProgress = async (body: RequestBody["SAVE"]) => {
  const res = await ConsApi.post("/api/v1/project-progress", body);
  return res.data;
};

export const putProjectProgress = async (
  id: number,
  body: RequestBody["SAVE"]
) => {
  const res = await ConsApi.put(`/api/v1/project-progress?id=${id}`, body);
  return res.data;
};
