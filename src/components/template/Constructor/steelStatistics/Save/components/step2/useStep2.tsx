import { useFormCustom } from "@/lib/form";
import { ROUTES } from "@/routes";
import { deleteAssembly } from "@/service/constructor/Assembly/delete";
import { postAssembly, putAssembly } from "@/service/constructor/Assembly/save";
import { RequestBody } from "@/service/constructor/Assembly/save/type";
import { toastError, toastSuccess } from "@/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import router from "next/router";
import { useMemo, useState } from "react";
const defaultValues = {
  id: undefined,
  code: "",
  name: "",
};

export default function useStep2() {
  const [reloadAssemblyKey, setReloadAssemblyKey] = useState(0);
  const methodForm = useFormCustom<RequestBody["SAVE"]>({
    defaultValues,
  });
  const queryClient = useQueryClient();
  const { reset, handleSubmit, control, setValue, watch } = methodForm;
  const id = watch("id");
  console.log("iddđ", id);
  const handleSuccess = (res: any) => {
    toastSuccess("Thành công");
  };
  const handleError = (error: any) => {
    toastError(error?.message || "Có lỗi xảy ra");
  };

  const { mutate: createAssembly } = useMutation({
    mutationFn: (body: RequestBody["SAVE"]) => postAssembly(body),
    onSuccess: handleSuccess,
    onError: handleError,
  });
  const { mutate: updateAssembly } = useMutation({
    mutationFn: (body: RequestBody["SAVE"]) => putAssembly(body),
    onSuccess: () => {
      toastSuccess("Thành công");
      queryClient.invalidateQueries({
        queryKey: ["assembly-list"],
      });
      setReloadAssemblyKey((prev) => prev + 1);
      reset();
    },
    onError: handleError,
  });

  const { mutate: removeAssembly } = useMutation({
    mutationFn: (id: number) => deleteAssembly({ id }),
    onSuccess: () => {
      toastSuccess("Xóa cấu kiện thành công");
      setReloadAssemblyKey((prev) => prev + 1);
      reset();
    },
    onError: handleError,
  });

  const onSubmitCreate = handleSubmit((data) => {
    createAssembly(data); // POST
  });

  const onSubmitUpdate = handleSubmit((data) => {
    const assemblyId = data?.id;
    console.log("assemblyId", assemblyId);
    if (!assemblyId) {
      toastError("Vui lòng chọn cấu kiện cần chỉnh sửa");
      return;
    }

    updateAssembly({
      ...data,
      id: assemblyId,
      code: data?.code,
      name: data?.name,
    });
  });

  const onSubmitDelete = () => {
    const assemblyId = methodForm.getValues("id");

    if (!assemblyId) {
      toastError("Vui lòng chọn cấu kiện cần xóa");
      return;
    }

    removeAssembly(assemblyId);
  };

  const columns = useMemo(
    () => [
      {
        header: "Tên cấu kiện",
        fieldName: "name",
      },
      {
        header: "Số lượng cấu kiện giống nhau",
        fieldName: "quantity",
      },
    ],
    []
  );
  const tableData = [
    {
      name: "Dầm móng",
      quantity: 12,
    },
    {
      name: "Cột bê tông cốt thép",
      quantity: 24,
    },
    {
      name: "Sàn tầng 1",
      quantity: 1,
    },
    {
      name: "Sàn tầng 2",
      quantity: 1,
    },
    {
      name: "Dầm biên",
      quantity: 18,
    },
    {
      name: "Móng đơn",
      quantity: 30,
    },
  ];
  return [
    { onSubmitCreate, onSubmitUpdate, reloadAssemblyKey, onSubmitDelete },
    { columns, tableData, control, setValue },
  ] as const;
}
