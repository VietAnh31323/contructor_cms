import { ConsApi } from "@/config/axios";
import { RequestParams, Response } from "./type";

export const deleteSteel = async ({ id }: { id: number }) => {
  const res = await ConsApi.delete("/api/v1/steel", { params: { id } });
  return res.data;
};
