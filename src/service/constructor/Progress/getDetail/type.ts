import { BaseResponse } from "@/service/type";

export type ProjectProgressDetail = {
  id: number;
  code: string;
  name: string;
  owner: string;
  address: string;
  signDate: string;
  deliveryDate: string;
  creator: Creator;
  manager: Manager;
  supporter: Supporter;
  description: string;
  note: string;
  state: string;
  progressPercent: number;
  projectProgress: ProjectProgress[];
};
export interface Creator {
  id: number;
  code: string;
  name: string;
}

export interface Manager {
  id: number;
  code: string;
  name: string;
}

export interface Supporter {
  id: number;
  code: string;
  name: string;
}

export interface ProjectProgress {
  id: number;
  progress: Progress;
  tasks: Task[];
}

export interface Progress {
  id: number;
  code: string;
  name: string;
}

export interface Task {
  id: number;
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  remainDay: number;
  reviewer: Reviewer;
  staffs: Staff[];
  progressPercent: number;
  state: string;
  priorityLevel: string;
}

export interface Reviewer {
  id: number;
  avatar: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
}

export interface Staff {
  id: number;
  code: string;
  name: string;
}
export type Response = {
  GET: BaseResponse<ProjectProgressDetail>;
};

export type RequestParams = {
  GET: {
    id: number;
  };
};
