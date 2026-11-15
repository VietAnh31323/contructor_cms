import { BaseResponse } from "@/service/type";
import { CodeNameRef } from "../../Customer/getList/type";
import { ProjectState } from "../getList/type";

export type ProjectLifecycleStageItem = {
  state: ProjectState;
  label: string;
  stepOrder: number;
  projectCount: number;
  totalContractValue: number;
};

export type ProjectLifecycleSummary = {
  totalProjects: number;
  activeProjects: number;
  pausedProjects: number;
  cancelledProjects: number;
  closedProjects: number;
  totalContractValue: number;
  stages: ProjectLifecycleStageItem[];
};

export type ProjectStateTransitionRequest = {
  toState: ProjectState;
  reason?: string;
  actualHandoverDate?: string | null;
  warrantyEndDate?: string | null;
};

export type ProjectStateLogItem = {
  id: number;
  projectId: number;
  fromState?: ProjectState | null;
  fromStateLabel?: string | null;
  toState: ProjectState;
  toStateLabel: string;
  reason?: string | null;
  changedByStaffId?: number | null;
  changedByStaff?: CodeNameRef | null;
  changedByUsername?: string | null;
  createdAt?: string | null;
};

export type LifecycleSummaryResponse = BaseResponse<ProjectLifecycleSummary>;
export type ProjectStateLogListResponse = BaseResponse<ProjectStateLogItem[]>;
