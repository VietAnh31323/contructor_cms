import { ProjectProgressDetail } from "../getDetail/type";

export type ProjectProgressSave = ProjectProgressDetail;

export type RequestBody = {
  SAVE: ProjectProgressSave;
};
