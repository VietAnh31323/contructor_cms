export type TaskSave = {
  id: number;
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  reviewer: Reviewer;
  description: string;
  parent: Parent;
  state: string;
  priorityLevel: string;
  taskStaffMaps: TaskStaffMap[];
};
export interface Reviewer {
  id: number;
  code: string;
  name: string;
}

export interface Parent {
  id: number;
  code: string;
  name: string;
}

export interface TaskStaffMap {
  id: number;
  staff: Staff;
}

export interface Staff {
  id: number;
  code: string;
  name: string;
}
export type RequestBody = {
  SAVE: TaskSave;
};
