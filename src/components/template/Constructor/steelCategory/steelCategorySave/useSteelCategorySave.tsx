"use client";

import { useFormCustom } from "@/lib/form";
import { ROUTES } from "@/routes";
import { useCategoryDetailQuery } from "@/service/constructor/Category/getDetail";
import { postCategory, putCategory } from "@/service/constructor/Category/save";
import { RequestBody } from "@/service/constructor/SteelCategory/save/type";
import { toastError, toastSuccess } from "@/toast";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useFieldArray } from "react-hook-form";
import { DropResult } from "react-beautiful-dnd";
import {
  postSteelCategory,
  putSteelCategory,
} from "@/service/constructor/SteelCategory/save";
import { useSteelCategoryDetailQuery } from "@/service/constructor/SteelCategory/getDetail";

export const defaultValues = {
  id: undefined,
  code: "",
  name: "",
  images: [],
  description: "",
  isActive: true,
  steelCategoryLines: [
    {
      id: undefined,
      paramName: "",
    },
  ],
};

export default function SteelCategorySave() {
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
    name: "steelCategoryLines",
  });
  const { data, isLoading } = useSteelCategoryDetailQuery(id, {
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
      isUpdate ? putSteelCategory(id, body) : postSteelCategory(body),

    onSuccess: (res: any) => {
      toastSuccess("Thành công");
      if (res?.data?.id) {
        router.push(`${ROUTES.STEELCATEGORY}/${res.data.id}?actionType=VIEW`);
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
      reset({
        ...data.data,
        images: Array.isArray(data.data.images) ? data.data.images : [],
      });
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
  ] as const;
}
