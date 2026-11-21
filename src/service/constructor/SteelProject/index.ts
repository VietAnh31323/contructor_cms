import { ConsApi } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";
import {
  SteelCategoryLineDto,
  SteelCategoryOutput,
  SteelImportResultDto,
  SteelProjectDto,
  SteelProjectListParams,
  SteelProjectOutput,
} from "./type";

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const getSteelProjectList = async (
  params: SteelProjectListParams
): Promise<PageResponse<SteelProjectOutput>> => {
  const { data } = await ConsApi.get("/api/v1/steel-project/list", {
    params: {
      search: params.search || undefined,
      projectId: params.projectId || undefined,
      page: params.page ?? 0,
      size: params.size ?? 20,
    },
  });
  return data?.data ?? data;
};

export const getSteelProjectDetail = async (
  id: number
): Promise<SteelProjectDto> => {
  const { data } = await ConsApi.get("/api/v1/steel-project", {
    params: { id },
  });
  return data?.data ?? data;
};

export const createSteelProject = async (
  body: SteelProjectDto
): Promise<{ id: number }> => {
  const { data } = await ConsApi.post("/api/v1/steel-project", body);
  return data?.data ?? data;
};

export const updateSteelProject = async (
  body: SteelProjectDto
): Promise<{ id: number }> => {
  const { data } = await ConsApi.put("/api/v1/steel-project", body);
  return data?.data ?? data;
};

export const deleteSteelProject = async (id: number): Promise<void> => {
  await ConsApi.delete("/api/v1/steel-project", { params: { id } });
};

export const exportSteelProjectExcel = async (id: number): Promise<Blob> => {
  const { data } = await ConsApi.get(
    `/api/v1/steel-project/${id}/export-excel`,
    { responseType: "blob" }
  );
  return data;
};

export const exportSteelProjectPdf = async (id: number): Promise<Blob> => {
  const { data } = await ConsApi.get(
    `/api/v1/steel-project/${id}/export-pdf`,
    { responseType: "blob" }
  );
  return data;
};

export const downloadSteelImportTemplate = async (): Promise<Blob> => {
  const { data } = await ConsApi.get("/api/v1/steel-project/import-template", {
    responseType: "blob",
  });
  return data;
};

export const importSteelProjectExcel = async (
  id: number,
  file: File,
  replaceExisting: boolean
): Promise<SteelImportResultDto> => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await ConsApi.post(
    `/api/v1/steel-project/${id}/import-excel`,
    formData,
    {
      params: { replaceExisting },
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return data?.data ?? data;
};

export const getSteelCategoryList = async (): Promise<
  PageResponse<SteelCategoryOutput>
> => {
  const { data } = await ConsApi.get("/api/v1/steel-category/list", {
    params: { page: 0, size: 100, isActive: true },
  });
  return data?.data ?? data;
};

export const getSteelCategoryLines = async (
  steelCategoryId: number
): Promise<SteelCategoryLineDto[]> => {
  const { data } = await ConsApi.get("/api/v1/steel-category/line/list", {
    params: { steelCategoryId },
  });
  return data?.data ?? data ?? [];
};

export const useSteelProjectListQuery = (
  params: SteelProjectListParams,
  options?: { enabled?: boolean }
) =>
  useQuery({
    queryKey: ["/api/v1/steel-project/list", params],
    queryFn: () => getSteelProjectList(params),
    enabled: options?.enabled ?? true,
  });

export const useSteelProjectDetailQuery = (
  id?: number,
  options?: { enabled?: boolean }
) =>
  useQuery({
    queryKey: ["/api/v1/steel-project", id],
    queryFn: () => getSteelProjectDetail(id as number),
    enabled: Boolean(id) && (options?.enabled ?? true),
  });

export const useSteelCategoryListQuery = () =>
  useQuery({
    queryKey: ["/api/v1/steel-category/list"],
    queryFn: getSteelCategoryList,
  });
