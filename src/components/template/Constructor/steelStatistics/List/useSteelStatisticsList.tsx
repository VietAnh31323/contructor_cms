import { RequestBody } from "@/service/constructor/Steel/getList/type";
import { useSteelProjectListQuery } from "@/service/constructor/Steel/getList";
import _ from "lodash";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
const defaultValues = {
  search: "",
  page: 0,
  size: 20,
};
const useSteelStatisticsList = () => {
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
  const { data, isLoading } = useSteelProjectListQuery();
  const columns = useMemo(
    () => [
      { header: "Mã dự án", fieldName: "code" },
      { header: "Tên dự án", fieldName: "name" },
      { header: "Chủ đầu tư", fieldName: "owner" },
      { header: "Ngày ký hợp đồng", fieldName: "signDate" },
      { header: "Ngày ký giao hồ sơ", fieldName: "deliveryDate" },
    ],
    []
  );

  const tableData =
    data?.data?.content?.map((item) => ({
      ...item,
    })) ?? [];

  return [
    { columns, tableData, page, rowsPerPage },
    { setPage, setRowsPerPage },
  ];
};

export default useSteelStatisticsList;
