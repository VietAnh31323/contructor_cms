import { getEnum } from "@/components/atoms/TextColor";
import { GREEN, RED } from "@/helper/colors";
import { useProjectListQuery } from "@/service/constructor/Project/getList";
import { RequestBody } from "@/service/constructor/Project/getList/type";
import _ from "lodash";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
const defaultValues = {
  search: "",
  page: 0,
  size: 20,
};
const useConstructionProjectList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const methodForm = useForm<RequestBody["GET"]>({
    defaultValues,
  });
  const { handleSubmit } = methodForm;

  const [queryPage, setQueryPage] = useState<any>(
    _.omitBy(defaultValues, _.isNil)
  );
  const onSubmit = handleSubmit(async (input) => {
    setQueryPage(input);
  });
  const onChangePageSize = (val: any) => {
    const { page, size } = val;
    const input = { ...queryPage, page, size };

    setQueryPage(input);
  };
  const { data, isLoading } = useProjectListQuery();
  const columns = useMemo(
    () => [
      { header: "Mã hợp đồng", fieldName: "code" },
      { header: "Tên dự án", fieldName: "name" },
      { header: "Chủ đầu tư", fieldName: "owner" },
      { header: "Ngày kí hợp đồng", fieldName: "signDate" },
      { header: "Giá trị hợp đồng", fieldName: "contractValue" },
      { header: "Chủ nhiệm dự án", fieldName: "manager.name" },
      { header: "Giá trị tạm ứng ", fieldName: "contractAdvance" },
      { header: "Thời gian còn lại", fieldName: "remainingTime" },
      { header: "Tình trạng thanh toán", fieldName: "paymentStatus" },
    ],
    []
  );

  const tableData =
    data?.data?.content?.map((item) => {
      const signDate = new Date(item.signDate);
      const deliveryDate = new Date(item.deliveryDate);

      const remainingDays = Math.ceil(
        (deliveryDate.getTime() - signDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        ...item,

        remainingDays,

        remainingTime:
          remainingDays > 0
            ? `${remainingDays} ngày`
            : remainingDays === 0
            ? "Hết hạn hôm nay"
            : `Quá hạn ${Math.abs(remainingDays)} ngày`,

        paymentStatus: getEnum(item.paymentStatus, [
          { value: "COMPLETED", label: "Hoàn tất thanh toán", color: GREEN },
          {
            value: "NOT_COMPLETED",
            label: "Chưa hoàn tất thanh toán",
            color: RED,
          },
        ]),
      };
    }) ?? [];

  return [
    { columns, tableData, page, rowsPerPage },
    { setPage, setRowsPerPage },
  ];
};

export default useConstructionProjectList;
