import { useFormCustom } from "@/lib/form";
import { ROUTES } from "@/routes";
import { useAccountDetailQuery } from "@/service/constructor/Account/getDetail";
import { RequestBody as RequestDetail } from "@/service/constructor/Account/getDetail/type";
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

  const methodForm = useFormCustom<RequestDetail["GET"]>({
    defaultValues,
  });
  const methodForms = useFormCustom<RequestBody["SAVE"]>({
    defaultValues,
  });
  const { reset } = methodForm;
  const { handleSubmit, control, setValue } = methodForms;
  const accountId = Number(localStorage.getItem("accountId"));
  console.log("accountId", accountId);
  const { data, isLoading, refetch } = useAccountDetailQuery(accountId);

  useEffect(() => {
    if (id && data?.data) {
      reset(data.data as any);
    }
  }, [accountId, data, reset]);

  const { mutate } = useMutation({
    mutationFn: (body: RequestBody["SAVE"]) => putAccount(body),

    onSuccess: (res: any) => {
      toastSuccess("Thành công");
      if (res?.data?.id) {
        router.push(ROUTES.INFORMATION);
      }
      refetch();
    },

    onError: (error: any) => {
      toastError(error?.message || "Có lỗi xảy ra");
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutate(data);
  });
  return [
    { isView, page, rowsPerPage, control, isUpdate, isLoading, id, data },
    { setPage, setRowsPerPage, onSubmit, setValue },
  ];
}
