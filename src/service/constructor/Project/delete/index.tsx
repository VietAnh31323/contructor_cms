import { ConsApi } from "@/config/axios";
import { RequestParams, Response } from "./type";

export const deleteProject = async ({ id }: { id: number }) => {
  const res = await ConsApi.delete("/api/v1/project", { params: { id } });
  return res.data;
};
