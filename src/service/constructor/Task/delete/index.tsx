import { ConsApi } from "@/config/axios";
import { RequestParams, Response } from "./type";

export const deleteTask = async ({ id }: { id: number }) => {
  const res = await ConsApi.delete("/api/v1/task", { params: { id } });
  return res.data;
};
