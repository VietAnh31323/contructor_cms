import { GREEN, RED } from "@/helper/colors";
import { useCategoryListQuery } from "@/service/constructor/Category/getList";
import {
  CategoryList,
  RequestBody,
} from "@/service/constructor/Category/getList/type";
import { useSteelCategoryListQuery } from "@/service/constructor/SteelCategory/getList";
import _ from "lodash";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
const defaultValues = {
  search: "",
  page: 0,
  size: 20,
};
const useSteelCategoryList = () => {
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
  const { data, isLoading } = useSteelCategoryListQuery();
  const columns = useMemo(
    () => [
      { header: "Mã kiểu thanh thép", fieldName: "code" },
      { header: "Tên kiểu thanh thép", fieldName: "name" },
      { header: "Hình ảnh thanh thép", fieldName: "images" },
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
      images:
        Array.isArray(item.images) && item.images.length > 0 ? (
          <img
            src={item.images[0]?.url}
            alt={String(item.images[0]?.name ?? "")}
            style={{
              width: "150px",
              height: "50px",
              objectFit: "cover",
              borderRadius: "4px",
            }}
          />
        ) : (
          <span>Chưa có hình ảnh</span>
        ),
    })) ?? [];

  return [
    { columns, tableData, page, rowsPerPage },
    { setPage, setRowsPerPage },
  ];
};

export default useSteelCategoryList;
