import { ConsApi } from "@/config/axios";
import { RequestBody } from "./type";

export const postTask = async (body: RequestBody["SAVE"]) => {
  const res = await ConsApi.post("/api/v1/task", body);
  return res.data;
};

// export const putTask = async (id: number, body: RequestBody["SAVE"]) => {
//   const res = await ConsApi.put(`/api/v1/task?id=${id}`, body);
//   return res.data;
// };
