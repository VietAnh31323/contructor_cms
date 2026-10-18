import { ProgressList } from "../getList/type";

export type ProgressSave = ProgressList;
export type ProgressProjectSave = ProgressSave;

export type RequestBody = {
  SAVE: ProgressSave;
};
