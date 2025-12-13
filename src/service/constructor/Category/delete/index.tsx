import { ConsApi } from "@/config/axios";
import { RequestParams, Response } from "./type";

export const deleteCategory = async ({ id }: { id: number }) => {
  const res = await ConsApi.delete("/api/v1/category", { params: { id } });
  return res.data;
};
