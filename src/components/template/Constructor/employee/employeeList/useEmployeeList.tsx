import { useEmployeeListQuery } from "@/service/constructor/Employee/getList";
import { RequestBody } from "@/service/constructor/Employee/getList/type";
import _ from "lodash";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
const defaultValues = {
  search: "",
  page: 0,
  size: 20,
};
const useEmployee = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const methodForm = useForm<RequestBody["GET"]>({
    defaultValues,
  });
  const { handleSubmit, control } = methodForm;

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
  const { data, isLoading } = useEmployeeListQuery();
  const columns = useMemo(
    () => [
      { header: "Mã nhân sự", fieldName: "code" },
      { header: "First Name", fieldName: "name" },
      { header: "Last Name", fieldName: "phone" },
      { header: "Email", fieldName: "email" },
      { header: "Số điện thoại", fieldName: "description" },
      { header: "Chức vụ", fieldName: "contactStatus" },
    ],
    []
  );

  const tableData =
    data?.data?.content?.map((item) => ({
      ...item,
    })) ?? [];

  return [
    { columns, tableData, page, rowsPerPage, control },
    { setPage, setRowsPerPage },
  ];
};

export default useEmployee;
