import { BaseResponse } from "@/service/type";
import { CodeNameRef } from "../../Customer/getList/type";
import { ProjectState } from "../getList/type";

/** 2.23: Chưa làm → Đang làm → Chờ duyệt → Hoàn thành / Trả lại */
export type TaskState =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "PENDING_REVIEW"
  | "RETURNED"
  | "COMPLETED";
export type PriorityLevel = "LOW" | "MEDIUM" | "HIGH";

/** 2.26: So sánh kế hoạch – thực tế */
export type ScheduleStatus =
  | "NOT_SCHEDULED"
  | "ON_TRACK"
  | "AT_RISK"
  | "OVERDUE"
  | "COMPLETED_ON_TIME"
  | "COMPLETED_LATE";

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
  stateLabel?: string;
  priorityLevel?: PriorityLevel | null;
  overdue: boolean;
  reviewer?: CodeNameRef | null;
  assignees?: CodeNameRef[];
  // 2.22
  weight?: number;
  // 2.26
  actualStartDate?: string | null;
  actualEndDate?: string | null;
  delayDays?: number;
  scheduleStatus?: ScheduleStatus;
  // 2.23
  returnReason?: string | null;
  submittedAt?: string | null;
  reviewedAt?: string | null;
  hasChildren?: boolean;
  canReview?: boolean;
  allowedNextStates?: TaskState[];
  // 2.25 / 2.27
  siteReportCount?: number;
  commentCount?: number;
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
  // 2.21
  sortOrder?: number | null;
  plannedStartDate?: string | null;
  plannedEndDate?: string | null;
  actualStartDate?: string | null;
  actualEndDate?: string | null;
  weight?: number;
  note?: string | null;
  // 2.26
  overdueTaskCount?: number;
  delayDays?: number;
  scheduleStatus?: ScheduleStatus;
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
  // 2.23 / 2.26
  pendingReviewTasks?: number;
  returnedTasks?: number;
  atRiskTasks?: number;
  scheduleStatus?: ScheduleStatus;
  delayDays?: number;
  phases: GanttPhaseItem[];
  milestones: GanttMilestoneItem[];
};

export type CreateGanttPhaseRequest = {
  progressId?: number | null;
  newProgressName?: string;
  description?: string;
  plannedStartDate?: string | null;
  plannedEndDate?: string | null;
  weight?: number;
};

export type CreateGanttTaskRequest = {
  projectProgressId?: number | null;
  parentTaskId?: number | null;
  name: string;
  startDate: string;
  endDate: string;
  priorityLevel?: PriorityLevel;
  /** Chỉ NOT_STARTED / IN_PROGRESS khi tạo mới */
  state?: TaskState;
  weight?: number;
  reviewerId?: number | null;
  staffIds?: number[];
  description?: string;
};

export type ProjectGanttResponse = BaseResponse<ProjectGanttData>;
