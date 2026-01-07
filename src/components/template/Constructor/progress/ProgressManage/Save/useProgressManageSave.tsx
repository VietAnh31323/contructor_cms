import { useFormCustom } from "@/lib/form";
import { useProjectDetailQuery } from "@/service/constructor/Project/getDetail";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { RequestBody } from "@/service/constructor/Project/save/type";
export default function ProgressManageSave() {
  const [page, setPage] = useState(0);
  const searchParams = useSearchParams();
  const params = useParams();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const actionType = searchParams.get("actionType");
  const isView = actionType === "VIEW";

  const id = Number(params?.id);
  const isUpdate = !!id;
  const methodForm = useFormCustom<RequestBody["SAVE"]>({
    defaultValues: {},
  });

  const { handleSubmit, reset, setError, control, watch, setValue } =
    methodForm;
  // const columns = useMemo(
  //   () => [
  //     { header: "Mã nhân sự", fieldName: "code" },
  //     { header: "Họ và tên", fieldName: "name" },
  //     { header: "Ngày sinh", fieldName: "date" },
  //     { header: "Số điện thoại", fieldName: "phone" },
  //     { header: "Chức vụ", fieldName: "position" },
  //   ],
  //   []
  // );

  // const tableData = [
  //   {
  //     code: "NV001",
  //     name: "Nguyễn Văn A",
  //     date: "1990-05-12",
  //     phone: "0987654321",
  //     position: "Kỹ sư",
  //   },
  //   {
  //     code: "NV002",
  //     name: "Trần Thị B",
  //     date: "1988-11-23",
  //     phone: "0912345678",
  //     position: "Kế toán",
  //   },
  //   {
  //     code: "NV003",
  //     name: "Lê Văn C",
  //     date: "1992-07-08",
  //     phone: "0978123456",
  //     position: "Nhân viên thi công",
  //   },
  //   {
  //     code: "NV004",
  //     name: "Phạm Thị D",
  //     date: "1995-03-15",
  //     phone: "0904567891",
  //     position: "Quản lý dự án",
  //   },
  //   {
  //     code: "NV005",
  //     name: "Hoàng Văn E",
  //     date: "1985-09-30",
  //     phone: "0939876543",
  //     position: "Kỹ thuật viên",
  //   },
  //   {
  //     code: "NV006",
  //     name: "Đặng Thị F",
  //     date: "1993-12-05",
  //     phone: "0961234567",
  //     position: "Nhân viên hành chính",
  //   },
  // ];
  const { data, isLoading } = useProjectDetailQuery(id, {
    enabled: !!id,
  });
  useEffect(() => {
    if (id && data?.data) {
      reset(data.data);
    }
  }, [id, data, reset]);
  return [
    {
      page,
      rowsPerPage,
      control,
      isView,
      isLoading,
      watch,
      setValue,
      methodForm,
      id,
    },
    { setPage, setRowsPerPage },
  ] as const;
}
