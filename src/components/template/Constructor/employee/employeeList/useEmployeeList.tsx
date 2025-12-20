import { getEnum } from "@/components/atoms/TextColor";
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
      { header: "Tên nhân sự", fieldName: "name" },
      { header: "Email", fieldName: "email" },
      { header: "Số điện thoại", fieldName: "phone" },
      { header: "Chức vụ", fieldName: "position" },
    ],
    []
  );

  const tableData =
    data?.data?.content?.map((item) => ({
      ...item,
      position: getEnum(item.position, [
        { label: "Kiến trúc sư", value: "ARCHITECT" },
        { label: "Kĩ sư điện nước", value: "MEP_ENGINEER" },
        {
          label: "Kĩ sư kết cấu",
          value: "STRUCTURAL_ENGINEER",
        },
        { label: "Kĩ sư giám sát", value: "ESTIMATOR" },
        { label: "Dự toán viên", value: "SUPERVISOR" },
      ]),
    })) ?? [];

  return [
    { columns, tableData, page, rowsPerPage, control },
    { setPage, setRowsPerPage },
  ];
};

export default useEmployee;
