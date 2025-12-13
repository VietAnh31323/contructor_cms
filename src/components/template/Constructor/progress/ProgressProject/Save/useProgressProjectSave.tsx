import { useFormCustom } from "@/lib/form";
import { ROUTES } from "@/routes";
import { useProgressProjectDetailQuery } from "@/service/constructor/ProgressProject/getDetail";
import {
  postProgressProject,
  putProgressProject,
} from "@/service/constructor/ProgressProject/save";
import { RequestBody } from "@/service/constructor/ProgressProject/save/type";
import { toastError, toastSuccess } from "@/toast";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
const defaultValues = {
  code: "",
  name: "",
  description: "",
  isActive: true,
};
export default function ProgressProjectSave() {
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

  const { data, isLoading } = useProgressProjectDetailQuery(id, {
    enabled: !!id,
  });

  const { mutate } = useMutation({
    mutationFn: (body: RequestBody["SAVE"]) =>
      isUpdate ? putProgressProject(id, body) : postProgressProject(body),

    onSuccess: (res: any) => {
      toastSuccess("Thành công");
      if (res?.data?.id) {
        router.push(
          `${ROUTES.PROGRESS_PROJECT}/${res.data.id}?actionType=VIEW`
        );
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
