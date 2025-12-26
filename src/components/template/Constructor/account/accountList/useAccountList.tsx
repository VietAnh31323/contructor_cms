import { getEnum } from "@/components/atoms/TextColor";
import { useAccountListQuery } from "@/service/constructor/Account/getList";
import { RequestBody } from "@/service/constructor/Employee/getList/type";
import Avatar from "@mui/material/Avatar/Avatar";
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
      {
        header: "Ảnh đại diện",
        fieldName: "avatar",
        render: (row: any) => {
          return (
            <Avatar
              src={row.avatar}
              alt="avatar"
              sx={{
                width: 40,
                height: 40,
                border: 3,
                borderColor: "#0078D4",
                boxShadow: 2,
              }}
            />
          );
        },
      },
      { header: "Tên nhân sự", fieldName: "name" },
      { header: "Tên tài khoản", fieldName: "username" },
      { header: "Chức vụ", fieldName: "position" },
      { header: "Quyền", fieldName: "roles" },
    ],
    []
  );

  const tableData =
    data?.data?.content.map((item) => ({
      ...item,
      avatar: item?.staff?.avatar,

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

      code: item?.staff?.code,
      name: item?.staff?.name,
      roles: item?.roles?.length ? (
        <>
          {item.roles.map((r, index) => (
            <span key={r.id}>
              {getEnum(r.name, [
                { label: "Quản trị viên", value: "ADMIN" },
                { label: "Nhân viên", value: "STAFF" },
                { label: "CSKH", value: "CUSTOMER_CARE" },
              ])}
              {index < item.roles.length - 1 && ", "}
            </span>
          ))}
        </>
      ) : (
        "N/A"
      ),
    })) ?? [];

  return [
    { columns, tableData, page, rowsPerPage, control },
    { setPage, setRowsPerPage },
  ];
};

export default useAccountList;
