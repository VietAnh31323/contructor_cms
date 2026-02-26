import { useDialog } from "@/components/hooks/dialog/useDialog";
import { useFormCustom } from "@/lib/form";
import { ROUTES } from "@/routes";
import { postSteel } from "@/service/constructor/Steel/save";
import { useSteelCategoryListQuery } from "@/service/constructor/SteelCategory/getList";
import { postTask } from "@/service/constructor/Task/save";
import { RequestBody } from "@/service/constructor/Steel/save/type";
import { toastError, toastSuccess } from "@/toast";
import { useMutation } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
type UseSteelChooseProps = {
  assemblyId: number;
  onSuccess: (steelRow: any) => void;
};

export default function useSteelChoose({
  assemblyId,
  onSuccess,
}: UseSteelChooseProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const lastFormData = useRef<any>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { hideDialog } = useDialog();
  const actionType = searchParams.get("actionType");
  const isView = actionType === "VIEW";

  const methodForm = useFormCustom<any>({
    defaultValues: {
      steelLines: {},
      images: [],
      barCode: "",
      barQuantity: "",
      barDiameter: "",
      spliceLength: "",
    },
  });
  const handleSuccess = (res: any) => {
    toastSuccess("Thành công");
    hideDialog();
  };
  const handleError = (error: any) => {
    toastError(error?.message || "Có lỗi xảy ra");
  };
  const { reset, handleSubmit, control, getValues, setValue } = methodForm;

  const id = Number(params?.id);
  const isUpdate = !!id;
  const buildStaffNames = (taskStaffMaps: any) => {
    if (!Array.isArray(taskStaffMaps)) return "--";

    return (
      taskStaffMaps
        .map((item) => item?.staff?.name)
        .filter(Boolean)
        .join(", ") || "--"
    );
  };

  const calcRemainingDays = (start: string, end: string) => {
    if (!start || !end) return "--";

    const startDate = new Date(start);
    const endDate = new Date(end);

    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Đã quá hạn";
    if (diffDays === 0) return "0 ngày";

    return `${diffDays} ngày`;
  };
  const { data, isLoading } = useSteelCategoryListQuery();
  const { mutateAsync: createSteel } = useMutation({
    mutationFn: (body: RequestBody["SAVE"]) => postSteel(body),
  });

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const steelLinesArray = Object.entries(formData.steelLines || {}).map(
        ([paramName, value]) => ({
          id: 0,
          paramName,
          value: Number(value),
        }),
      );

      const payload: RequestBody["SAVE"] = {
        ...formData,
        images: formData.images,
        barCode: Number(formData.barCode),
        barQuantity: Number(formData.barQuantity),
        barDiameter: Number(formData.barDiameter),
        spliceLength: Number(formData.spliceLength),
        steelLines: steelLinesArray,
      };

      const imageUrls = (formData.images || []).map(
        (img: any) => img.url || img.fileUrl,
      );

      const res = await createSteel(payload);

      const steelId = res?.data?.id;
      console.log("id của thanh thép", steelId);
      const steelRow = {
        id: steelId, // ⭐ QUAN TRỌNG NHẤT
        barCode: payload.barCode,
        assemblyName: res?.data?.assemblyName, // nếu có
        barDiameter: payload.barDiameter,
        barQuantity: payload.barQuantity,
        spliceLength: payload.spliceLength,
        steelLinesText: payload.steelLines.reduce(
          (sum, item) => sum + (Number(item.value) || 0),
          0,
        ),
        images: imageUrls,
      };

      onSuccess(steelRow);

      console.log("🚀 FINAL PAYLOAD SEND API:", payload);
      console.log("🔥 STEEL ROW SEND TO STEP2:", steelRow);

      // ✅ CHỜ API
      await createSteel(payload);

      // ✅ ĐẨY NGƯỢC DATA VỀ STEP2
      onSuccess(steelRow);
      console.log("✅ CALLBACK onSuccess CALLED:", steelRow);

      toastSuccess("Thành công");
      hideDialog();
    } catch (error: any) {
      toastError(error?.message || "Có lỗi xảy ra");
    }
  });

  return [
    { isView, page, rowsPerPage, control, isUpdate, id, data, setValue },
    { setPage, setRowsPerPage, onSubmit },
  ];
}
