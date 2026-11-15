import { BaseResponse } from "@/service/type";
import { CustomerPipelineStage } from "../getList/type";

export type PipelineStageSummaryItem = {
  stage: CustomerPipelineStage;
  label: string;
  stepOrder: number;
  customerCount: number;
  projectCount: number;
  totalContractValue: number;
};

export type CustomerPipelineSummary = {
  totalCustomers: number;
  individualCustomers: number;
  businessCustomers: number;
  upcomingFollowUps: number;
  overdueFollowUps: number;
  totalContractValue: number;
  stages: PipelineStageSummaryItem[];
};

export type Response = {
  SUMMARY: BaseResponse<CustomerPipelineSummary>;
};
