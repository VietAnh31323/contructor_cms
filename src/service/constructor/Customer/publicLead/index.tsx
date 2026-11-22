import { ConsApi } from "@/config/axios";
import {
  AiHouseDesignRequest,
  AiHouseDesignResponse,
  PublicCustomerLeadPayload,
  Response,
} from "./type";

export const submitPublicCustomerLead = async (
  body: PublicCustomerLeadPayload
): Promise<Response["POST"]> => {
  const res = await ConsApi.post("/public/customer-lead", body);
  return {
    message: res.data?.message || "Gửi thông tin thành công",
    traceId: res.data?.traceId || "",
    data: res.data?.data ?? res.data,
  };
};

export const generateAiHouseDesign = async (
  body: AiHouseDesignRequest
): Promise<AiHouseDesignResponse> => {
  const res = await ConsApi.post("/public/customer-lead/ai-design", body);
  return res.data?.data ?? res.data;
};
