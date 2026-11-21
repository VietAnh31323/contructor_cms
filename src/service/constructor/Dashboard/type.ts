export interface StateCountDto {
  state: string;
  label: string;
  count: number;
}

export interface MonthlyCashflowDto {
  month: string;
  collectedAmount: number;
  plannedAmount: number;
}

export interface DashboardAlertDto {
  alertType: string;
  severity: "ERROR" | "WARNING" | "INFO";
  title: string;
  subtitle: string;
  dueDate?: string;
  link?: string;
}

export interface MyTaskItemDto {
  id: number;
  code: string;
  name: string;
  projectId?: number;
  projectName?: string;
  state: string;
  stateLabel: string;
  progressPercent: number;
  endDate?: string;
  overdue: boolean;
}

export interface DashboardOverviewDto {
  totalProjects: number;
  activeProjects: number;
  overdueProjects: number;
  overdueTasks: number;
  pendingApprovalTasks: number;
  myOpenTasksCount: number;
  totalContractValue: number;
  totalCollectedAmount: number;
  receivableTotal: number;
  collectedThisMonth: number;
  projectsByState: StateCountDto[];
  monthlyCashflow: MonthlyCashflowDto[];
  alerts: DashboardAlertDto[];
  myTasks: MyTaskItemDto[];
}

export interface ProjectReportItemDto {
  projectId: number;
  projectCode: string;
  projectName: string;
  customerName?: string;
  state: string;
  stateLabel: string;
  signDate?: string;
  deliveryDate?: string;
  overdue: boolean;
  progressPercent: number;
  contractValue: number;
  collectedAmount: number;
  remainingReceivable: number;
  estimatedCost: number;
  estimatedProfit: number;
  profitMarginPercent: number;
  totalSteelWeightKg: number;
  completedPhases: number;
  totalPhases: number;
}

export interface ProjectReportSummaryResponse {
  totalContractValue: number;
  totalCollected: number;
  totalReceivable: number;
  totalEstimatedCost: number;
  totalEstimatedProfit: number;
  averageProgressPercent: number;
  projects: ProjectReportItemDto[];
}
