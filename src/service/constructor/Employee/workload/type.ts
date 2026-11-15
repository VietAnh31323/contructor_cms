import { ProjectState } from "../../Project/getList/type";

export type StaffProjectItem = {
  id: number;
  code: string;
  name: string;
  owner?: string | null;
  address?: string | null;
  state: ProjectState;
  progressPercent?: number | null;
  signDate?: string | null;
  deliveryDate?: string | null;
  overdue: boolean;
  rolesInProject: string[];
  staffTaskCount: number;
  staffActiveTaskCount: number;
};

export type StaffTaskItem = {
  id: number;
  code: string;
  name: string;
  parentId?: number | null;
  parentTaskCode?: string | null;
  parentTaskName?: string | null;
  projectId?: number | null;
  projectCode?: string | null;
  projectName?: string | null;
  progressId?: number | null;
  progressName?: string | null;
  rolesInTask: string[];
  priorityLevel?: "LOW" | "MEDIUM" | "HIGH" | null;
  state: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  progressPercent?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  overdue: boolean;
  dueSoon: boolean;
};

export type StaffWorkload = {
  staffId: number;
  staffCode: string;
  staffName: string;
  position?: string | null;
  department?: string | null;

  totalProjects: number;
  activeProjects: number;
  managedActiveProjects: number;
  completedProjects: number;

  totalTasks: number;
  notStartedTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  activeTasks: number;
  overdueTasks: number;
  dueSoonTasks: number;
  highPriorityActiveTasks: number;

  workloadLevel: "NORMAL" | "HIGH" | "OVERLOADED";

  projects: StaffProjectItem[];
  tasks: StaffTaskItem[];
};
