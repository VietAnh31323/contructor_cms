import { CoreButton } from "@/components/atoms/CoreButton";
import { useFormCustom } from "@/lib/form";
import { ROUTES } from "@/routes";
import { deleteAssembly } from "@/service/constructor/Assembly/delete";
import { postAssembly, putAssembly } from "@/service/constructor/Assembly/save";
import { RequestBody } from "@/service/constructor/Assembly/save/type";
import { toastError, toastSuccess } from "@/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import router from "next/router";
import { useMemo, useState } from "react";

export interface AssemblyTableRow {
  id: number;
  assemblyName: string;
  sameQuantity: number;
  steels?: any[];
}

const defaultValues = {
  id: undefined,
  code: "",
  name: "",
  sameQuantity: "",
};

export default function useStep2() {
  const [reloadAssemblyKey, setReloadAssemblyKey] = useState(0);
  const [tableData, setTableData] = useState<AssemblyTableRow[]>([]);

  const methodForm = useFormCustom<any>({
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
  const addAssemblyToTable = () => {
    const { id, name, sameQuantity } = methodForm.getValues();
    const quantity = Number(sameQuantity);

    if (!id) {
      toastError("Vui lòng chọn cấu kiện");
      return;
    }

    if (!quantity || quantity <= 0) {
      toastError("Vui lòng nhập số lượng hợp lệ");
      return;
    }

    setTableData((prev) => [
      ...prev,
      {
        id,
        assemblyName: name,
        sameQuantity: quantity,
      },
    ]);

    setValue("id", undefined);
    setValue("name", "");
    setValue("sameQuantity", "");
  };
  const removeAssemblyFromTable = (rowId: number) => {
    setTableData((prev) => prev.filter((row) => row.id !== rowId));
  };

  const addSteelToAssemblyRow = (assemblyId: number, steel: any) => {
    setTableData((prev) =>
      prev.map((row) =>
        row.id === assemblyId
          ? {
              ...row,
              steels: [...(row.steels || []), steel],
            }
          : row
      )
    );
  };

  const columns = useMemo(
    () => [
      {
        header: "Tên cấu kiện",
        fieldName: "assemblyName",
      },
      {
        header: "Số lượng cấu kiện giống nhau",
        fieldName: "sameQuantity",
      },
      {
        header: "",
        fieldName: "action",
        render: (row: AssemblyTableRow) => (
          <CoreButton
            theme="cancel"
            size="small"
            onClick={() => removeAssemblyFromTable(row.id)}
          >
            Xóa
          </CoreButton>
        ),
      },
    ],
    []
  );

  return [
    {
      onSubmitCreate,
      onSubmitUpdate,
      reloadAssemblyKey,
      onSubmitDelete,
      addAssemblyToTable,
      removeAssemblyFromTable,
      addSteelToAssemblyRow,
    },
    { columns, tableData, control, setValue },
  ] as const;
}
