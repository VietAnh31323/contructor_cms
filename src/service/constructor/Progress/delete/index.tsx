import { ConsApi } from "@/config/axios";
import { RequestParams, Response } from "./type";

export const deleteProgress = async ({ id }: { id: number }) => {
  const res = await ConsApi.delete("/api/v1/progress", { params: { id } });
  return res.data;
};

export const deleteProgressProject = deleteProgress;
