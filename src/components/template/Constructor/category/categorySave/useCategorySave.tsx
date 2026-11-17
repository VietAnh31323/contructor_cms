"use client";

import { useFormCustom } from "@/lib/form";
import { ROUTES } from "@/routes";
import { useCategoryDetailQuery } from "@/service/constructor/Category/getDetail";
import { useCategoryListQuery } from "@/service/constructor/Category/getList";
import { postCategory, putCategory } from "@/service/constructor/Category/save";
import { RequestBody } from "@/service/constructor/Category/save/type";
import { toastError, toastSuccess } from "@/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const defaultValues = {
  code: "",
  name: "",
  description: "",
  isActive: true,
  parentId: null as number | null,
  unit: "",
  defaultUnitPrice: "" as any,
  sortOrder: 0,
};

export default function CategorySave() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const params = useParams();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const actionType = searchParams.get("actionType");
  const preselectedParentId = searchParams.get("parentId")
    ? Number(searchParams.get("parentId"))
    : null;
  const isView = actionType === "VIEW";

  const id = Number(params?.id);
  const isUpdate = !!id;

  const methodForm = useFormCustom<RequestBody["SAVE"]>({
    defaultValues,
  });

  const { reset, handleSubmit, control, setValue } = methodForm;

  const { data, isLoading } = useCategoryDetailQuery(id, {
    enabled: !!id,
  });

  const { data: allCategoriesResp } = useCategoryListQuery({
    page: 0,
    size: 500,
  });

  const parentOptions = useMemo(() => {
    const list = allCategoriesResp?.data?.content ?? [];
    return list
      .filter((c) => c.id !== id)
      .map((c) => ({
        value: c.id,
        label: `${c.code} - ${c.name}`,
      }));
  }, [allCategoriesResp, id]);

  const { mutate } = useMutation({
    mutationFn: (body: RequestBody["SAVE"]) =>
      isUpdate ? putCategory(id, body) : postCategory(body),

    onSuccess: (res: any) => {
      toastSuccess("Thành công");
      queryClient.invalidateQueries({ queryKey: ["category-list"] });
      queryClient.invalidateQueries({ queryKey: ["category-tree"] });
      if (res?.data?.id) {
        router.push(`${ROUTES.CATEGORY}/${res.data.id}?actionType=VIEW`);
      }
    },

    onError: (error: any) => {
      toastError(error?.message || "Có lỗi xảy ra");
    },
  });

  const onSubmit = handleSubmit((formData: any) => {
    mutate({
      ...formData,
      parentId: formData.parentId ? Number(formData.parentId) : null,
      unit: formData.unit?.trim() || null,
      defaultUnitPrice:
        formData.defaultUnitPrice !== "" &&
        formData.defaultUnitPrice !== null &&
        formData.defaultUnitPrice !== undefined
          ? Number(formData.defaultUnitPrice)
          : 0,
      sortOrder:
        formData.sortOrder !== "" && formData.sortOrder !== null
          ? Number(formData.sortOrder)
          : 0,
    });
  });

  useEffect(() => {
    if (id && data?.data) {
      reset(data.data);
    } else if (!id && preselectedParentId) {
      setValue("parentId", preselectedParentId);
    }
  }, [id, data, reset, preselectedParentId, setValue]);

  return [
    {
      isView,
      page,
      rowsPerPage,
      control,
      isUpdate,
      isLoading,
      id,
      parentOptions,
    },
    { setPage, setRowsPerPage, onSubmit },
  ] as const;
}
