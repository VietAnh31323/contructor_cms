import { ConsApi } from "@/config/axios";
import { defaultOption } from "@/config/reactQuery";
import { BaseResponse } from "@/service/type";
import { useQuery } from "@tanstack/react-query";
import {
  CreateGanttPhaseRequest,
  CreateGanttTaskRequest,
  ProjectGanttResponse,
  TaskState,
} from "./type";

export const getProjectGantt = async (
  projectId: number
): Promise<ProjectGanttResponse> => {
  const { data } = await ConsApi.get<ProjectGanttResponse>(
    `/api/v1/project/${projectId}/gantt`
  );
  return data;
};

export const useProjectGanttQuery = (projectId?: number, options?: any) => {
  return useQuery<ProjectGanttResponse>({
    queryKey: ["project-gantt", projectId],
    queryFn: () => getProjectGantt(projectId as number),
    ...defaultOption,
    enabled: Boolean(projectId) && (options?.enabled ?? true),
    ...options,
  });
};

export const postProjectGanttPhase = async (
  projectId: number,
  body: CreateGanttPhaseRequest
): Promise<BaseResponse<{ id: number }>> => {
  const { data } = await ConsApi.post<BaseResponse<{ id: number }>>(
    `/api/v1/project/${projectId}/gantt/phases`,
    body
  );
  return data;
};

export const deleteProjectGanttPhase = async (
  projectId: number,
  projectProgressId: number
) => {
  const { data } = await ConsApi.delete(
    `/api/v1/project/${projectId}/gantt/phases/${projectProgressId}`
  );
  return data;
};

export const postProjectGanttTask = async (
  projectId: number,
  body: CreateGanttTaskRequest
): Promise<BaseResponse<{ id: number }>> => {
  const { data } = await ConsApi.post<BaseResponse<{ id: number }>>(
    `/api/v1/project/${projectId}/gantt/tasks`,
    body
  );
  return data;
};

export const putUpdateTaskState = async (body: {
  id: number;
  state: TaskState;
  /** 2.23: bắt buộc khi Trả lại */
  reason?: string;
}) => {
  const { data } = await ConsApi.put("/api/v1/task/update-state", body);
  return data;
};
