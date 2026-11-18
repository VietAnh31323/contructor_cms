import { ConsApi } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";
import { ScheduleStatus } from "../Project/gantt/type";

/** 2.21: Giai đoạn tiến độ của dự án */
export type ProjectPhase = {
  projectProgressId: number;
  projectId: number;
  progressId?: number | null;
  progressCode?: string | null;
  progressName: string;
  newProgressName?: string;
  sortOrder?: number | null;
  plannedStartDate?: string | null;
  plannedEndDate?: string | null;
  actualStartDate?: string | null;
  actualEndDate?: string | null;
  weight?: number;
  progressPercent?: number;
  note?: string | null;
  taskCount?: number;
  completedTaskCount?: number;
  pendingReviewTaskCount?: number;
  overdueTaskCount?: number;
  delayDays?: number;
  scheduleStatus?: ScheduleStatus;
};

/** 2.24: Tổng hợp tiến độ theo dự án */
export type ProjectProgressSummary = {
  projectId: number;
  progressPercent: number;
  phaseCount: number;
  totalTasks: number;
  notStartedTasks: number;
  inProgressTasks: number;
  pendingReviewTasks: number;
  returnedTasks: number;
  completedTasks: number;
  overdueTasks: number;
  plannedEndDate?: string | null;
  nextDeadline?: string | null;
  delayDays?: number;
  scheduleStatus?: ScheduleStatus;
};

const unwrap = <T,>(res: any): T => (res?.data?.data ?? res?.data) as T;

export const getProjectPhases = async (projectId: number) =>
  unwrap<ProjectPhase[]>(
    await ConsApi.get(`/api/v1/project-progress/${projectId}/phases`)
  );

export const useProjectPhasesQuery = (projectId?: number) =>
  useQuery({
    queryKey: ["project-phases", projectId],
    queryFn: () => getProjectPhases(projectId as number),
    enabled: Boolean(projectId),
  });

export const updateProjectPhase = async (
  projectProgressId: number,
  body: Partial<ProjectPhase>
) =>
  unwrap<ProjectPhase>(
    await ConsApi.put(`/api/v1/project-progress/phases/${projectProgressId}`, body)
  );

export const deleteProjectPhase = async (projectProgressId: number) =>
  unwrap<void>(
    await ConsApi.delete(`/api/v1/project-progress/phases/${projectProgressId}`)
  );

export const reorderProjectPhases = async (
  projectId: number,
  orderedIds: number[]
) =>
  unwrap<ProjectPhase[]>(
    await ConsApi.put(`/api/v1/project-progress/${projectId}/phases/reorder`, {
      orderedIds,
    })
  );

export const recalculateProjectProgress = async (projectId: number) =>
  unwrap<number>(
    await ConsApi.post(`/api/v1/project-progress/${projectId}/recalculate`)
  );

export const getProjectProgressSummaries = async (projectIds: number[]) => {
  if (!projectIds.length) return [] as ProjectProgressSummary[];
  return unwrap<ProjectProgressSummary[]>(
    await ConsApi.get(`/api/v1/project-progress/summary`, {
      params: { projectIds: projectIds.join(",") },
    })
  );
};

export const useProjectProgressSummariesQuery = (projectIds: number[]) =>
  useQuery({
    queryKey: ["project-progress-summary", projectIds],
    queryFn: () => getProjectProgressSummaries(projectIds),
    enabled: projectIds.length > 0,
  });
