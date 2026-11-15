import { ConsApi } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";
import { CustomerPipelineStage } from "../getList/type";
import { Response } from "./type";

export const getCustomerPipelineSummary = async (): Promise<
  Response["SUMMARY"]
> => {
  const res = await ConsApi.get("/api/v1/customer/pipeline-summary");
  return {
    message: res.data.message,
    traceId: res.data.traceId,
    data: res.data.data,
  };
};

export const patchCustomerPipelineStage = async (
  customerId: number,
  body: { pipelineStage: CustomerPipelineStage; note?: string }
) => {
  const res = await ConsApi.patch(
    `/api/v1/customer/${customerId}/pipeline-stage`,
    body
  );
  return res.data;
};

export const useCustomerPipelineSummaryQuery = () =>
  useQuery({
    queryKey: ["customer-pipeline-summary"],
    queryFn: getCustomerPipelineSummary,
  });
