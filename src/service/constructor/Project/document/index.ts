import { ConsApi } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";
import { ProjectDocumentFolder, ProjectDocumentItem } from "./type";

export const getProjectDocuments = async (
  projectId: number,
  folder?: ProjectDocumentFolder | ""
): Promise<{ message?: string; traceId?: string; data: ProjectDocumentItem[] }> => {
  const res = await ConsApi.get(`/api/v1/project/${projectId}/documents`, {
    params: folder ? { folder } : undefined,
  });
  return res.data;
};

export const useProjectDocumentsQuery = (
  projectId?: number,
  folder?: ProjectDocumentFolder | "",
  options?: { enabled?: boolean }
) =>
  useQuery({
    queryKey: ["project-documents", projectId, folder || "ALL"],
    queryFn: () => getProjectDocuments(projectId as number, folder),
    enabled: Boolean(projectId) && options?.enabled !== false,
  });

export const addProjectDocument = async (
  projectId: number,
  body: ProjectDocumentItem
) => {
  const res = await ConsApi.post(`/api/v1/project/${projectId}/documents`, body);
  return res.data;
};

export const updateProjectDocument = async (
  projectId: number,
  documentId: number,
  body: ProjectDocumentItem
) => {
  const res = await ConsApi.put(
    `/api/v1/project/${projectId}/documents/${documentId}`,
    body
  );
  return res.data;
};

export const deleteProjectDocument = async (
  projectId: number,
  documentId: number
) => {
  const res = await ConsApi.delete(
    `/api/v1/project/${projectId}/documents/${documentId}`
  );
  return res.data;
};
