import { ConsApi } from "@/config/axios";
import { ProjectCategoryMapDto, ProjectDetail } from "../getDetail/type";

export const postProject = async (body: ProjectDetail) => {
  const res = await ConsApi.post("/api/v1/project", body);
  return res.data;
};

export const putProject = async (id: number, body: ProjectDetail) => {
  const res = await ConsApi.put("/api/v1/project", { ...body, id });
  return res.data;
};

export const deleteProject = async (params: { id: number }) => {
  const res = await ConsApi.delete("/api/v1/project", { params });
  return res.data;
};

export const saveProjectCategories = async (
  projectId: number,
  categories: ProjectCategoryMapDto[]
): Promise<{ message?: string; data: ProjectCategoryMapDto[] }> => {
  const res = await ConsApi.put(
    `/api/v1/project/${projectId}/categories`,
    categories
  );
  return res.data;
};
