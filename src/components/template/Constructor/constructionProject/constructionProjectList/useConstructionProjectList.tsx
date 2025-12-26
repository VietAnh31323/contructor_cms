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
      { header: "Chủ đầu tư", fieldName: "isActive" },
      { header: "Ngày kí hợp đồng", fieldName: "isActive" },
      { header: "Giá trị hợp đồng", fieldName: "isActive" },
      { header: "Chủ nhiệm dự án", fieldName: "isActive" },
      { header: "Thời gian còn lại", fieldName: "isActive" },
      { header: "Tình trạng thanh toán", fieldName: "isActive" },
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

export default useConstructionProjectList;
