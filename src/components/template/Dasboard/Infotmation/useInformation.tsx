import { useFormCustom } from "@/lib/form";
import { ROUTES } from "@/routes";
import { useAccountDetailQuery } from "@/service/constructor/Account/getDetail";
import { putAccount } from "@/service/constructor/Account/save";
import { RequestBody } from "@/service/constructor/Account/save/type";
import { toastError, toastSuccess } from "@/toast";
import { useMutation } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const defaultValues = {};

export default function useInformation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const actionType = searchParams.get("actionType");
  const isView = actionType === "VIEW";

  const id = Number(params?.id);
  const isUpdate = !!id;

  const methodForms = useFormCustom<RequestBody["SAVE"]>({
    defaultValues,
  });
  const { handleSubmit, control, reset, setValue, watch } = methodForms;
  const { data, isLoading, refetch } = useAccountDetailQuery();
  const watchedAvatar = watch("avatar");

  useEffect(() => {
    if (data?.data) {
      reset(data.data as any);
    }
  }, [data, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: (body: RequestBody["SAVE"]) => putAccount(body),
    onSuccess: (res: any) => {
      toastSuccess("Cập nhật thông tin thành công");
      if (res?.data?.id) {
        router.push(ROUTES.INFORMATION);
      }
      refetch();
    },
    onError: (error: any) => {
      toastError(error?.message || "Có lỗi xảy ra");
    },
  });

  const onSubmit = handleSubmit((formData) => {
    mutate(formData);
  });

  return [
    {
      isView,
      page,
      rowsPerPage,
      control,
      watchedAvatar,
      isUpdate,
      isLoading,
      isPending,
      id,
      data,
    },
    { setPage, setRowsPerPage, setValue, onSubmit },
  ] as const;
}
