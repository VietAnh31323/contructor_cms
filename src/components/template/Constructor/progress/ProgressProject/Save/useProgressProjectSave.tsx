import { useFormCustom } from "@/lib/form";
import { ROUTES } from "@/routes";
import { useProgressDetailQuery } from "@/service/constructor/Progress/getDetail";
import {
  postProgress,
  putProgress,
} from "@/service/constructor/Progress/save";
import { RequestBody } from "@/service/constructor/Progress/save/type";
import { toastError, toastSuccess } from "@/toast";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";
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

  const actionType = searchParams.get("actionType");
  const isView = actionType === "VIEW";

  const id = Number(params?.id);
  const isUpdate = !!id;

  const methodForm = useFormCustom<RequestBody["SAVE"]>({
    defaultValues,
  });

  const { reset, handleSubmit, control } = methodForm;

  const { data, isLoading } = useProgressDetailQuery(id, {
    enabled: !!id,
  });

  const { mutate } = useMutation({
    mutationFn: (body: RequestBody["SAVE"]) =>
      isUpdate ? putProgress(id, body) : postProgress(body),

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
    { isView, control, isUpdate, isLoading, id },
    { onSubmit },
  ];
}
