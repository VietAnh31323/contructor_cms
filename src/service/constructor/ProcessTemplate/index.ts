import { ConsApi } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";
import { BuildingType } from "../Project/getDetail/type";
import { ProcessTemplateItem } from "./type";

export const getProcessTemplateList = async (
  buildingType?: BuildingType | ""
): Promise<{ data: ProcessTemplateItem[] }> => {
  const res = await ConsApi.get("/api/v1/process-template/list", {
    params: buildingType ? { buildingType } : undefined,
  });
  return res.data;
};

export const useProcessTemplateListQuery = (
  buildingType?: BuildingType | "",
  options?: { enabled?: boolean }
) =>
  useQuery({
    queryKey: ["process-templates", buildingType || "ALL"],
    queryFn: () => getProcessTemplateList(buildingType),
    enabled: options?.enabled !== false,
  });

export const getProcessTemplateDetail = async (
  id: number
): Promise<{ data: ProcessTemplateItem }> => {
  const res = await ConsApi.get(`/api/v1/process-template/${id}`);
  return res.data;
};

export const createProcessTemplate = async (body: ProcessTemplateItem) => {
  const res = await ConsApi.post("/api/v1/process-template", body);
  return res.data;
};

export const updateProcessTemplate = async (
  id: number,
  body: ProcessTemplateItem
) => {
  const res = await ConsApi.put(`/api/v1/process-template/${id}`, body);
  return res.data;
};

export const deleteProcessTemplate = async (id: number) => {
  const res = await ConsApi.delete(`/api/v1/process-template/${id}`);
  return res.data;
};

export const applyProcessTemplateToProject = async (
  projectId: number,
  templateId?: number
) => {
  const res = await ConsApi.post(
    `/api/v1/process-template/apply/${projectId}`,
    null,
    { params: templateId ? { templateId } : undefined }
  );
  return res.data;
};
