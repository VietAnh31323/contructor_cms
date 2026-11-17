import { PriorityLevel } from "../Project/gantt/type";
import { BuildingType } from "../Project/getDetail/type";

export type ProcessTemplateTaskItem = {
  id?: number;
  stageId?: number;
  name: string;
  sortOrder?: number;
  offsetDays?: number;
  durationDays?: number;
  priority?: PriorityLevel;
  description?: string;
};

export type ProcessTemplateStageItem = {
  id?: number;
  templateId?: number;
  name: string;
  sortOrder?: number;
  durationDays?: number;
  description?: string;
  tasks?: ProcessTemplateTaskItem[];
};

export type ProcessTemplateItem = {
  id?: number;
  code?: string;
  name: string;
  buildingType: BuildingType;
  buildingTypeLabel?: string;
  description?: string;
  isActive?: boolean;
  isDefault?: boolean;
  stageCount?: number;
  taskCount?: number;
  stages?: ProcessTemplateStageItem[];
};
