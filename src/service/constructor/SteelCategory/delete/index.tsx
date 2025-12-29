import { ConsApi } from "@/config/axios";
import { RequestParams, Response } from "./type";

export const deleteSteelCategory = async ({ id }: { id: number }) => {
  const res = await ConsApi.delete("/api/v1/steel-category", {
    params: { id },
  });
  return res.data;
};
