import { useFormCustom } from "@/lib/form";
import { useEmployeeDetailQuery } from "@/service/constructor/Employee/getDetail";
import { RequestBody } from "@/service/constructor/Employee/save/type";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
const defaultValues = {};
const useAccountSave = () => {
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

  const { data, isLoading } = useEmployeeDetailQuery(id, {
    enabled: !!id,
  });

  useEffect(() => {
    if (id && data?.data) {
      reset(data.data);
    }
  }, [id, data, reset]);

  return [
    { isView, page, rowsPerPage, control, isUpdate, isLoading, id },
    { setPage, setRowsPerPage },
  ];
};

export default useAccountSave;
