import { GREEN, RED } from "@/helper/colors";
import { useProgressProjectListQuery } from "@/service/constructor/ProgressProject/getList";
import { RequestBody } from "@/service/constructor/ProgressProject/getList/type";
import _ from "lodash";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
const defaultValues = {
  search: "",
  page: 0,
  size: 20,
};
const useProgressProjectList = () => {
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
  const { data, isLoading } = useProgressProjectListQuery();
  const columns = useMemo(
    () => [
      { header: "Mã tiến trình", fieldName: "code" },
      { header: "Tên tiến trình", fieldName: "name" },
      { header: "Trạng thái", fieldName: "isActive" },
    ],
    []
  );

  const tableData =
    data?.data?.content?.map((item) => ({
      ...item,
      isActive: (
        <span style={{ color: item.isActive ? GREEN : RED }}>
          {item.isActive ? "Hoạt động" : "Ngưng hoạt động"}
        </span>
      ),
    })) ?? [];

  return [
    { columns, tableData, page, rowsPerPage },
    { setPage, setRowsPerPage },
  ];
};

export default useProgressProjectList;
