import { ConsApi } from "@/config/axios";
import { RequestParams, Response } from "./type";

export const deleteAssembly = async ({ id }: { id: number }) => {
  const res = await ConsApi.delete("/api/v1/assembly", { params: { id } });
  return res.data;
};
