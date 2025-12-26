import { useFormCustom } from "@/lib/form";

import { useTranslation } from "next-i18next";
import { useParams, useSearchParams } from "next/navigation";
import router, { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { DropResult } from "react-beautiful-dnd";
import { RequestBody } from "@/service/constructor/Project/save/type";
import { useProjectDetailQuery } from "@/service/constructor/Project/getDetail";
import { useMutation } from "@tanstack/react-query";
import { postProject, putProject } from "@/service/constructor/Project/save";
import { toastError, toastSuccess } from "@/toast";
import { ROUTES } from "@/routes";
const defaultValues = {};
const useConstructionProjectSave = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const actionType = searchParams.get("actionType");
  const isView = actionType === "VIEW";

  const id = Number(params?.id);
  const isUpdate = !!id;

  const methodForm = useFormCustom<RequestBody["SAVE"]>({
    defaultValues,
  });

  const { handleSubmit, reset, setError, control, watch, setValue } =
    methodForm;
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "projectLines",
  });
  const { data, isLoading } = useProjectDetailQuery(id, {
    enabled: !!id,
  });
  const handleDragEnd = (result: DropResult) => {
    if (isView) return;

    const { source, destination } = result;
    if (!destination) return;

    move(source.index, destination.index);
  };
  const { mutate } = useMutation({
    mutationFn: (body: RequestBody["SAVE"]) =>
      isUpdate ? putProject(id, body) : postProject(body),

    onSuccess: (res: any) => {
      toastSuccess("Thành công");
      if (res?.data?.id) {
        router.push(`${ROUTES.PROJECT}/${res.data.id}?actionType=VIEW`);
      }
    },

    onError: (error: any) => {
      toastError(error?.message || "Có lỗi xảy ra");
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutate(data);
  });

  useEffect(() => {
    if (id && data?.data) {
      reset(data.data);
    }
  }, [id, data, reset]);

  return [
    {
      isView,
      page,
      rowsPerPage,
      control,
      isUpdate,
      isLoading,
      id,
      methodForm,
      fields,
    },
    { setPage, setRowsPerPage, onSubmit, append, remove, handleDragEnd },
  ];
};

export default useConstructionProjectSave;
