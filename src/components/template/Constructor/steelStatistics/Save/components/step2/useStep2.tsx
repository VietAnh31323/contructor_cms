import { CoreButton } from "@/components/atoms/CoreButton";
import { useFormCustom } from "@/lib/form";
import { ROUTES } from "@/routes";
import { deleteAssembly } from "@/service/constructor/Assembly/delete";
import { postAssembly, putAssembly } from "@/service/constructor/Assembly/save";
import { RequestBody } from "@/service/constructor/Assembly/save/type";
import { toastError, toastSuccess } from "@/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import router, { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { getAssemblyDetail } from "@/service/constructor/Assembly/getDetail";
export type Step2Data = {
  steelProjectAssemblyMaps: AssemblyTableRow[];
};

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
  sameQuantity: undefined,
};

export default function useStep2(detailData?: any) {
  const [reloadAssemblyKey, setReloadAssemblyKey] = useState(0);
  const [tableData, setTableData] = useState<AssemblyTableRow[]>([]);
  console.log("tableDataa1", detailData);
  const methodForm = useFormCustom<any>({
    defaultValues,
  });
  const queryClient = useQueryClient();
  const { reset, handleSubmit, control, setValue, watch } = methodForm;
  const id = watch("id");
  const router = useRouter();
  const { actionType } = router.query;
  const isView = actionType === "VIEW";
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
        steels: [],
      },
    ]);

    setValue("id", undefined);
    setValue("name", "");
    setValue("sameQuantity", "");
  };

  const removeAssemblyFromTable = (rowId: number) => {
    setTableData((prev) => prev.filter((row) => row.id !== rowId));
  };

  // const addSteelToAssemblyRow = (assemblyId: number, steel: any) => {
  //   setTableData((prev) =>
  //     prev.map((row) =>
  //       row.id === assemblyId
  //         ? {
  //             ...row,
  //             steels: [...(row.steels || []), steel],
  //           }
  //         : row
  //     )
  //   );
  // };
  const addSteelToAssemblyRow = (assemblyId: number, steelRow: any) => {
    setTableData((prev) =>
      prev.map((assembly) => {
        if (assembly.id !== assemblyId) return assembly;

        const isExist = assembly.steels?.some((s) => s.id === steelRow.id);

        if (isExist) return assembly; // 👈 KHÔNG ADD NẾU TRÙNG

        return {
          ...assembly,
          steels: [...(assembly.steels || []), steelRow],
        };
      }),
    );
  };
  const setSteelsForAssembly = (assemblyId: number, steels: any[]) => {
    setTableData((prev) =>
      prev.map((assembly) =>
        assembly.id === assemblyId ? { ...assembly, steels } : assembly,
      ),
    );
  };
  const columns = useMemo(() => {
    const baseColumns: Array<{
      header: string;
      fieldName: string;
      render?: (row: AssemblyTableRow) => JSX.Element;
    }> = [
      {
        header: "Tên cấu kiện",
        fieldName: "assemblyName",
      },
      {
        header: "Số lượng cấu kiện giống nhau",
        fieldName: "sameQuantity",
      },
    ];

    if (!isView) {
      baseColumns.push({
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
      });
    }

    return baseColumns;
  }, [isView]);

  // useEffect(() => {
  //   if (!detailData?.steelProjectAssemblyMaps) return;

  //   setTableData(
  //     detailData.steelProjectAssemblyMaps.map((item: any) => ({
  //       id: item.id,
  //       assemblyName: item.assemblyName,
  //       sameQuantity: item.sameQuantity ?? 1,
  //       steels: item.steels ?? [],
  //     })),
  //   );
  // }, [detailData]);

  useEffect(() => {
    if (!detailData?.steelProjectAssemblyMaps) return;

    const loadData = async () => {
      const assemblies = await Promise.all(
        detailData.steelProjectAssemblyMaps.map(async (item: any) => {
          const res = await getAssemblyDetail(item.id); // API lấy steels
          return {
            id: item.id,
            assemblyName: item.assemblyName,
            sameQuantity: item.sameQuantity ?? 1,
            steels: res.data || [],
          };
        }),
      );

      setTableData(assemblies);
    };

    loadData();
  }, [detailData]);
  const handleExportExcel = () => {
    if (!tableData.length) {
      alert("Không có dữ liệu để export");
      return;
    }

    let currentRow = 1; // vì sheet bắt đầu từ row 1
    const merges: any[] = [];

    const exportData = tableData.flatMap((assembly, index) => {
      const steels = assembly.steels?.length ? assembly.steels : [{}];

      const startRow = currentRow;

      const rows = steels.map((steel: any, steelIndex: number) => {
        const soLuong1CK = Number(steel.barQuantity) || 0;
        const soLuongCauKien = Number(assembly.sameQuantity) || 0;
        const lengthMm = Number(steel.length) || 0;
        const diameter = Number(steel.barDiameter) || 0;

        const tongSoLuong = soLuong1CK * soLuongCauKien;
        const tongChieuDai = (lengthMm * soLuong1CK * soLuongCauKien) / 1000;

        const lengthM = lengthMm / 1000;
        const tongTrongLuong =
          (lengthM * soLuong1CK * diameter * diameter * soLuongCauKien) / 162.2;

        currentRow++;

        return {
          STT_CauKien: steelIndex === 0 ? index + 1 : "",
          Ten_Cau_Kien: steelIndex === 0 ? assembly.assemblyName : "",
          So_Luong_Cau_Kien: steelIndex === 0 ? soLuongCauKien : "",

          So_Hieu: steel.barCode || "",
          Duong_Kinh: diameter,
          So_Luong_1_CK: soLuong1CK,
          Chieu_Dai_mm: lengthMm,

          Tong_So_Luong: tongSoLuong,
          Tong_Chieu_Dai_m: tongChieuDai.toFixed(2),
          Tong_Trong_Luong_kg: tongTrongLuong.toFixed(2),
        };
      });

      const endRow = currentRow - 1;

      // 👇 Nếu có nhiều hơn 1 dòng thì merge
      if (endRow > startRow) {
        merges.push(
          { s: { r: startRow, c: 0 }, e: { r: endRow, c: 0 } }, // STT
          { s: { r: startRow, c: 1 }, e: { r: endRow, c: 1 } }, // Ten_Cau_Kien
          { s: { r: startRow, c: 2 }, e: { r: endRow, c: 2 } }, // So_Luong_Cau_Kien
        );
      }

      return rows;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // 👇 Gán merge vào sheet
    worksheet["!merges"] = merges;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ThongKeThep");

    XLSX.writeFile(workbook, "ThongKeThep.xlsx");
  };
  return [
    {
      onSubmitCreate,
      onSubmitUpdate,
      reloadAssemblyKey,
      onSubmitDelete,
      addAssemblyToTable,
      removeAssemblyFromTable,
      addSteelToAssemblyRow,
      handleExportExcel,
      setSteelsForAssembly,
    },
    { columns, tableData, control, setValue, isView },
  ] as const;
}
