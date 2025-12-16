import { ConsApi } from "@/config/axios";
import { RequestParams, Response } from "./type";

export const deleteCustomer = async ({ id }: { id: number }) => {
  const res = await ConsApi.delete("/api/v1/customer", { params: { id } });
  return res.data;
};
