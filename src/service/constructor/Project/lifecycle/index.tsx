import { ConsApi } from "@/config/axios";
import { defaultOption } from "@/config/reactQuery";
import { BaseResponse } from "@/service/type";
import { useQuery } from "@tanstack/react-query";
import { ProjectDetail } from "../getDetail/type";
import {
  LifecycleSummaryResponse,
  ProjectStateLogListResponse,
  ProjectStateTransitionRequest,
} from "./type";

export const getProjectLifecycleSummary =
  async (): Promise<LifecycleSummaryResponse> => {
    const { data } = await ConsApi.get<LifecycleSummaryResponse>(
      "/api/v1/project/lifecycle-summary"
    );
    return data;
  };

export const useProjectLifecycleSummaryQuery = (options?: any) => {
  return useQuery<LifecycleSummaryResponse>({
    queryKey: ["project-lifecycle-summary"],
    queryFn: () => getProjectLifecycleSummary(),
    ...defaultOption,
    ...options,
  });
};

export const patchProjectState = async (
  projectId: number,
  body: ProjectStateTransitionRequest
): Promise<BaseResponse<ProjectDetail>> => {
  const { data } = await ConsApi.patch<BaseResponse<ProjectDetail>>(
    `/api/v1/project/${projectId}/state`,
    body
  );
  return data;
};

export const getProjectStateLogs = async (
  projectId: number
): Promise<ProjectStateLogListResponse> => {
  const { data } = await ConsApi.get<ProjectStateLogListResponse>(
    `/api/v1/project/${projectId}/state-logs`
  );
  return data;
};

export const useProjectStateLogsQuery = (
  projectId?: number,
  options?: any
) => {
  return useQuery<ProjectStateLogListResponse>({
    queryKey: ["project-state-logs", projectId],
    queryFn: () => getProjectStateLogs(projectId as number),
    ...defaultOption,
    enabled: !!projectId && (options?.enabled ?? true),
    ...options,
  });
};
