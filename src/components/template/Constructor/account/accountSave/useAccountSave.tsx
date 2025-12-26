import { useFormCustom } from "@/lib/form";
import { ROUTES } from "@/routes";
import { useAccountDetailStaffQuery } from "@/service/constructor/Account/getDetailStaff";
import { putUpdateRole } from "@/service/constructor/Account/putRole";
import { RequestBody } from "@/service/constructor/Account/putRole/type";
import { toastError, toastSuccess } from "@/toast";
import { useMutation } from "@tanstack/react-query";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
type SelectedPermission = {
  id: number;
  name?: string;
};

const defaultValues = {};

const useAccountSave = (selected: SelectedPermission[]) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  const actionType = searchParams.get("actionType");
  const isView = actionType === "VIEW";

  const id = params?.id ? Number(params.id) : undefined;
  const isUpdate = !!id;

  const methodForm = useFormCustom<any>({
    defaultValues,
  });

  const { reset, control, handleSubmit, setValue } = methodForm;

  const { data, isLoading } = useAccountDetailStaffQuery(id!, {
    enabled: !!id,
  });
  const { mutate } = useMutation({
    mutationFn: (body: RequestBody["SAVE"]) => putUpdateRole(body),

    onSuccess: (res: any) => {
      toastSuccess("Thành công");
      if (res?.data?.id) {
        router.push(ROUTES.ACCOUNT);
      }
    },

    onError: (error: any) => {
      toastError(error?.message || "Có lỗi xảy ra");
    },
  });

  const onSubmit = handleSubmit((data) => {
    const payload = {
      ...data,
      roles: selected.map((r) => ({
        id: r.id,
        name: r.name,
      })),
    };

    mutate(payload);
  });
  useEffect(() => {
    if (id && data?.data) {
      reset(data.data);
    }
  }, [id, data, reset]);

  return [
    { isView, control, isUpdate, isLoading, id, data },
    { onSubmit, setValue },
  ];
};

export default useAccountSave;
