import { useFormCustom } from "@/lib/form";
import { useProjectDetailQuery } from "@/service/constructor/Project/getDetail";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { RequestBody } from "@/service/constructor/Progress/save/type";
import { useMutation } from "@tanstack/react-query";
import {
  postProjectProgress,
  putProjectProgress,
} from "@/service/constructor/Progress/save";
import { toastError, toastSuccess } from "@/toast";
import router from "next/router";
import { ROUTES } from "@/routes";
export default function ProgressManageSave() {
  const [page, setPage] = useState(0);
  const searchParams = useSearchParams();
  const params = useParams();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const actionType = searchParams.get("actionType");
  const isView = actionType === "VIEW";

  const id = Number(params?.id);
  const isUpdate = !!id;
  const methodForm = useFormCustom<RequestBody["SAVE"]>({
    defaultValues: {
      projectProgress: [],
    },
  });

  const { handleSubmit, reset, setError, control, watch, setValue } =
    methodForm;
  const { mutate } = useMutation({
    mutationFn: (body: RequestBody["SAVE"]) =>
      isUpdate ? putProjectProgress(id, body) : postProjectProgress(body),

    onSuccess: (res: any) => {
      toastSuccess("Thành công");
      if (res?.data?.id) {
        router.push(`${ROUTES.PROGRESS_MANAGE}/${res.data.id}?actionType=VIEW`);
      }
    },

    onError: (error: any) => {
      toastError(error?.message || "Có lỗi xảy ra");
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutate(data);
  });
  const { data, isLoading } = useProjectDetailQuery(id, {
    enabled: !!id,
  });
  useEffect(() => {
    if (id && data?.data) {
      reset(data.data);
    }
  }, [id, data, reset]);
  return [
    {
      page,
      rowsPerPage,
      control,
      isView,
      isLoading,
      watch,
      setValue,
      methodForm,
      onSubmit,
      id,
    },
    { setPage, setRowsPerPage },
  ] as const;
}
