import { ConsApi } from "@/config/axios";
import { RequestParams, Response } from "./type";

export const deleteEmployee = async ({ id }: { id: number }) => {
  const res = await ConsApi.delete("/api/v1/staff", { params: { id } });
  return res.data;
};
