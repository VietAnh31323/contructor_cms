import { useMemo, useState } from "react";

const useProgressProjectList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const columns = useMemo(
    () => [
      { header: "Mã tiến trình", fieldName: "code" },
      { header: "Tên tiến trình", fieldName: "name" },
      { header: "Trạng thái", fieldName: "isActive" },
    ],
    []
  );

  const tableData = [
    {
      code: "TT001",
      name: "Tiến trình A",
      isActive: "Inactive",
    },
    {
      code: "TT001",
      name: "Tiến trình B",
      isActive: "Inactive",
    },
    {
      code: "TT001",
      name: "Tiến trình C",
      isActive: "Active",
    },
    {
      code: "TT001",
      name: "Tiến trình D",
      isActive: "Active",
    },
    {
      code: "TT001",
      name: "Tiến trình E",
      isActive: "Inactive",
    },
    {
      code: "TT001",
      name: "Tiến trình F",
      isActive: "Active",
    },
    {
      code: "TT001",
      name: "Tiến trình G",
      isActive: "Active",
    },
  ];

  return [
    { columns, tableData, page, rowsPerPage },
    { setPage, setRowsPerPage },
  ];
};

export default useProgressProjectList;
