import { useMemo, useState } from "react";

const useSteelStatisticsSave = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const columns = useMemo(
    () => [
      { header: "Mã hạng mục", fieldName: "code" },
      { header: "Tên hạng mục", fieldName: "name" },
      { header: "Trạng thái", fieldName: "isActive" },
    ],
    []
  );

  const tableData = [
    {
      code: "HM001",
      name: "Hạng mục A",
      isActive: "Inactive",
    },
    {
      code: "HM001",
      name: "Hạng mục B",
      isActive: "Inactive",
    },
    {
      code: "HM001",
      name: "Hạng mục C",
      isActive: "Active",
    },
    {
      code: "HM001",
      name: "Hạng mục D",
      isActive: "Active",
    },
    {
      code: "HM001",
      name: "Hạng mục E",
      isActive: "Inactive",
    },
    {
      code: "HM001",
      name: "Hạng mục F",
      isActive: "Active",
    },
    {
      code: "HM001",
      name: "Hạng mục G",
      isActive: "Active",
    },
    {
      code: "HM001",
      name: "Hạng mục H",
      isActive: "Active",
    },
  ];

  return [
    { columns, tableData, page, rowsPerPage },
    { setPage, setRowsPerPage },
  ];
};

export default useSteelStatisticsSave;
