import { useFormCustom } from "@/lib/form";
import { ROUTES } from "@/routes";
import { useEmployeeDetailQuery } from "@/service/constructor/Employee/getDetail";
import { postEmployee, putEmployee } from "@/service/constructor/Employee/save";
import { RequestBody } from "@/service/constructor/Employee/save/type";
import { toastError, toastSuccess } from "@/toast";
import { useMutation } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
const defaultValues = {};
const useEmployeeSave = () => {
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
  const methodForms = useFormCustom<any>({
    defaultValues,
  });
  const { reset, handleSubmit, control } = methodForm;
  const { setValue } = methodForms;
  const { data, isLoading } = useEmployeeDetailQuery(id, {
    enabled: !!id,
  });

  const { mutate } = useMutation({
    mutationFn: (body: RequestBody["SAVE"]) =>
      isUpdate ? putEmployee(id, body) : postEmployee(body),

    onSuccess: (res: any) => {
      toastSuccess("Thành công");
      if (res?.data?.id) {
        router.push(`${ROUTES.EMPLOYEE}/${res.data.id}?actionType=VIEW`);
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
    { setPage, setRowsPerPage, onSubmit, setValue },
  ];
};

export default useEmployeeSave;
