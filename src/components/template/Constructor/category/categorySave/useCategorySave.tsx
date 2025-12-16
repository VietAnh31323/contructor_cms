"use client";

import { useFormCustom } from "@/lib/form";
import { ROUTES } from "@/routes";
import { useCategoryDetailQuery } from "@/service/constructor/Category/getDetail";
import { postCategory, putCategory } from "@/service/constructor/Category/save";
import { RequestBody } from "@/service/constructor/Category/save/type";
import { toastError, toastSuccess } from "@/toast";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";

const defaultValues = {
  code: "",
  name: "",
  description: "",
  isActive: true,
};

export default function CategorySave() {
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

  const { reset, handleSubmit, control } = methodForm;

  const { data, isLoading } = useCategoryDetailQuery(id, {
    enabled: !!id,
  });

  const { mutate } = useMutation({
    mutationFn: (body: RequestBody["SAVE"]) =>
      isUpdate ? putCategory(id, body) : postCategory(body),

    onSuccess: (res: any) => {
      toastSuccess("Thành công");
      if (res?.data?.id) {
        router.push(`${ROUTES.CATEGORY}/${res.data.id}?actionType=VIEW`);
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
    { isView, page, rowsPerPage, control, isUpdate, isLoading, id },
    { setPage, setRowsPerPage, onSubmit },
  ];
}
