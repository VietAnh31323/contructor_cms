import { ConsApi } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";
import { DashboardOverviewDto, ProjectReportSummaryResponse } from "./type";

export const getDashboardOverview = async (): Promise<DashboardOverviewDto> => {
  const { data } = await ConsApi.get("/api/v1/dashboard/overview");
  return data?.data ?? data;
};

export const useDashboardOverviewQuery = () =>
  useQuery({
    queryKey: ["/api/v1/dashboard/overview"],
    queryFn: getDashboardOverview,
  });

export const getProjectReports = async (
  projectId?: number | null
): Promise<ProjectReportSummaryResponse> => {
  const { data } = await ConsApi.get("/api/v1/dashboard/project-report", {
    params: { projectId: projectId || undefined },
  });
  return data?.data ?? data;
};

export const useProjectReportsQuery = (projectId?: number | null) =>
  useQuery({
    queryKey: ["/api/v1/dashboard/project-report", projectId],
    queryFn: () => getProjectReports(projectId),
  });

export const downloadExcelFromUrl = async (
  url: string,
  filename: string,
  params?: Record<string, any>
) => {
  const { data } = await ConsApi.get(url, {
    params,
    responseType: "blob",
  });
  const blobUrl = window.URL.createObjectURL(data);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(blobUrl);
};
