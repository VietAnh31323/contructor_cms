import { ConsApi } from "@/config/axios";
import { RequestBody } from "./type";

export const postProject = async (body: RequestBody["SAVE"]) => {
  const res = await ConsApi.post("/api/v1/project", body);
  return res.data;
};

export const putProject = async (id: number, body: RequestBody["SAVE"]) => {
  const res = await ConsApi.put(`/api/v1/project?id=${id}`, body);
  return res.data;
};
