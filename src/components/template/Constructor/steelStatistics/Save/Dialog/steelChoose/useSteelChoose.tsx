import { useDialog } from "@/components/hooks/dialog/useDialog";
import { useFormCustom } from "@/lib/form";
import { ROUTES } from "@/routes";
import { useSteelCategoryListQuery } from "@/service/constructor/SteelCategory/getList";
import { postTask } from "@/service/constructor/Task/save";
import { RequestBody } from "@/service/constructor/Task/save/type";
import { toastError, toastSuccess } from "@/toast";
import { useMutation } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

export default function useSteelChoose() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const lastFormData = useRef<any>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { hideDialog } = useDialog();
  const actionType = searchParams.get("actionType");
  const isView = actionType === "VIEW";

  const methodForm = useFormCustom<any>({
    defaultValues: {
      params: {},
    },
  });

  const { reset, handleSubmit, control, getValues } = methodForm;

  const id = Number(params?.id);
  const isUpdate = !!id;
  const buildStaffNames = (taskStaffMaps: any) => {
    if (!Array.isArray(taskStaffMaps)) return "--";

    return (
      taskStaffMaps
        .map((item) => item?.staff?.name)
        .filter(Boolean)
        .join(", ") || "--"
    );
  };

  const calcRemainingDays = (start: string, end: string) => {
    if (!start || !end) return "--";

    const startDate = new Date(start);
    const endDate = new Date(end);

    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Đã quá hạn";
    if (diffDays === 0) return "0 ngày";

    return `${diffDays} ngày`;
  };
  const { data, isLoading } = useSteelCategoryListQuery();

  const { mutate } = useMutation({
    mutationFn: (body: RequestBody["SAVE"]) => postTask(body),
    onSuccess: (res) => {
      toastSuccess("Thành công");

      const formData = lastFormData.current;
      if (!formData) return;

      const remainingTime = calcRemainingDays(
        formData.startDate,
        formData.endDate
      );

      const staffNames = Array.isArray(formData.taskStaffMaps)
        ? formData.taskStaffMaps.map((s: any) => s.name).join(", ")
        : "--";

      const row = {
        id: res.data.id,
        code: formData.code,
        name: formData.name,
        startTime: formData.startDate,
        endTime: formData.endDate,
        remainingTime,
        reviewer: res.data.reviewer?.name ?? "Bạn",
        taskStaffMaps: staffNames,
        progress: 0,
        state: formData.state,
      };

      console.log("ROW CREATED:", row);

      hideDialog();
    },

    onError: (error: any) => {
      toastError(error?.message || "Có lỗi xảy ra");
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutate(data);
  });

  return [
    { isView, page, rowsPerPage, control, isUpdate, id, data },
    { setPage, setRowsPerPage, onSubmit },
  ];
}
