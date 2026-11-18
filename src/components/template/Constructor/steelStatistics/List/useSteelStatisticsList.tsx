import { useProjectListQuery } from "@/service/constructor/Project/getList";
import {
  deleteSteelProject,
  useSteelProjectListQuery,
} from "@/service/constructor/SteelProject";
import { SteelProjectOutput } from "@/service/constructor/SteelProject/type";
import { toastError, toastSuccess } from "@/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function useSteelStatisticsList() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [projectId, setProjectId] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  const { data: listResp, isLoading, refetch } = useSteelProjectListQuery({
    search,
    projectId,
    page,
    size: rowsPerPage,
  });

  const { data: projectListResp } = useProjectListQuery({
    page: 0,
    size: 100,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteSteelProject(id),
    onSuccess: () => {
      toastSuccess("Xóa bảng thống kê thép thành công");
      queryClient.invalidateQueries({
        queryKey: ["/api/v1/steel-project/list"],
      });
    },
    onError: (err) => {
      toastError(err, "Xóa bảng thống kê thép thất bại");
    },
  });

  const items: SteelProjectOutput[] = listResp?.content ?? [];
  const totalElements = listResp?.totalElements ?? 0;
  const totalPages = listResp?.totalPages ?? 0;
  const projects = projectListResp?.data?.content ?? [];

  return [
    {
      items,
      totalElements,
      totalPages,
      page,
      rowsPerPage,
      search,
      projectId,
      projects,
      isLoading,
      isDeleting: deleteMutation.isPending,
    },
    {
      setSearch: (val: string) => {
        setSearch(val);
        setPage(0);
      },
      setProjectId: (val: number | null) => {
        setProjectId(val);
        setPage(0);
      },
      setPage,
      setRowsPerPage: (size: number) => {
        setRowsPerPage(size);
        setPage(0);
      },
      onDelete: (id: number) => deleteMutation.mutate(id),
      refetch,
    },
  ] as const;
}
