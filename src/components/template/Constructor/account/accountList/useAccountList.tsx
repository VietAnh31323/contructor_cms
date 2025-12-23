import { getEnum } from "@/components/atoms/TextColor";
import { useAccountListQuery } from "@/service/constructor/Account/getList";
import { RequestBody } from "@/service/constructor/Employee/getList/type";
import _ from "lodash";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
const defaultValues = {
  search: "",
  page: 0,
  size: 20,
};
const useAccountList = () => {
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
  const { data, isLoading } = useAccountListQuery();
  const columns = useMemo(
    () => [
      { header: "Mã nhân sự", fieldName: "code" },
      { header: "Tên nhân sự", fieldName: "name" },
      { header: "Tên tài khoản", fieldName: "username" },
      { header: "Chức vụ", fieldName: "position" },
      { header: "Quyền", fieldName: "roles" },
    ],
    []
  );

  const tableData =
    data?.data?.content?.map((item) => ({
      ...item,
      roles: getEnum(item.roles?.map((r) => r.name).join(", ") || "", [
        { label: "Quản trị viên", value: "ADMIN" },
        { label: "Nhân viên", value: "STAFF" },
        { label: "Nhân viên CSKH", value: "CUSTOMER_CARE" },
      ]),
      position: getEnum(item?.staff?.position, [
        { label: "Kiến trúc sư", value: "ARCHITECT" },
        { label: "Kĩ sư điện nước", value: "MEP_ENGINEER" },
        {
          label: "Kĩ sư kết cấu",
          value: "STRUCTURAL_ENGINEER",
        },
        { label: "Kĩ sư giám sát", value: "ESTIMATOR" },
        { label: "Dự toán viên", value: "SUPERVISOR" },
      ]),
      name:
        [item?.staff?.firstName, item?.staff?.lastName]
          .filter(Boolean)
          .join(" ") || "N/A",
      code: item?.staff?.code,
    })) ?? [];

  return [
    { columns, tableData, page, rowsPerPage, control },
    { setPage, setRowsPerPage },
  ];
};

export default useAccountList;
