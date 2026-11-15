import { BaseResponse } from "@/service/type";
import { CodeNameRef } from "../../Customer/getList/type";
import { ProjectState } from "../getList/type";

export type TaskState = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
export type PriorityLevel = "LOW" | "MEDIUM" | "HIGH";

export type GanttTaskItem = {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  parentId?: number | null;
  projectProgressId?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  durationDays: number;
  remainDays?: number | null;
  progressPercent: number;
  state: TaskState;
  priorityLevel?: PriorityLevel | null;
  overdue: boolean;
  reviewer?: CodeNameRef | null;
  assignees?: CodeNameRef[];
  subTasks?: GanttTaskItem[];
};

export type GanttPhaseItem = {
  projectProgressId: number;
  progressId?: number | null;
  progressCode?: string | null;
  progressName: string;
  startDate?: string | null;
  endDate?: string | null;
  progressPercent: number;
  taskCount: number;
  completedTaskCount: number;
  tasks: GanttTaskItem[];
};

export type GanttMilestoneItem = {
  key: string;
  type: "CONTRACT" | "PAYMENT" | "LIFECYCLE";
  title: string;
  subtitle?: string | null;
  date: string;
  amount?: number | null;
  status: "DONE" | "UPCOMING" | "OVERDUE" | "INFO";
};

export type ProjectGanttData = {
  projectId: number;
  projectCode: string;
  projectName: string;
  customerName?: string | null;
  managerName?: string | null;
  state: ProjectState;
  stateLabel: string;
  progressPercent: number;
  signDate?: string | null;
  deliveryDate?: string | null;
  actualHandoverDate?: string | null;
  warrantyEndDate?: string | null;
  timelineStartDate: string;
  timelineEndDate: string;
  totalPhases: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  notStartedTasks: number;
  overdueTasks: number;
  phases: GanttPhaseItem[];
  milestones: GanttMilestoneItem[];
};

export type CreateGanttPhaseRequest = {
  progressId?: number | null;
  newProgressName?: string;
  description?: string;
};

export type CreateGanttTaskRequest = {
  projectProgressId?: number | null;
  parentTaskId?: number | null;
  name: string;
  startDate: string;
  endDate: string;
  priorityLevel?: PriorityLevel;
  state?: TaskState;
  progressPercent?: number;
  reviewerId?: number | null;
  staffIds?: number[];
  description?: string;
};

export type ProjectGanttResponse = BaseResponse<ProjectGanttData>;
