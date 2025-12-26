import { BaseResponse } from "@/service/type";
import { ProjectSave } from "../save/type";

export type ProjectDetail = ProjectSave;

export type Response = {
  GET: BaseResponse<ProjectDetail>;
};

export type RequestParams = {
  GET: {
    id: number;
  };
};
