import { getEnum } from "@/components/atoms/TextColor";
import { BLUE, GREEN, ORANGE, RED } from "@/helper/colors";
import { useCustomerListQuery } from "@/service/constructor/Customer/getList";
import { RequestBody } from "@/service/constructor/Customer/getList/type";
import { CheckBox } from "@mui/icons-material";
import _ from "lodash";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Checkbox from "@mui/material/Checkbox";

const defaultValues = {
  search: "",
  page: 0,
  size: 20,
};
const useCustomerList = () => {
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
  const { data, isLoading } = useCustomerListQuery();
  const columns = useMemo(
    () => [
      { header: "Mã khách hàng", fieldName: "code" },
      { header: "Tên khách hàng", fieldName: "name" },
      { header: "Số điện thoại", fieldName: "phone" },
      { header: "Email", fieldName: "email" },
      { header: "Nội dung tư vấn", fieldName: "description" },
      { header: "Trạng thái", fieldName: "contactStatus" },
      { header: "KH tiềm năng", fieldName: "isPotential" },
    ],
    []
  );

  const tableData =
    data?.data?.content?.map((item) => ({
      ...item,
      contactStatus: getEnum(item?.contactStatus, [
        {
          label: "Chưa liên hệ",
          value: "NOT_CONTACTED",
          color: ORANGE,
        },
        { label: "Đã liên hệ", value: "CONTACTED", color: GREEN },
        {
          label: "Không phản hồi",
          value: "NO_RESPONSE",
          color: RED,
        },
        { label: "Đã phản hồi", value: "RESPONDED", color: BLUE },
      ]),
      isPotential: <Checkbox checked={Boolean(item.isPotential)} disabled />,
    })) ?? [];

  return [
    { columns, tableData, page, rowsPerPage, control },
    { setPage, setRowsPerPage },
  ];
};

export default useCustomerList;
